selector_to_html = {"a[href=\"#dispatch-architecture-shared-with-vllm-plugin-fl\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Dispatch Architecture (shared with vllm-plugin-FL)<a class=\"headerlink\" href=\"#dispatch-architecture-shared-with-vllm-plugin-fl\" title=\"Link to this heading\">#</a></h2><p>Chip vendors implement the <strong>same backend interface</strong> for both frameworks. The only framework-specific code is the bridge layer, which is maintained by the plugin.</p>", "a[href=\"#load-plugin\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Load plugin<a class=\"headerlink\" href=\"#load-plugin\" title=\"Link to this heading\">#</a></h2><p>SGLang discovers and loads the plugin automatically at startup via setuptools entry_points.</p><p>The plugin registers two entry_points in <code class=\"docutils literal notranslate\"><span class=\"pre\">pyproject.toml</span></code>:</p>", "a[href=\"#aten-replacement\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen replacement<a class=\"headerlink\" href=\"#aten-replacement\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#empty-mode-boundary\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Empty mode boundary<a class=\"headerlink\" href=\"#empty-mode-boundary\" title=\"Link to this heading\">#</a></h2><p>Empty mode is an installation/runtime assembly mechanism for target platforms where the CUDA-oriented dependency set is not the deployment environment. It is not a no-device mode. The target platform still supplies vendor torch, drivers, firmware, device runtime, communication libraries, platform attention backends, and any operators not covered by the plugin.</p><p>Use the centralized vendor/framework/image-selection page for platform-specific runtime and image choices: <a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">centralized vendor/framework/image-selection page</a>.</p>", "a[href=\"#how-plugin-works\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">How plugin works ?<a class=\"headerlink\" href=\"#how-plugin-works\" title=\"Link to this heading\">#</a></h1><h2>Load plugin<a class=\"headerlink\" href=\"#load-plugin\" title=\"Link to this heading\">#</a></h2><p>SGLang discovers and loads the plugin automatically at startup via setuptools entry_points.</p><p>The plugin registers two entry_points in <code class=\"docutils literal notranslate\"><span class=\"pre\">pyproject.toml</span></code>:</p>", "a[href=\"#dispatch-hook\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Dispatch hook<a class=\"headerlink\" href=\"#dispatch-hook\" title=\"Link to this heading\">#</a></h2><p>The core mechanism uses an AROUND hook on <code class=\"docutils literal notranslate\"><span class=\"pre\">MultiPlatformOp.dispatch_forward()</span></code> combined with a standardized dispatch system:</p>"}
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
