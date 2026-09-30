selector_to_html = {"a[href=\"#verl-hardware-plugin\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-hardware-plugin \u6982\u8ff0<a class=\"headerlink\" href=\"#verl-hardware-plugin\" title=\"Link to this heading\">#</a></h1><p>verl-hardware-plugin \u4e3a <a class=\"reference external\" href=\"https://github.com/verl-project/verl\">verl</a> RL \u540e\u8bad\u7ec3\u6846\u67b6\u63d0\u4f9b\u591a\u82af\u7247\u786c\u4ef6\u5e73\u53f0\u4e0e\u8bad\u7ec3\u5f15\u64ce\u7684<strong>\u53c2\u8003\u5b9e\u73b0</strong>\u3002\u5b83\u4e3a\u975e CUDA \u52a0\u901f\u5668\u63d0\u4f9b\u5e73\u53f0\u62bd\u8c61\u4e0e\u8bad\u7ec3\u5f15\u64ce\u6269\u5c55\uff0c\u5e76\u4f5c\u4e3a\u786c\u4ef6\u5382\u5546\u901a\u8fc7\u7edf\u4e00\u63d2\u4ef6\u63a5\u53e3\u5c06 verl \u9002\u914d\u5230\u81ea\u6709\u8bbe\u5907\u7684\u6a21\u677f\u4e0e\u793a\u4f8b\u3002</p><p>\u672c\u4ed3\u5e93\u7531\u5b57\u8282\u8df3\u52a8 verl \u56e2\u961f\u4e0e <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a> \u793e\u533a\u8054\u5408\u5f00\u53d1\u3002</p>", "a[href=\"#verlverl-fl\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4e0e verl\u3001verl-FL \u7684\u5173\u7cfb<a class=\"headerlink\" href=\"#verlverl-fl\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u67b6\u6784<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u63d2\u4ef6\u901a\u8fc7\u4e24\u4e2a\u6ce8\u518c\u8868\u4e0e verl \u96c6\u6210\uff1a</p>", "a[href=\"features.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u786c\u4ef6\u65e0\u5173\u7684\u5e73\u53f0\u62bd\u8c61\u5c42<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u901a\u8fc7\u7edf\u4e00\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">PlatformBase</span></code> \u63a5\u53e3\uff0c\u5c06\u8bbe\u5907\u7ba1\u7406\u3001\u96c6\u5408\u901a\u4fe1\u3001\u5185\u5b58\u7ba1\u7406\u3001profiler\u3001rollout \u73af\u5883\u53d8\u91cf\u7b49\u786c\u4ef6\u76f8\u5173\u903b\u8f91\u62bd\u8c61\u4e3a\u6807\u51c6\u65b9\u6cd5\u3002\u5382\u5546\u53ea\u9700\u5b9e\u73b0\u4e00\u4e2a\u5e73\u53f0\u7c7b\u5e76\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">@PlatformRegistry.register</span></code> \u6ce8\u518c\uff0c\u5373\u53ef\u63a5\u5165 verl\u3002</p><p>\u5bf9\u4e8e\u6c90\u66e6\u3001\u5929\u6570\u667a\u82af\u7b49 CUDA \u517c\u5bb9\u786c\u4ef6\uff0c<code class=\"docutils literal notranslate\"><span class=\"pre\">torch.cuda.is_available()</span></code> \u5728\u591a\u79cd\u82af\u7247\u4e0a\u5747\u8fd4\u56de True\u3002\u5e73\u53f0\u5c42\u5f15\u5165 <code class=\"docutils literal notranslate\"><span class=\"pre\">vendor_name</span></code> \u6807\u8bc6\u4e0e\u57fa\u4e8e SMI \u547d\u4ee4\u7684\u786c\u4ef6\u63a2\u6d4b\uff08\u5982\u6c90\u66e6\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">mx-smi</span></code>\u3001\u5929\u6570\u667a\u82af\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">ixsmi</span></code>\uff09\uff0c\u5728\u9996\u6b21\u81ea\u52a8\u68c0\u6d4b\u65f6\u533a\u5206\u5b9e\u9645\u786c\u4ef6\uff0c\u907f\u514d\u8bef\u5339\u914d\u5230 NVIDIA \u5f15\u64ce\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u652f\u6301\u7684\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>"}
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
