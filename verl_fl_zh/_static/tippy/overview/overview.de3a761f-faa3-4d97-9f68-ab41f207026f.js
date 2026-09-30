selector_to_html = {"a[href=\"#verl-fl\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-FL \u6982\u8ff0<a class=\"headerlink\" href=\"#verl-fl\" title=\"Link to this heading\">#</a></h1><p>verl-FL \u662f <a class=\"reference external\" href=\"https://github.com/volcengine/verl\">verl</a> \u7684\u4e00\u4e2a\u5206\u652f\uff0c\u65e8\u5728\u652f\u6301\u591a\u79cd AI \u52a0\u901f\u5668\u3002\u5b83\u57fa\u4e8e <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a> \u6784\u5efa\uff0cFlagOS \u662f\u4e00\u4e2a\u7edf\u4e00\u7684\u5f00\u6e90 AI \u7cfb\u7edf\u8f6f\u4ef6\u6808\uff0c\u96c6\u6210\u4e86\u8bad\u7ec3\u5f15\u64ce <a class=\"reference external\" href=\"https://github.com/flagos-ai/Megatron-LM-FL\">Megatron-LM-FL</a> \u548c <a class=\"reference external\" href=\"https://github.com/flagos-ai/TransformerEngine-FL\">Transformer-Engine-FL</a>\uff0c\u4ee5\u53ca\u63a8\u7406\u5f15\u64ce <a class=\"reference external\" href=\"https://github.com/flagos-ai/vllm-plugin-FL\">vllm-plugin-FL</a> \u7b49\u5173\u952e\u7ec4\u4ef6\u3002</p><p>\u4e0a\u6e38 verl \u4e0e CUDA \u7d27\u5bc6\u8026\u5408\uff0c\u800c verl-FL \u5f15\u5165\u4e86\u5e73\u53f0\u62bd\u8c61\u5c42\u5e76\u96c6\u6210\u4e86 FlagOS \u751f\u6001\u7ec4\u4ef6\uff0c\u4ece\u800c\u5728\u4e0d\u4fee\u6539\u4e0a\u6e38\u4e1a\u52a1\u903b\u8f91\u7684\u60c5\u51b5\u4e0b\u5b9e\u73b0\u5f02\u6784\u5206\u5e03\u5f0f\u8bad\u7ec3\u3002</p>", "a[href=\"#id4\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u5f02\u6784\u8bad\u7ec3\u67b6\u6784<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h3><p><a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagCX\">FlagCX</a> \u4f5c\u4e3a\u7edf\u4e00\u7684\u8de8\u5382\u5546\u901a\u4fe1\u540e\u7aef\uff0c\u5728\u5f02\u6784\u573a\u666f\u4e2d\u66ff\u4ee3 NCCL\u3002\u901a\u8fc7 Ray \u8fd0\u884c\u65f6\u4e0a\u4e0b\u6587\u5b9e\u73b0 CUDA \u548c MUSA \u8282\u70b9\u95f4\u7684\u6743\u91cd\u540c\u6b65\u548c\u8bbe\u5907\u9694\u79bb\uff1a</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u67b6\u6784<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><h3>\u5e73\u53f0\u62bd\u8c61\u5c42<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h3><p>verl-FL \u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">verl/plugin/platform/</span></code> \u4e0b\u5f15\u5165\u4e86\u7b56\u7565\u6a21\u5f0f\u7684\u5e73\u53f0\u62bd\u8c61\uff1a</p>", "a[href=\"#id3\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u5f15\u64ce\u63d2\u4ef6\u67b6\u6784<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id2\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u5e73\u53f0\u62bd\u8c61\u5c42<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h3><p>verl-FL \u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">verl/plugin/platform/</span></code> \u4e0b\u5f15\u5165\u4e86\u7b56\u7565\u6a21\u5f0f\u7684\u5e73\u53f0\u62bd\u8c61\uff1a</p>"}
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
