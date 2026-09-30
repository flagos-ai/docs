# Features

## Multi-Backend Architecture

TransformerEngine-FL introduces a three-tier plugin-based operator dispatch system that enables chip-agnostic FP8 training and inference:

- **FlagOS Backend** (default) — Uses [FlagGems](https://github.com/flagos-ai/FlagGems) for unified operator dispatch and [FlagCX](https://github.com/flagos-ai/FlagCX) for communication. Provides optimized Triton-based kernels across all supported hardware platforms.
- **Reference Backend** — Pure PyTorch implementation as a fallback for correctness verification and platforms without optimized kernels.
- **Vendor Backend** — Hardware-specific implementations that leverage vendor-provided libraries and custom kernels for maximum performance on each platform.

The dispatch system (`OpRegistry`, `OpManager`, `SelectionPolicy`) automatically selects the best available implementation based on detected hardware, policy configuration, and runtime availability.

## Multi-Vendor Hardware Support

TransformerEngine-FL supports FP8 training and inference across multiple hardware vendors through the plugin system. New vendor backends can be added through the plugin discovery mechanism without modifying core code.

## FP8 Training & Inference

- Easy-to-use modules for building Transformer layers with FP8 support on NVIDIA Hopper, Ada, and Blackwell GPUs
- Optimized fused kernels for attention, normalization, activation, GEMM, and more
- Multi-precision support: FP8, FP16, BF16 across NVIDIA Ampere architecture and later

## Framework Support

- PyTorch and JAX integrations
- Works with Megatron-LM, NeMo, DeepSpeed, HF Accelerate, Lightning, and more

## FP8 Convergence

FP8 has been tested extensively across different model architectures and configurations and we found **no significant difference** between FP8 and BF16 training loss curves. FP8 has also been validated for accuracy on downstream LLM tasks (e.g. LAMBADA and WikiText).

Validated models: T5 (770M, 11B), MPT (1.3B, 13B), GPT (5B, 22B, 175B), LLama2 (7B, 70B).
