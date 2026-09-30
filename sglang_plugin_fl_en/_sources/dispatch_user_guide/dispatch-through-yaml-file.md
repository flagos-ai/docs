# Dispatch through YAML config file

<!-- CHANGED: v0.2.0 stores platform defaults under sglang_fl/dispatch/config and distinguishes explicit YAML from platform auto-detection. -->
The plugin ships platform YAML defaults under `sglang_fl/dispatch/config/`. Available platform files include `ascend.yaml`, `gcu.yaml`, `hygon.yaml`, `iluvatar.yaml`, `kunlunxin.yaml`, `musa.yaml`, `nvidia.yaml`, and `tsingmicro.yaml`. These files provide default dispatch policy; they are not a vendor validation matrix.

Create an explicit YAML file when you want to override the platform defaults:

```{code-block} shell
SGLANG_FL_CONFIG=./my_config.yaml python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph
```

Configuration precedence is:

```{code-block} text
environment variables > explicit YAML (`SGLANG_FL_CONFIG`) > platform auto-detected YAML > code defaults
```

If no explicit YAML is supplied, the detected platform YAML and code defaults are used. Environment variables can override either YAML source.

## Config Fields

```yaml
# Global backend preference: flagos | vendor | reference
prefer: flagos

# Per-op backend priority (ordered list, first available wins)
op_backends:
  rms_norm: [vendor, flagos, reference]
  silu_and_mul: [flagos, vendor, reference]

# Layer 2 fused ops to skip (fall through to SGLang native path)
oot_blacklist:
  - RotaryEmbedding

# Layer 1 ATen ops to exclude from FlagGems Triton replacement
flagos_blacklist:
  - mul
  - sub

# Optional vendor filters
allow_vendors: []
deny_vendors: []

# Disable fallback when true
strict: false
```

| Field | Description |
|-------|-------------|
| `prefer` | Global backend preference: `flagos`, `vendor`, `reference` |
| `op_backends` | Per-op ordered backend list; the first available and allowed backend is selected |
| `oot_blacklist` | Layer 2 fused ops to skip from OOT dispatch |
| `flagos_blacklist` | Layer 1 ATen ops to exclude from FlagGems replacement |
| `allow_vendors` | Optional vendor allow list; only listed vendors are eligible |
| `deny_vendors` | Optional vendor deny list |
| `strict` | Disables fallback when enabled; exact YAML boolean syntax is [TODO: needs confirmation] |

## Common Recipes

Each recipe shows a YAML config and expected dispatch result. Use [Dispatch Log](debugg-and-diagonostics.md) to verify.

### 1. Skip RotaryEmbedding from OOT dispatch (fall through to SGLang native path)

```yaml
# my_config.yaml
prefer: flagos
oot_blacklist:
  - RotaryEmbedding
```

Expected dispatch log: only SiluAndMul and RMSNorm appear, no RotaryEmbedding.

### 2. Force RMSNorm to use vendor backend, others use flagos

```yaml
# my_config.yaml
prefer: flagos
op_backends:
  rms_norm: [vendor, flagos, reference]
```

Expected dispatch log: the first available, allowed backend is selected according to the active platform and vendor filters.

### 3. Use pure PyTorch reference for all Ops (useful for precision debugging)

```yaml
# my_config.yaml
prefer: reference
```

Expected dispatch log: reference implementations are selected when available.
