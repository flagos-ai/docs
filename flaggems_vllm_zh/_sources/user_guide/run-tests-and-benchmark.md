# 运行测试和基准

本节介绍如何运行 FlagGems-vLLM 的测试和基准，以验证正确性并衡量算子性能。

以下命令已在 FlagGems-vLLM 仓库中验证，可用于安装后的快速验证。

## 导入冒烟测试

```bash
cd /workspace/FlagGems-vllm
PYTHONPATH=/workspace/FlagGems-vllm/src python - <<'PY'
import torch
import flaggems_vllm

print('torch:', torch.__version__)
print('cuda available:', torch.cuda.is_available())
print('flaggems_vllm device:', flaggems_vllm.device)
print('grouped_topk:', callable(flaggems_vllm.grouped_topk))
PY
```

## 运行测试

```bash
cd /workspace/FlagGems-vllm
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q tests --collect-only
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q tests --quick
```

运行特定算子测试：

```bash
cd /workspace/FlagGems-vllm
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q tests/test_grouped_topk.py
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q tests/test_fused_inv_rope_fp8_quant.py --quick
```

## 运行基准测试

```bash
cd /workspace/FlagGems-vllm
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q benchmark --collect-only
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q benchmark/test_moe_align_block_size_triton.py::test_moe_align_block_size_triton --level core --iter 1 --warmup 1
```

运行 vLLM 专用算子的基准测试：

```bash
cd /workspace/FlagGems-vllm
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q benchmark/test_grouped_topk.py --level core --iter 1 --warmup 1
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q benchmark/test_fused_inv_rope_fp8_quant.py --level core --iter 1 --warmup 1
```

```{note}
- 大多数测试/基准需要支持 CUDA 的 GPU 运行时，后续计划支持更多后端芯片。
- 建议先使用 `--collect-only` 快速检查导入和测试发现。
- 当测试支持时，使用 `--quick` 进行快速功能验证。
- 使用 `--level core --iter 1 --warmup 1` 进行快速基准冒烟测试。
- 完整的基准运行可能需要很长时间，应保留用于性能验证。
```
