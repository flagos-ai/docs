selector_to_html = {"a[href=\"#id7\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5de5\u4f5c\u539f\u7406<a class=\"headerlink\" href=\"#id7\" title=\"Link to this heading\">#</a></h2><p>\u5f53\u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">PrecisionCheckRegister</span></code> \u4f5c\u4e3a\u6ce8\u518c\u5668\u65f6\uff0c\u6bcf\u4e2a\u7b97\u5b50\u4f1a\u88ab\u5305\u88c5\u4e0a\n\u4e00\u4e2a\u7cbe\u5ea6\u68c0\u67e5\u88c5\u9970\u5668\u3002\u8be5\u88c5\u9970\u5668\u7684\u5de5\u4f5c\u6d41\u7a0b\u4e3a\uff1a</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5173\u95ed\u7cbe\u5ea6\u68c0\u67e5<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u5982\u9700\u5728\u8fd0\u884c\u65f6\u5173\u95ed\u7cbe\u5ea6\u68c0\u67e5\uff1a</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5982\u4f55\u542f\u7528<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u542f\u7528\u7cbe\u5ea6\u68c0\u67e5\u9700\u8981\u4e24\u6b65\uff1a</p>", "a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u65e5\u5fd7\u8f93\u51fa<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2><p>\u7cbe\u5ea6\u68c0\u67e5\u7684\u7ed3\u679c\u9ed8\u8ba4\u5199\u5165 <code class=\"docutils literal notranslate\"><span class=\"pre\">~/.flaggems/precision.log</span></code> \u6587\u4ef6\u3002\n\u53ea\u6709\u672a\u901a\u8fc7\u5bb9\u5fcd\u5ea6\u68c0\u67e5\u7684\u7b97\u5b50\u624d\u4f1a\u88ab\u8bb0\u5f55\u3002</p><p>\u65e5\u5fd7\u8f93\u51fa\u793a\u4f8b\uff1a</p>", "a[href=\"#id6\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u884c\u4e3a\u7ec6\u8282<a class=\"headerlink\" href=\"#id6\" title=\"Link to this heading\">#</a></h2><p>\u7cbe\u5ea6\u68c0\u67e5\u5668\u5185\u7f6e\u4e86\u591a\u9879\u4fdd\u62a4\u63aa\u65bd\u4ee5\u5c3d\u91cf\u51cf\u5c11\u5bf9\u6027\u80fd\u7684\u5f71\u54cd\uff1a</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u914d\u7f6e\u53c2\u6570<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u4f60\u53ef\u4ee5\u901a\u8fc7\u5411 <code class=\"docutils literal notranslate\"><span class=\"pre\">enable_precision_check()</span></code> \u4f20\u9012\u53c2\u6570\u6765\u81ea\u5b9a\u4e49\u7cbe\u5ea6\u68c0\u67e5\u7684\u884c\u4e3a\u3002</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7cbe\u5ea6\u68c0\u67e5\uff08\u5b9e\u9a8c\u6027\u529f\u80fd\uff09<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p><em>FlagGems</em> \u63d0\u4f9b\u4e86\u4e00\u4e2a\u5b9e\u9a8c\u6027\u7684\u7cbe\u5ea6\u68c0\u67e5\u673a\u5236\uff0c\u80fd\u591f\u81ea\u52a8\u5c06 FlagGems \u7b97\u5b50\u7684\u8f93\u51fa\n\u4e0e\u539f\u751f PyTorch\uff08CPU\uff09\u7684\u8ba1\u7b97\u7ed3\u679c\u8fdb\u884c\u5bf9\u6bd4\uff0c\u5e76\u5c06\u7cbe\u5ea6\u4e0d\u4e00\u81f4\u7684\u60c5\u51b5\u8bb0\u5f55\u5230\u65e5\u5fd7\u6587\u4ef6\u4e2d\u3002\n\u8fd9\u5bf9\u4e8e\u5f00\u53d1\u8fc7\u7a0b\u4e2d\u9a8c\u8bc1\u6570\u503c\u6b63\u786e\u6027\u975e\u5e38\u6709\u7528\u3002</p>"}
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
