selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b56\u7565\u4e0a\u4e0b\u6587\u7ba1\u7406<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u652f\u6301\u5728\u4ee3\u7801\u4e2d\u4e34\u65f6\u8986\u76d6\u7b56\u7565\uff1a</p>"}
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
