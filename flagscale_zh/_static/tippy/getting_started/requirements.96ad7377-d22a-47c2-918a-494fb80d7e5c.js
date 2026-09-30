selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u8981\u6c42<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u5305\u542b\u786c\u4ef6\u5e73\u53f0\u548c\u6a21\u578b\u7684\u76f8\u5173\u4fe1\u606f\u3002</p>", "a[href=\"multi-platform-training.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u591a\u5e73\u53f0\u8bad\u7ec3\u4e0e\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagScale \u672c\u8eab\u6ca1\u6709\u786c\u4ef6\u5e73\u53f0\u8981\u6c42\u2014\u2014\u5b83\u901a\u8fc7 FlagOS \u63d2\u4ef6\u6765\u7f16\u6392\u8bad\u7ec3\u3002\u672c\u6307\u5357\u4ecb\u7ecd\u5982\u4f55\u5728\u56db\u7c7b\u975e NVIDIA \u5e73\u53f0\uff08\u6c90\u66e6\u3001\u6d77\u5149\u3001\u6607\u817e\u3001\u5e73\u5934\u54e5\uff09\u4e0a\uff0c\u914d\u5408\u5e95\u5c42\u63d2\u4ef6\u6808\u8dd1\u901a\u4e00\u6b21\u7aef\u5230\u7aef\u8bad\u7ec3\u3002</p><p>\u5404\u5e73\u53f0\u63d2\u4ef6\u7684\u5b89\u88c5\u65b9\u5f0f\u89c1\u63d2\u4ef6\u6587\u6863\uff1a</p>", "a[href=\"#id5\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u670d\u52a1 / \u63a8\u7406<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h3><p>\u5b8c\u6574\u5217\u8868\u8bf7\u53c2\u89c1 https://github.com/flagos-ai/FlagScale/tree/main/examples</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u652f\u6301\u7684\u6a21\u578b<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><h3>\u8bad\u7ec3<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id4\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u8bad\u7ec3<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u786c\u4ef6\u5e73\u53f0<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>FlagScale \u8bbe\u8ba1\u4e3a\u4e0e FlagOS \u63d2\u4ef6\u534f\u540c\u5de5\u4f5c\u3002\u867d\u7136 FlagScale \u672c\u8eab\u6ca1\u6709\u786c\u4ef6\u5e73\u53f0\u8981\u6c42\uff0c\u4f46\u60a8\u5e94\u67e5\u770b\u8ba1\u5212\u4f7f\u7528\u7684\u5177\u4f53 FlagOS \u63d2\u4ef6\u7684\u786c\u4ef6\u8981\u6c42\u3002\u6709\u5173\u66f4\u591a\u4fe1\u606f\uff0c\u8bf7\u53c2\u89c1 <a class=\"reference external\" href=\"https://github.com/flagos-ai/Megatron-LM-FL\">Megatron-LM-FL</a>\u3001<a class=\"reference external\" href=\"https://github.com/flagos-ai/TransformerEngine-FL\">TransformerEngine-FL</a>\u3001<a class=\"reference external\" href=\"https://github.com/flagos-ai/verl-FL\">VeRL-FL</a> \u548c <a class=\"reference external\" href=\"https://github.com/flagos-ai/vllm-plugin-FL\">vllm-plugin-FL</a>\u3002</p><p>\u8bad\u7ec3\u5df2\u5728\u4ee5\u4e0b\u5e73\u53f0\u4e0a\u4e0e Megatron-LM-FL\u3001TransformerEngine-FL \u4e00\u8d77\u5b8c\u6210\u7aef\u5230\u7aef\u9a8c\u8bc1\uff1a</p>"}
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
