selector_to_html = {"a[href=\"features.html#flaggems-vllm-plugin-fl\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4e0e FlagGems \u548c vllm-plugin-fl \u7684\u5173\u7cfb<a class=\"headerlink\" href=\"#flaggems-vllm-plugin-fl\" title=\"Link to this heading\">#</a></h2><p>\u8fd9\u4e09\u4e2a\u4ed3\u5e93\u914d\u5408\u4f7f\u7528\uff0c\u4f46\u5404\u81ea\u627f\u62c5\u4e0d\u540c\u7684\u804c\u8d23\uff1a</p>", "a[href=\"#flaggems-vllm\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagGems-vLLM \u6982\u89c8<a class=\"headerlink\" href=\"#flaggems-vllm\" title=\"Link to this heading\">#</a></h1><p>FlagGems-vLLM \u662f <a class=\"reference external\" href=\"https://flagos.io/Home\">FlagOS</a> \u7684\u4e00\u90e8\u5206\u3002FlagGems-vLLM \u662f\u4e00\u4e2a\u9762\u5411\u591a\u79cd\u786c\u4ef6\u540e\u7aef\u7684\u9ad8\u6027\u80fd\u7b97\u5b50\u5e93\u3002\u5b83\u63d0\u4f9b\u4e86\u5e38\u7528 vLLM \u7b97\u5b50\u7684\u4f18\u5316\u5b9e\u73b0\uff0c\u5e76\u652f\u6301\u591a\u79cd\u5e7f\u6cdb\u4f7f\u7528\u7684\u6a21\u578b\u8fdb\u884c\u9ad8\u6027\u80fd\u63a8\u7406\u548c\u90e8\u7f72\u3002</p><p>FlagGems-vLLM \u662f\u4e00\u4e2a\u4f7f\u7528 OpenAI \u63a8\u51fa\u7684 <a class=\"reference external\" href=\"https://github.com/openai/triton\">Triton \u7f16\u7a0b\u8bed\u8a00</a> \u5b9e\u73b0\u7684\u9ad8\u6027\u80fd\u6df1\u5ea6\u5b66\u4e60\u7b97\u5b50\u5e93\u3002</p>", "a[href=\"features.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagGems-vLLM \u63d0\u4f9b\u4ee5\u4e0b\u5173\u952e\u7279\u6027\uff1a</p>"}
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
