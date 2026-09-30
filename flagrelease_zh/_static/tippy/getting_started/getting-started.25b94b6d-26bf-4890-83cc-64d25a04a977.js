selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u4ece\u4e0b\u8f7d\u5f00\u6e90\u6a21\u578b\u6743\u91cd\u5230\u90e8\u7f72\u6267\u884c\u6a21\u578b\u7684\u901a\u7528\u6b65\u9aa4\u3002</p><p>FlagRelease \u7684\u8f93\u51fa\u5305\u62ec\u7ecf\u8fc7\u9a8c\u8bc1\u7684\u5927\u6a21\u578b\u6587\u4ef6\u548c\u96c6\u6210\u7684 FlagOS Docker \u955c\u50cf\u3002\u901a\u8fc7\u4f7f\u7528\u8fd9\u4e9b\u5236\u54c1\uff0c\u7528\u6237\u53ef\u4ee5\u5feb\u901f\u5728\u4e0d\u540c\u786c\u4ef6\u5e73\u53f0\u4e0a\u90e8\u7f72\u548c\u8fd0\u884c\u5927\u6a21\u578b\uff0c\u65e0\u9700\u81ea\u884c\u8fdb\u884c\u6a21\u578b\u8fc1\u79fb\u6216\u914d\u7f6e\u590d\u6742\u7684\u8f6f\u4ef6\u73af\u5883\u3002</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u64cd\u4f5c\u6b65\u9aa4<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u901a\u7528\u6d41\u7a0b<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u901a\u7528\u6d41\u7a0b\u5982\u4e0b\uff1a</p>"}
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
