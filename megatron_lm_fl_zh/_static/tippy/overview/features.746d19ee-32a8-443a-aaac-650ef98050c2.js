selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u63d2\u4ef6\u7cfb\u7edf<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>Megatron-LM-FL \u5f15\u5165\u4e86\u57fa\u4e8e\u63d2\u4ef6\u7684\u67b6\u6784\uff0c\u65e0\u9700\u4fee\u6539\u4e0a\u6e38\u4ee3\u7801\u5373\u53ef\u5b9e\u73b0\u5e73\u53f0\u7279\u5b9a\u7684\u5b9e\u73b0\uff1a</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u591a\u5e73\u53f0\u652f\u6301<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u901a\u8fc7 <code class=\"docutils literal notranslate\"><span class=\"pre\">PlatformBase</span></code> \u8fdb\u884c\u786c\u4ef6\u62bd\u8c61\uff0c\u652f\u6301\u591a\u4e2a\u5e73\u53f0\u7684\u5b9e\u73b0\uff1a</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u63d2\u4ef6\u7cfb\u7edf<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>Megatron-LM-FL \u5f15\u5165\u4e86\u57fa\u4e8e\u63d2\u4ef6\u7684\u67b6\u6784\uff0c\u65e0\u9700\u4fee\u6539\u4e0a\u6e38\u4ee3\u7801\u5373\u53ef\u5b9e\u73b0\u5e73\u53f0\u7279\u5b9a\u7684\u5b9e\u73b0\uff1a</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4e0a\u6e38\u517c\u5bb9\u6027<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#deepseek-v4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">DeepSeek V4 \u652f\u6301<a class=\"headerlink\" href=\"#deepseek-v4\" title=\"Link to this heading\">#</a></h2><p>\u5b8c\u6574\u7684 DeepSeek V4 \u67b6\u6784\u8bad\u7ec3\u652f\u6301\uff08CSA/HCA\u3001Hash Router\u3001mHC\u3001Engram\u3001MTP\uff09\u3002</p>", "a[href=\"#ci-cd\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">CI/CD<a class=\"headerlink\" href=\"#ci-cd\" title=\"Link to this heading\">#</a></h2>"}
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
