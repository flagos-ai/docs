# Compatibility and Platform Support

## Status definitions

| Status | Meaning |
|---|---|
| Stable | Critical paths are continuously tested and the supported version combination is documented. |
| Beta | The primary path is validated, but coverage, packaging, or release procedures are not yet stable. |
| Experimental | Validation exists for a specific setup, model, or hardware environment; interfaces or build procedures may change. |
| Runtime only | Device runtime support exists, but the platform is not a general eager operator backend. |

## Project compatibility

| Component | Supported range | Notes |
|---|---|---|
| Python | 3.8 or later | Platform SDKs and available wheels may impose a narrower range |
| PyTorch | 2.10.x (`>=2.10,<2.11`) | Generated ATen bindings are tied to this minor line |
| FlagGems | Platform dependent | Installed from PyPI or a vendor-compatible build only where the platform route uses it |
| Triton / compiler | Platform dependent | Use the compiler distribution required by the selected accelerator; FlagTree where the platform is built on it |

### ATen minor-line pinning

PyTorch-Plugin-FL generates native bindings to PyTorch's internal ATen operator registry. Those bindings are sensitive to C++ ABI and operator schema changes, so the project pins to a PyTorch minor line — currently **2.10.x**. A different minor version (for example 2.11.x) produces build or runtime failures; patch releases inside the same line (2.10.0 → 2.10.1) are compatible.

### Wheel compatibility record

Every built wheel carries `torch_fl/compatibility.json`, recording the selected platform and kernel sets, the bundled libtorch location, the build-time PyTorch version and C++ ABI flag, the FlagTree/FlagGems/FlagCX versions observed at build time, the declared vendor PyTorch version where one supplies device libraries, and the wheel's Python requirements. An SDK version is recorded only when the builder sets `FLAGOS_SDK_VERSION` to a verified value; an absent value means *unknown*, not "compatible with all".

```bash
python scripts/tools/torch-fl-preflight --wheel dist/torch_fl-*.whl --platform cuda \
  --sdk-version 13.3 --check-installed
```

`torch-fl-preflight` runs without importing `torch_fl`, so its checks do not trigger backend import side effects. `--check-installed` compares declared dependency ranges with the installed environment, `--check-build-env` requires exact build versions, and `--require-sdk` rejects wheels without a declared SDK. A release table can be generated from final wheel files with `--release --markdown-table`.

## Platform matrix

| Platform | Build selector | Execution path | Eager and autograd | torch.compile | Distributed | Profiler | FlagGems | Status |
|---|---|---|---|---|---|---|---|---|
| NVIDIA CUDA | `FLAGOS_ACCELERATOR=cuda` (default) | CUDA boxing over an external `libtorch_cuda.so` | Stable | Experimental (Inductor GPU device registered; no CI step) | Beta (FlagCX + NCCL fallback, DDP live-verified) | Stable (CUPTI parity) | Beta (Python + C++ dispatch paths) | Stable |
| MetaX | `FLAGOS_ACCELERATOR=metax` | CUDA boxing via `cu-bridge` against the vendor libtorch | Stable (FP16/BF16 autocast and GradScaler measured in boxing mode) | Experimental (vendor Triton and FlagTree measured on C550) | Experimental (NCCL-shaped `mccl` fallback; not CI-covered) | Experimental (MCPTI parity measured on C550; not CI-covered) | Experimental (Python dispatch; not CI-tested on MetaX) | Stable |
| Ascend | `FLAGOS_ACCELERATOR=ascend` | Native ACLNN backend, FlagGems via FlagTree (Triton 3.5) | Stable (CI-covered ops, RNG suite) | Experimental (Inductor measured on 910 with triton-ascend only, not revalidated on FlagTree; no CI step) | Experimental (HCCL fallback; architectural routing only) | Beta (MSPTI events plus device-time linkage, CI-covered by the shared contract; parity suite excluded) | Beta (Python dispatch; float64 and bool `neg` routes fall back to ACLNN) | Beta |
| PPU | `FLAGOS_ACCELERATOR=ppu` | CUDA boxing against the PPU CUDA-13-compatible SDK, bundling its own libtorch | Experimental (FP16/BF16 autocast and GradScaler measured on PPU hardware, not in CI) | Not validated | Experimental (NCCL fallback via a vendor-adapted `libnccl.so.2`; not CI-covered) | Not validated on this vendor's tracer | Experimental (vendor-index Triton required) | Experimental |
| Hygon DCU | `FLAGOS_ACCELERATOR=dcu` | CUDA boxing over the hipified DTK torch build | Beta (including FP16/BF16 autocast and GradScaler) | Experimental (FlagTree HCU validated on `gfx936`; not in CI) | Experimental (RCCL via DTK; `all_reduce`/DDP measured on 2 cards) | Beta (parity suite runs in CI) | Beta (Python dispatch only) | Beta |
| Enflame GCU | `FLAGOS_ACCELERATOR=gcu` | Native `libtopsaten.so` backend, CPU fallback for unrouted/int64/float64 ops | Beta (operator, RNG, factory and AMP suites CI-guarded on S60) | Not validated | Not validated | Runtime only (TOPSPTI activities, no device events on a CPU-only Kineto build) | Experimental (Python dispatch, requires vendor Triton) | Beta |
| Moore Threads MUSA | `FLAGOS_ACCELERATOR=musa` | Native `mudnn` backend, CPU fallback for unrouted ops | Experimental (FP16/BF16 autocast and GradScaler measured on MTT S5000) | Experimental (FlagTree forward/backward measured on MTT S5000; vendor runtime required) | Not validated | Experimental (MUPTI device timeline measured on MTT S5000) | Experimental (Python dispatch, requires vendor Triton) | Experimental |
| D-Robotics BPU | `FLAGOS_ACCELERATOR=bpu` | No eager kernel sets; eager ops run on CPU | Runtime only (CPU fallback for eager) | Experimental (`torch.compile(backend="bpu")` graph path via hbdk4) | Not applicable | Not validated | Not applicable (no per-operator kernel build) | Runtime only |
| TsingMicro | `FLAGOS_ACCELERATOR=tsingmicro` | Runtime/build selector present; no per-operator kernel set documented | Runtime only | Not validated | Not validated | Not validated | Not applicable | Runtime only |

## Reading the matrix

- **Eager and autograd** is the primary operator path; a Stable rating means the platform's critical paths are continuously exercised.
- **torch.compile** is experimental on most platforms: it is validated on specific hardware, and several platforms have no CI step for it. See {doc}`torch.compile integration <../architecture/torch-compile>`.
- **Distributed** ratings reflect measured collective and DDP coverage rather than the presence of code; see {doc}`Distributed collectives <../architecture/distributed>`.
- **Profiler** ratings describe which parts of the `torch.profiler` contract a platform satisfies; see {doc}`Profiler integration <../architecture/profiler>`.
- **FlagGems** on a platform means the portable Triton kernel route is available there; it is measured separately for availability and correctness.

Capability ratings here describe the platform, not one build. A wheel built with a subset of kernel sets (`FLAGOS_BUILD_*`) supports a subset of what the platform can do — the wheel's own record is authoritative for that wheel.
