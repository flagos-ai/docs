# Release Notes

This section includes the Megatron-LM-FL release information.

## v0.3.0

Megatron-LM-FL v0.3.0 synchronizes with upstream Megatron-LM v0.18.2 and requires Python >= 3.12.

- **Added Features**

  - New platform backends: Enflame, KunlunXin, and MUSA.
  - DSA structure support for the `GLM5` / `GLM5.1` / `GLM5.2` model family.
  - Chunked cross-entropy to reduce memory usage.
  - Ascend native integration of the MegatronAdaptor module.

- **Improved Features**

  - Override mechanism upgrade.

## v0.2.0

- **Added Features**

  - DeepSeek V4 Model Support — Full training support for DeepSeek V4 architecture including CSA/HCA attention variants, Hash Router for MoE token routing, Multi-Head Hyper-Connection (mHC), Engram auxiliary memory module, and Multi-Token Prediction (MTP) enhancements. New fused kernels: `fused_mhc_kernels`, extended `fused_mla_yarn_rope_apply`.

  - TXDA Platform Backend — Added Tsingmicro chip support via `platform_txda.py`, including optimizer and pipeline schedule adaptations for TXDA hardware.

  - NPU Platform Backend — Added Ascend NPU support via `platform_npu.py`, following the existing CUDA/MUSA platform pattern.

  - Multi-Vendor Plugin Dispatch — Extended the `@override` decorator system with runtime vendor selection via `MG_FL_PREFER` environment variable. Four-level fallback: preferred vendor → default vendor → sole vendor → None.

  - Core 0.17.0 Upgrade — Synchronized with upstream Megatron-LM Core 0.17.0, preserving FlagScale-specific patches including Engram DDP buffer separation, hetero pipeline support, `qk_layernorm_hidden_dim` support, and `cur_platform` abstraction.

## v0.1.0

Initial release of Megatron-LM-FL.

- **Added Features**

  - Plugin System — `@overridable` / `@override` decorator mechanism for platform-specific method replacement without modifying upstream code.
  - Multi-Platform Support — Hardware abstraction via `PlatformBase` with implementations for NVIDIA (CUDA), MetaX, Moore Threads (MUSA), TXDA (Tsingmicro), and NPU (Ascend).
  - Full Upstream Compatibility — All upstream Megatron-LM features preserved, including advanced parallelism strategies (TP, PP, DP, EP, CP), mixed precision (FP16, BF16, FP8), and GPU-optimized kernels.
