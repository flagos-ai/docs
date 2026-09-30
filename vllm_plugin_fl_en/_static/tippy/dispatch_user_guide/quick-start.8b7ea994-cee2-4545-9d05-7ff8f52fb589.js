selector_to_html = {"a[href=\"#basic-usage\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Basic usage<a class=\"headerlink\" href=\"#basic-usage\" title=\"Link to this heading\">#</a></h2>", "a[href=\"../reference/dispatch-api-reference.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Dispatch API Reference<a class=\"headerlink\" href=\"#dispatch-api-reference\" title=\"Link to this heading\">#</a></h1><h2>Convenience Functions<a class=\"headerlink\" href=\"#convenience-functions\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#quick-start\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Quick start<a class=\"headerlink\" href=\"#quick-start\" title=\"Link to this heading\">#</a></h1><h2>Basic usage<a class=\"headerlink\" href=\"#basic-usage\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#use-the-manager\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Use the Manager<a class=\"headerlink\" href=\"#use-the-manager\" title=\"Link to this heading\">#</a></h2><p>For API explanations, see <a class=\"reference internal\" href=\"../reference/dispatch-api-reference.html\"><span class=\"std std-doc\">Dispatch API Reference</span></a>.</p>"}
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
