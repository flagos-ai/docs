selector_to_html = {"a[href=\"#platforms-supported\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Platforms Supported<a class=\"headerlink\" href=\"#platforms-supported\" title=\"Link to this heading\">#</a></h1><p><em>FlagGems</em> supports 10+ backends. The currently supported platforms and\ntheir capabilities are listed blow:</p>"}
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
