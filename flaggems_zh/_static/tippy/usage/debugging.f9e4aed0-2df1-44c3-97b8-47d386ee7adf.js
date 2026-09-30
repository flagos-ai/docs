selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u542f\u7528\u8c03\u8bd5\u65e5\u5fd7<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u4e3a\u4e86\u65b9\u4fbf\u7b97\u5b50\u5f00\u53d1\uff08\u5c24\u5176\u662f\u8c03\u8bd5\u548c\u6027\u80fd\u5206\u6790\u4f18\u5316\uff09\uff0c<em>FlagGems</em> \u4e3a <code class=\"docutils literal notranslate\"><span class=\"pre\">enable()</span></code>\n\u548c <code class=\"docutils literal notranslate\"><span class=\"pre\">only_enable()</span></code> API \u63a5\u53e3\u63d0\u4f9b\u4e00\u4e9b\u53ef\u9009\u7684\u53c2\u6570\uff0c\u65b9\u4fbf\u95ee\u9898\u8bca\u65ad\u3002\n\u5177\u4f53\u5982\u4e0b\uff1a</p>"}
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
