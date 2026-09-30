selector_to_html = {"a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-hardware-plugin \u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#verl-hardware-plugin\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u5b89\u88c5 verl-hardware-plugin \u7684\u8981\u6c42\uff0c\u5e76\u6307\u5bfc\u4f60\u5728\u4e0d\u540c\u786c\u4ef6\u5e73\u53f0\u4e0a\u5b8c\u6210\u5b89\u88c5\u3002</p>", "a[href=\"#verl-hardware-plugin\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-hardware-plugin \u6587\u6863<a class=\"headerlink\" href=\"#verl-hardware-plugin\" title=\"Link to this heading\">#</a></h1><p>verl-hardware-plugin \u4e3a <a class=\"reference external\" href=\"https://github.com/verl-project/verl\">verl</a> \u63d0\u4f9b\u591a\u82af\u7247\u786c\u4ef6\u5e73\u53f0\u4e0e\u8bad\u7ec3\u5f15\u64ce\u63d2\u4ef6\u3002\u5b83\u7531\u5b57\u8282\u8df3\u52a8 verl \u56e2\u961f\u4e0e <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a> \u793e\u533a\u8054\u5408\u5f00\u53d1\uff0c\u4f7f\u540c\u4e00\u4efd RL \u540e\u8bad\u7ec3\u4ee3\u7801\u80fd\u591f\u8fd0\u884c\u5728 NVIDIA\u3001\u6c90\u66e6 MetaX\u3001\u5929\u6570\u667a\u82af Iluvatar\u3001\u5bd2\u6b66\u7eaa MLU\u3001\u71e7\u539f Enflame\u3001Intel XPU \u7b49\u786c\u4ef6\u4e0a\u3002</p><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5feb\u901f\u5f00\u59cb</span></a></p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-hardware-plugin \u6982\u8ff0<a class=\"headerlink\" href=\"#verl-hardware-plugin\" title=\"Link to this heading\">#</a></h1><p>verl-hardware-plugin \u4e3a <a class=\"reference external\" href=\"https://github.com/verl-project/verl\">verl</a> RL \u540e\u8bad\u7ec3\u6846\u67b6\u63d0\u4f9b\u591a\u82af\u7247\u786c\u4ef6\u5e73\u53f0\u4e0e\u8bad\u7ec3\u5f15\u64ce\u7684<strong>\u53c2\u8003\u5b9e\u73b0</strong>\u3002\u5b83\u4e3a\u975e CUDA \u52a0\u901f\u5668\u63d0\u4f9b\u5e73\u53f0\u62bd\u8c61\u4e0e\u8bad\u7ec3\u5f15\u64ce\u6269\u5c55\uff0c\u5e76\u4f5c\u4e3a\u786c\u4ef6\u5382\u5546\u901a\u8fc7\u7edf\u4e00\u63d2\u4ef6\u63a5\u53e3\u5c06 verl \u9002\u914d\u5230\u81ea\u6709\u8bbe\u5907\u7684\u6a21\u677f\u4e0e\u793a\u4f8b\u3002</p><p>\u672c\u4ed3\u5e93\u7531\u5b57\u8282\u8df3\u52a8 verl \u56e2\u961f\u4e0e <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a> \u793e\u533a\u8054\u5408\u5f00\u53d1\u3002</p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u5982\u4f55\u4f7f\u7528 verl-hardware-plugin \u5728\u5404\u786c\u4ef6\u5e73\u53f0\u4e0a\u8fd0\u884c verl RL \u540e\u8bad\u7ec3\u4efb\u52a1\u3002</p>"}
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
