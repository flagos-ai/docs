selector_to_html = {"a[href=\"platform-abstraction.html#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5f15\u64ce\u63d2\u4ef6\u67b6\u6784<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u8bad\u7ec3\u5f15\u64ce\u53ef\u6309\u8bbe\u5907\u63d2\u62d4\u6ce8\u518c\uff1a</p>", "a[href=\"#verl-fl\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-FL \u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#verl-fl\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u63d0\u4f9b\u4f7f\u7528 verl-FL \u5728\u4e0d\u540c\u786c\u4ef6\u5e73\u53f0\u4e0a\u8fdb\u884c\u7aef\u5230\u7aef GRPO \u8bad\u7ec3\u7684\u8be6\u7ec6\u6307\u5bfc\u3002</p>", "a[href=\"platform-abstraction.html#id7\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u65b0\u589e\u540e\u7aef<a class=\"headerlink\" href=\"#id7\" title=\"Link to this heading\">#</a></h2><p>\u5e26\u5b8c\u6574\u6ce8\u91ca\u7684\u6a21\u677f\u89c1\u4ed3\u5e93\u4e2d\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">verl/plugin/platform/README.md</span></code>\u3002</p>", "a[href=\"platform-abstraction.html#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5e73\u53f0\u62bd\u8c61\u5c42<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u62bd\u8c61\u5c42\u4f4d\u4e8e <code class=\"docutils literal notranslate\"><span class=\"pre\">verl/plugin/platform/</span></code>\uff0c\u91c7\u7528\u7b56\u7565\u6a21\u5f0f\uff1a</p>", "a[href=\"platform-abstraction.html#flagcx\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u57fa\u4e8e FlagCX \u7684\u5f02\u6784\u8bad\u7ec3<a class=\"headerlink\" href=\"#flagcx\" title=\"Link to this heading\">#</a></h2><p><a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagCX\">FlagCX</a> \u662f\u7edf\u4e00\u7684\u8de8\u5382\u5546\u901a\u4fe1\u540e\u7aef\u3002\u5b83\u5141\u8bb8\u540c\u4e00\u96c6\u7fa4\u6df7\u7528\u52a0\u901f\u5668\uff1aNVIDIA \u8282\u70b9\u8fd0\u884c actor/critic\uff08FSDP\uff09\uff0c\u6469\u5c14\u7ebf\u7a0b MUSA \u8282\u70b9\u8fd0\u884c rollout\uff08vLLM\uff09\uff0c\u6743\u91cd\u540c\u6b65\u4e0e\u8bbe\u5907\u9694\u79bb\u901a\u8fc7 Ray \u8fd0\u884c\u65f6\u4e0a\u4e0b\u6587\u5b8c\u6210\u3002</p>", "a[href=\"platform-abstraction.html#id6\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u9a8c\u8bc1\u901a\u8fc7\u7684\u8868\u73b0<a class=\"headerlink\" href=\"#id6\" title=\"Link to this heading\">#</a></h2>", "a[href=\"platform-abstraction.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5e73\u53f0\u62bd\u8c61\u4e0e\u591a\u82af\u7247\u8bad\u7ec3<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>verl-FL \u7528\u5e73\u53f0\u62bd\u8c61\u5c42\u66ff\u4ee3\u4e86\u4e0a\u6e38 verl \u4e2d\u786c\u7f16\u7801\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.cuda</span></code> \u8c03\u7528\uff0c\u5e76\u96c6\u6210 FlagOS \u8bad\u7ec3\u5f15\u64ce\uff0c\u4f7f\u540c\u4e00\u4efd RL \u540e\u8bad\u7ec3\u811a\u672c\u53ef\u8fd0\u884c\u5728 NVIDIA\u3001\u534e\u4e3a\u6607\u817e\u3001\u6c90\u66e6 MetaX\uff08MACA\uff09\u3001\u6469\u5c14\u7ebf\u7a0b MUSA \u4e0e CPU \u4e0a\u3002\u672c\u9875\u4ecb\u7ecd\u8be5\u62bd\u8c61\u5c42\u3001\u5f15\u64ce\u63d2\u4ef6\u4ee5\u53ca\u5df2\u9a8c\u8bc1\u7684\u7aef\u5230\u7aef\u6d41\u7a0b\u3002</p>"}
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
