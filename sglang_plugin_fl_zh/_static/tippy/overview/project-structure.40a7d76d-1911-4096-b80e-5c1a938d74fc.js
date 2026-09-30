selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u9879\u76ee\u7ed3\u6784<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u5e73\u53f0 YAML \u6587\u4ef6\u4e3a\u68c0\u6d4b\u5230\u7684\u5e73\u53f0\u63d0\u4f9b\u9ed8\u8ba4\u8c03\u5ea6\u7b56\u7565\u3002\u5b83\u4eec\u4e0d\u662f\u5382\u5546\u9a8c\u8bc1\u77e9\u9635\u3002\u5382\u5546\u7279\u5b9a\u7684\u6846\u67b6\u9009\u62e9\u3001\u8fd0\u884c\u65f6\u955c\u50cf\u3001\u9a8c\u8bc1\u72b6\u6001\u3001\u5b89\u88c5\u547d\u4ee4\u548c\u9002\u914d\u6d41\u7a0b\u7edf\u4e00\u5728\u96c6\u4e2d\u5f0f\u9875\u9762\u7ef4\u62a4\uff1a<a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">\u96c6\u4e2d\u5f0f\u5382\u5546/\u6846\u67b6/\u955c\u50cf\u9009\u62e9\u9875\u9762</a>\u3002</p>"}
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
