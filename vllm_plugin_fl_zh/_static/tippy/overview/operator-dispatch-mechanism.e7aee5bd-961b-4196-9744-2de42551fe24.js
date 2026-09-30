selector_to_html = {"a[href=\"#backendimplkind\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">1. \u540e\u7aef\u5b9e\u73b0\u7c7b\u578b\uff08BackendImplKind\uff09<a class=\"headerlink\" href=\"#backendimplkind\" title=\"Link to this heading\">#</a></h3><p><code class=\"docutils literal notranslate\"><span class=\"pre\">types.py</span></code> \u5305\u542b\u4ee5\u4e0b\u540e\u7aef\u5b9e\u73b0\u7c7b\u578b\uff1a</p>", "a[href=\"#id8\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u63d2\u4ef6\u96c6\u6210\u70b9<a class=\"headerlink\" href=\"#id8\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#opimpl\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">2. \u7b97\u5b50\u5b9e\u73b0\uff08OpImpl\uff09<a class=\"headerlink\" href=\"#opimpl\" title=\"Link to this heading\">#</a></h3><p><code class=\"docutils literal notranslate\"><span class=\"pre\">types.py</span></code> \u5305\u542b\u7b97\u5b50\u5b9e\u73b0\uff0c\u6bcf\u4e2a\u7b97\u5b50\u5b9e\u73b0\u5305\u542b\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u5b50\u8c03\u5ea6\u673a\u5236<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u76ee\u5f55\u5b9e\u73b0\u4e86 vllm-plugin-FL \u7684\u7b97\u5b50\u8c03\u5ea6\u673a\u5236\uff0c\u63d0\u4f9b\u4e86\u4e00\u4e2a\u7075\u6d3b\u7684\u7b97\u5b50\u8c03\u5ea6\u7cfb\u7edf\uff0c\u6839\u636e\u53ef\u7528\u6027\u548c\u7b56\u7565\u914d\u7f6e\u5728\u4e0d\u540c\u7684\u540e\u7aef\u5b9e\u73b0\uff08FlagGems\u3001PyTorch\u3001\u5382\u5546\u7279\u5b9a\uff09\u4e4b\u95f4\u8fdb\u884c\u9009\u62e9\u3002</p>", "a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u67b6\u6784\u6982\u89c8<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2><h3>\u8c03\u5ea6\u6d41\u7a0b\u56fe<a class=\"headerlink\" href=\"#id6\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6838\u5fc3\u6982\u5ff5<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><h3>1. \u540e\u7aef\u5b9e\u73b0\u7c7b\u578b\uff08BackendImplKind\uff09<a class=\"headerlink\" href=\"#backendimplkind\" title=\"Link to this heading\">#</a></h3><p><code class=\"docutils literal notranslate\"><span class=\"pre\">types.py</span></code> \u5305\u542b\u4ee5\u4e0b\u540e\u7aef\u5b9e\u73b0\u7c7b\u578b\uff1a</p>", "a[href=\"#id7\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f18\u5148\u7ea7\u9009\u62e9\u6d41\u7a0b<a class=\"headerlink\" href=\"#id7\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u76ee\u5f55\u7ed3\u6784<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id4\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">3. \u9009\u62e9\u7b56\u7565<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h3><p><code class=\"docutils literal notranslate\"><span class=\"pre\">policy.py</span></code> \u5305\u542b\u9009\u62e9\u7b56\u7565\u3002</p><p>\u7b56\u7565\u63a7\u5236\u7b97\u5b50\u5b9e\u73b0\u7684\u9009\u62e9\uff1a</p>", "a[href=\"#id6\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u8c03\u5ea6\u6d41\u7a0b\u56fe<a class=\"headerlink\" href=\"#id6\" title=\"Link to this heading\">#</a></h3>"}
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
