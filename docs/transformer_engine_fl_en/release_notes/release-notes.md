# Release Notes

This section includes the TransformerEngine-FL release information.

## v0.3.0

TransformerEngine-FL v0.3.0 synchronizes with upstream NVIDIA TransformerEngine v2.17.

- **Added Features**

  - FlagOS Triton fused RoPE kernels.
  - FlagOS layer normalization operator.
  - Bias support for `generic_gemm`.
  - New vendor backends: Tsingmicro TXDA, Ascend, and KunlunXin.

## v0.2.0

- **Added Features**

  - TE V2.14 Upstream Synchronization — Integrated NVIDIA TransformerEngine upstream v2.14, incorporating MXFP8/NVFP4 quantization, Blackwell (sm120) architecture support, FSDP2 with DTensor-aware optimizer states, fused RMSNorm dLN with add-through, and MoE grouped MLP ops. The FlagOS plugin system is fully preserved with synced OP API signatures and multi-backend compatibility patches.
  - KunlunXin Vendor Backend — Added KunlunXin chip vendor operator support with flash attention and operator registration.
  - Enflame Vendor Backend — Added Enflame chip vendor operator support with flash attention and operator registration.
  - FlagOS Grouped GEMM Operator — Implemented `te_general_grouped_gemm` for the FlagOS backend based on FlagGems Triton kernels, supporting both forward and backward computation.

## v0.1.0

Initial release of TransformerEngine-FL.

- **Added Features**

  - Multi-Backend Plugin Architecture — Plugin-based operator dispatch system (`OpRegistry`, `OpManager`, `SelectionPolicy`) with three backend tiers: FlagOS (default/Triton), Vendor (hardware-specific), and Reference (pure PyTorch).
  - Vendor Backends — Added five hardware vendor backends: Hygon (DCU), MetaX (GPU with flash attention), KunlunXin (flash attention), Iluvatar (Corex GPU), and MUSA (Moore Threads S-series GPU).
  - FlagOS Backend — FlagGems-based unified operator dispatch with FlagCX communication library integration.
  - Attention System — Multi-vendor attention backend framework with flash attention integration.
