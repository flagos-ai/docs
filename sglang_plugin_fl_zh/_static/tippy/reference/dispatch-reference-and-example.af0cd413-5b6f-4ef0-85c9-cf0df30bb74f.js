selector_to_html = {"a[href=\"#id6\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u793a\u4f8b<a class=\"headerlink\" href=\"#id6\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#aten-flaggems\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b2c\u4e00\u5c42 \u2014 ATen \u66ff\u6362\uff08FlagGems\uff09<a class=\"headerlink\" href=\"#aten-flaggems\" title=\"Link to this heading\">#</a></h3><p><code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_WHITELIST</span></code> \u548c <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_BLACKLIST</span></code> \u4e92\u65a5\u3002<code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_WHITELIST</span></code> \u4f18\u5148\u7ea7\u9ad8\u4e8e YAML <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos_blacklist</span></code>\u3002</p>", "a[href=\"#id4\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b2c\u4e09\u5c42 \u2014 \u901a\u4fe1<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h3><p>\u652f\u6301\u7684\u8fd0\u884c\u65f6\u9009\u9879\u53d6\u51b3\u4e8e\u5e73\u53f0\u548c\u5df2\u5b89\u88c5\u5e93\u3002\u5bf9\u4e8e\u76ee\u6807\u8fd0\u884c\u65f6\u672a\u8986\u76d6\u7684\u5e73\u53f0\u7279\u5b9a\u53ef\u63a5\u53d7\u503c\uff0c\u8bf7\u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">[TODO:</span> <span class=\"pre\">needs</span> <span class=\"pre\">confirmation]</span></code>\u3002</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u73af\u5883\u53d8\u91cf\u53c2\u8003\u4e0e\u793a\u4f8b<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u9875\u8bb0\u5f55 sglang-plugin-FL \u7684\u73af\u5883\u53d8\u91cf\u53c2\u8003\u548c\u793a\u4f8b\u3002</p><p>\u6709\u6548\u914d\u7f6e\u4f18\u5148\u7ea7\u5982\u4e0b\uff1a</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u73af\u5883\u53d8\u91cf \u2014 \u5b8c\u6574\u53c2\u8003<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><h3>\u7b2c\u4e8c\u5c42 \u2014 \u878d\u5408\u7b97\u5b50\u8c03\u5ea6<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id5\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u7cfb\u7edf / \u8c03\u8bd5<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id3\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b2c\u4e8c\u5c42 \u2014 \u878d\u5408\u7b97\u5b50\u8c03\u5ea6<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h3>"}
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
