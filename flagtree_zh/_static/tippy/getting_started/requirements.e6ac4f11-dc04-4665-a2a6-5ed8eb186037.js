selector_to_html = {"a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7cfb\u7edf\u8f6f\u4ef6\u8981\u6c42<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u60a8\u53ef\u80fd\u9700\u8981\u4ee5\u4e0b\u7cfb\u7edf\u8f6f\u4ef6\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7cfb\u7edf\u8981\u6c42<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u5305\u542b\u4f7f\u7528 FlagTree \u7684\u8981\u6c42\uff0c\u5305\u62ec\u652f\u6301\u7684\u5e73\u53f0\u548c\u4f9d\u8d56\u9879\u3002\u53ea\u6709\u5728\u6ee1\u8db3\u6240\u6709\u8981\u6c42\u7684\u60c5\u51b5\u4e0b\uff0cFlagTree \u624d\u80fd\u6210\u529f\u5b89\u88c5\u548c\u8fd0\u884c\u3002</p>", "a[href=\"#triton\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u540e\u7aef\u3001Triton \u7248\u672c\u548c\u5206\u652f<a class=\"headerlink\" href=\"#triton\" title=\"Link to this heading\">#</a></h2><p>\u6bcf\u4e2a\u540e\u7aef\u57fa\u4e8e\u4e0d\u540c\u7248\u672c\u7684 Triton\uff0c\u56e0\u6b64\u4f4d\u4e8e\u4e0d\u540c\u7684\u53d7\u4fdd\u62a4\u5206\u652f\u4e2d\u3002\u6240\u6709\u8fd9\u4e9b\u53d7\u4fdd\u62a4\u5206\u652f\u5177\u6709\u540c\u7b49\u5730\u4f4d\u3002\u8868\u4e2d\u5217\u51fa\u7684\u6bcf\u4e2a\u540e\u7aef\u90fd\u914d\u5907\u4e86 CI/CD \u8fd0\u884c\u5668\u3002</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4e0d\u540c\u5206\u652f\u4e0a\u7684\u529f\u80fd\u7279\u6027<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>FlagTree \u7684\u6269\u5c55\u7ec4\u4ef6\u76ee\u524d\u5728\u67d0\u4e9b\u540e\u7aef\u4e0a\u53ef\u7528\uff1a</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u540e\u7aef\u96c6\u6210<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u4ee5\u4e0b\u540e\u7aef\u5df2\u96c6\u6210\u5230 FlagTree \u4e2d\u3002\u5bf9\u4e8e\u65b0\u5382\u5546\uff0c\u60a8\u53ef\u4ee5\u53c2\u8003\u4ee5\u4e0b\u4ee3\u7801\u94fe\u63a5\u8fdb\u884c\u96c6\u6210\uff1a</p>"}
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
