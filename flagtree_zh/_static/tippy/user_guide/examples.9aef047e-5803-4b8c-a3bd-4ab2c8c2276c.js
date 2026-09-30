selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u793a\u4f8b<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u5305\u542b FlagTree \u793a\u4f8b\u3002</p>", "a[href=\"#mla\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7a00\u758f MLA \u524d\u5411\u4f20\u64ad<a class=\"headerlink\" href=\"#mla\" title=\"Link to this heading\">#</a></h2><p>\u672c\u6a21\u5757\u5b9e\u73b0\u4e86\u4e00\u4e2a\u7528\u4e8e\u7a00\u758f MLA\uff08\u591a\u5934\u6ce8\u610f\u529b\uff09\u673a\u5236\u524d\u5411\u4f20\u64ad\u7684 Triton \u5185\u6838\u3002\u5b83\u6f14\u793a\u4e86\u5982\u4f55\u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">tle.load</span></code> \u5b9e\u73b0\u9ad8\u6548\u7684\u5185\u5b58\u8bbf\u95ee\u548c\u8ba1\u7b97\u3002</p>"}
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
