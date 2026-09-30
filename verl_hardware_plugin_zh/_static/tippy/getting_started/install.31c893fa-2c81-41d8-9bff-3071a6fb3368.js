selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>verl-hardware-plugin \u4ee5 Python \u5305\u5f62\u5f0f\u5b89\u88c5\uff0cverl \u901a\u8fc7 <code class=\"docutils literal notranslate\"><span class=\"pre\">verl.plugins</span></code> entry-points \u7ec4\u81ea\u52a8\u53d1\u73b0\u3002</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4ece\u6e90\u7801\u5b89\u88c5<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u5b89\u88c5\u540e\u65e0\u9700\u5728 verl \u4e2d\u505a\u4efb\u4f55\u989d\u5916\u914d\u7f6e\u3002verl \u542f\u52a8\u65f6\u4f1a\u5bfc\u5165\u6ce8\u518c\u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">verl.plugins</span></code> \u7ec4\u4e0b\u7684\u6240\u6709\u5305\uff0c\u4ece\u800c\u89e6\u53d1\u6240\u6709\u5e73\u53f0\u4e0e\u5f15\u64ce\u7684\u6ce8\u518c\u3002</p><p>\u9a8c\u8bc1\u6ce8\u518c\uff1a</p>", "a[href=\"#id6\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u51c6\u5907\u6570\u636e\u4e0e\u6a21\u578b<a class=\"headerlink\" href=\"#id6\" title=\"Link to this heading\">#</a></h2><p>\u5404\u5e73\u53f0\u6307\u5357\u4ee5 Qwen3-0.6B \u4e0e GSM8K \u4f5c\u4e3a\u7aef\u5230\u7aef\u53c2\u8003\u793a\u4f8b\uff1a</p>", "a[href=\"../references/reference.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u53c2\u8003<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u9879\u76ee\u94fe\u63a5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u524d\u7f6e\u6761\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5e73\u53f0\u9009\u62e9<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u5e73\u53f0\u5728\u542f\u52a8\u65f6\u81ea\u52a8\u68c0\u6d4b\u3002\u53ef\u901a\u8fc7 <code class=\"docutils literal notranslate\"><span class=\"pre\">VERL_PLATFORM</span></code> \u73af\u5883\u53d8\u91cf\u8986\u76d6\uff1a</p>", "a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5404\u5e73\u53f0\u7279\u5b9a\u8bbe\u7f6e<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2><p>\u6bcf\u4e2a\u786c\u4ef6\u5e73\u53f0\u90fd\u6709\u5404\u81ea\u7684\u57fa\u7840\u955c\u50cf\u3001\u9a71\u52a8\u6302\u8f7d\u4e0e\u73af\u5883\u8981\u6c42\u3002\u5c3d\u53ef\u80fd\u4f7f\u7528\u5382\u5546\u63d0\u4f9b\u7684\u5bb9\u5668\u955c\u50cf\u3002</p>", "a[href=\"../user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u5982\u4f55\u4f7f\u7528 verl-hardware-plugin \u5728\u5404\u786c\u4ef6\u5e73\u53f0\u4e0a\u8fd0\u884c verl RL \u540e\u8bad\u7ec3\u4efb\u52a1\u3002</p>"}
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
