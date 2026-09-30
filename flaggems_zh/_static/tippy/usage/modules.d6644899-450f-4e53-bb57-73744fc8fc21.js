selector_to_html = {"a[href=\"#flaggems\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528 FlagGems \u6a21\u5757\u6784\u9020\u81ea\u5df1\u7684\u6a21\u578b<a class=\"headerlink\" href=\"#flaggems\" title=\"Link to this heading\">#</a></h1><p>\u5728\u67d0\u4e9b\u4f7f\u7528\u573a\u666f\u4e2d\uff0c\u7528\u6237\u53ef\u80fd\u5e0c\u671b\u4ece\u5934\u6784\u5efa\u81ea\u5df1\u7684 AI \u6a21\u578b\uff0c\n\u6216\u8005\u5bf9\u73b0\u6709\u7684\u6a21\u578b\u8fdb\u884c\u9002\u914d\uff0c\u4ee5\u66f4\u597d\u5730\u6ee1\u8db3\u81ea\u5df1\u7684\u7279\u5b9a\u4f7f\u7528\u573a\u666f\u3002\n\u4e3a\u4e86\u652f\u6301\u8fd9\u79cd\u9700\u6c42\uff0c<em>FlagGems</em> \u63d0\u4f9b\u4e00\u4e2a\u4e0d\u65ad\u589e\u957f\u7684\u9ad8\u6027\u80fd\u6a21\u5757\u96c6\u5408\uff0c\n\u8fd9\u4e9b\u6a21\u5757\u5728\u5927\u8bed\u8a00\u6a21\u578b\uff08LLM\uff09\u4e2d\u4f7f\u7528\u5f88\u666e\u904d\u3002</p><p>\u8fd9\u4e9b\u7ec4\u4ef6\u662f\u4f7f\u7528 <em>FlagGems</em> \u52a0\u901f\u8fc7\u7684\u7b97\u5b50\u5b9e\u73b0\u7684\uff0c\u53ef\u4ee5\u50cf\u4f60\u4f7f\u7528\u6807\u51c6\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.nn.Module</span></code>\n\u4e00\u6837\u4f7f\u7528\u3002\u4f60\u53ef\u4ee5\u5c06\u5b83\u4eec\u65e0\u7f1d\u96c6\u6210\u5230\u81ea\u5df1\u7684\u7cfb\u7edf\u91cd\uff0c\u5728\u4e0d\u9700\u8981\u7f16\u5199\u5b9a\u5236\u7684 CUDA\n\u4ee3\u7801\u6216\u8005 Triton \u4ee3\u7801\u7684\u524d\u63d0\u4e0b\uff0c\u4ece\u5185\u6838\u7ea7\u7684\u52a0\u901f\u4e2d\u83b7\u76ca\u3002</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u53ef\u7528\u7684\u6a21\u5757<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u6211\u4eec\u9f13\u52b1\u7528\u6237\u5c06\u8fd9\u4e9b\u6a21\u5757\u4f5c\u4e3a\u7b49\u4ef7 PyTorch \u5c42\u7684\u66ff\u6362\u65b9\u6848\u3002\n\u56e2\u961f\u6b63\u5728\u5f00\u53d1\u878d\u5408\u7684\u6ce8\u610f\u529b\u673a\u5236\u3001MoE \u5c42\u4ee5\u53ca Transformer \u5757\u7b49\u6a21\u5757\u3002</p>"}
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
