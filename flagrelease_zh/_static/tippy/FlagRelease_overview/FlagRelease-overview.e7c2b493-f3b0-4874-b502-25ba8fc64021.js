selector_to_html = {"a[href=\"#flagrelease\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagRelease \u6982\u8ff0<a class=\"headerlink\" href=\"#flagrelease\" title=\"Link to this heading\">#</a></h1><p>FlagRelease \u662f\u4e00\u4e2a\u81f4\u529b\u4e8e\u8de8\u4e0d\u540c AI \u786c\u4ef6\u5e73\u53f0\u5b9e\u73b0\u5927\u6a21\u578b\u81ea\u52a8\u8fc1\u79fb\u3001\u9002\u914d\u548c\u53d1\u5e03\u7684\u5e73\u53f0\u3002</p><p>FlagRelease \u57fa\u4e8e\u7edf\u4e00\u5f00\u6e90\u7684 AI \u7cfb\u7edf\u8f6f\u4ef6\u6808 FlagOS \u6784\u5efa\uff0c\u63d0\u4f9b\u8de8\u786c\u4ef6\u9002\u914d\u80fd\u529b\u3002FlagRelease \u5efa\u7acb\u4e86\u4e00\u5957\u6807\u51c6\u5316\u7684\u6d41\u7a0b\uff0c\u652f\u6301\uff1a</p>"}
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
