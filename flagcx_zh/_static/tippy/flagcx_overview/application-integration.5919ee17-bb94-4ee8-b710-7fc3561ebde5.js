selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5e94\u7528\u96c6\u6210<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagCX \u4e0e\u4e0a\u5c42\u5e94\u7528\u5982 <a class=\"reference external\" href=\"https://pytorch.org/\">PyTorch</a> \u548c <a class=\"reference external\" href=\"https://github.com/PaddlePaddle/\">PaddlePaddle</a> \u96c6\u6210\u3002\n\u4e0b\u8868\u5217\u51fa\u4e86 FlagCX \u652f\u6301\u7684\u6846\u67b6\u53ca\u5176\u76f8\u5173\u901a\u4fe1\u64cd\u4f5c\uff0c\u5176\u4e2d <code class=\"docutils literal notranslate\"><span class=\"pre\">batch_XXX</span></code> \u548c <code class=\"docutils literal notranslate\"><span class=\"pre\">XXX_coalesced</span></code> \u64cd\u4f5c\u6307\u7684\u662f\u4f7f\u7528\u7ec4\u539f\u8bed\u3002</p>"}
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
