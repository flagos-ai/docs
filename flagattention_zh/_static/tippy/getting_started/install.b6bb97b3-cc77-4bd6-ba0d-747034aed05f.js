selector_to_html = {"a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u9a8c\u8bc1\u5b89\u88c5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u8bbe\u5907\u63a2\u6d4b\u4f7f\u7528\u5f53\u524d\u53ef\u7528\u7684 PyTorch \u8bbe\u5907\u548c Triton target\uff0c\u4e5f\u53ef\u4ee5\u5728\u5bfc\u5165\u5305\u4e4b\u524d\u901a\u8fc7\u73af\u5883\u53d8\u91cf\u8986\u76d6\uff1a</p>", "a[href=\"#wheel\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6784\u5efa wheel<a class=\"headerlink\" href=\"#wheel\" title=\"Link to this heading\">#</a></h2><p>\u6253\u5305\u4f7f\u7528 PEP 517 \u4e0e setuptools-scm\uff0c\u4e0d\u63d0\u4f9b <code class=\"docutils literal notranslate\"><span class=\"pre\">setup.py</span></code>\uff1a</p>", "a[href=\"#flagattention\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5 FlagAttention<a class=\"headerlink\" href=\"#flagattention\" title=\"Link to this heading\">#</a></h1><h2>\u514b\u9686\u5e76\u5b89\u88c5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u514b\u9686\u4ed3\u5e93\u5e76\u4f7f\u7528 Triton \u5f00\u53d1\u4f9d\u8d56\u5b89\u88c5 FlagAttention\uff1a</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u514b\u9686\u5e76\u5b89\u88c5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u514b\u9686\u4ed3\u5e93\u5e76\u4f7f\u7528 Triton \u5f00\u53d1\u4f9d\u8d56\u5b89\u88c5 FlagAttention\uff1a</p>"}
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
