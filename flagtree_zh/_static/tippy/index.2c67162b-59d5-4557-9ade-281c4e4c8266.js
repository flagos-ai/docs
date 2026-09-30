selector_to_html = {"a[href=\"FlagTree_overview/FlagTree-overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree \u6982\u8ff0<a class=\"headerlink\" href=\"#flagtree\" title=\"Link to this heading\">#</a></h1><p>FlagTree \u662f\u4e00\u4e2a\u9762\u5411\u591a\u79cd AI \u82af\u7247\u7684\u5f00\u6e90\u7edf\u4e00\u7f16\u8bd1\u5668\u3002FlagTree \u81f4\u529b\u4e8e\u4e3a\u591a\u6837\u5316\u7684 AI \u82af\u7247\u6784\u5efa\u7f16\u8bd1\u5668\u53ca\u76f8\u5173\u5de5\u5177\u5e73\u53f0\uff0c\u63a8\u8fdb\u548c\u6269\u5c55 Triton \u4e0a\u4e0b\u6e38\u751f\u6001\u7cfb\u7edf\uff0c\u76ee\u6807\u662f\u652f\u6301\u73b0\u6709\u9002\u914d\u65b9\u6848\u3001\u7edf\u4e00\u4ee3\u7801\u4ed3\u5e93\uff0c\u5e76\u4ece\u5355\u4e00\u4ed3\u5e93\u5b9e\u73b0\u5feb\u901f\u7684\u591a\u540e\u7aef\u652f\u6301\u3002\u5bf9\u4e8e\u4e0a\u6e38\u6a21\u578b\u7528\u6237\uff0cFlagTree \u63d0\u4f9b\u8de8\u591a\u4e2a\u540e\u7aef\u7684\u7edf\u4e00\u7f16\u8bd1\u652f\u6301\uff1b\u5bf9\u4e8e\u4e0b\u6e38\u82af\u7247\u5382\u5546\uff0cFlagTree \u63d0\u4f9b\u96c6\u6210\u5230 Triton \u751f\u6001\u7cfb\u7edf\u7684\u53c2\u8003\u5b9e\u73b0\u3002</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5f00\u59cb\u4f7f\u7528<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u5b89\u88c5\u548c\u8fd0\u884c FlagTree \u7684\u8981\u6c42\uff0c\u5e76\u6307\u5bfc\u60a8\u5b8c\u6210 FlagTree \u7684\u5b89\u88c5\u3002</p>", "a[href=\"#flagtree\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree \u6587\u6863<a class=\"headerlink\" href=\"#flagtree\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5f00\u59cb\u4f7f\u7528</span></a></p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u5982\u4f55\u4f7f\u7528 Hints\u3001TLE-Lite\u3001TLE-Struct \u548c TLE-Raw \u7f16\u8bd1\u5668\u8bed\u8a00\u6765\u4f18\u5316\u7f16\u8bd1\u3002\u5173\u4e8e\u5982\u4f55\u5728 Hints\u3001TLE-Lite\u3001TLE-Struct \u548c TLE-Raw \u4e4b\u95f4\u8fdb\u884c\u9009\u62e9\uff0c\u5efa\u8bae\u60a8\u5148\u9605\u8bfb <a class=\"reference internal\" href=\"FlagTree_overview/FlagTree-overview.html\"><span class=\"std std-doc\">FlagTree \u6982\u8ff0</span></a>\u3002</p>"}
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
