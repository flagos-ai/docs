selector_to_html = {"a[href=\"#ci-cd\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">CI/CD<a class=\"headerlink\" href=\"#ci-cd\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#plugin-system\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Plugin System<a class=\"headerlink\" href=\"#plugin-system\" title=\"Link to this heading\">#</a></h2><p>Megatron-LM-FL introduces a plugin-based architecture that enables platform-specific implementations without modifying upstream code:</p>", "a[href=\"#features\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h1><h2>Plugin System<a class=\"headerlink\" href=\"#plugin-system\" title=\"Link to this heading\">#</a></h2><p>Megatron-LM-FL introduces a plugin-based architecture that enables platform-specific implementations without modifying upstream code:</p>", "a[href=\"#multi-platform-support\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Multi-Platform Support<a class=\"headerlink\" href=\"#multi-platform-support\" title=\"Link to this heading\">#</a></h2><p>Hardware abstraction via <code class=\"docutils literal notranslate\"><span class=\"pre\">PlatformBase</span></code> with implementations for multiple platforms:</p>", "a[href=\"#upstream-compatibility\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Upstream Compatibility<a class=\"headerlink\" href=\"#upstream-compatibility\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#deepseek-v4-support\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">DeepSeek V4 Support<a class=\"headerlink\" href=\"#deepseek-v4-support\" title=\"Link to this heading\">#</a></h2><p>Full training support for DeepSeek V4 architecture (CSA/HCA, Hash Router, mHC, Engram, MTP).</p>"}
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
