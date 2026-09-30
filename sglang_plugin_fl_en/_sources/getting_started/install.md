# Install sglang-plugin-FL

<!-- CHANGED: v0.2.0 centralizes vendor/framework/image selection and removes stale private image tags from this page. -->
## Runtime images and platform packages

Vendor-specific framework selection, runtime images, validation status, installation commands, and adaptation procedures are maintained on the centralized page: [centralized vendor/framework/image-selection page](https://flagos.io/resourcedownload?lang=en). Use that page to choose the vendor, framework, and image before installing or launching sglang-plugin-FL.

This page intentionally does not maintain a full image matrix or platform-specific package recipe.

<!-- NEW in v0.2.0 -->
## Empty mode

Empty mode is an installation/runtime assembly mechanism for platforms where the CUDA-oriented SGLang dependency stack is not the target deployment environment. It avoids treating CUDA packages as the universal dependency set, but it is **not** a no-device mode.

The target platform still provides:

- vendor torch;
- drivers and firmware;
- device runtime;
- communication libraries;
- platform attention backends;
- operators not covered by sglang-plugin-FL.

Use the centralized vendor/framework/image-selection page for the platform-specific image and dependency set: [centralized vendor/framework/image-selection page](https://flagos.io/resourcedownload?lang=en).
<!-- END NEW -->
