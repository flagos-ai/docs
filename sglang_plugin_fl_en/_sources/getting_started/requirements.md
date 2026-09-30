# Requirements

## Software requirements

<!-- CHANGED: v0.2.0 separates generic plugin requirements from vendor-specific framework/image/package selections. -->
The required runtime stack depends on the selected vendor, framework, and image. Use the centralized vendor/framework/image-selection page for platform-specific SDKs, framework builds, images, validation status, and package versions: [centralized vendor/framework/image-selection page](https://flagos.io/resourcedownload?lang=en).

Generic requirements for sglang-plugin-FL are:

| Component | Requirement |
|---------|---------|
| SGLang | Compatible SGLang runtime with plugin entry-point loading |
| sglang-plugin-FL | Installed in the target runtime environment |
| FlagGems | Required for Layer 1 ATen replacement and FlagGems-backed fused implementations when enabled |
| FlagCX | Required when using FlagCX collectives |
| Vendor runtime stack | Vendor torch, drivers, firmware, device runtime, communication libraries, attention backend, and uncovered operators |

<!-- NEW in v0.2.0 -->
## Empty mode boundary

Empty mode is not a no-device mode. It changes installation/runtime assembly so that vendor-specific environments can provide their own runtime stack instead of inheriting a CUDA-oriented dependency set. The target platform still supplies vendor torch, drivers, firmware, device runtime, communication libraries, platform attention backend, and operators not covered by the plugin.
<!-- END NEW -->

## Hardware requirements

- NVIDIA GPU with CUDA support, or
- Huawei Ascend NPU with CANN toolkit, or
- Other supported hardware with appropriate vendor SDK

## Verified models

<!-- CHANGED: v0.2.0 moves detailed model/platform validation status to the centralized page. -->
Detailed model, quantization, platform, and validation status is maintained on the centralized page: [centralized vendor/framework/image-selection page](https://flagos.io/resourcedownload?lang=en). Do not treat this page as a complete vendor support matrix.
