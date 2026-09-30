# Release Notes

This section includes the release information for PyTorch-Plugin-FL.

## v0.1.0

Initial release of PyTorch-Plugin-FL as part of FlagOS.

- **One `flagos` device** — a `PrivateUse1`-based PyTorch device plugin; standard PyTorch APIs, tensor methods and storage work unchanged.
- **Per-operator backend routing** — FlagGems Triton kernels, vendor-native operator libraries, CUDA compatibility boxing and explicit CPU fallback behind one device name, with a per-platform routing table and per-operator overrides.
- **Multi-platform support** — NVIDIA CUDA, MetaX, Huawei Ascend, PPU, Hygon DCU, Enflame GCU, Moore Threads MUSA and D-Robotics BPU, each with its own build selector.
- **Training stack** — eager execution and autograd, `torch.autocast("flagos")` and `torch.amp.GradScaler("flagos")`, `torch.compile` integration, and DDP/FSDP support through `ProcessGroupFlagOS`.
- **Observability** — `torch.profiler` integration with a device timeline and flow arrows, per-operator dispatch and fallback logging, and a wheel compatibility manifest with the `torch-fl-preflight` inspector.
- **Platform compatibility** — CUDA boxing, native ACLNN and topsaten backends, and the FlagGems Python and C++ dispatch paths, with status levels recorded per platform.
