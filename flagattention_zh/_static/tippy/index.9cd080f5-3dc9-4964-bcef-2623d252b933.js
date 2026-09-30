selector_to_html = {"a[href=\"#flagattention\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagAttention \u6587\u6863<a class=\"headerlink\" href=\"#flagattention\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5feb\u901f\u5165\u95e8</span></a></p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u7a20\u5bc6\u6ce8\u610f\u529b<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><h3>FlashAttention<a class=\"headerlink\" href=\"#flashattention\" title=\"Link to this heading\">#</a></h3><p>\u5b8c\u6574\u63a5\u53e3\u5982\u4e0b\uff1a</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagAttention \u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#flagattention\" title=\"Link to this heading\">#</a></h1>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagAttention \u6982\u89c8<a class=\"headerlink\" href=\"#flagattention\" title=\"Link to this heading\">#</a></h1><p>FlagAttention \u662f <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> \u7684\u7ec4\u6210\u90e8\u5206\u3002\u5b83\u662f\u4e00\u7ec4\u4f7f\u7528 <a class=\"reference external\" href=\"https://github.com/triton-lang/triton\">Triton \u8bed\u8a00</a> \u5b9e\u73b0\u7684\u5185\u5b58\u9ad8\u6548 attention \u7b97\u5b50\uff0c\u9762\u5411\u9700\u8981\u81ea\u5b9a\u4e49 attention score \u53d8\u6362\u3001paged/sparse KV cache \u5e03\u5c40\u6216\u9012\u5f52\u7ebf\u6027\u6ce8\u610f\u529b kernel \u7684\u8bad\u7ec3\u4e0e\u63a8\u7406\u4efb\u52a1\u3002</p><p>\u4e0e <a class=\"reference external\" href=\"https://arxiv.org/abs/2205.14135\">FlashAttention</a> \u7c7b\u4f3c\uff0c\u7a20\u5bc6\u7b97\u5b50\u901a\u8fc7\u5206\u5757\u548c\u91cd\u8ba1\u7b97\u907f\u514d\u5b9e\u4f53\u5316\u5b8c\u6574\u7684 attention matrix\u3002\u4ed3\u5e93\u8fd8\u5305\u542b\u89e3\u7801\u3001\u5757\u7a00\u758f\u3001\u91cf\u5316\u548c\u9012\u5f52\u7b97\u5b50\uff0c\u5b83\u4eec\u5e76\u4e0d\u5c40\u9650\u4e8e\u6807\u51c6 scaled dot-product attention \u63a5\u53e3\u3002</p>", "a[href=\"reference/operator-registry.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u5b50\u6ce8\u518c\u8868<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u5b8c\u6574\u7684\u7b97\u5b50\u6ce8\u518c\u8868\uff08\u542b\u5404\u7b97\u5b50\u9636\u6bb5\u3001\u6d4b\u8bd5\u4e0e benchmark \u5165\u53e3\uff09\u7ef4\u62a4\u5728 <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagAttention/blob/main/conf/operators.yaml\">FlagAttention conf/operators.yaml</a>\u3002</p>"}
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
