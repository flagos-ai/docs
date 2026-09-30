selector_to_html = {"a[href=\"#obtain-source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Obtain Source Code<a class=\"headerlink\" href=\"#obtain-source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#installation\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Installation<a class=\"headerlink\" href=\"#installation\" title=\"Link to this heading\">#</a></h2><p><strong>Option A \u2014 Pythonic Installation (pip install):</strong></p>", "a[href=\"#build-and-installation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Build and Installation<a class=\"headerlink\" href=\"#build-and-installation\" title=\"Link to this heading\">#</a></h1><h2>Obtain Source Code<a class=\"headerlink\" href=\"#obtain-source-code\" title=\"Link to this heading\">#</a></h2>"}
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
