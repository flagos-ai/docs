selector_to_html = {"a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5df2\u77e5\u7f3a\u53e3<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#profiler\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Profiler \u96c6\u6210<a class=\"headerlink\" href=\"#profiler\" title=\"Link to this heading\">#</a></h1><p><code class=\"docutils literal notranslate\"><span class=\"pre\">torch.profiler</span></code> \u901a\u8fc7\u7f16\u8bd1\u8fdb wheel \u7684\u8bbe\u5907\u8ffd\u8e2a\u5668\u652f\u6301 <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> \u8bbe\u5907\u3002<code class=\"docutils literal notranslate\"><span class=\"pre\">torch.profiler.profile(activities=[CPU,</span> <span class=\"pre\">PrivateUse1])</span></code> \u4ea7\u51fa\u7684 trace \u4e0e\u540c\u4e00\u5de5\u4f5c\u8d1f\u8f7d\u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.cuda</span></code> \u4e0a\u7684 trace \u7ed3\u6784\u7b49\u4ef7\uff1a</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4e09\u5c42\u67b6\u6784<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u65b0\u589e\u4e00\u4e2a\u5382\u5546\u610f\u5473\u7740\u53ea\u5199\u4e00\u4e2a\u6587\u4ef6\uff1a\u6ee1\u8db3\u4e0e\u5382\u5546\u65e0\u5173\u63a5\u53e3\u7684\u8ffd\u8e2a\u5668\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8c03\u8bd5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u6709\u4e24\u7c7b\u544a\u8b66\u523b\u610f\u4e0d\u53d7 <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_TRACE</span></code> \u63a7\u5236 \u2014\u2014 \u7a7a\u7684 linked-activity \u56de\u8c03\u4e0e\u6d3b\u52a8\u8bb0\u5f55\u5e03\u5c40\u4e0d\u5339\u914d \u2014\u2014 \u56e0\u4e3a\u5b83\u4eec\u90fd\u4f1a\u9759\u9ed8\u5730\u628a\u8bbe\u5907\u65f6\u95f4\u5f52\u96f6\u3002</p>", "a[href=\"#correlation-id\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Correlation id<a class=\"headerlink\" href=\"#correlation-id\" title=\"Link to this heading\">#</a></h2><p>\u4e00\u6761 trace \u4e2d\u5b58\u5728\u4e24\u5957\u5f7c\u6b64\u72ec\u7acb\u7684\u7f16\u53f7\u4f53\u7cfb\uff0c\u90fd\u53eb \u201ccorrelation\u201d\uff0c\u5916\u89c2\u76f8\u4f3c\u4f46\u542b\u4e49\u4e0d\u540c\uff1a</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5bf9\u7b49\u6027\u6d4b\u8bd5\u4e0e\u57fa\u7ebf<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">tests/integration/test_profiler_parity.py</span></code> \u5c06 <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> trace \u4e0e\u5728\u539f\u751f <code class=\"docutils literal notranslate\"><span class=\"pre\">torch+cuda</span></code> \u4e0a\u91c7\u96c6\u7684\u57fa\u7ebf\u5bf9\u6bd4\u3002\u4e03\u9879\u65ad\u8a00\u5168\u90e8\u53ea\u68c0\u67e5\u7ed3\u6784\uff0c\u4e0d\u68c0\u67e5\u8ba1\u6570\u6216\u8017\u65f6\uff1a</p>"}
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
