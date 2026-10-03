selector_to_html = {"a[href=\"#gpu\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u4e91 GPU \u6a21\u578b\u5217\u8868<a class=\"headerlink\" href=\"#gpu\" title=\"Link to this heading\">#</a></h1><h2>\u817e\u8baf\u4e91 HAI<a class=\"headerlink\" href=\"#hai\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u963f\u91cc\u4e91<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#hai\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u817e\u8baf\u4e91 HAI<a class=\"headerlink\" href=\"#hai\" title=\"Link to this heading\">#</a></h2>"}
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
