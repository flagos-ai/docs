selector_to_html = {"a[href=\"features.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagScale \u63d0\u4f9b\u7edf\u4e00\u5de5\u5177\u96c6\uff0c\u8986\u76d6\u5927\u8bed\u8a00\u6a21\u578b\u3001\u591a\u6a21\u6001\u6a21\u578b\u548c\u5177\u8eab\u667a\u80fd\u6a21\u578b\u7684\u5b8c\u6574\u751f\u547d\u5468\u671f\u3002\u5b83\u5728\u5355\u4e00\u914d\u7f6e\u548c CLI \u63a5\u53e3\u4e0b\u96c6\u6210\u4e86\u591a\u4e2a\u5f00\u6e90\u540e\u7aef\u5f15\u64ce\uff0c\u652f\u6301\u5728\u4e0d\u540c\u82af\u7247\u5382\u5546\u95f4\u4e00\u81f4\u8fd0\u884c\u3002\u4e3b\u8981\u7279\u6027\u5305\u62ec\uff1a</p>", "a[href=\"workflow.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5de5\u4f5c\u6d41<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u4e0b\u56fe\u7b80\u8981\u5c55\u793a\u4e86\u5982\u4f55\u4f7f\u7528 FlagScale \u4ee5\u901a\u7528\u65b9\u5f0f\u8fd0\u884c\u8bad\u7ec3\u3001\u63a8\u7406\u3001\u670d\u52a1\u6216\u5f3a\u5316\u5b66\u4e60\u4efb\u52a1\u3002</p><p><a data-lightbox=\"image-set\" href=\"../_images/flagscale-workflow.png\">\n<img alt=\"alt text\" src=\"../_images/flagscale-workflow.png\"/></a>\n</p>", "a[href=\"#flagscale\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagScale \u6982\u89c8<a class=\"headerlink\" href=\"#flagscale\" title=\"Link to this heading\">#</a></h1><p>FlagScale \u662f <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> \u7684\u6838\u5fc3\u7ec4\u4ef6\u2014\u2014\u4e00\u4e2a\u7edf\u4e00\u7684\u5f00\u6e90 AI \u7cfb\u7edf\u8f6f\u4ef6\u6808\uff0c\u901a\u8fc7\u65e0\u7f1d\u96c6\u6210\u5404\u79cd\u6a21\u578b\u3001\u7cfb\u7edf\u548c\u82af\u7247\uff0c\u57f9\u80b2\u5f00\u653e\u6280\u672f\u751f\u6001\u3002\u9075\u5faa\u201d\u4e00\u6b21\u5f00\u53d1\uff0c\u8de8\u82af\u7247\u8fc1\u79fb\u201d\u7684\u539f\u5219\uff0cFlagOS \u65e8\u5728\u5145\u5206\u91ca\u653e\u786c\u4ef6\u7684\u8ba1\u7b97\u6f5c\u529b\uff0c\u6253\u7834\u4e0d\u540c\u82af\u7247\u8f6f\u4ef6\u6808\u4e4b\u95f4\u7684\u58c1\u5792\uff0c\u6709\u6548\u964d\u4f4e\u8fc1\u79fb\u6210\u672c\u3002</p><p>\u4f5c\u4e3a\u8be5\u751f\u6001\u7cfb\u7edf\u7684\u6838\u5fc3\u5de5\u5177\u96c6\uff0cFlagScale \u63d0\u4f9b\u7edf\u4e00\u63a5\u53e3\uff0c\u8986\u76d6\u5927\u8bed\u8a00\u6a21\u578b\u3001\u591a\u6a21\u6001\u6a21\u578b\u548c\u5177\u8eab\u667a\u80fd\u6a21\u578b\u7684\u5b8c\u6574\u751f\u547d\u5468\u671f\u3002\u5b83\u5728\u5355\u4e00\u914d\u7f6e\u548c CLI \u63a5\u53e3\u4e0b\u96c6\u6210\u4e86\u591a\u4e2a\u5f00\u6e90\u540e\u7aef\u5f15\u64ce\uff0c\u652f\u6301\u6a21\u578b\u8bad\u7ec3\u3001\u5f3a\u5316\u5b66\u4e60\u548c\u63a8\u7406\u7b49\u5173\u952e\u5de5\u4f5c\u6d41\u2014\u2014\u53ef\u5728\u4e0d\u540c\u82af\u7247\u5382\u5546\u95f4\u4e00\u81f4\u8fd0\u884c\u3002</p>"}
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
