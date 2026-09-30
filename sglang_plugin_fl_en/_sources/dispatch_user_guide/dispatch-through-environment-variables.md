# Dispatch through environment variables

All plugin behavior is controlled by environment variables with the `SGLANG_FL_*` prefix.

<!-- NEW in v0.2.0 -->
The effective configuration precedence is:

```{code-block} text
environment variables > explicit YAML (`SGLANG_FL_CONFIG`) > platform auto-detected YAML > code defaults
```

Environment variables can override explicit and platform YAML values. Platform-specific backend names and runtime defaults depend on the target platform; use `[TODO: needs confirmation]` where a deployment requires an accepted-value list that is not defined by this generic guide.
<!-- END NEW -->

## Layer 2 — Fused Op Dispatch

| Variable | Default | Description |
|----------|---------|-------------|
| `SGLANG_FL_OOT_ENABLED` | `1` | Master switch: `0` disables Layer 2 (keeps Layer 1 ATen active) |
| `SGLANG_FL_PREFER` | `flagos` | Global backend preference: `flagos`, `vendor`, `reference` |
| `SGLANG_FL_PER_OP` | — | Per-op backend priority, e.g. `rms_norm=vendor\|flagos;silu_and_mul=reference` |
| `SGLANG_FL_OOT_BLACKLIST` | — | Skip listed ops from OOT dispatch (comma-separated class names) |
| `SGLANG_FL_OOT_WHITELIST` | — | Only dispatch listed ops (mutually exclusive with BLACKLIST) |
| `SGLANG_FL_STRICT` | `0` | `1` disables fallback; an unavailable preferred/ordered backend becomes an error |
| `SGLANG_FL_DENY_VENDORS` | — | Deny specific vendors (comma-separated) |
| `SGLANG_FL_ALLOW_VENDORS` | — | Allow only listed vendors (comma-separated) |
| `SGLANG_FL_DISPATCH_LOG` | — | Path to dispatch log file (records which ops are intercepted) |
| `SGLANG_FL_DISPATCH_DEBUG` | [TODO: needs confirmation] | Enables additional dispatch diagnostics; accepted values are [TODO: needs confirmation] |

## Layer 1 — ATen Replacement (FlagGems)

| Variable | Default | Description |
|----------|---------|-------------|
| `USE_FLAGGEMS` | `1` | Master switch: `0` disables all ATen replacement |
| `SGLANG_FL_FLAGOS_WHITELIST` | — | Only listed ATen ops use FlagGems (comma-separated) |
| `SGLANG_FL_FLAGOS_BLACKLIST` | — | Listed ATen ops don't use FlagGems (comma-separated) |
| `SGLANG_FLAGGEMS_RECORD` | `0` | `1` = record which ATen ops are replaced |
| `SGLANG_FLAGGEMS_LOG_PATH` | — | Path to ATen replacement log file |
| `SGLANG_FLAGGEMS_LOG_ONCE` | `1` | `1` = log each op only once, `0` = log every call |

> `SGLANG_FL_FLAGOS_WHITELIST` and `SGLANG_FL_FLAGOS_BLACKLIST` are mutually exclusive. `SGLANG_FL_FLAGOS_WHITELIST` takes priority over YAML `flagos_blacklist`.

## Layer 3 — Distributed Communication

| Variable | Default | Description |
|----------|---------|-------------|
| `SGLANG_FL_DIST_BACKEND` | `nccl` in the generic reference table | Distributed backend selection; platform runtime defaults may map to another backend, and `FLAGCX_PATH` can select FlagCX when no explicit override is set |
| `FLAGCX_PATH` | — | FlagCX installation path; required for FlagCX collectives |

Supported runtime choices depend on the platform and installed libraries. Use `[TODO: needs confirmation]` for platform-specific accepted values not covered by the target runtime.

## System / Debug

| Variable | Default | Description |
|----------|---------|-------------|
| `SGLANG_FL_CONFIG` | — | Path to YAML config file (overrides platform auto-detection) |
| `SGLANG_FL_PLATFORM` | (auto) | Force platform; accepted values are [TODO: needs confirmation] |
| `SGLANG_FL_LOG_LEVEL` | `INFO` | Dispatch system log level: `DEBUG`, `INFO`, `WARNING`, `ERROR` |
| `SGLANG_PLUGINS` | (all) | SGLang built-in: filter which plugins to load (comma-separated) |

## Examples

```{code-block} shell
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
