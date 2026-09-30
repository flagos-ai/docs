selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u8fd0\u884c\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u5148\u5b89\u88c5\u5f00\u53d1\u4f9d\u8d56\uff0c\u7136\u540e\u4ece\u6700\u5c0f\u7684\u6709\u6548\u5206\u5c42\u5f00\u59cb\uff0c\u6309\u5f71\u54cd\u8303\u56f4\u9010\u6b65\u6269\u5c55\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5404\u5206\u5c42\u8bc1\u660e\u4e86\u4ec0\u4e48<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u7a7a\u7684\u6807\u8bb0\u9009\u62e9\u4e0d\u7b97\u9a8c\u8bc1\u3002CPU \u5206\u5e03\u5f0f\u6d4b\u8bd5\u53ea\u8bc1\u660e\u8bed\u4e49\uff0c\u6c38\u8fdc\u4e0d\u4f1a\u88ab\u7528\u4f5c\u53ef\u6269\u5c55\u6027\u7684\u53d1\u5e03\u8bc1\u636e\u3002</p>"}
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
