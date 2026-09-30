selector_to_html = {"a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagDNN \u6982\u89c8<a class=\"headerlink\" href=\"#flagdnn\" title=\"Link to this heading\">#</a></h1><p>FlagDNN \u662f <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> \u7684\u7ec4\u6210\u90e8\u5206\u3002FlagDNN \u662f\u4e00\u4e2a\u9762\u5411\u591a\u82af\u7247\u540e\u7aef\u7684\u6df1\u5ea6\u795e\u7ecf\u7f51\u7edc\u8ba1\u7b97\u5e93\uff0c\u63d0\u4f9b\u5e38\u89c1\u6df1\u5ea6\u5b66\u4e60\u7b97\u5b50\u7684\u9ad8\u6027\u80fd\u5b9e\u73b0\uff0c\u652f\u6301\u6df1\u5ea6\u5b66\u4e60\u3001\u8ba1\u7b97\u673a\u89c6\u89c9\u3001\u81ea\u7136\u8bed\u8a00\u5904\u7406\u548c\u4eba\u5de5\u667a\u80fd\u7b49\u9886\u57df\u7684\u9ad8\u6548\u8ba1\u7b97\u3002</p><p>FlagDNN \u662f\u4f7f\u7528 OpenAI \u63a8\u51fa\u7684 <a class=\"reference external\" href=\"https://github.com/openai/triton\">Triton \u7f16\u7a0b\u8bed\u8a00</a> \u5b9e\u73b0\u7684\u9ad8\u6027\u80fd\u6df1\u5ea6\u5b66\u4e60\u7b97\u5b50\u5e93\u3002</p>", "a[href=\"#flagdnn\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagDNN \u6587\u6863<a class=\"headerlink\" href=\"#flagdnn\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5feb\u901f\u5165\u95e8</span></a></p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagDNN \u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#flagdnn\" title=\"Link to this heading\">#</a></h1><h2>\u4f7f\u7528 FlagDNN<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>FlagDNN \u76f4\u63a5\u4e0e PyTorch \u96c6\u6210\u3002\u5bfc\u5165\u5305\u5e76\u5bf9 CUDA \u5f20\u91cf\u8c03\u7528\u7b97\u5b50\uff1a</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagDNN \u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#flagdnn\" title=\"Link to this heading\">#</a></h1>"}
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
