selector_to_html = {"a[href=\"../getting_started/multi-platform-training.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Multi-Platform Training and Testing<a class=\"headerlink\" href=\"#multi-platform-training-and-testing\" title=\"Link to this heading\">#</a></h1><p>FlagScale has no hardware requirements of its own \u2014 it orchestrates training through the FlagOS plugins. This guide shows how to drive an end-to-end training job on four non-NVIDIA platforms (MetaX, Hygon, Ascend, T-Head PPU) with the plugin stack underneath.</p><p>Platform-specific plugin installation is documented in the plugin guides:</p>", "a[href=\"#flagscale-v2-1-0-release-notes\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagScale v2.1.0 Release Notes<a class=\"headerlink\" href=\"#flagscale-v2-1-0-release-notes\" title=\"Link to this heading\">#</a></h1><h2>Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#multi-platform-validation\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Multi-platform validation<a class=\"headerlink\" href=\"#multi-platform-validation\" title=\"Link to this heading\">#</a></h2><p>Validated end-to-end together with Megatron-LM-FL v0.3.0 and TransformerEngine-FL v0.3.0:</p>", "a[href=\"#highlights\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2>"}
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
