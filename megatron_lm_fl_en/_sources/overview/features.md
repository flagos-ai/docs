# Features

## Plugin System

Megatron-LM-FL introduces a plugin-based architecture that enables platform-specific implementations without modifying upstream code:

- **`@overridable`** — Marks a method or function in `megatron.core` as replaceable by a plugin
- **`@override`** — Registers a plugin implementation that replaces an `@overridable` target
- **Multi-Vendor Dispatch** — Runtime vendor selection via `MG_FL_PREFER` environment variable with four-level fallback: preferred vendor → default vendor → sole vendor → None

## Multi-Platform Support

Hardware abstraction via `PlatformBase` with implementations for multiple platforms:

- **NVIDIA** — CUDA GPUs (default, full feature support)
- **MetaX** — MetaX GPUs
- **Moore Threads** — MUSA GPUs
- **TXDA** — Tsingmicro GPUs
- **NPU** — Ascend NPU

## DeepSeek V4 Support

Full training support for DeepSeek V4 architecture (CSA/HCA, Hash Router, mHC, Engram, MTP).

## Upstream Compatibility

- Full upstream Megatron-LM features preserved
- Core 0.17.0 synchronization with FlagScale-specific patches (engram, hetero pipeline, platform plugin)
- Advanced parallelism strategies: TP, PP, DP, EP, CP
- Mixed precision: FP16, BF16, FP8
- GPU-optimized kernels

## CI/CD

- Multi-platform unit and functional tests (CUDA + MetaX)
- Qwen3 benchmark gate with A100 golden values
- Lint gate: pylint >= 9.0
- Coverage reporting to FlagCICD platform
