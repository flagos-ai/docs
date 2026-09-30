selector_to_html = {"a[href=\"#verl-fl\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-FL \u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#verl-fl\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd verl-FL \u7684\u5b89\u88c5\u8981\u6c42\uff0c\u5e76\u6307\u5bfc\u60a8\u5728\u4e0d\u540c\u786c\u4ef6\u5e73\u53f0\u4e0a\u5b89\u88c5 verl-FL\u3002</p>", "a[href=\"requirements.html#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8f6f\u4ef6<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u73af\u5883\u8981\u6c42<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u652f\u6301\u7684\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u64cd\u4f5c\u7cfb\u7edf<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>Linux\uff08\u5b98\u65b9\uff09</p>", "a[href=\"install.html#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6e90\u7801\u5b89\u88c5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><h3>\u524d\u7f6e\u6761\u4ef6<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h3><p>\u8bf7\u786e\u4fdd\u5df2\u5b89\u88c5\u6240\u9700\u7684\u8f6f\u4ef6\u4f9d\u8d56\u3002\u8be6\u89c1<a class=\"reference internal\" href=\"requirements.html\"><span class=\"std std-doc\">\u73af\u5883\u8981\u6c42</span></a>\u3002</p>", "a[href=\"requirements.html#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u652f\u6301\u7684\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html#flagos\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FlagOS \u4f9d\u8d56<a class=\"headerlink\" href=\"#flagos\" title=\"Link to this heading\">#</a></h2>", "a[href=\"install.html#docker\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Docker \u955c\u50cf\uff08\u63a8\u8350\uff09<a class=\"headerlink\" href=\"#docker\" title=\"Link to this heading\">#</a></h2><p>\u5404\u5e73\u53f0\u63d0\u4f9b\u9884\u6784\u5efa\u7684 Docker \u955c\u50cf\uff1a</p>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5b89\u88c5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>Docker \u955c\u50cf\uff08\u63a8\u8350\uff09<a class=\"headerlink\" href=\"#docker\" title=\"Link to this heading\">#</a></h2><p>\u5404\u5e73\u53f0\u63d0\u4f9b\u9884\u6784\u5efa\u7684 Docker \u955c\u50cf\uff1a</p>"}
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
