selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagScale \u63d0\u4f9b\u7edf\u4e00\u5de5\u5177\u96c6\uff0c\u8986\u76d6\u5927\u8bed\u8a00\u6a21\u578b\u3001\u591a\u6a21\u6001\u6a21\u578b\u548c\u5177\u8eab\u667a\u80fd\u6a21\u578b\u7684\u5b8c\u6574\u751f\u547d\u5468\u671f\u3002\u5b83\u5728\u5355\u4e00\u914d\u7f6e\u548c CLI \u63a5\u53e3\u4e0b\u96c6\u6210\u4e86\u591a\u4e2a\u5f00\u6e90\u540e\u7aef\u5f15\u64ce\uff0c\u652f\u6301\u5728\u4e0d\u540c\u82af\u7247\u5382\u5546\u95f4\u4e00\u81f4\u8fd0\u884c\u3002\u4e3b\u8981\u7279\u6027\u5305\u62ec\uff1a</p>"}
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
