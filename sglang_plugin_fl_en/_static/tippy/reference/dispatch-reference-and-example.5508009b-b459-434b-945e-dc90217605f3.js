selector_to_html = {"a[href=\"#system-debug\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">System / Debug<a class=\"headerlink\" href=\"#system-debug\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#environment-variable-references-and-examples\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Environment variable references and examples<a class=\"headerlink\" href=\"#environment-variable-references-and-examples\" title=\"Link to this heading\">#</a></h1><p>This page documents the references and examples of environment variables for sglang-plugin-FL.</p><p>The effective configuration precedence is:</p>", "a[href=\"#layer-3-communication\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Layer 3 \u2014 Communication<a class=\"headerlink\" href=\"#layer-3-communication\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#layer-1-aten-replacement-flaggems\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Layer 1 \u2014 ATen Replacement (FlagGems)<a class=\"headerlink\" href=\"#layer-1-aten-replacement-flaggems\" title=\"Link to this heading\">#</a></h3><p><code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_WHITELIST</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_BLACKLIST</span></code> are mutually exclusive. <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_WHITELIST</span></code> takes priority over YAML <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos_blacklist</span></code>.</p>", "a[href=\"#environment-variables-complete-reference\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Environment Variables \u2014 Complete Reference<a class=\"headerlink\" href=\"#environment-variables-complete-reference\" title=\"Link to this heading\">#</a></h2><h3>Layer 2 \u2014 Fused Op Dispatch<a class=\"headerlink\" href=\"#layer-2-fused-op-dispatch\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#layer-2-fused-op-dispatch\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Layer 2 \u2014 Fused Op Dispatch<a class=\"headerlink\" href=\"#layer-2-fused-op-dispatch\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#examples\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Examples<a class=\"headerlink\" href=\"#examples\" title=\"Link to this heading\">#</a></h2>"}
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
