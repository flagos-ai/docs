selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u9009\u62e9\u6027\u542f\u7528\u7b97\u5b50<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u5728\u542f\u7528 <em>FlagGems</em> \u5e93\u65f6\uff0c\u4f60\u53ef\u4ee5\u4f7f\u7528\u82e5\u5e72\u53ef\u9009\u7684\u53c2\u6570\u6765\u7cbe\u7ec6\u63a7\u5236\u5728\u4f60\u7684\u5e94\u7528\u4e2d\u5982\u4f55\u4f7f\u7528\u7b97\u5b50\u52a0\u901f\u3002\n\u8fd9\u4e9b\u53c2\u6570\u7684\u5b58\u5728\u4f7f\u5f97\u7528\u6237\u80fd\u591f\u5f88\u7075\u6d3b\u5730\u5b9e\u73b0\u5404\u79cd\u96c6\u6210\u4efb\u52a1\uff0c\u5e76\u4e14\u5728\u5de5\u4f5c\u6d41\u5f88\u590d\u6742\u7684\u60c5\u51b5\u4e0b\uff0c\n\u4e5f\u53ef\u4ee5\u5f88\u65b9\u4fbf\u5730\u8fdb\u884c\u6545\u969c\u8c03\u8bd5\u548c\u6027\u80fd\u5206\u6790\u3002</p><p>\u76ee\u524d\uff0c<em>FlagGems</em> \u63d0\u4f9b\u4e09\u79cd\u65b9\u5f0f\u4f9b\u4f60\u6709\u9009\u62e9\u5730\u542f\u7528\u6216\u8005\u7981\u7528\u67d0\u4e9b\u7b97\u5b50\u3002</p>"}
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
