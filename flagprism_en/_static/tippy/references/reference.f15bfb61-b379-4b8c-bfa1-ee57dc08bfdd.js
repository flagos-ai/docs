selector_to_html = {"a[href=\"#reference\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Reference<a class=\"headerlink\" href=\"#reference\" title=\"Link to this heading\">#</a></h1><h2>Project links<a class=\"headerlink\" href=\"#project-links\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#project-links\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Project links<a class=\"headerlink\" href=\"#project-links\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#public-interfaces\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Public interfaces<a class=\"headerlink\" href=\"#public-interfaces\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#backend-support\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Backend support<a class=\"headerlink\" href=\"#backend-support\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#source-layout\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source layout<a class=\"headerlink\" href=\"#source-layout\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#related-components\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Related components<a class=\"headerlink\" href=\"#related-components\" title=\"Link to this heading\">#</a></h2>"}
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
