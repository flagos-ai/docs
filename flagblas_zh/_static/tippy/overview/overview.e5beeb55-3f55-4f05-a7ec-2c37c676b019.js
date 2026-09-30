selector_to_html = {"a[href=\"#flagblas\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagBLAS \u6982\u89c8<a class=\"headerlink\" href=\"#flagblas\" title=\"Link to this heading\">#</a></h1><p>FlagBLAS \u662f\u4e00\u4e2a\u9075\u5faa BLAS\uff08\u57fa\u7840\u7ebf\u6027\u4ee3\u6570\u5b50\u7a0b\u5e8f\uff09\u6807\u51c6\u63a5\u53e3\u7684\u9ad8\u6027\u80fd\u901a\u7528\u7b97\u5b50\u5e93\uff0c\u9762\u5411\u591a\u82af\u7247\u540e\u7aef\u3002\u5b83\u662f <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> \u751f\u6001\u7cfb\u7edf\u7684\u7ec4\u6210\u90e8\u5206\uff0c\u5b9a\u4e49\u4e86\u5411\u91cf\u548c\u77e9\u9635\u7b49\u6570\u503c\u8ba1\u7b97\u7684\u6838\u5fc3\u64cd\u4f5c\uff0c\u652f\u6301\u79d1\u5b66\u8ba1\u7b97\u3001\u5de5\u7a0b\u4eff\u771f\u3001\u673a\u5668\u5b66\u4e60\u548c\u4eba\u5de5\u667a\u80fd\u7b49\u9886\u57df\u7684\u9ad8\u6027\u80fd\u8ba1\u7b97\u3002</p><p>FlagBLAS \u4f7f\u7528 OpenAI \u63a8\u51fa\u7684 <a class=\"reference external\" href=\"https://github.com/openai/triton\">Triton \u7f16\u7a0b\u8bed\u8a00</a> \u5b9e\u73b0\uff0c\u4f7f\u5185\u6838\u4ee3\u7801\u80fd\u591f\u5728\u591a\u79cd\u786c\u4ef6\u4e0a\u79fb\u690d\u3002</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u67b6\u6784<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>FlagBLAS \u9075\u5faa\u6807\u51c6 BLAS \u63a5\u53e3\u5c42\u6b21\u7ed3\u6784\uff1a</p>"}
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
