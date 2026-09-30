selector_to_html = {"a[href=\"#flagos\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u76f8\u5173 FlagOS \u7ec4\u4ef6<a class=\"headerlink\" href=\"#flagos\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u53c2\u8003<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u9879\u76ee\u94fe\u63a5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8bb8\u53ef\u8bc1<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>Apache License 2.0\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u9879\u76ee\u94fe\u63a5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#verl\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4e0a\u6e38 verl \u6587\u6863<a class=\"headerlink\" href=\"#verl\" title=\"Link to this heading\">#</a></h2><p>\u975e\u786c\u4ef6\u63d2\u4ef6\u7279\u6709\u7684 verl \u7279\u6027\u4e0e\u547d\u4ee4\uff0c\u8bf7\u53c2\u8003 <a class=\"reference external\" href=\"https://verl.readthedocs.io/en/latest/index.html\">verl \u6587\u6863</a>\u3002</p>"}
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
