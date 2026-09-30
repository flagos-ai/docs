selector_to_html = {"a[href=\"#using-experimental-operators\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Using Experimental Operators<a class=\"headerlink\" href=\"#using-experimental-operators\" title=\"Link to this heading\">#</a></h1><p>The <code class=\"docutils literal notranslate\"><span class=\"pre\">experimental_ops</span></code> module provides a space for new operators\nthat are not yet ready for production release.\nOperators in this package are accessible via <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems.experimental_ops.*</span></code>.\nThese operators follow the same development patterns as the core, stable operators.</p>"}
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
