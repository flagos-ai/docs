# Run tests and benchmark

This section covers how to run tests and benchmarks for FlagGems-vLLM to validate correctness and measure operator performance.

The following commands are verified in the FlagGems-vLLM repository and can be used for quick validation after installation.

## Import smoke test

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

## Run tests

```bash
cd /workspace/FlagGems-vllm
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q tests --collect-only
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q tests --quick
```

Run a focused operator test:

```bash
cd /workspace/FlagGems-vllm
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q tests/test_grouped_topk.py
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q tests/test_fused_inv_rope_fp8_quant.py --quick
```

## Run benchmark

```bash
cd /workspace/FlagGems-vllm
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q benchmark --collect-only
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q benchmark/test_moe_align_block_size_triton.py::test_moe_align_block_size_triton --level core --iter 1 --warmup 1
```

Run focused benchmarks for vLLM-specific operators:

```bash
cd /workspace/FlagGems-vllm
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q benchmark/test_grouped_topk.py --level core --iter 1 --warmup 1
PYTHONPATH=/workspace/FlagGems-vllm/src pytest -q benchmark/test_fused_inv_rope_fp8_quant.py --level core --iter 1 --warmup 1
```

```{note}
- Most tests/benchmarks require a CUDA-capable GPU runtime, with ongoing support for additional backend chips planned.
- `--collect-only` is recommended first to quickly check import and test discovery.
- Use `--quick` for fast functional validation when supported by the test.
- Use `--level core --iter 1 --warmup 1` for fast benchmark smoke tests.
- Full benchmark runs can take a long time and should be reserved for performance validation.
```
