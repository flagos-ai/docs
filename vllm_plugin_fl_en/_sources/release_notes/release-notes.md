# Release Notes

This section includes the vllm-plugin-FL release information.

## v0.3.0


vllm-plugin-FL v0.3.0 requires [vllm v0.24.0](https://github.com/vllm-project/vllm/tree/v0.24.0).


- **Added Features**

  - Support for vLLM 0.24.0, including the official vLLM 0.24 CUDA stable-ABI wheels; the FlagCX connector now covers vLLM 0.20-0.24.
  - Vendor backends upgraded to vLLM 0.24.0: MetaX C550, Moore Threads MUSA (MTT S5000), Iluvatar BI-V150, T-Head (PPU) attention backend and empty mode, Sunrise attention backend, Tsingmicro TXDA, and the Hygon workflow.
  - Quantization inference: W8A8 adapted to vLLM 0.24, plus Arm CPU support for Qwen packed W4A8 and GDN.
  - Qwen3.5 text-only runtime compatibility on vLLM 0.24.

## v0.2.2


vllm-plugin-FL v0.2.2 requires [vllm v0.20.2](https://github.com/vllm-project/vllm/tree/v0.20.2). Supported platforms: NVIDIA, Hygon DCU.

- **Added Features**

  - Qwen3.6-35B-A3B model support with text and image inference/serving
  - Qwen3.6-27B model support with text and image inference/serving
  - Hygon DCU platform support with DTK container-based deployment
  - Serving-based test workflow (vllm serve + OpenAI client) for multimodal models

- **Improved Features**

  - Extended NVIDIA platform test matrix with Qwen3.6 model coverage
  - Updated vLLM compatibility to v0.20.x

## v0.1.0

vllm-plugin-FL v0.1.0 requires [vllm v0.13.0](https://github.com/vllm-project/vllm/tree/v0.13.0). Supported platforms: NVIDIA, Ascend, T-Head, MetaX, Iluvatar.

- **Added Features**

  - Initial release of vllm-plugin-FL as a vLLM inference/serving framework plugin
  - Unified multi-chip backend support via FlagGems and FlagCX integration
  - Flexible operator dispatch system with FlagGems, vendor-specific, and PyTorch reference backends
  - End-to-end verified support for Qwen3.5-397B-A17B, Qwen3-Next-80B-A3B, Qwen3-4B, MiniCPM-o 4.5, GLM-5, Qwen3.5-35B-A3B, and BAAI/bge-m3 models
  - Hardware support for NVIDIA, Ascend, T-Head, MetaX, and Iluvatar chips
  - Platform-specific configuration files (ascend.yaml, cuda.yaml) for auto-detected defaults
  - Environment variable-based configuration for backend selection, vendor filtering, and operator control
  - YAML configuration file support for complete dispatch policy override
  - Multi-process safe operator registry with thread-safe cache operations

- **Improved Features**

  - Optimized dispatch flow with caching for resolved operators
  - Fallback mechanism from preferred backend to available alternatives on failure
  - Per-operator backend selection order configuration
  - Whitelist and blacklist support for FlagGems and OOT operators
  - Debug logging mode for dispatch system troubleshooting
