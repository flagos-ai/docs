selector_to_html = {"a[href=\"features.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagTree \u5305\u542b\u4ee5\u4e0b\u4e3b\u8981\u7279\u6027\uff1a</p>", "a[href=\"#flagtree\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree \u53ef\u6269\u5c55\u6846\u67b6<a class=\"headerlink\" href=\"#flagtree\" title=\"Link to this heading\">#</a></h1><p>FlagTree \u53ef\u6269\u5c55\u6846\u67b6\u4e13\u95e8\u8bbe\u8ba1\u7528\u4e8e\u652f\u6301\u591a\u540e\u7aef\u7f16\u8bd1\u548c\u4e09\u7ea7\u7f16\u8bd1\u5668\u8bed\u8a00\uff0c\u5982<a class=\"reference internal\" href=\"features.html\"><span class=\"std std-doc\">\u7279\u6027</span></a>\u90e8\u5206\u6240\u8ff0\u3002</p>"}
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
