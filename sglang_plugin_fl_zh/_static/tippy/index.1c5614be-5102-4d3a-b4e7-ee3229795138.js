selector_to_html = {"a[href=\"reference/dispatch-reference-and-example.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u73af\u5883\u53d8\u91cf\u53c2\u8003\u4e0e\u793a\u4f8b<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u9875\u8bb0\u5f55 sglang-plugin-FL \u7684\u73af\u5883\u53d8\u91cf\u53c2\u8003\u548c\u793a\u4f8b\u3002</p><p>\u6709\u6548\u914d\u7f6e\u4f18\u5148\u7ea7\u5982\u4e0b\uff1a</p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">sglang-plugin-FL \u6982\u8ff0<a class=\"headerlink\" href=\"#sglang-plugin-fl\" title=\"Link to this heading\">#</a></h1><p>sglang-plugin-FL \u662f <a class=\"reference external\" href=\"https://github.com/sgl-project/sglang\">SGLang</a> \u7684\u6811\u5916\uff08OOT\uff09\u63d2\u4ef6\uff0c\u6784\u5efa\u4e8e FlagOS \u7684\u7edf\u4e00\u591a\u82af\u7247\u540e\u7aef\u4e4b\u4e0a\u2014\u2014\u5305\u62ec\u7edf\u4e00\u7b97\u5b50\u5e93 <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagGems\">FlagGems</a> \u548c\u7edf\u4e00\u901a\u4fe1\u5e93 <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagCX\">FlagCX</a>\u3002\u5b83\u5c06 SGLang \u7684\u63a8\u7406\u80fd\u529b\u6269\u5c55\u5230\u591a\u79cd\u786c\u4ef6\u5e73\u53f0\u3002\u65e0\u9700\u66f4\u6539 SGLang \u7684\u539f\u59cb\u63a5\u53e3\u6216\u4f7f\u7528\u65b9\u5f0f\uff0c\u540c\u4e00\u547d\u4ee4\u5373\u53ef\u5728\u4e0d\u540c\u82af\u7247\u4e0a\u8fd0\u884c\u6a21\u578b\u63a8\u7406\u3002</p>", "a[href=\"#sglang-plugin-fl\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">sglang-plugin-FL \u6587\u6863<a class=\"headerlink\" href=\"#sglang-plugin-fl\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5feb\u901f\u5165\u95e8</span></a></p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u5b89\u88c5 sglang-plugin-FL \u7684\u8981\u6c42\uff0c\u5e76\u6307\u5bfc\u60a8\u5b8c\u6210\u5b89\u88c5\u8fc7\u7a0b\u548c\u8fd0\u884c\u63a8\u7406\u4efb\u52a1\u3002</p>", "a[href=\"dispatch_user_guide/dispatch-user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u5b50\u8c03\u5ea6\u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u8c03\u5ea6\u7cfb\u7edf\u901a\u8fc7 YAML \u6587\u4ef6\u548c\u73af\u5883\u53d8\u91cf\u63d0\u4f9b\u7b97\u5b50\u66ff\u6362\u4e0e\u5206\u5e03\u5f0f\u901a\u4fe1\u914d\u7f6e\u3002\u60a8\u53ef\u4ee5\u72ec\u7acb\u63a7\u5236\u66ff\u6362\u5c42\uff0c\u5e76\u914d\u7f6e\u53ef\u611f\u77e5\u5e73\u53f0\u7684\u901a\u4fe1\u540e\u7aef\u3002</p><p>\u8c03\u5ea6\u7cfb\u7edf\u540c\u65f6\u652f\u6301 YAML \u914d\u7f6e\u548c\u73af\u5883\u53d8\u91cf\uff0c\u4ee5\u4fbf\u8fdb\u884c\u7ec6\u7c92\u5ea6\u63a7\u5236\u3002\u73af\u5883\u53d8\u91cf\u4f18\u5148\u4e8e YAML \u914d\u7f6e\u3002</p>"}
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
