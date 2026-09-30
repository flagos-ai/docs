selector_to_html = {"a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u64cd\u4f5c\u7cfb\u7edf<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>Linux\uff08\u5b98\u65b9\u652f\u6301\uff09\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u652f\u6301\u7684\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8f6f\u4ef6<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u5404\u5e73\u53f0\u7684\u8f6f\u4ef6\u6808\uff08\u5382\u5546\u9a71\u52a8\u3001\u56fa\u4ef6\u3001<code class=\"docutils literal notranslate\"><span class=\"pre\">torch_mlu</span></code> \u7b49 torch \u6269\u5c55\uff0c\u4ee5\u53ca CNCL/MCCL/IXCCL \u7b49\u901a\u4fe1\u5e93\uff09\u7531\u76f8\u5e94\u786c\u4ef6\u5382\u5546\u63d0\u4f9b\u3002\u7ec6\u8282\u89c1\u5404\u5e73\u53f0\u5b89\u88c5\u6307\u5357\u3002</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u8981\u6c42<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u652f\u6301\u7684\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>"}
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
