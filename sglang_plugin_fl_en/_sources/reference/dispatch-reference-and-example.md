# Environment variable references and examples

This page documents the references and examples of environment variables for sglang-plugin-FL.

<!-- NEW in v0.2.0 -->
The effective configuration precedence is:

```{code-block} text
environment variables > explicit YAML (`SGLANG_FL_CONFIG`) > platform auto-detected YAML > code defaults
```

For vendor/framework/image selection, platform-specific runtime packages, images, and validation status, use the [centralized vendor/framework/image-selection page](https://flagos.io/resourcedownload?lang=en).
<!-- END NEW -->

## Environment Variables — Complete Reference

### Layer 2 — Fused Op Dispatch

| Variable | Default | Description |
|----------|---------|-------------|
| `SGLANG_FL_OOT_ENABLED` | `1` | Master switch: `0` disables Layer 2 (keeps Layer 1 ATen active) |
| `SGLANG_FL_PREFER` | `flagos` | Global backend preference: `flagos`, `vendor`, `reference` |
| `SGLANG_FL_PER_OP` | — | Per-op backend priority, e.g. `rms_norm=vendor\|flagos;silu_and_mul=reference` |
| `SGLANG_FL_OOT_BLACKLIST` | — | Skip listed ops from OOT dispatch (comma-separated class names) |
| `SGLANG_FL_OOT_WHITELIST` | — | Only dispatch listed ops (mutually exclusive with BLACKLIST) |
| `SGLANG_FL_STRICT` | `0` | `1` = disable fallback (error if preferred backend unavailable) |
| `SGLANG_FL_DENY_VENDORS` | — | Deny specific vendors (comma-separated, e.g. `cuda,ascend`) |
| `SGLANG_FL_ALLOW_VENDORS` | — | Allow only listed vendors (comma-separated) |
| `SGLANG_FL_DISPATCH_LOG` | — | Path to dispatch log file (records which ops are intercepted) |


### Layer 1 — ATen Replacement (FlagGems)

| Variable | Default | Description |
|----------|---------|-------------|
| `USE_FLAGGEMS` | `1` | Master switch: `0` disables all ATen replacement |
| `SGLANG_FL_FLAGOS_WHITELIST` | — | Only listed ATen ops use FlagGems (comma-separated) |
| `SGLANG_FL_FLAGOS_BLACKLIST` | — | Listed ATen ops don't use FlagGems (comma-separated) |
| `SGLANG_FLAGGEMS_RECORD` | `0` | `1` = record which ATen ops are replaced |
| `SGLANG_FLAGGEMS_LOG_PATH` | — | Path to ATen replacement log file |
| `SGLANG_FLAGGEMS_LOG_ONCE` | `1` | `1` = log each op only once, `0` = log every call |

`FLAGOS_WHITELIST` and `FLAGOS_BLACKLIST` are mutually exclusive. `FLAGOS_WHITELIST` takes priority over YAML `flagos_blacklist`.

### Layer 3 — Communication

| Variable | Default | Description |
|----------|---------|-------------|
| `SGLANG_FL_DIST_BACKEND` | `nccl` | Backend: `nccl` / `hccl` / `flagcx` |
| `FLAGCX_PATH` | — | FlagCX installation path (if set, defaults to `flagcx` backend) |

###  System / Debug

| Variable | Default | Description |
|----------|---------|-------------|
| `SGLANG_FL_CONFIG` | — | Path to YAML config file (overrides platform auto-detect) |
| `SGLANG_FL_PLATFORM` | (auto) | Force platform: `cuda`, `ascend` (overrides auto-detection) |
| `SGLANG_FL_LOG_LEVEL` | `INFO` | Dispatch system log level: `DEBUG`, `INFO`, `WARNING`, `ERROR` |
| `SGLANG_PLUGINS` | (all) | SGLang built-in: filter which plugins to load (comma-separated). Not needed — plugin auto-discovered after `pip install` |

## Examples

```{code-block} bash
# Force all ops to reference backend (pure PyTorch, useful for precision debugging)
SGLANG_FL_PREFER=reference python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# Per-op: RMSNorm uses vendor, others use flagos
SGLANG_FL_PER_OP="rms_norm=vendor|flagos;silu_and_mul=flagos" \
    python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# Skip RotaryEmbedding from OOT dispatch (fall through to SGLang native CUDA)
SGLANG_FL_OOT_BLACKLIST=RotaryEmbedding python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# Disable ATen layer, keep only fused op dispatch
USE_FLAGGEMS=0 python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# Use YAML config with env var override
SGLANG_FL_CONFIG=./my_config.yaml SGLANG_FL_PREFER=reference \
    python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph
```
