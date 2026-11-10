selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u53d1\u5e03\u8bf4\u660e<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagPrism \u662f FlagTree \u9762\u5411 Triton \u7a0b\u5e8f\u7684\u8c03\u8bd5\u4e0e\u6027\u80fd\u5206\u6790\u5de5\u5177\u5957\u4ef6\uff0c\u901a\u8fc7 <code class=\"docutils literal notranslate\"><span class=\"pre\">third_party/FlagPrism</span></code> \u5b50\u6a21\u5757\u968f FlagTree wheel \u4e00\u8d77\u4ea4\u4ed8\uff0c\u4e0d\u5355\u72ec\u53d1\u5e03\u8c03\u8bd5\u5668/\u6027\u80fd\u5206\u6790\u5668 wheel\u3002</p>"}
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
