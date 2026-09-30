selector_to_html = {"a[href=\"features.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h1><p>FlagTree includes the following main features:</p>", "a[href=\"#flagtree-extensible-framework\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree extensible framework<a class=\"headerlink\" href=\"#flagtree-extensible-framework\" title=\"Link to this heading\">#</a></h1><p>FlagTree extensible framework is specifically designed to support multi-backend compilation and three-level compiler languages, as mentioned in the <a class=\"reference internal\" href=\"features.html\"><span class=\"std std-doc\">Features</span></a> section.</p>"}
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
