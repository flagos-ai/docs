selector_to_html = {"a[href=\"#sglang-plugin-fl\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5 sglang-plugin-FL<a class=\"headerlink\" href=\"#sglang-plugin-fl\" title=\"Link to this heading\">#</a></h1><h2>\u8fd0\u884c\u65f6\u955c\u50cf\u4e0e\u5e73\u53f0\u8f6f\u4ef6\u5305<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u7279\u5b9a\u5382\u5546\u7684\u6846\u67b6\u9009\u62e9\u3001\u8fd0\u884c\u65f6\u955c\u50cf\u3001\u9a8c\u8bc1\u72b6\u6001\u3001\u5b89\u88c5\u547d\u4ee4\u548c\u9002\u914d\u6d41\u7a0b\u7edf\u4e00\u7ef4\u62a4\u5728\u96c6\u4e2d\u9875\u9762\uff1a<a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">\u5382\u5546/\u6846\u67b6/\u955c\u50cf\u9009\u62e9\u96c6\u4e2d\u9875\u9762</a>\u3002\u5b89\u88c5\u6216\u542f\u52a8 sglang-plugin-FL \u524d\uff0c\u8bf7\u4f7f\u7528\u8be5\u9875\u9762\u9009\u62e9\u5382\u5546\u3001\u6846\u67b6\u548c\u955c\u50cf\u3002</p><p>\u672c\u9875\u9762\u6709\u610f\u4e0d\u518d\u7ef4\u62a4\u5b8c\u6574\u955c\u50cf\u77e9\u9635\u6216\u5e73\u53f0\u4e13\u5c5e\u8f6f\u4ef6\u5305\u914d\u65b9\u3002</p>", "a[href=\"#empty-mode\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Empty mode<a class=\"headerlink\" href=\"#empty-mode\" title=\"Link to this heading\">#</a></h2><p>Empty mode \u662f\u4e00\u79cd\u5b89\u88c5/\u8fd0\u884c\u65f6\u7ec4\u88c5\u673a\u5236\uff0c\u9002\u7528\u4e8e\u4ee5 CUDA \u4e3a\u5bfc\u5411\u7684 SGLang \u4f9d\u8d56\u6808\u5e76\u975e\u76ee\u6807\u90e8\u7f72\u73af\u5883\u7684\u5e73\u53f0\u3002\u5b83\u907f\u514d\u5c06 CUDA \u8f6f\u4ef6\u5305\u89c6\u4e3a\u901a\u7528\u4f9d\u8d56\u96c6\uff0c\u4f46\u5b83<strong>\u4e0d\u662f</strong>\u65e0\u8bbe\u5907\u6a21\u5f0f\u3002</p><p>\u76ee\u6807\u5e73\u53f0\u4ecd\u9700\u63d0\u4f9b\uff1a</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8fd0\u884c\u65f6\u955c\u50cf\u4e0e\u5e73\u53f0\u8f6f\u4ef6\u5305<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u7279\u5b9a\u5382\u5546\u7684\u6846\u67b6\u9009\u62e9\u3001\u8fd0\u884c\u65f6\u955c\u50cf\u3001\u9a8c\u8bc1\u72b6\u6001\u3001\u5b89\u88c5\u547d\u4ee4\u548c\u9002\u914d\u6d41\u7a0b\u7edf\u4e00\u7ef4\u62a4\u5728\u96c6\u4e2d\u9875\u9762\uff1a<a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">\u5382\u5546/\u6846\u67b6/\u955c\u50cf\u9009\u62e9\u96c6\u4e2d\u9875\u9762</a>\u3002\u5b89\u88c5\u6216\u542f\u52a8 sglang-plugin-FL \u524d\uff0c\u8bf7\u4f7f\u7528\u8be5\u9875\u9762\u9009\u62e9\u5382\u5546\u3001\u6846\u67b6\u548c\u955c\u50cf\u3002</p><p>\u672c\u9875\u9762\u6709\u610f\u4e0d\u518d\u7ef4\u62a4\u5b8c\u6574\u955c\u50cf\u77e9\u9635\u6216\u5e73\u53f0\u4e13\u5c5e\u8f6f\u4ef6\u5305\u914d\u65b9\u3002</p>"}
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
