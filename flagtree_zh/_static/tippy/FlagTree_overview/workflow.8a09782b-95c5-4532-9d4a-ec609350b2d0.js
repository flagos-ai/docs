selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5de5\u4f5c\u6d41\u7a0b<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u4e0b\u56fe\u7b80\u8981\u5c55\u793a\u4e86\u5982\u4f55\u4f7f\u7528 FlagTree \u751f\u6210\u7b97\u5b50\u3002</p><p><a data-lightbox=\"image-set\" href=\"../_images/flagtree-workflow.png\">\n<img alt=\"alt text\" src=\"../_images/flagtree-workflow.png\"/></a>\n</p>"}
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
