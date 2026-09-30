selector_to_html = {"a[href=\"override-usage.html#id9\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">3. \u66ff\u6362\u6574\u4e2a\u7c7b<a class=\"headerlink\" href=\"#id9\" title=\"Link to this heading\">#</a></h2><p><strong>\u573a\u666f</strong>\uff1a\u7528\u65b0\u7c7b\u5b8c\u5168\u66ff\u6362\u539f\u59cb\u7c7b\u3002\u6240\u6709\u5b9e\u4f8b\u5316\u539f\u59cb\u7c7b\u7684\u5730\u65b9\u90fd\u4f1a\u81ea\u52a8\u83b7\u5f97\u66ff\u6362\u7c7b\u3002</p>", "a[href=\"override-usage.html#method-key\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">method_key \u751f\u6210\u89c4\u5219<a class=\"headerlink\" href=\"#method-key\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">register()</span></code> \u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">target</span></code> \u53c2\u6570\u4f1a\u81ea\u52a8\u8f6c\u6362\u4e3a\u5185\u90e8\u7684 method_key\uff1a</p>", "a[href=\"override-usage.html#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. \u66ff\u6362\u6a21\u5757\u7ea7\u51fd\u6570<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2><p><strong>\u573a\u666f</strong>\uff1a\u66ff\u6362\u6a21\u5757\u4e2d\u7684\u72ec\u7acb\u51fd\u6570\u3002</p>", "a[href=\"override-usage.html#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6838\u5fc3\u6982\u5ff5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"override-usage.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Override \u63d2\u4ef6\u673a\u5236<a class=\"headerlink\" href=\"#override\" title=\"Link to this heading\">#</a></h1><p>\u672c\u6587\u6863\u4ecb\u7ecd\u5982\u4f55\u5728 FlagScale \u4e2d\u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">@overridable</span></code> / <code class=\"docutils literal notranslate\"><span class=\"pre\">register()</span></code> \u63d2\u4ef6\u7cfb\u7edf\uff0c\u8be5\u7cfb\u7edf\u652f\u6301\u66ff\u6362 <code class=\"docutils literal notranslate\"><span class=\"pre\">megatron.core</span></code>\uff08Megatron-LM-FL \u4fa7\uff09\u548c <code class=\"docutils literal notranslate\"><span class=\"pre\">megatron.training</span></code>\uff08FlagScale \u4fa7\uff09\u7684\u5b9e\u73b0\u3002</p><p>\u652f\u6301\u4e09\u79cd\u66ff\u6362\u573a\u666f\uff1a</p>", "a[href=\"override-usage.html#id15\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5165\u95e8\u6e05\u5355<a class=\"headerlink\" href=\"#id15\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#megatron-lm-fl\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Megatron-LM-FL \u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#megatron-lm-fl\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u63d0\u4f9b\u4f7f\u7528 Megatron-LM-FL \u7684\u8be6\u7ec6\u6307\u5bfc\u3002</p>", "a[href=\"override-usage.html#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. \u66ff\u6362\u7c7b\u65b9\u6cd5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p><strong>\u573a\u666f</strong>\uff1a\u66ff\u6362\u7c7b\u4e2d\u7684\u5355\u4e2a\u65b9\u6cd5\uff0c\u540c\u65f6\u4fdd\u6301\u5176\u4ed6\u65b9\u6cd5\u4e0d\u53d8\u3002</p>", "a[href=\"override-usage.html#id14\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u591a\u4f9b\u5e94\u5546\u652f\u6301<a class=\"headerlink\" href=\"#id14\" title=\"Link to this heading\">#</a></h2><p>\u53ef\u4ee5\u4e3a\u540c\u4e00 target \u6ce8\u518c\u591a\u4e2a\u4f9b\u5e94\u5546\u5b9e\u73b0\uff0c\u901a\u8fc7\u73af\u5883\u53d8\u91cf\u9009\u62e9\uff1a</p>"}
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
