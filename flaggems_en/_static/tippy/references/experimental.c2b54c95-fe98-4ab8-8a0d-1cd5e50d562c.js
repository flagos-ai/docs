selector_to_html = {"a[href=\"#operators-by-performance\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Operators by Performance<a class=\"headerlink\" href=\"#operators-by-performance\" title=\"Link to this heading\">#</a></h2><p><strong>Legend</strong>:</p>", "a[href=\"#notes\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Notes<a class=\"headerlink\" href=\"#notes\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flaggems-experimental-operators\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagGems Experimental Operators<a class=\"headerlink\" href=\"#flaggems-experimental-operators\" title=\"Link to this heading\">#</a></h1><p>This document lists all experimental operators in FlagGems that have achieved an average speedup of 0.8x or higher compared to PyTorch implementations.</p>", "a[href=\"#categories\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Categories<a class=\"headerlink\" href=\"#categories\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#performance-overview\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Performance Overview<a class=\"headerlink\" href=\"#performance-overview\" title=\"Link to this heading\">#</a></h2>"}
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
