# 特性

FlagGems-vLLM 提供以下关键特性：

- **算子经过深度性能调优** — 每个算子都针对多种硬件后端的吞吐量和延迟进行了精心优化。
- **Triton 内核调用优化** — 通过专门的 Triton 内核模式和自动调优，最大限度地减少了内核启动开销。
- **灵活的多后端支持机制** — 该库支持多种 GPU 硬件平台，使算子无论底层设备如何都能高效运行。
- **支持常用 vLLM 算子** — 包括 vLLM 推理中常用算子的优化实现，如 `moe_align_block_size`、`grouped_topk`、`fused_moe`、`flash_mla` 等。

## 与 FlagGems 和 vllm-plugin-fl 的关系

这三个仓库配合使用，但各自承担不同的职责：

- **FlagGems**：通用 FlagGems 算子库。它提供常见的 PyTorch/Triton 算子替换，并通过 `flag_gems.enable()` / `flag_gems.use_gems()` 将算子注册到 PyTorch 调度中。
- **FlagGems-vllm**：即本仓库。它包含 vLLM 场景的算子实现以及测试/基准，对于相同算子，这些实现与对应的 FlagGems 实现保持一致。它通过 `flaggems_vllm` Python 包暴露算子，例如 `flaggems_vllm.grouped_topk`、`flaggems_vllm.fused_experts_impl` 和 `flaggems_vllm.moe_align_block_size`。
- **vllm-plugin-fl**：vLLM 插件层。它通过导入 FlagGems 并调用 `flag_gems.enable()` 将 FlagGems 用作全局算子后端。对于未通过 PyTorch 调度启用的 vLLM 专用融合内核，它会显式地从 FlagGems-vLLM 导入并调用算子。

在典型的 vLLM 插件环境中，调用流程如下：

```text
vLLM
    -> vllm-plugin-fl
            -> flag_gems.enable() 用于通用 FlagGems 算子注册
            -> flaggems_vllm.<operator>() 用于 vLLM 专用融合算子
```

这意味着 `FlagGems` 和 `FlagGems-vllm` 是互补的：`FlagGems` 提供通用算子后端，而 `FlagGems-vllm` 提供面向 vLLM 的内核以及供 `vllm-plugin-fl` 使用的兼容性测试/基准。
