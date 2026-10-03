selector_to_html = {"a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8bbe\u5907\u6ce8\u518c<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u5bfc\u5165\u65f6\uff0cTorch-FL \u63a5\u7ba1 <code class=\"docutils literal notranslate\"><span class=\"pre\">PrivateUse1</span></code> dispatch key\uff0c\u5e76\u4ee5 <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> \u540d\u79f0\u53d1\u5e03\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u67b6\u6784<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>Torch-FL \u6ce8\u518c\u4e00\u4e2a PyTorch \u8bbe\u5907\uff0c\u5e76\u5bf9\u5230\u8fbe\u8be5\u8bbe\u5907\u7684\u6bcf\u4e2a\u7b97\u5b50\u8fdb\u884c\u8def\u7531\u3002</p><p><a data-lightbox=\"image-set\" href=\"../_images/torch-fl.png\">\n<img alt=\"Torch-FL \u67b6\u6784\" src=\"../_images/torch-fl.png\"/></a>\n</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5bfc\u5165\u671f\u9636\u6bb5<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">import</span> <span class=\"pre\">torch_fl</span></code> \u4f1a\u6267\u884c\u4e00\u4e32\u56fa\u5b9a\u7684\u526f\u4f5c\u7528\u5e8f\u5217\u3002\u8fd9\u4e9b\u6b65\u9aa4\u7684\u987a\u5e8f\u662f\u5173\u952e\u7684 \u2014\u2014 \u987a\u5e8f\u9519\u8bef\u4f1a\u5bfc\u81f4 <code class=\"docutils literal notranslate\"><span class=\"pre\">dlopen</span></code> \u4e2d\u6b62\u6216\u9009\u9519\u5382\u5546\u6784\u5efa\uff0c\u800c\u4e0d\u662f\u629b\u51fa Python \u5f02\u5e38 \u2014\u2014 \u56e0\u6b64\u96c6\u4e2d\u5728\u4e00\u5904\u7ba1\u7406\uff1a</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7ec4\u4ef6\u5e03\u5c40<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u5b50\u8c03\u5ea6<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2><p>\u7b97\u5b50\u5b9e\u73b0\u901a\u8fc7\u540c\u4e00\u4e2a dispatch key \u4e0e\u540c\u4e00\u5f20\u8def\u7531\u8868\u5230\u8fbe\uff1a</p>"}
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
