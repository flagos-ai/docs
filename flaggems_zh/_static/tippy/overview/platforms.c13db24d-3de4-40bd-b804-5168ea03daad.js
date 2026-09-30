selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u652f\u6301\u7684\u786c\u4ef6\u5e73\u53f0<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p><em>FlagGems</em> \u652f\u6301\u8d85\u8fc7 10 \u79cd\u4e0d\u540c\u540e\u7aef\u786c\u4ef6\u5e73\u53f0\u3002\u76ee\u524d\u652f\u6301\u7684\u5e73\u53f0\u53ca\u8fd9\u4e9b\u5e73\u53f0\u7684\u80fd\u529b\u5217\u4e3e\u5982\u4e0b\uff1a</p>"}
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
