selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u6027\u80fd\u6d4b\u8bd5\u6982\u89c8<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u4e0e\u539f\u751f\u7684 PyTorch \u5e93\u4e2d\u7684\u7b97\u5b50\u76f8\u6bd4\uff0c<em>FlagGems</em> \u7b97\u5b50\u4e00\u822c\u800c\u8a00\u80fd\u591f\u63d0\u4f9b\u66f4\u597d\u7684\u3001\n\u81f3\u5c11\u662f\u53ef\u6bd4\u8f83\u7684\u6027\u80fd\u3002\n\u6211\u4eec\u4f7f\u7528\u6765\u81ea Triton \u9879\u76ee\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">triton.testing.do_bench</span></code> \u6846\u67b6\u6765\u6267\u884c\u6027\u80fd\u57fa\u51c6\u6d4b\u8bd5\u3002\n\u4e0b\u56fe\u5c55\u793a\u7684\u5373\u662f\u6240\u83b7\u5f97\u7684\u5185\u6838\u6027\u80fd\u6570\u636e\u3002</p><p><a data-lightbox=\"image-set\" href=\"performance/_static/images/speedup-20251225.png\">\n<img alt=\"\u7b97\u5b50\u52a0\u901f\u6bd4\" src=\"performance/_static/images/speedup-20251225.png\"/></a>\n</p>", "a[href=\"benchmark.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagGems \u4e2d\u7684\u6027\u80fd\u57fa\u51c6\u6d4b\u8bd5<a class=\"headerlink\" href=\"#flaggems\" title=\"Link to this heading\">#</a></h1><p>\u6211\u4eec\u5efa\u8bae\u5f00\u53d1\u8005\u57fa\u4e8e\u4e0b\u9762\u7684\u8fc7\u7a0b\u6765\u4e3a\u65b0\u7684\u7b97\u5b50\u6dfb\u52a0\u6d4b\u8bd5\u7528\u4f8b\u3002\n\u8fd9\u4e9b\u6b65\u9aa4\u65e2\u9002\u7528\u4e8e Python \u5b9e\u73b0\u7684\u7b97\u5b50\uff0c\u4e5f\u9002\u7528\u4e8e C++ \u5c01\u88c5\u7684\u7b97\u5b50\u3002</p>"}
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
