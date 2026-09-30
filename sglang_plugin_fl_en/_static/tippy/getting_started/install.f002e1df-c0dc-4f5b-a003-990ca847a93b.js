selector_to_html = {"a[href=\"#runtime-images-and-platform-packages\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Runtime images and platform packages<a class=\"headerlink\" href=\"#runtime-images-and-platform-packages\" title=\"Link to this heading\">#</a></h2><p>Vendor-specific framework selection, runtime images, validation status, installation commands, and adaptation procedures are maintained on the centralized page: <a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">centralized vendor/framework/image-selection page</a>. Use that page to choose the vendor, framework, and image before installing or launching sglang-plugin-FL.</p><p>This page intentionally does not maintain a full image matrix or platform-specific package recipe.</p>", "a[href=\"#install-sglang-plugin-fl\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Install sglang-plugin-FL<a class=\"headerlink\" href=\"#install-sglang-plugin-fl\" title=\"Link to this heading\">#</a></h1><h2>Runtime images and platform packages<a class=\"headerlink\" href=\"#runtime-images-and-platform-packages\" title=\"Link to this heading\">#</a></h2><p>Vendor-specific framework selection, runtime images, validation status, installation commands, and adaptation procedures are maintained on the centralized page: <a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">centralized vendor/framework/image-selection page</a>. Use that page to choose the vendor, framework, and image before installing or launching sglang-plugin-FL.</p><p>This page intentionally does not maintain a full image matrix or platform-specific package recipe.</p>", "a[href=\"#empty-mode\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Empty mode<a class=\"headerlink\" href=\"#empty-mode\" title=\"Link to this heading\">#</a></h2><p>Empty mode is an installation/runtime assembly mechanism for platforms where the CUDA-oriented SGLang dependency stack is not the target deployment environment. It avoids treating CUDA packages as the universal dependency set, but it is <strong>not</strong> a no-device mode.</p><p>The target platform still provides:</p>"}
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
