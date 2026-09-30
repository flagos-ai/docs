selector_to_html = {"a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Hints \u7b80\u4ecb<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>Hints \u63d0\u4f9b\u4e86\u4e00\u79cd\u975e\u4fb5\u5165\u5f0f\u7684\u6027\u80fd\u63d0\u793a\u6ce8\u5165\u673a\u5236\uff0c\u80fd\u591f\u5728\u4fdd\u6301\u4e0e\u539f\u751f Triton \u4ee3\u7801\u5b8c\u5168\u517c\u5bb9\u7684\u540c\u65f6\uff0c\u5b9e\u73b0\u786c\u4ef6\u611f\u77e5\u7684\u4f18\u5316\u3002\u5176\u673a\u5236\u5f88\u7b80\u5355\uff1a\u7a0b\u5e8f\u5458\u5728\u76f8\u5e94\u7684 Triton \u64cd\u4f5c\uff08\u4f8b\u5982 <code class=\"docutils literal notranslate\"><span class=\"pre\">tl.load</span></code>\uff09\u65c1\u6dfb\u52a0\u884c\u5185\u6ce8\u91ca\uff08<code class=\"docutils literal notranslate\"><span class=\"pre\">#@hint:</span> <span class=\"pre\">&lt;hint_name&gt;</span></code>\uff09\uff0c\u4ee5\u63d0\u4f9b\u786c\u4ef6\u611f\u77e5\u7684\u4f18\u5316\u63d0\u793a\u3002\u8fd9\u4e9b\u63d0\u793a\u5728\u7f16\u8bd1\u8fc7\u7a0b\u4e2d\u88ab\u7f16\u7801\u4e3a MLIR\uff08\u591a\u5c42\u4e2d\u95f4\u8868\u793a\uff09\u5c5e\u6027\uff0c\u4f7f\u4e2d\u7aef\u548c\u540e\u7aef\u80fd\u591f\u57fa\u4e8e\u5f39\u6027\u9a8c\u8bc1\u7b56\u7565\u5e94\u7528\u786c\u4ef6\u611f\u77e5\u4f18\u5316\u548c\u591a\u5e73\u53f0\u52a8\u6001\u9002\u914d\u3002</p><p>\u8be5\u673a\u5236\u5177\u6709\u4ee5\u4e0b\u7279\u70b9\uff1a</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Hints \u5728\u7f16\u8bd1\u8fc7\u7a0b\u4e2d\u7684\u5904\u7406<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>Hints \u901a\u8fc7\u4e3a TTIR \u64cd\u4f5c\u6269\u5c55\u5c5e\u6027\u6765\u5b9e\u73b0\u786c\u4ef6\u611f\u77e5\u4f18\u5316\u3002\u5176\u5b9e\u73b0\u6d89\u53ca AST \u5904\u7406\u3001TTIR \u5c5e\u6027\u7f16\u7801\u548c\u540e\u7aef Pass \u5206\u53d1\u3002</p>", "a[href=\"../../user_guide/use-hints.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528 Hints<a class=\"headerlink\" href=\"#hints\" title=\"Link to this heading\">#</a></h1><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree_hints</span></code> \u5141\u8bb8\u7528\u6237\u901a\u8fc7 Triton Kernel \u4ee3\u7801\u4e2d\u7684\u884c\u5c3e\u6ce8\u91ca\u5411\u7f16\u8bd1\u5668\u63d0\u4f9b\u4f18\u5316\u63d0\u793a\u3002</p><p>\u4f60\u53ef\u4ee5\u7b80\u5355\u5730\u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">tl.load</span></code> \u7b49\u64cd\u4f5c\u6240\u5728\u7684\u540c\u4e00\u884c\u6dfb\u52a0\u683c\u5f0f\u4e3a <code class=\"docutils literal notranslate\"><span class=\"pre\">#</span> <span class=\"pre\">@hint:</span> <span class=\"pre\">&lt;hint_name&gt;</span></code> \u7684\u884c\u5c3e\u6ce8\u91ca\u6765\u6dfb\u52a0\u63d0\u793a\u3002</p>", "a[href=\"#hints\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Hints<a class=\"headerlink\" href=\"#hints\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd Hints \u4ee5\u53ca Hints \u5728\u7f16\u8bd1\u8fc7\u7a0b\u4e2d\u7684\u5904\u7406\u65b9\u5f0f\u3002</p>"}
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
