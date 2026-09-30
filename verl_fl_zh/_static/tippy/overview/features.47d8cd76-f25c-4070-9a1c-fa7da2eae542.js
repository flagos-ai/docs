selector_to_html = {"a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5f02\u6784\u5206\u5e03\u5f0f\u8bad\u7ec3<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u901a\u8fc7 FlagCX \u5b9e\u73b0\u8de8\u5382\u5546\u96c6\u5408\u901a\u4fe1\uff0c\u652f\u6301 NVIDIA GPU \u548c\u6469\u5c14\u7ebf\u7a0b MUSA \u8282\u70b9\u95f4\u7684\u5f02\u6784\u8bad\u7ec3\u3002\u4e00\u4e2a\u8282\u70b9\u8fd0\u884c actor/critic\uff08NVIDIA\uff0cFSDP\uff09\uff0c\u53e6\u4e00\u4e2a\u8282\u70b9\u8fd0\u884c rollout\uff08\u6469\u5c14\u7ebf\u7a0b MUSA\uff0cvLLM\uff09\uff0c\u901a\u8fc7 Ray \u8fd0\u884c\u65f6\u4e0a\u4e0b\u6587\u7ba1\u7406\u6743\u91cd\u540c\u6b65\u548c\u8bbe\u5907\u9694\u79bb\u3002</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u7edf\u4e00\u5e73\u53f0\u62bd\u8c61\u5c42<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">verl/plugin/platform/</span></code> \u4e0b\u7684\u7b56\u7565\u6a21\u5f0f\u8bbe\u8ba1\u5c06\u4e1a\u52a1\u903b\u8f91\u4e0e\u786c\u4ef6\u7279\u5b9a\u8c03\u7528\u89e3\u8026\uff0c\u652f\u6301 CUDA\u3001\u6607\u817e NPU\u3001MetaX (MACA)\u3001\u6469\u5c14\u7ebf\u7a0b (MUSA)\u3001CPU \u53ca\u672a\u6765\u7684\u52a0\u901f\u5668\u3002</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u591a\u5382\u5546\u786c\u4ef6\u652f\u6301<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>verl-FL \u652f\u6301 NVIDIA\u3001\u534e\u4e3a\u6607\u817e\u3001MetaX\u3001\u6469\u5c14\u7ebf\u7a0b\u548c CPU \u5e73\u53f0\u3002\u8be6\u89c1<a class=\"reference internal\" href=\"../getting_started/requirements.html#supported-hardwares\"><span class=\"std std-ref\">\u652f\u6301\u7684\u786c\u4ef6</span></a>\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7edf\u4e00\u5e73\u53f0\u62bd\u8c61\u5c42<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">verl/plugin/platform/</span></code> \u4e0b\u7684\u7b56\u7565\u6a21\u5f0f\u8bbe\u8ba1\u5c06\u4e1a\u52a1\u903b\u8f91\u4e0e\u786c\u4ef6\u7279\u5b9a\u8c03\u7528\u89e3\u8026\uff0c\u652f\u6301 CUDA\u3001\u6607\u817e NPU\u3001MetaX (MACA)\u3001\u6469\u5c14\u7ebf\u7a0b (MUSA)\u3001CPU \u53ca\u672a\u6765\u7684\u52a0\u901f\u5668\u3002</p>", "a[href=\"#flagos\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FlagOS \u8bad\u7ec3\u5f15\u64ce\u96c6\u6210<a class=\"headerlink\" href=\"#flagos\" title=\"Link to this heading\">#</a></h2><p>\u901a\u8fc7 FlagOS \u751f\u6001\u7ec4\u4ef6\u5b9e\u73b0\u53ef\u63d2\u62d4\u540e\u7aef\uff0c\u652f\u6301\u591a\u82af\u7247 GRPO \u8bad\u7ec3\uff1a</p>"}
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
