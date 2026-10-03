selector_to_html = {"a[href=\"#flagtree-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree Documentation<a class=\"headerlink\" href=\"#flagtree-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started<a class=\"headerlink\" href=\"#getting-started\" title=\"Link to this heading\">#</a></h1><p>This section covers the requirements for installing and running FlagTree and guides you through installing FlagTree.</p>", "a[href=\"FlagTree_overview/FlagTree-overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree Overview<a class=\"headerlink\" href=\"#flagtree-overview\" title=\"Link to this heading\">#</a></h1><p>FlagTree is an open-source, unified compiler for multiple AI chips. FlagTree is dedicated to building a compiler and associated tooling platform for diverse AI chips, advancing and expanding the upstream and downstream Triton ecosystem, with the goals of supporting existing adaptation solutions, unifying code repositories, and enabling rapid multi-backend support from a single repository. For upstream model users, FlagTree provides unified compilation support across multiple backends; for downstream chip vendors, FlagTree offers reference implementations for integration into the Triton ecosystem.</p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">User Guide<a class=\"headerlink\" href=\"#user-guide\" title=\"Link to this heading\">#</a></h1><p>This section introduces how to use Hints, TLE-Lite, TLE-Struct, and TLE-Raw compiler languages to optimize the compilation. Regarding how to choose between Hints, TLE-Lite, TLE-Struct, and TLE-Raw, you are recommended to read the <a class=\"reference internal\" href=\"FlagTree_overview/FlagTree-overview.html\"><span class=\"std std-doc\">FlagTree Overview</span></a> first.</p>"}
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
