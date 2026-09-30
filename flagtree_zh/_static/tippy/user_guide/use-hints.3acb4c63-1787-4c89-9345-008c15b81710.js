selector_to_html = {"a[href=\"#\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528 Hints<a class=\"headerlink\" href=\"#hints\" title=\"Link to this heading\">#</a></h1><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree_hints</span></code> \u5141\u8bb8\u7528\u6237\u901a\u8fc7 Triton Kernel \u4ee3\u7801\u4e2d\u7684\u884c\u5c3e\u6ce8\u91ca\u5411\u7f16\u8bd1\u5668\u63d0\u4f9b\u4f18\u5316\u63d0\u793a\u3002</p><p>\u4f60\u53ef\u4ee5\u7b80\u5355\u5730\u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">tl.load</span></code> \u7b49\u64cd\u4f5c\u6240\u5728\u7684\u540c\u4e00\u884c\u6dfb\u52a0\u683c\u5f0f\u4e3a <code class=\"docutils literal notranslate\"><span class=\"pre\">#</span> <span class=\"pre\">@hint:</span> <span class=\"pre\">&lt;hint_name&gt;</span></code> \u7684\u884c\u5c3e\u6ce8\u91ca\u6765\u6dfb\u52a0\u63d0\u793a\u3002</p>", "a[href=\"#nvidia\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">NVIDIA<a class=\"headerlink\" href=\"#nvidia\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u652f\u6301\u7684\u63d0\u793a<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u4e0b\u8868\u5217\u51fa\u4e86\u5728\u4e0d\u540c\u540e\u7aef\u4e0a\u7f16\u8bd1\u65f6\u9002\u7528\u4e8e Triton \u64cd\u4f5c\u7684\u4f18\u5316\u63d0\u793a\u3002</p>", "a[href=\"#id2\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u534e\u4e3a\u6607\u817e<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#aipu\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">AIPU<a class=\"headerlink\" href=\"#aipu\" title=\"Link to this heading\">#</a></h3><p>\u6709\u5173 Hints \u4f7f\u7528\u4fe1\u606f\uff0c\u8bf7\u53c2\u89c1 <a class=\"reference internal\" href=\"#\"><span class=\"std std-doc\">\u4f7f\u7528 Hints</span></a>\u3002</p>", "a[href=\"#hints\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528 Hints<a class=\"headerlink\" href=\"#hints\" title=\"Link to this heading\">#</a></h1><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree_hints</span></code> \u5141\u8bb8\u7528\u6237\u901a\u8fc7 Triton Kernel \u4ee3\u7801\u4e2d\u7684\u884c\u5c3e\u6ce8\u91ca\u5411\u7f16\u8bd1\u5668\u63d0\u4f9b\u4f18\u5316\u63d0\u793a\u3002</p><p>\u4f60\u53ef\u4ee5\u7b80\u5355\u5730\u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">tl.load</span></code> \u7b49\u64cd\u4f5c\u6240\u5728\u7684\u540c\u4e00\u884c\u6dfb\u52a0\u683c\u5f0f\u4e3a <code class=\"docutils literal notranslate\"><span class=\"pre\">#</span> <span class=\"pre\">@hint:</span> <span class=\"pre\">&lt;hint_name&gt;</span></code> \u7684\u884c\u5c3e\u6ce8\u91ca\u6765\u6dfb\u52a0\u63d0\u793a\u3002</p>"}
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
