selector_to_html = {"a[href=\"#v0-1-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.1.0<a class=\"headerlink\" href=\"#v0-1-0\" title=\"Link to this heading\">#</a></h2><p>Megatron-LM-FL \u521d\u59cb\u7248\u672c\u3002</p>", "a[href=\"#v0-3-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.3.0<a class=\"headerlink\" href=\"#v0-3-0\" title=\"Link to this heading\">#</a></h2><p>Megatron-LM-FL v0.3.0 \u5df2\u540c\u6b65\u4e0a\u6e38 Megatron-LM v0.18.2\uff0c\u8981\u6c42 Python &gt;= 3.12\u3002</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u53d1\u5e03\u8bf4\u660e<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u5305\u542b Megatron-LM-FL \u7684\u53d1\u5e03\u4fe1\u606f\u3002</p>", "a[href=\"#v0-2-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.2.0<a class=\"headerlink\" href=\"#v0-2-0\" title=\"Link to this heading\">#</a></h2>"}
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
