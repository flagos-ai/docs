# Release Notes

This section includes the verl-hardware-plugin release information.

## v0.1.0

- **Overview**

  Initial release of verl-hardware-plugin, providing multi-chip hardware platform and engine plugins for [verl](https://github.com/verl-project/verl). The package is jointly developed by the ByteDance verl team and the FlagOS community, and is auto-discovered by verl through the `verl.plugins` entry-points group.

- **Added Features**

  - Hardware platform implementations registered via `@PlatformRegistry.register`:
    - FlagOS engine platform on `cuda` (vendor `flagos`, NVIDIA verified).
    - MetaX platform on `cuda` (vendor `metax`).
    - Iluvatar platform on `cuda` (vendor `iluvatar`, BI-V150).
    - Cambricon MLU platform on `mlu` (vendor `cambricon`).
    - Enflame GCU platform (vendor `enflame`).
    - Intel XPU platform on `xpu` (vendor `intel`).
  - FSDP and Megatron engine variants for each supported device/vendor pair, registered via `@EngineRegistry.register`.
  - Stage-scoped environment manager (`FLEnvManager`) for per-stage FlagGems operator allowlists/blocklists and FlagCX communication control.
  - SMI-based hardware detection for CUDA-compatible devices (`nvidia-smi`, `mx-smi`) to disambiguate vendors during auto-detection.
  - Dedicated FlagOS engines (`FSDPFlagOSEngineWithLMHead`/`WithValueHead`, `MegatronFlagOSEngineWithLMHead`) that transparently inject FlagGems acceleration.
  - Cambricon CNCL and CNI XL checkpoint engines.
  - Per-platform user guides and the GSM8K GRPO acceptance baseline script.
  - Validated platforms — the end-to-end GRPO run on GSM8K with Qwen3-0.6B has been completed on MetaX and Iluvatar; the remaining platforms ship as reference implementations.

- **Requirements**

  - Python >= 3.10
  - verl >= 0.7.0 (plugin registry from [verl#6086](https://github.com/verl-project/verl/pull/6086); Iluvatar uses verl > 0.8.0)

