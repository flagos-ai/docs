selector_to_html = {"a[href=\"#flagdnn\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagDNN \u6982\u89c8<a class=\"headerlink\" href=\"#flagdnn\" title=\"Link to this heading\">#</a></h1><p>FlagDNN \u662f <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> \u7684\u7ec4\u6210\u90e8\u5206\u3002FlagDNN \u662f\u4e00\u4e2a\u9762\u5411\u591a\u82af\u7247\u540e\u7aef\u7684\u6df1\u5ea6\u795e\u7ecf\u7f51\u7edc\u8ba1\u7b97\u5e93\uff0c\u63d0\u4f9b\u5e38\u89c1\u6df1\u5ea6\u5b66\u4e60\u7b97\u5b50\u7684\u9ad8\u6027\u80fd\u5b9e\u73b0\uff0c\u652f\u6301\u6df1\u5ea6\u5b66\u4e60\u3001\u8ba1\u7b97\u673a\u89c6\u89c9\u3001\u81ea\u7136\u8bed\u8a00\u5904\u7406\u548c\u4eba\u5de5\u667a\u80fd\u7b49\u9886\u57df\u7684\u9ad8\u6548\u8ba1\u7b97\u3002</p><p>FlagDNN \u662f\u4f7f\u7528 OpenAI \u63a8\u51fa\u7684 <a class=\"reference external\" href=\"https://github.com/openai/triton\">Triton \u7f16\u7a0b\u8bed\u8a00</a> \u5b9e\u73b0\u7684\u9ad8\u6027\u80fd\u6df1\u5ea6\u5b66\u4e60\u7b97\u5b50\u5e93\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u67b6\u6784<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>FlagDNN \u91c7\u7528\u5206\u5c42\u67b6\u6784\uff1a</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5de5\u4f5c\u6d41\u7a0b<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>"}
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
