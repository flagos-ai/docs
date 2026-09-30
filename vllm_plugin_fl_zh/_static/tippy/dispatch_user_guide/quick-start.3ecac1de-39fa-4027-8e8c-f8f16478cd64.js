selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u57fa\u672c\u7528\u6cd5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u57fa\u672c\u7528\u6cd5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528\u7ba1\u7406\u5668<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>API \u8bf4\u660e\u8bf7\u53c2\u89c1 <a class=\"reference internal\" href=\"../reference/dispatch-api-reference.html\"><span class=\"std std-doc\">\u8c03\u5ea6 API \u53c2\u8003</span></a>\u3002</p>", "a[href=\"../reference/dispatch-api-reference.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u8c03\u5ea6 API \u53c2\u8003<a class=\"headerlink\" href=\"#api\" title=\"Link to this heading\">#</a></h1><h2>\u4fbf\u6377\u51fd\u6570<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>"}
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
