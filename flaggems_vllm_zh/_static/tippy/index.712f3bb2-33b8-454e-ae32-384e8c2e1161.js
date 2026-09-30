selector_to_html = {"a[href=\"user_guide/run-tests-and-benchmark.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u8fd0\u884c\u6d4b\u8bd5\u548c\u57fa\u51c6<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u5982\u4f55\u8fd0\u884c FlagGems-vLLM \u7684\u6d4b\u8bd5\u548c\u57fa\u51c6\uff0c\u4ee5\u9a8c\u8bc1\u6b63\u786e\u6027\u5e76\u8861\u91cf\u7b97\u5b50\u6027\u80fd\u3002</p><p>\u4ee5\u4e0b\u547d\u4ee4\u5df2\u5728 FlagGems-vLLM \u4ed3\u5e93\u4e2d\u9a8c\u8bc1\uff0c\u53ef\u7528\u4e8e\u5b89\u88c5\u540e\u7684\u5feb\u901f\u9a8c\u8bc1\u3002</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u6db5\u76d6\u4e86\u5b89\u88c5\u548c\u8fd0\u884c FlagGems-vLLM \u7684\u8981\u6c42\uff0c\u5e76\u6307\u5bfc\u60a8\u5b8c\u6210\u5b89\u88c5\u548c\u4f7f\u7528\u5176\u4f18\u5316\u7b97\u5b50\u7684\u8fc7\u7a0b\u3002</p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagGems-vLLM \u6982\u89c8<a class=\"headerlink\" href=\"#flaggems-vllm\" title=\"Link to this heading\">#</a></h1><p>FlagGems-vLLM \u662f <a class=\"reference external\" href=\"https://flagos.io/Home\">FlagOS</a> \u7684\u4e00\u90e8\u5206\u3002FlagGems-vLLM \u662f\u4e00\u4e2a\u9762\u5411\u591a\u79cd\u786c\u4ef6\u540e\u7aef\u7684\u9ad8\u6027\u80fd\u7b97\u5b50\u5e93\u3002\u5b83\u63d0\u4f9b\u4e86\u5e38\u7528 vLLM \u7b97\u5b50\u7684\u4f18\u5316\u5b9e\u73b0\uff0c\u5e76\u652f\u6301\u591a\u79cd\u5e7f\u6cdb\u4f7f\u7528\u7684\u6a21\u578b\u8fdb\u884c\u9ad8\u6027\u80fd\u63a8\u7406\u548c\u90e8\u7f72\u3002</p><p>FlagGems-vLLM \u662f\u4e00\u4e2a\u4f7f\u7528 OpenAI \u63a8\u51fa\u7684 <a class=\"reference external\" href=\"https://github.com/openai/triton\">Triton \u7f16\u7a0b\u8bed\u8a00</a> \u5b9e\u73b0\u7684\u9ad8\u6027\u80fd\u6df1\u5ea6\u5b66\u4e60\u7b97\u5b50\u5e93\u3002</p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u6307\u5bfc\u60a8\u5982\u4f55\u6d4b\u8bd5 FlagGems-vLLM \u7b97\u5b50\uff0c\u4ee5\u53ca\u5982\u4f55\u5728 vLLM \u63a8\u7406\u5de5\u4f5c\u6d41\u4e2d\u4f7f\u7528\u8fd9\u4e9b\u7b97\u5b50\u3002</p>", "a[href=\"#flaggems-vllm\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagGems-vLLM \u6587\u6863<a class=\"headerlink\" href=\"#flaggems-vllm\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5feb\u901f\u5165\u95e8</span></a></p>"}
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
