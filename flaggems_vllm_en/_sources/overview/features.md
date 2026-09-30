# Features

FlagGems-vLLM provides the following key features:

- **Operators have undergone deep performance tuning** — Each operator is carefully optimized for throughput and latency across multiple hardware backends.
- **Triton kernel call optimization** — Kernel launch overhead is minimized through specialized Triton kernel patterns and autotuning.
- **Flexible multi-backend support mechanism** — The library supports a variety of GPU hardware platforms, allowing operators to run efficiently regardless of the underlying device.
- **Support for common vLLM operators** — Includes optimized implementations of operators frequently used in vLLM inference, such as `moe_align_block_size`, `grouped_topk`, `fused_moe`, `flash_mla`, and more.

## Relationship with FlagGems and vllm-plugin-fl

The three repositories are used together but have different responsibilities:

- **FlagGems**: the general-purpose FlagGems operator library. It provides common PyTorch/Triton operator replacements and exposes `flag_gems.enable()` / `flag_gems.use_gems()` to register operators into PyTorch dispatch.
- **FlagGems-vllm**: this repository. It contains vLLM-scenario operator implementations and tests/benchmarks that are aligned with the corresponding FlagGems implementations where the same operator exists. It exposes operators through the `flaggems_vllm` Python package, for example `flaggems_vllm.grouped_topk`, `flaggems_vllm.fused_experts_impl`, and `flaggems_vllm.moe_align_block_size`.
- **vllm-plugin-fl**: the vLLM plugin layer. It uses FlagGems as the global operator backend by importing FlagGems and calling `flag_gems.enable()`. For vLLM-specific fused kernels that are not enabled through PyTorch dispatch, it explicitly imports and calls operators from FlagGems-vllm.

In a typical vLLM plugin environment, the call flow is:

```text
vLLM
    -> vllm-plugin-fl
            -> flag_gems.enable() for general FlagGems operator registration
            -> flaggems_vllm.<operator>() for vLLM-specific fused operators
```

This means `FlagGems` and `FlagGems-vllm` are complementary: `FlagGems` provides the common operator backend, while `FlagGems-vllm` provides vLLM-oriented kernels and compatibility tests/benchmarks used by `vllm-plugin-fl`.
