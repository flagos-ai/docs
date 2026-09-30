# TransformerEngine-FL Overview

TransformerEngine-FL is a fork of [NVIDIA Transformer Engine](https://github.com/NVIDIA/TransformerEngine) (TE) that introduces a plugin-based architecture for supporting diverse AI chips, built on top of [FlagOS](https://github.com/flagos-ai), a unified open-source AI system software stack. It extends TE's FP8 training and inference capabilities across diverse hardware environments. Without changing TE's original interfaces or usage patterns, the same model code can run FP8 mixed-precision training and inference on different AI chip platforms.

Transformer Engine (TE) is a library for accelerating Transformer models on NVIDIA GPUs, including using 8-bit floating point (FP8) precision on Hopper, Ada, and Blackwell GPUs, to provide better performance with lower memory utilization in both training and inference. TE provides a collection of highly optimized building blocks for popular Transformer architectures and an automatic mixed precision-like API that can be used seamlessly with your framework-specific code. TE also includes a framework agnostic C++ API that can be integrated with other deep learning libraries to enable FP8 support for Transformers.

## Architecture

TransformerEngine-FL adopts a three-layer plugin-based architecture that decouples operator management from hardware-specific implementations.

![alt text](../assets/te-fl-architecture.PNG)

**Upper Layer** — Core API remains unchanged. TEFLModule initializes the plugin system and abstracts an Op API layer. CppExtension/Pybind binds TEFLModule to execute selected backend kernels.

**Middle Layer** — OpManager serves as the core dispatch hub, coordinating OpRegistry (thread-safe operator registration), SelectionPolicy (backend selection with prefer/strict/per-op configuration), and Discovery (automatic plugin detection via Python Entry Points and environment variables).

**Lower Layer** — Three backend types: FlagOS (default, Triton-based cross-platform), Vendor (hardware-specific optimized implementations, supports In-Tree and Out-of-Tree plugins), and Reference (pure PyTorch fallback for correctness guarantee).


## Plugin System

TransformerEngine-FL adds a plugin-based operator dispatch system in `transformer_engine/plugin/`. It allows alternative backend implementations to be registered and selected at runtime, enabling multi-chip support without modifying the core library.

The plugin system consists of:

- **OpRegistry**: Thread-safe registry for operator implementations
- **OpManager**: Core dispatch manager that selects the best available backend
- **SelectionPolicy**: Configurable backend selection policy
- **Discovery**: Plugin discovery via environment variables and setuptools entry points

### Backend Priority

| Kind | Priority | Description |
|------|----------|-------------|
| DEFAULT (FlagOS) | 150 | FlagGems-based implementations |
| VENDOR | 100 | Vendor-specific implementations |
| REFERENCE | 50 | PyTorch native implementations |

For supported vendors, see [Supported hardwares](/getting_started/requirements.md#supported-hardwares).

```{toctree}
:maxdepth: 2

features.md
```