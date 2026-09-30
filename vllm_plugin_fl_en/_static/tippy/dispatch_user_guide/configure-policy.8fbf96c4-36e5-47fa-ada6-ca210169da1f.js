selector_to_html = {"a[href=\"#policy-context-management\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Policy context management<a class=\"headerlink\" href=\"#policy-context-management\" title=\"Link to this heading\">#</a></h1><p>Supports temporary policy override in code:</p>"}
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
