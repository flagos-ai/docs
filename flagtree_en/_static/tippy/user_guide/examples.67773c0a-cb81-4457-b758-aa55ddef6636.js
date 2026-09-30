selector_to_html = {"a[href=\"#sparse-mla-forward\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Sparse MLA Forward<a class=\"headerlink\" href=\"#sparse-mla-forward\" title=\"Link to this heading\">#</a></h2><p>This module implements a Triton kernel for the forward pass of a sparse MLA (Multi-Headed Attention) mechanism.\nIt demonstrates the use of <code class=\"docutils literal notranslate\"><span class=\"pre\">tle.load</span></code> for efficient memory access and computation.</p>", "a[href=\"#examples\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Examples<a class=\"headerlink\" href=\"#examples\" title=\"Link to this heading\">#</a></h1><p>This section includes FlagTree examples.</p>"}
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
