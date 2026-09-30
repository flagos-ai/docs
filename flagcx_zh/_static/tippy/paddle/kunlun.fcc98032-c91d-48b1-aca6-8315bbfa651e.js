selector_to_html = {"a[href=\"#paddle-flagcx\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528 Paddle + FlagCX \u8bad\u7ec3\u6a21\u578b<a class=\"headerlink\" href=\"#paddle-flagcx\" title=\"Link to this heading\">#</a></h2><p>\u6211\u4eec\u652f\u6301\u5728\u6606\u4ed1\u82af XPU \u673a\u5668\u4e0a\u4f7f\u7528 Paddle + FlagCX \u8bad\u7ec3 GPT3\u3002\u8bf7\u53c2\u8003\u4ee5\u4e0b\u6b65\u9aa4\u5f00\u59cb</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u73af\u5883\u914d\u7f6e<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flagcx-paddle\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528 FlagCX \u7f16\u8bd1 Paddle<a class=\"headerlink\" href=\"#flagcx-paddle\" title=\"Link to this heading\">#</a></h2><p>\u8bf7\u6309\u7167\u4ee5\u4e0b\u547d\u4ee4\u64cd\u4f5c</p>", "a[href=\"#xpu-paddle-flagcx\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5728\u6606\u4ed1\u82af XPU \u673a\u5668\u4e0a\u4f7f\u7528 Paddle \u548c FlagCX \u6307\u5357<a class=\"headerlink\" href=\"#xpu-paddle-flagcx\" title=\"Link to this heading\">#</a></h1><h2>\u73af\u5883\u914d\u7f6e<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>"}
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
