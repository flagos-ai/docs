# Troubleshooting

Symptom-first fixes for the problems that recur across platforms. A device count of 0 with a working driver, a symbol error at import, or a crash in one operator usually traces back to import order, a missing vendor library, or the wrong compiler — the sections below cover each in turn.

## Import order

`import torch_fl` must come **before** `import torch` in a fresh process on every CUDA-ABI platform (CUDA, MetaX, PPU, DCU). At import, Torch-FL preloads the vendor `libtorch` and the CUDA assets; if `torch` is imported first, PyTorch caches its stub CUDA hooks and the preload has no effect.

```python
import torch_fl   # first
import torch
```

Symptoms of getting this wrong:

| Symptom | Where |
|---|---|
| `Cannot initialize CUDA without ATen_cuda library` | CUDA |
| `undefined symbol` from `libtorch` | MetaX |
| Undefined `c10` symbol, or a crash instead of an exception | MUSA, when the wheel was built without `--no-build-isolation` |
| A wrong-vendor build resolved, or a `dlopen` abort | any CUDA-ABI platform |

## `torch.flagos.device_count()` returns 0

Work through these in order:

1. **Driver visible?** `nvidia-smi` (CUDA), `mx-smi` (MetaX), `hy-smi` (DCU), vendor tools on the others. If the driver does not see the device, no software fix helps.
2. **Runtime initialized?** A driver/runtime version skew is the most common cause. On CUDA, reinstall the matching `nvidia-*-cu12` runtime packages.
3. **Import order** — see above.
4. **Device nodes / visibility.** Ascend needs accessible `/dev/davinci*` nodes; CUDA honours `CUDA_VISIBLE_DEVICES`, and an out-of-range `device="flagos:N"` raises `invalid device ordinal`.
5. **Vendor library reachable.** A MetaX wheel that cannot find `/opt/maca`, or one whose `LD_LIBRARY_PATH` overrides the MACA runtime paths, reports a device-count mismatch between `torch.cuda` and `torch.flagos`.

## Missing vendor libraries

| Message | Platform | Cause and fix |
|---|---|---|
| `cannot open shared object file: libhydmi.so` | DCU | `hyhal` is not on `LD_LIBRARY_PATH`; add `/usr/local/hyhal/lib` (or `/opt/hyhal/lib`) |
| `MIOpen: librt.so not found` | DCU | DTK's MIOpen config references a removed `/usr/lib/.../librt.so`; the `FLAGOS_ACCELERATOR=dcu` build branch rewrites it — verify that selector is set and you are on current code |
| `libtorch_cuda.so not found` | PPU | PPU builds ship no bundled CUDA assets: export `FLAGOS_DISABLE_CUDA_ASSETS=1` before running Python |
| `CUDA_HOME not set` | PPU | export `CUDA_HOME=/usr/local/PPU_SDK/CUDA_SDK` before building |

## Compiler and Triton

| Message | Cause and fix |
|---|---|
| `No backend registered for 'hcu'` | The active `triton` is not the FlagTree build: uninstall every `triton` until clean, then install the FlagTree wheel for your platform from the FlagOS index |
| Two `triton` distributions in one environment | pip cannot remove a copy that ships no `dist-info`; delete `site-packages/triton` by path first, then reinstall |
| `Invalid cross-device link` (PPU) | pip cache and build dir are on different filesystems; download the wheel and install the file directly |
| A FlagGems-import error after setting `FLAGGEMS_DIR` to an incompatible build | install FlagGems and FlagTree from the same index for the same platform |

FlagGems routes resolve kernels by name at dispatch time, so a FlagGems-backed operator raises rather than silently falling back when the package is missing. To confirm what actually served a call, run with `FLAGOS_LOG=dispatch`.

## Distributed

- A `ProcessGroupGloo` **rejects flagos tensors outright**. With `FLAGOS_DIST_REDIRECT_GLOO` (on by default) a plain `init_process_group(backend="gloo")` is answered with the flagos backend instead.
- If no vendor communicator (FlagCX / NCCL / HCCL / MCCL) is available, the host-staged gloo tier is used, which copies each operand device → host → device. Set `FLAGOS_DIST_STAGED_GLOO=0` to fail loudly instead of silently staging.
- `extended_api creator not found` when building FlagCX for PPU: rebuild with `FLAGCX_ADAPTOR=nvidia`.

## Profiler and torch.compile

- `torch.profiler` on a platform whose tracer library is not at its default path: point `FLAGOS_TRACER_LIBRARY` at the installed library.
- PPU and MUSA may show no device events when the installed PyTorch build is a CPU-only wheel: it supplies no `PrivateUse1` Kineto resolver, so collected activities never surface as device events. This is an environment limitation, not a tracer defect.
- `torch.compile` on a platform with no vendor Triton stack installed: the Inductor route needs the platform's FlagTree (or vendor Triton) build; `FLAGOS_COMPILE_FALLBACK_EAGER=1` falls back to eager for unsupported operations.
