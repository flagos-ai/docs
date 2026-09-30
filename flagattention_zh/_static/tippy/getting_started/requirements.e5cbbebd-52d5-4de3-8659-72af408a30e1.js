selector_to_html = {"a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8f6f\u4ef6<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>PyTorch \u4e0e\u52a0\u901f\u5668\u8fd0\u884c\u65f6\u672a\u4f5c\u4e3a\u786c\u4f9d\u8d56\u58f0\u660e\uff0c\u56e0\u4e3a\u6b63\u786e\u7684\u8f6f\u4ef6\u5305\u53d6\u51b3\u4e8e\u8bbe\u5907\u548c\u9a71\u52a8\u6808\u3002\u8bf7\u5148\u5b89\u88c5\u5b83\u4eec\uff0c\u518d\u5b89\u88c5 FlagAttention\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u73af\u5883\u8981\u6c42<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>"}
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
