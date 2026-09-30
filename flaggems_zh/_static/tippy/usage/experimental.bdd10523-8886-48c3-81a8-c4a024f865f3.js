selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528\u5b9e\u9a8c\u6027\u8d28\u7684\u7b97\u5b50<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p><em>FlagGems</em> \u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">experimental_ops</span></code> \u6a21\u5757\u63d0\u4f9b\u4e86\u4e00\u4e2a\u540d\u5b57\u7a7a\u95f4\uff0c\n\u7528\u6765\u5b58\u653e\u5c1a\u672a\u4e3a\u751f\u4ea7\u73af\u5883\u4f7f\u7528\u51c6\u5907\u5c31\u7eea\u7684\u7b97\u5b50\u3002\n\u5728\u8fd9\u4e2a\u5305\u4e2d\u7684\u7b97\u5b50\u53ef\u4ee5\u901a\u8fc7 <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems.experimental_ops.*</span></code> \u7684\u5f62\u5f0f\u6765\u8bbf\u95ee\u3002\n\u5b9e\u9a8c\u6027\u8d28\u7b97\u5b50\u7684\u5f00\u53d1\u4e0e\u4e0e\u6838\u5fc3\u7684\u7a33\u5b9a\u7b97\u5b50\u76f8\u540c\u7684\u5f00\u53d1\u6a21\u5f0f\u3002</p>"}
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
