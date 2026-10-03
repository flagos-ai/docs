selector_to_html = {"a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u4ece\u4e0b\u8f7d\u5f00\u6e90\u6a21\u578b\u6743\u91cd\u5230\u90e8\u7f72\u6267\u884c\u6a21\u578b\u7684\u901a\u7528\u6b65\u9aa4\u3002</p><p>FlagRelease \u7684\u8f93\u51fa\u5305\u62ec\u7ecf\u8fc7\u9a8c\u8bc1\u7684\u5927\u6a21\u578b\u6587\u4ef6\u548c\u96c6\u6210\u7684 FlagOS Docker \u955c\u50cf\u3002\u901a\u8fc7\u4f7f\u7528\u8fd9\u4e9b\u5236\u54c1\uff0c\u7528\u6237\u53ef\u4ee5\u5feb\u901f\u5728\u4e0d\u540c\u786c\u4ef6\u5e73\u53f0\u4e0a\u90e8\u7f72\u548c\u8fd0\u884c\u5927\u6a21\u578b\uff0c\u65e0\u9700\u81ea\u884c\u8fdb\u884c\u6a21\u578b\u8fc1\u79fb\u6216\u914d\u7f6e\u590d\u6742\u7684\u8f6f\u4ef6\u73af\u5883\u3002</p>", "a[href=\"#flagrelease\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagRelease \u6587\u6863<a class=\"headerlink\" href=\"#flagrelease\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5feb\u901f\u5f00\u59cb</span></a></p>", "a[href=\"FlagRelease_overview/FlagRelease-overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagRelease \u6982\u8ff0<a class=\"headerlink\" href=\"#flagrelease\" title=\"Link to this heading\">#</a></h1><p>FlagRelease \u662f\u4e00\u4e2a\u81f4\u529b\u4e8e\u8de8\u4e0d\u540c AI \u786c\u4ef6\u5e73\u53f0\u5b9e\u73b0\u5927\u6a21\u578b\u81ea\u52a8\u8fc1\u79fb\u3001\u9002\u914d\u548c\u53d1\u5e03\u7684\u5e73\u53f0\u3002</p><p>FlagRelease \u57fa\u4e8e\u7edf\u4e00\u5f00\u6e90\u7684 AI \u7cfb\u7edf\u8f6f\u4ef6\u6808 FlagOS \u6784\u5efa\uff0c\u63d0\u4f9b\u8de8\u786c\u4ef6\u9002\u914d\u80fd\u529b\u3002FlagRelease \u5efa\u7acb\u4e86\u4e00\u5957\u6807\u51c6\u5316\u7684\u6d41\u7a0b\uff0c\u652f\u6301\uff1a</p>", "a[href=\"model_list/model-list.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u6a21\u578b\u5217\u8868<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u5305\u542b\u901a\u8fc7 FlagRelease \u53d1\u5e03\u7684\u786c\u4ef6\u9002\u914d\u6a21\u578b\u3002</p>", "a[href=\"release_guide/release-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagRelease \u53d1\u5e03\u6307\u5357<a class=\"headerlink\" href=\"#flagrelease\" title=\"Link to this heading\">#</a></h1><h2>\u4ec0\u4e48\u662f FlagRelease<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>FlagRelease \u662f\u4e00\u5957\u81ea\u52a8\u5316\u6a21\u578b\u8bc4\u6d4b\u4e0e\u53d1\u5e03\u6d41\u6c34\u7ebf\uff0c\u53ef\u5728 NVIDIA\u3001\u6607\u817e\u3001\u6c90\u66e6\u3001\u6d77\u5149\u7b49 GPU \u5e73\u53f0\u4e0a\u5b8c\u6210\uff1a</p>"}
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
