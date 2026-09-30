selector_to_html = {"a[href=\"#system-debug\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">System / Debug<a class=\"headerlink\" href=\"#system-debug\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#dispatch-through-environment-variables\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Dispatch through environment variables<a class=\"headerlink\" href=\"#dispatch-through-environment-variables\" title=\"Link to this heading\">#</a></h1><p>All plugin behavior is controlled by environment variables with the <code class=\"docutils literal notranslate\"><span class=\"pre\">SGLANG_FL_*</span></code> prefix.</p><p>The effective configuration precedence is:</p>", "a[href=\"#layer-1-aten-replacement-flaggems\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Layer 1 \u2014 ATen Replacement (FlagGems)<a class=\"headerlink\" href=\"#layer-1-aten-replacement-flaggems\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#layer-3-distributed-communication\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Layer 3 \u2014 Distributed Communication<a class=\"headerlink\" href=\"#layer-3-distributed-communication\" title=\"Link to this heading\">#</a></h2><p>Supported runtime choices depend on the platform and installed libraries. Use <code class=\"docutils literal notranslate\"><span class=\"pre\">[TODO:</span> <span class=\"pre\">needs</span> <span class=\"pre\">confirmation]</span></code> for platform-specific accepted values not covered by the target runtime.</p>", "a[href=\"#layer-2-fused-op-dispatch\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Layer 2 \u2014 Fused Op Dispatch<a class=\"headerlink\" href=\"#layer-2-fused-op-dispatch\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#examples\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Examples<a class=\"headerlink\" href=\"#examples\" title=\"Link to this heading\">#</a></h2>"}
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
