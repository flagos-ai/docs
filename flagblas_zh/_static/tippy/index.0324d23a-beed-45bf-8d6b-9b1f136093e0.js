selector_to_html = {"a[href=\"#flagblas\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagBLAS \u6587\u6863<a class=\"headerlink\" href=\"#flagblas\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5feb\u901f\u5165\u95e8</span></a></p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagBLAS \u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#flagblas\" title=\"Link to this heading\">#</a></h1>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagBLAS \u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#flagblas\" title=\"Link to this heading\">#</a></h1><h2>\u4f7f\u7528 FlagBLAS<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>FlagBLAS \u76f4\u63a5\u4e0e PyTorch \u96c6\u6210\u3002\u5bfc\u5165\u5305\u5e76\u5bf9 CUDA \u5f20\u91cf\u8c03\u7528\u7b97\u5b50\uff1a</p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagBLAS \u6982\u89c8<a class=\"headerlink\" href=\"#flagblas\" title=\"Link to this heading\">#</a></h1><p>FlagBLAS \u662f\u4e00\u4e2a\u9075\u5faa BLAS\uff08\u57fa\u7840\u7ebf\u6027\u4ee3\u6570\u5b50\u7a0b\u5e8f\uff09\u6807\u51c6\u63a5\u53e3\u7684\u9ad8\u6027\u80fd\u901a\u7528\u7b97\u5b50\u5e93\uff0c\u9762\u5411\u591a\u82af\u7247\u540e\u7aef\u3002\u5b83\u662f <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> \u751f\u6001\u7cfb\u7edf\u7684\u7ec4\u6210\u90e8\u5206\uff0c\u5b9a\u4e49\u4e86\u5411\u91cf\u548c\u77e9\u9635\u7b49\u6570\u503c\u8ba1\u7b97\u7684\u6838\u5fc3\u64cd\u4f5c\uff0c\u652f\u6301\u79d1\u5b66\u8ba1\u7b97\u3001\u5de5\u7a0b\u4eff\u771f\u3001\u673a\u5668\u5b66\u4e60\u548c\u4eba\u5de5\u667a\u80fd\u7b49\u9886\u57df\u7684\u9ad8\u6027\u80fd\u8ba1\u7b97\u3002</p><p>FlagBLAS \u4f7f\u7528 OpenAI \u63a8\u51fa\u7684 <a class=\"reference external\" href=\"https://github.com/openai/triton\">Triton \u7f16\u7a0b\u8bed\u8a00</a> \u5b9e\u73b0\uff0c\u4f7f\u5185\u6838\u4ee3\u7801\u80fd\u591f\u5728\u591a\u79cd\u786c\u4ef6\u4e0a\u79fb\u690d\u3002</p>"}
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
