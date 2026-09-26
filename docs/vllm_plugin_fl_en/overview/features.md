# Features

- **Unified multi-chip backend**

Leverages FlagGems (unified operator library) and FlagCX (unified communication library) to provide chip-agnostic inference capabilities. The same model can run on different hardware without code modifications.

- **Flexible operator dispatch**

Implements a priority-based dispatch system that selects between FlagGems, vendor-specific, and PyTorch reference implementations. Operators can be configured per-backend with automatic fallback on failure.

- **Platform auto-detection**

Automatically detects hardware and loads platform-specific configuration. Supports NVIDIA GPU, Ascend NPU, T-Head, Iluvatar, MetaX, Moore Threads, Tsingmicro, Hygon DCU, Sunrise, Enflame, Kunlunxin, and Alibaba PPU chips, plus CPU-only inference on ARM64 hosts.

- **Extensible vendor backend**

Supports built-in vendor backends, external plugin packages via setuptools entry points, and environment-based plugin modules.

- **Optional native extension**

Building with `VLLM_VENDOR=cuda` installs the `vllm_fl._C` C++ extension required by some graph and custom-op paths, including CUDA-like devices (CUDA and HIP/ROCm) that use PyTorch's CUDA dispatch key. Without it the plugin runs as a Python-only plugin.

For the end-to-end installation flow, see [Install software for running an inference task](../getting_started/install.md). For backend and operator selection, see [Operator dispatch user guide](../dispatch_user_guide/dispatch-user-guide.md).