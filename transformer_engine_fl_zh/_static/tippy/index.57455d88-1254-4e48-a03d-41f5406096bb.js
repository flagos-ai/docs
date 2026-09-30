selector_to_html = {"a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">TransformerEngine-FL \u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#transformerengine-fl\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u5b89\u88c5 TransformerEngine-FL \u7684\u8981\u6c42\uff0c\u5e76\u6307\u5bfc\u60a8\u5728\u4e0d\u540c\u786c\u4ef6\u5e73\u53f0\u4e0a\u5b89\u88c5 TransformerEngine-FL\u3002</p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">TransformerEngine-FL \u6982\u89c8<a class=\"headerlink\" href=\"#transformerengine-fl\" title=\"Link to this heading\">#</a></h1><p>TransformerEngine-FL \u662f <a class=\"reference external\" href=\"https://github.com/NVIDIA/TransformerEngine\">NVIDIA Transformer Engine</a>\uff08TE\uff09\u7684\u4e00\u4e2a\u5206\u652f\uff0c\u5f15\u5165\u4e86\u57fa\u4e8e\u63d2\u4ef6\u67b6\u6784\u7684\u591a AI \u82af\u7247\u652f\u6301\uff0c\u6784\u5efa\u5728 <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a>\uff08\u7edf\u4e00\u5f00\u6e90 AI \u7cfb\u7edf\u8f6f\u4ef6\u6808\uff09\u4e4b\u4e0a\u3002\u5b83\u5c06 TE \u7684 FP8 \u8bad\u7ec3\u548c\u63a8\u7406\u80fd\u529b\u6269\u5c55\u5230\u591a\u79cd\u786c\u4ef6\u73af\u5883\u4e2d\u3002\u5728\u4e0d\u6539\u53d8 TE \u539f\u6709\u63a5\u53e3\u6216\u4f7f\u7528\u65b9\u5f0f\u7684\u60c5\u51b5\u4e0b\uff0c\u76f8\u540c\u7684\u6a21\u578b\u4ee3\u7801\u53ef\u4ee5\u5728\u4e0d\u540c AI \u82af\u7247\u5e73\u53f0\u4e0a\u8fd0\u884c FP8 \u6df7\u5408\u7cbe\u5ea6\u8bad\u7ec3\u548c\u63a8\u7406\u3002</p><p>Transformer Engine\uff08TE\uff09\u662f\u4e00\u4e2a\u7528\u4e8e\u5728 NVIDIA GPU \u4e0a\u52a0\u901f Transformer \u6a21\u578b\u7684\u5e93\uff0c\u5305\u62ec\u5728 Hopper\u3001Ada \u548c Blackwell GPU \u4e0a\u4f7f\u7528 8 \u4f4d\u6d6e\u70b9\uff08FP8\uff09\u7cbe\u5ea6\uff0c\u4ee5\u66f4\u4f4e\u7684\u663e\u5b58\u5360\u7528\u6765\u63d0\u4f9b\u66f4\u597d\u7684\u8bad\u7ec3\u548c\u63a8\u7406\u6027\u80fd\u3002TE \u63d0\u4f9b\u4e86\u4e00\u7cfb\u5217\u9488\u5bf9\u6d41\u884c Transformer \u67b6\u6784\u7684\u9ad8\u5ea6\u4f18\u5316\u6784\u5efa\u6a21\u5757\uff0c\u4ee5\u53ca\u4e00\u4e2a\u7c7b\u4f3c\u4e8e\u81ea\u52a8\u6df7\u5408\u7cbe\u5ea6\u7684 API\uff0c\u53ef\u4ee5\u65e0\u7f1d\u5730\u4e0e\u60a8\u7684\u6846\u67b6\u7279\u5b9a\u4ee3\u7801\u4e00\u8d77\u4f7f\u7528\u3002TE \u8fd8\u5305\u542b\u4e00\u4e2a\u4e0e\u6846\u67b6\u65e0\u5173\u7684 C++ API\uff0c\u53ef\u4ee5\u4e0e\u5176\u4ed6\u6df1\u5ea6\u5b66\u4e60\u5e93\u96c6\u6210\uff0c\u4e3a Transformer \u542f\u7528 FP8 \u652f\u6301\u3002</p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1>", "a[href=\"#transformerengine-fl\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">TransformerEngine-FL \u6587\u6863<a class=\"headerlink\" href=\"#transformerengine-fl\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5feb\u901f\u5165\u95e8</span></a></p>"}
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
