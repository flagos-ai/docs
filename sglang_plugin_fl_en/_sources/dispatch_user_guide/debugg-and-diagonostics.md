# Debugging and diagnostics

This section introduces diagnostics on ops dispatch.

<!-- NEW in v0.2.0 -->
## Policy and backend resolution

Dispatch is policy-based rather than a fixed `flagos > vendor > reference` chain. When an operation does not use the expected implementation, check the effective configuration and backend availability:

1. Check environment-variable overrides such as `SGLANG_FL_PREFER`, `SGLANG_FL_PER_OP`, `SGLANG_FL_ALLOW_VENDORS`, `SGLANG_FL_DENY_VENDORS`, and `SGLANG_FL_STRICT`.
2. Check `SGLANG_FL_CONFIG` and the detected platform YAML under `sglang_fl/dispatch/config/`.
3. Enable `SGLANG_FL_DISPATCH_DEBUG=[TODO: needs confirmation]` if additional policy diagnostics are required.
4. Confirm that the selected backend's runtime and device are available in the target image.

Strict mode reports an error instead of falling back when the preferred or explicitly ordered backend is unavailable. Without strict mode, dispatch filters unavailable or disallowed candidates and selects the next allowed implementation.

## Distributed and FlagCX diagnostics

For distributed communication failures, verify the selected `SGLANG_FL_DIST_BACKEND`, `FLAGCX_PATH` when FlagCX is expected, device visibility, network configuration, and tensor/pipeline parallel settings. Platform-specific framework, image, and network-device prerequisites are documented on the [centralized vendor/framework/image-selection page](https://flagos.io/resourcedownload?lang=en).
<!-- END NEW -->

## Dispatch log

See which backend each fused op resolved to (written at server startup):

```{code-block} python
rm -f /tmp/dispatch.log
SGLANG_FL_DISPATCH_LOG=/tmp/dispatch.log \
  python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

sort -u /tmp/dispatch.log
# [OOT-DISPATCH] SiluAndMul → flagos(flagos)
# [OOT-DISPATCH] RMSNorm → flagos(flagos)
# [OOT-DISPATCH] RotaryEmbedding → flagos(flagos)
```

## ATen replacement log

Record which PyTorch ATen ops were replaced by FlagGems:

```{code-block} python
rm -f /tmp/gems_aten.txt
SGLANG_FLAGGEMS_RECORD=1 SGLANG_FLAGGEMS_LOG_PATH=/tmp/gems_aten.txt \
  python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# After first inference request:
sort -u /tmp/gems_aten.txt
```

```{note}
The log uses `_AtenOnlyFilter` to record only `flag_gems.ops.*` namespace calls, excluding internal FlagGems calls triggered by Layer 2 implementations.
```

## Troubleshoot numerical precision issues through Precision Bisection

When numerical differences appear, isolate the responsible layer. If output diverges at Step N but not Step N-1, the responsible layer/op is isolated.

```{code-block} python
# Step 1: Disable everything — confirm vanilla SGLang works
SGLANG_PLUGINS="__none__" python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# Step 2: Enable only Layer 2 (fused ops), disable ATen replacement
USE_FLAGGEMS=0 python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# Step 3: Per-op isolation — only SiluAndMul uses flagos, RMSNorm uses reference
USE_FLAGGEMS=0 \
SGLANG_FL_PER_OP="silu_and_mul=flagos;rms_norm=reference" \
    python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# Step 4: Disable Layer 2, only ATen replacement active
SGLANG_FL_OOT_ENABLED=0 python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# Step 5: Gradually enable ATen ops with whitelist
SGLANG_FL_OOT_ENABLED=0 SGLANG_FL_FLAGOS_WHITELIST=rms_norm,silu \
    python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph
```

## Common Issues

| Symptom | Cause & Fix |
| :--- | :--- |
| `dispatch.log` is empty | Plugin not loaded — check `pip show sglang_fl` |
| `gems_aten.txt` is empty | `USE_FLAGGEMS=0` is set, or `SGLANG_FL_FLAGOS_WHITELIST` excludes the op |
| `forward_cuda` error on non-NVIDIA | An op lacks OOT registration — register it or add to whitelist |
| `ImportError: sgl_kernel` | Normal on non-CUDA — the OOT dispatch bypasses `forward_cuda` |
| `tp>1` hangs at startup | Check GPU count, NCCL env vars, model TP compatibility |
| OOM at engine startup | Reduce `--mem-fraction-static` (default 0.5) |