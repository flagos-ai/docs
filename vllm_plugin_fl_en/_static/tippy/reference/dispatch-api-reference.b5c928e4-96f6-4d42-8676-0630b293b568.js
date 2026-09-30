selector_to_html = {"a[href=\"#plugin-discovery\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Plugin Discovery<a class=\"headerlink\" href=\"#plugin-discovery\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#logging\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Logging<a class=\"headerlink\" href=\"#logging\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#policy-management\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Policy Management<a class=\"headerlink\" href=\"#policy-management\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#convenience-functions\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Convenience Functions<a class=\"headerlink\" href=\"#convenience-functions\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#manager\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Manager<a class=\"headerlink\" href=\"#manager\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#dispatch-api-reference\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Dispatch API Reference<a class=\"headerlink\" href=\"#dispatch-api-reference\" title=\"Link to this heading\">#</a></h1><h2>Convenience Functions<a class=\"headerlink\" href=\"#convenience-functions\" title=\"Link to this heading\">#</a></h2>"}
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
