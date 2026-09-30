selector_to_html = {"a[href=\"#requirements\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><h2>Software requirements<a class=\"headerlink\" href=\"#software-requirements\" title=\"Link to this heading\">#</a></h2><p>The required runtime stack depends on the selected vendor, framework, and image. Use the centralized vendor/framework/image-selection page for platform-specific SDKs, framework builds, images, validation status, and package versions: <a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">centralized vendor/framework/image-selection page</a>.</p><p>Generic requirements for sglang-plugin-FL are:</p>", "a[href=\"#hardware-requirements\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Hardware requirements<a class=\"headerlink\" href=\"#hardware-requirements\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#software-requirements\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Software requirements<a class=\"headerlink\" href=\"#software-requirements\" title=\"Link to this heading\">#</a></h2><p>The required runtime stack depends on the selected vendor, framework, and image. Use the centralized vendor/framework/image-selection page for platform-specific SDKs, framework builds, images, validation status, and package versions: <a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">centralized vendor/framework/image-selection page</a>.</p><p>Generic requirements for sglang-plugin-FL are:</p>", "a[href=\"#verified-models\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Verified models<a class=\"headerlink\" href=\"#verified-models\" title=\"Link to this heading\">#</a></h2><p>Detailed model, quantization, platform, and validation status is maintained on the centralized page: <a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">centralized vendor/framework/image-selection page</a>. Do not treat this page as a complete vendor support matrix.</p>", "a[href=\"#empty-mode-boundary\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Empty mode boundary<a class=\"headerlink\" href=\"#empty-mode-boundary\" title=\"Link to this heading\">#</a></h2><p>Empty mode is not a no-device mode. It changes installation/runtime assembly so that vendor-specific environments can provide their own runtime stack instead of inheriting a CUDA-oriented dependency set. The target platform still supplies vendor torch, drivers, firmware, device runtime, communication libraries, platform attention backend, and operators not covered by the plugin.</p>"}
skip_classes = ["headerlink", "sd-stretched-link"]

window.onload = function () {
    for (const [select, tip_html] of Object.entries(selector_to_html)) {
        const links = document.querySelectorAll(` ${select}`);
        for (const link of links) {
            if (skip_classes.some(c => link.classList.contains(c))) {
                continue;
            }

            tippy(link, {
                content: tip_html,
                allowHTML: true,
                arrow: true,
                placement: 'auto-start', maxWidth: 500, interactive: false,

            });
        };
    };
    console.log("tippy tips loaded!");
};
