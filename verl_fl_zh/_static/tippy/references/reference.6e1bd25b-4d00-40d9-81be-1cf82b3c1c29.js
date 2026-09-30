selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u53c2\u8003\u8d44\u6599<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u60a8\u53ef\u4ee5\u5728 verl-FL \u652f\u6301\u7684\u82af\u7247\u4e0a\u4f7f\u7528 verl \u7684\u7279\u6027\u548c\u547d\u4ee4\u3002\u8be6\u60c5\u8bf7\u53c2\u8003 <a class=\"reference external\" href=\"https://verl.readthedocs.io/en/latest/index.html\">verl \u6587\u6863</a>\u3002</p>"}
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
