selector_to_html = {"a[href=\"#sglang\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b2c\u4e8c\u5c42 \u2014 SGLang \u878d\u5408\u5185\u6838<a class=\"headerlink\" href=\"#sglang\" title=\"Link to this heading\">#</a></h2><p>\u901a\u8fc7 HookRegistry AROUND \u94a9\u5b50\u62e6\u622a SGLang \u7684\u81ea\u5b9a\u4e49\u878d\u5408\u7b97\u5b50\uff0c\u7ecf\u8fc7\u6807\u51c6\u5316\u8c03\u5ea6\u7cfb\u7edf\uff08\u4e0e vllm-plugin-FL \u5bf9\u9f50\uff09\u8fdb\u884c\u8def\u7531\uff0c\u4ee5\u9009\u62e9\u6700\u4f73\u53ef\u7528\u540e\u7aef\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u529f\u80fd\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>SGLang \u7684\u63a8\u7406\u5f15\u64ce\u4f9d\u8d56 NVIDIA \u4e13\u7528\u7ec4\u4ef6\uff1aflashinfer \u7528\u4e8e\u6ce8\u610f\u529b\u8ba1\u7b97\uff0csgl_kernel \u7528\u4e8e\u878d\u5408 CUDA \u5185\u6838\uff0cNCCL \u7528\u4e8e\u5206\u5e03\u5f0f\u901a\u4fe1\u3002\u5728\u5176\u4ed6\u786c\u4ef6\uff08\u534e\u4e3a\u6607\u817e\u3001\u5bd2\u6b66\u7eaa MLU\u3001Iluvatar \u7b49\uff09\u4e0a\u8fd0\u884c\u539f\u672c\u9700\u8981\u5bf9\u6e90\u7801\u8fdb\u884c\u4fb5\u5165\u5f0f\u4fee\u6539\u3002</p><p>\u672c\u63d2\u4ef6\u901a\u8fc7\u4e09\u4e2a\u5c42\u6b21\u7684\u66ff\u6362\u4e0e\u6269\u5c55\u63d0\u4f9b\u975e\u4fb5\u5165\u5f0f\u9002\u914d\u5c42\uff1a</p>", "a[href=\"#aten\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b2c\u4e00\u5c42 \u2014 ATen \u7b97\u5b50<a class=\"headerlink\" href=\"#aten\" title=\"Link to this heading\">#</a></h2><p>\u901a\u8fc7 PyTorch \u7684\u8c03\u5ea6\u673a\u5236\uff0c\u7528 FlagGems Triton \u5185\u6838\u66ff\u6362 PyTorch \u7684\u4f4e\u7ea7\u7b97\u5b50\uff08matmul\u3001softmax\u3001embedding \u7b49\uff09\u3002\u5f53\u8c03\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems.enable()</span></code> \u65f6\uff0cPyTorch \u8c03\u5ea6\u8868\u4f1a\u4e3a ATen \u7b97\u5b50\u6ce8\u518c Triton \u5185\u6838\uff0c\u65e0\u9700\u4fee\u6539\u4ee3\u7801\u5373\u53ef\u63d0\u4f9b\u786c\u4ef6\u52a0\u901f\u5b9e\u73b0\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b2c\u4e09\u5c42 \u2014 \u5206\u5e03\u5f0f\u901a\u4fe1<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u7528 CommunicatorFL\uff08\u57fa\u4e8e FlagCX \u6216 torch.distributed\uff09\u66ff\u6362\u57fa\u4e8e NCCL \u7684\u96c6\u5408\u901a\u4fe1\uff0c\u4ece\u800c\u5728\u4e0d\u540c\u786c\u4ef6\u540e\u7aef\u4e0a\u652f\u6301\u591a\u5361\u63a8\u7406\u3002\u652f\u6301 all_reduce\u3001all_gather\u3001reduce_scatter\u3001send \u548c recv \u64cd\u4f5c\uff0c\u5e76\u652f\u6301\u5e73\u53f0\u611f\u77e5\u7684\u540e\u7aef\u9009\u62e9\u548c\u6d41\u6c34\u7ebf\u5e76\u884c\u901a\u4fe1\u3002</p><p><a data-lightbox=\"image-set\" href=\"../_images/sglang-plugin-fl-arch.png\">\n<img alt=\"alt text\" src=\"../_images/sglang-plugin-fl-arch.png\"/></a>\n</p>"}
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
