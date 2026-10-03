selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u53d1\u5e03\u8bf4\u660e<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u5305\u542b Torch-FL \u7684\u53d1\u5e03\u4fe1\u606f\u3002</p>", "a[href=\"#v2-10-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v2.10.0<a class=\"headerlink\" href=\"#v2-10-0\" title=\"Link to this heading\">#</a></h2><p>Torch-FL \u4f5c\u4e3a FlagOS \u4e00\u90e8\u5206\u7684\u521d\u59cb\u7248\u672c\u3002</p>"}
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
