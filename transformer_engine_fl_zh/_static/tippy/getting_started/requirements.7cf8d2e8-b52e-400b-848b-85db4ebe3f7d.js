selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u8981\u6c42<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u652f\u6301\u7684\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>TransformerEngine-FL \u8bad\u7ec3\u5df2\u5728\u6c90\u66e6\u3001\u6d77\u5149\u3001\u6607\u817e\u4e0e\u5e73\u5934\u54e5 PPU \u4e0a\u5b8c\u6210\u7aef\u5230\u7aef\u9a8c\u8bc1\u3002\u5b8c\u6574\u6d41\u7a0b\u8bf7\u53c2\u89c1<a class=\"reference internal\" href=\"install.html\"><span class=\"std std-doc\">\u5b89\u88c5</span></a>\u3002</p>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5 TransformerEngine-FL<a class=\"headerlink\" href=\"#transformerengine-fl\" title=\"Link to this heading\">#</a></h1><p>\u672c\u6307\u5357\u4ecb\u7ecd\u5982\u4f55\u4ece\u9884\u6784\u5efa Docker \u955c\u50cf\u5f00\u59cb\u5b89\u88c5 TransformerEngine-FL\uff0c\u5e76\u901a\u8fc7\u4e00\u6b21\u7aef\u5230\u7aef Qwen3 \u8bad\u7ec3\u4efb\u52a1\u9a8c\u8bc1\u5b89\u88c5\u3002\u5b89\u88c5\u4ece Docker \u955c\u50cf\u5f00\u59cb\uff0c\u968f\u540e\u5728\u5bb9\u5668\u5185\u5b89\u88c5\u5404\u7ec4\u4ef6\u5305\u3002</p><p>\u6574\u4e2a\u6d41\u7a0b\u7ec4\u5408\u4f7f\u7528\u4ee5\u4e0b FlagOS \u7ec4\u4ef6\uff1a</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u64cd\u4f5c\u7cfb\u7edf<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>Linux\uff08\u5b98\u65b9\uff09\uff0cWSL2\uff08\u6709\u9650\u652f\u6301\uff09</p>", "a[href=\"#flagos\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FlagOS \u7ec4\u4ef6\u53ca\u7248\u672c<a class=\"headerlink\" href=\"#flagos\" title=\"Link to this heading\">#</a></h2><p>\u4e0e TransformerEngine-FL \u914d\u5957\u4f7f\u7528\u7684\u5b8c\u6574 FlagOS \u8f6f\u4ef6\u6808\uff0c\u4ee5\u53ca\u5404\u5e73\u53f0\u9a8c\u8bc1\u901a\u8fc7\u7684\u7248\u672c\uff1a</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u652f\u6301\u7684\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>TransformerEngine-FL \u8bad\u7ec3\u5df2\u5728\u6c90\u66e6\u3001\u6d77\u5149\u3001\u6607\u817e\u4e0e\u5e73\u5934\u54e5 PPU \u4e0a\u5b8c\u6210\u7aef\u5230\u7aef\u9a8c\u8bc1\u3002\u5b8c\u6574\u6d41\u7a0b\u8bf7\u53c2\u89c1<a class=\"reference internal\" href=\"install.html\"><span class=\"std std-doc\">\u5b89\u88c5</span></a>\u3002</p>"}
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
