selector_to_html = {"a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4eae\u70b9<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flagscale-v2-1-0\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagScale v2.1.0 \u53d1\u5e03\u8bf4\u660e<a class=\"headerlink\" href=\"#flagscale-v2-1-0\" title=\"Link to this heading\">#</a></h1><h2>\u4eae\u70b9<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u591a\u5e73\u53f0\u9a8c\u8bc1<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u4e0e Megatron-LM-FL v0.3.0\u3001TransformerEngine-FL v0.3.0 \u4e00\u8d77\u5b8c\u6210\u7aef\u5230\u7aef\u9a8c\u8bc1\uff1a</p>", "a[href=\"../getting_started/multi-platform-training.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u591a\u5e73\u53f0\u8bad\u7ec3\u4e0e\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagScale \u672c\u8eab\u6ca1\u6709\u786c\u4ef6\u5e73\u53f0\u8981\u6c42\u2014\u2014\u5b83\u901a\u8fc7 FlagOS \u63d2\u4ef6\u6765\u7f16\u6392\u8bad\u7ec3\u3002\u672c\u6307\u5357\u4ecb\u7ecd\u5982\u4f55\u5728\u56db\u7c7b\u975e NVIDIA \u5e73\u53f0\uff08\u6c90\u66e6\u3001\u6d77\u5149\u3001\u6607\u817e\u3001\u5e73\u5934\u54e5\uff09\u4e0a\uff0c\u914d\u5408\u5e95\u5c42\u63d2\u4ef6\u6808\u8dd1\u901a\u4e00\u6b21\u7aef\u5230\u7aef\u8bad\u7ec3\u3002</p><p>\u5404\u5e73\u53f0\u63d2\u4ef6\u7684\u5b89\u88c5\u65b9\u5f0f\u89c1\u63d2\u4ef6\u6587\u6863\uff1a</p>"}
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
