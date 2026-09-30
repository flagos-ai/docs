selector_to_html = {"a[href=\"#enable-debug-logging\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Enable Debug Logging<a class=\"headerlink\" href=\"#enable-debug-logging\" title=\"Link to this heading\">#</a></h1><p>To facilitate operator development (especially debugging or profiling),\n<em>FlagGems</em> supports some optional parameters for the <code class=\"docutils literal notranslate\"><span class=\"pre\">enable()</span></code> and\nthe <code class=\"docutils literal notranslate\"><span class=\"pre\">only_enable()</span></code> API interface, as shown below.</p>"}
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
