selector_to_html = {"a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-FL \u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#verl-fl\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd verl-FL \u7684\u5b89\u88c5\u8981\u6c42\uff0c\u5e76\u6307\u5bfc\u60a8\u5728\u4e0d\u540c\u786c\u4ef6\u5e73\u53f0\u4e0a\u5b89\u88c5 verl-FL\u3002</p>", "a[href=\"#verl-fl\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-FL \u6587\u6863<a class=\"headerlink\" href=\"#verl-fl\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5feb\u901f\u5f00\u59cb</span></a></p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-FL \u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#verl-fl\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u63d0\u4f9b\u4f7f\u7528 verl-FL \u5728\u4e0d\u540c\u786c\u4ef6\u5e73\u53f0\u4e0a\u8fdb\u884c\u7aef\u5230\u7aef GRPO \u8bad\u7ec3\u7684\u8be6\u7ec6\u6307\u5bfc\u3002</p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-FL \u6982\u8ff0<a class=\"headerlink\" href=\"#verl-fl\" title=\"Link to this heading\">#</a></h1><p>verl-FL \u662f <a class=\"reference external\" href=\"https://github.com/volcengine/verl\">verl</a> \u7684\u4e00\u4e2a\u5206\u652f\uff0c\u65e8\u5728\u652f\u6301\u591a\u79cd AI \u52a0\u901f\u5668\u3002\u5b83\u57fa\u4e8e <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a> \u6784\u5efa\uff0cFlagOS \u662f\u4e00\u4e2a\u7edf\u4e00\u7684\u5f00\u6e90 AI \u7cfb\u7edf\u8f6f\u4ef6\u6808\uff0c\u96c6\u6210\u4e86\u8bad\u7ec3\u5f15\u64ce <a class=\"reference external\" href=\"https://github.com/flagos-ai/Megatron-LM-FL\">Megatron-LM-FL</a> \u548c <a class=\"reference external\" href=\"https://github.com/flagos-ai/TransformerEngine-FL\">Transformer-Engine-FL</a>\uff0c\u4ee5\u53ca\u63a8\u7406\u5f15\u64ce <a class=\"reference external\" href=\"https://github.com/flagos-ai/vllm-plugin-FL\">vllm-plugin-FL</a> \u7b49\u5173\u952e\u7ec4\u4ef6\u3002</p><p>\u4e0a\u6e38 verl \u4e0e CUDA \u7d27\u5bc6\u8026\u5408\uff0c\u800c verl-FL \u5f15\u5165\u4e86\u5e73\u53f0\u62bd\u8c61\u5c42\u5e76\u96c6\u6210\u4e86 FlagOS \u751f\u6001\u7ec4\u4ef6\uff0c\u4ece\u800c\u5728\u4e0d\u4fee\u6539\u4e0a\u6e38\u4e1a\u52a1\u903b\u8f91\u7684\u60c5\u51b5\u4e0b\u5b9e\u73b0\u5f02\u6784\u5206\u5e03\u5f0f\u8bad\u7ec3\u3002</p>"}
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
