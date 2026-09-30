selector_to_html = {"a[href=\"#highlights\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flagscale-v1-0-0-release-notes\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagScale v1.0.0 Release Notes<a class=\"headerlink\" href=\"#flagscale-v1-0-0-release-notes\" title=\"Link to this heading\">#</a></h1><h2>Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2>"}
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
