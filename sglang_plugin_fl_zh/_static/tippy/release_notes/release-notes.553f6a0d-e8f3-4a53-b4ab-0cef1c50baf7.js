selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u53d1\u5e03\u8bf4\u660e<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>v0.2.0<a class=\"headerlink\" href=\"#v0-2-0\" title=\"Link to this heading\">#</a></h2><p>\u672c\u6b21\u53d1\u5e03\u6269\u5c55\u4e86 sglang-plugin-FL \u7684\u8c03\u5ea6\u3001\u5e73\u53f0\u914d\u7f6e\u548c\u8fd0\u884c\u65f6\u914d\u7f6e\u80fd\u529b\uff0c\u5b8c\u6210\u4e86\u4ece <code class=\"docutils literal notranslate\"><span class=\"pre\">v0.1.0</span></code> \u5230 <code class=\"docutils literal notranslate\"><span class=\"pre\">v0.2.0</span></code> \u7684\u6f14\u8fdb\u3002</p>", "a[href=\"#v0-1-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.1.0<a class=\"headerlink\" href=\"#v0-1-0\" title=\"Link to this heading\">#</a></h2><p>sglang-plugin-FL \u521d\u59cb\u7248\u672c\u3002</p>", "a[href=\"#v0-2-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.2.0<a class=\"headerlink\" href=\"#v0-2-0\" title=\"Link to this heading\">#</a></h2><p>\u672c\u6b21\u53d1\u5e03\u6269\u5c55\u4e86 sglang-plugin-FL \u7684\u8c03\u5ea6\u3001\u5e73\u53f0\u914d\u7f6e\u548c\u8fd0\u884c\u65f6\u914d\u7f6e\u80fd\u529b\uff0c\u5b8c\u6210\u4e86\u4ece <code class=\"docutils literal notranslate\"><span class=\"pre\">v0.1.0</span></code> \u5230 <code class=\"docutils literal notranslate\"><span class=\"pre\">v0.2.0</span></code> \u7684\u6f14\u8fdb\u3002</p>"}
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
