# How plugin works ?

## Load plugin

SGLang discovers and loads the plugin automatically at startup via setuptools entry_points.

The plugin registers two entry_points in `pyproject.toml`:

```{code-block} python
[project.entry-points."sglang.srt.plugins"]
sglang_fl = "sglang_fl:load_plugin"

[project.entry-points."sglang.srt.platforms"]
sglang_fl = "sglang_fl:activate_platform"
```

## Dispatch hook

The core mechanism uses an AROUND hook on `MultiPlatformOp.dispatch_forward()` combined with a standardized dispatch system:

<!-- CHANGED: v0.2.0 dispatch no longer documents a fixed flagos > vendor > reference resolution order. -->
```{code-block} python
dispatch_forward() called for an op (e.g. RMSNorm)
  → AROUND hook intercepts
    → Check OOT_WHITELIST/OOT_BLACKLIST
    → Find bridge function via MRO (RMSNorm → rms_norm_bridge)
    → Return bridge function as the forward method
  → SGLang calls the bridge function with framework args:
      rms_norm_bridge(self, x, residual, post_residual_addition)
    → Bridge handles SGLang-specific params (post_residual_addition → merge into residual)
    → Bridge calls dispatch.call_op("rms_norm", obj, x, residual)
      → OpManager asks SelectionPolicy for candidate backend order
      → Policy combines global preference, per-op ordering, availability, vendor filters, and strict mode
      → OpManager selects the first available implementation, caches the result, or falls back when allowed
      → Calls the selected backend implementation
```
The bridge layer decouples framework-specific parameters from the standardized op signatures. Vendor backends only need to implement the standard signatures — the same impl works for both sglang-plugin-FL and vllm-plugin-FL.

<!-- NEW in v0.2.0 -->
Strict mode disables fallback: if the preferred or explicitly ordered backend cannot be used, dispatch reports an error instead of silently selecting another backend. Without strict mode, unavailable backends are filtered out and the next allowed candidate can run.
<!-- END NEW -->

## Dispatch Architecture (shared with vllm-plugin-FL)

```{code-block} python
┌─────────────────────────────────────────────────────────────┐
│  SGLang AROUND Hook        │  vLLM forward_oot override     │
│  (bridge/rms_norm.py)      │  (vllm_fl/ops/layernorm.py)    │
└────────────┬───────────────┴────────────────┬───────────────┘
             │                                │
             ▼                                ▼
┌─────────────────────────────────────────────────────────────┐
│  dispatch.call_op("rms_norm", obj, x, residual)             │
│  OpManager → SelectionPolicy → OpRegistry → resolve impl    │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   ┌─────────────┐  ┌───────────┐  ┌──────────────┐
   │ FLAGOS      │  │ VENDOR    │  │ REFERENCE    │
   │ (FlagGems)  │  │ (chip-    │  │ (PyTorch)    │
   │             │  │ native)   │  │              │
   └─────────────┘  └───────────┘  └──────────────┘
```
Chip vendors implement the **same backend interface** for both frameworks. The only framework-specific code is the bridge layer, which is maintained by the plugin.

## ATen replacement

```{code-block} python
Plugin loads → flag_gems.enable(record=True)
  → PyTorch dispatch table registers Triton kernels for ATen ops
  → On first inference call, each replaced op is logged
  → _AtenOnlyFilter ensures only flag_gems.ops.* calls are recorded
    (excludes internal FlagGems calls from Layer 2 flagos implementations)
```

<!-- NEW in v0.2.0 -->
## Empty mode boundary

Empty mode is an installation/runtime assembly mechanism for target platforms where the CUDA-oriented dependency set is not the deployment environment. It is not a no-device mode. The target platform still supplies vendor torch, drivers, firmware, device runtime, communication libraries, platform attention backends, and any operators not covered by the plugin.

Use the centralized vendor/framework/image-selection page for platform-specific runtime and image choices: [centralized vendor/framework/image-selection page](https://flagos.io/resourcedownload?lang=en).
<!-- END NEW -->
