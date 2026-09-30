selector_to_html = {"a[href=\"#performance-benchmarking-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Performance Benchmarking Overview<a class=\"headerlink\" href=\"#performance-benchmarking-overview\" title=\"Link to this heading\">#</a></h1><p><em>FlagGems</em> operators in general provides better or at least comparable performance\nwhen compared to operators from the native PyTorch library.\nWe use the <code class=\"docutils literal notranslate\"><span class=\"pre\">triton.testing.do_bench</span></code> from the Triton project for benchmarking.\nThe kernel data obtained are shown in the following graph.</p><p><a data-lightbox=\"image-set\" href=\"../_images/speedup-20251225.png\">\n<img alt=\"Operator Speedup\" src=\"../_images/speedup-20251225.png\"/></a>\n</p>", "a[href=\"benchmark.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Performance Benchmarking in FlagGems<a class=\"headerlink\" href=\"#performance-benchmarking-in-flaggems\" title=\"Link to this heading\">#</a></h1><p>It is recommended to follow the steps below to add test cases for a new operator.\nThese steps apply to Python-based operators as well as C+\u00b1wrapped operators.</p>"}
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
