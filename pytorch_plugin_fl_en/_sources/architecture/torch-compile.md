# torch.compile Integration

The `flagos` device supports `torch.compile` for automatic kernel fusion and reduced dispatch overhead. The graph stays on the `flagos` device: there is no device round trip and no copy at the graph boundary.

## Quick start

```python
import torch_fl  # Import first on MetaX and Ascend.
import torch

model = torch.nn.Sequential(
    torch.nn.Linear(512, 512),
    torch.nn.ReLU(),
    torch.nn.Linear(512, 512),
).to("flagos:0")

model = torch.compile(model, backend="flagos")

x = torch.randn(64, 512, device="flagos:0")
y = model(x)  # Fused kernels
```

Compilation modes:

```python
model = torch.compile(model, backend="flagos")                      # default
model = torch.compile(model, backend="flagos", mode="max-autotune")  # longer compile, better runtime
model = torch.compile(model, backend="flagos", options={"max_autotune": True})
```

`mode` and `options` are expanded into Inductor configuration patches scoped to that compile. CUDA graphs are always off for this backend, so `mode="reduce-overhead"` — whose main lever is CUDA graphs — has little effect.

## FlagTree compilation

[FlagTree](https://github.com/flagos-ai/FlagTree) is a Triton fork whose compiler targets many vendor backends. It integrates by **substitution at install time**, which is the whole thing to understand about it:

- Its wheel is named `flagtree`, but the module it installs is `triton`.
- Installing it uninstalls the official `triton` and takes its place.
- Inductor's own `import triton` therefore already resolves to FlagTree once it is installed, and nothing in PyTorch-Plugin-FL patches `sys.modules`.

The backend compiler is selected at FlagTree build time through `FLAGTREE_BACKEND` (unset for NVIDIA and AMD), not at runtime: the same Triton kernel code compiles for a different vendor backend. `is_flagtree_active()` detects a FlagTree build, and `FLAGOS_USE_FLAGTREE=1` asserts that the active Triton is FlagTree — it errors rather than silently compiling with stock Triton.

Because the FlagTree install removes the existing `triton`, build it in a separate virtualenv on a machine whose `triton` is in use by FlagGems. Wheels from FlagTree 0.6.2 on also install a real `flagtree` package (the FlagPrism debugger/profiler host); reaching FlagTree is still done through `triton`.

## Backend internals

| Component | Responsibility |
|---|---|
| `torch_fl/compile/inductor_backend.py` | Registers the `flagos` backend with `torch._dynamo` and wires Inductor's device interface |
| `torch_fl/compile/device_interface.py` | Inductor GPU device registration for the `flagos` device |
| `torch_fl/flagos/meta.py` | Meta kernels so tracing can infer output shapes for ops without a default meta implementation |
| `torch_fl/compile/flagtree_shim.py` | FlagTree detection (`is_flagtree_active`, `require_flagtree`); no import patching |
| `torch_fl/compile/platform_profile.py` | Per-platform codegen profiles and vendor workarounds |
| `torch_fl/compile/triton_*.py` | Triton integration guards: 64-bit indexing, byte loads, libdevice, resource limits |
| `torch_fl/compile/flagtree_ascend_policy.py` | Ascend backend policy for FlagTree's strategy registry, answering from `torch.flagos` instead of `torch_npu` |

## Platform notes

- **Ascend** — compilation through FlagTree's Ascend backend; the plugin's `flagos` policy answers FlagTree's strategy names from its own runtime and forces `TRITON_ENABLE_TASKQUEUE=false` (the task queue is `torch_npu`-only). Not covered in CI.
- **PPU** — FlagTree initializes CUDA while selecting compiler hints in an asynchronous Inductor worker, which can fail after the parent process initialized the PPU context, so PPU FlagTree defaults to serial compilation. Set `TORCHINDUCTOR_COMPILE_THREADS` explicitly only when testing an upstream fix or deliberately choosing another worker configuration.
- **MetaX** — `torch.compile` is validated with the vendor Triton and with FlagTree main in CUDA-boxing mode.
- **Enflame GCU** — the 64-bit codegen guard is what turns "no 64-bit support" failures into an actionable error naming the operator; see Troubleshooting.
- **D-Robotics BPU** — compilation is the *only* acceleration path: `torch.compile(backend="bpu")` traces a graph, compiles it to an `.hbm` artifact through hbdk4 and runs it on the BPU, with int8 quantization inserted by default.
- **CUDA** — `flagos` is registered as a first-class Inductor GPU device. There is no `torch.compile` step in the CUDA CI job, so the path is exercised by the integration test rather than by CI.

## Performance

Fusion gain is verified for correctness (`tests/integration/test_compile.py`); benchmarking the gain against stock Inductor on CUDA is still open work. Structurally the two should land close together — same fusion passes, same Triton codegen, no per-call copy — but that is an expectation, not a measurement.

```bash
python tests/perf/bench_compile.py --model=mlp --batch-size=64
python tests/perf/bench_compile.py --model=transformer --compare-cuda
FLAGOS_USE_FLAGTREE=1 python tests/perf/bench_compile.py
```

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `FLAGOS_USE_FLAGTREE` | `0` | Require the active Triton to be FlagTree (assert, not switch) |
| `FLAGOS_COMPILE_FALLBACK_EAGER` | `0` | Fall back to eager mode on compile errors |
| `FLAGOS_TILEOPS_*` | see reference | TileOps/TileLang L2 tier, instance-cache capacity and cache disabling |

Routing variables such as `FLAGOS_BACKEND_CONFIG`, `FLAGOS_OP_<op>` and `FLAGOS_FORCE_BACKEND` still apply to compiled kernels, because the compiled graph dispatches through the same routing table.

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| Compilation raises during graph capture or codegen | Set `FLAGOS_COMPILE_FALLBACK_EAGER=1` to fall back to eager; check for unsupported ops (dynamic shapes, custom ops) and missing meta implementations |
| `InductorError: ... has no 64-bit support` on GCU | The 64-bit codegen guard rejects kernel shapes that need 64-bit indexing on a backend without it; reduce the tensor/index sizes or keep the operator on its route |
| No speedup over eager | Verify the graph really compiled (`TORCH_LOGS=inductor`), check whether Triton autotuning is still running, and confirm the workload is not launch-bound |
| FlagTree not active | `FLAGOS_USE_FLAGTREE=1` raises when the active Triton is stock; check `is_flagtree_active()` and reinstall FlagTree, which must replace the `triton` module |
| `torch.compile` unavailable | The backend is registered when `torch._dynamo` is importable; check the PyTorch version and that `import torch_fl` ran before compiling |

```bash
pytest tests/integration/test_compile.py -v --tb=short
```
