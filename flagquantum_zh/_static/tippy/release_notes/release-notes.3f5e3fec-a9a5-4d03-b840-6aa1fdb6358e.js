selector_to_html = {"a[href=\"#v0-1-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.1.0<a class=\"headerlink\" href=\"#v0-1-0\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2026-06-24</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u53d1\u5e03\u8bf4\u660e<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>v0.2.0<a class=\"headerlink\" href=\"#v0-2-0\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2026-09-11</p>", "a[href=\"#v0-2-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.2.0<a class=\"headerlink\" href=\"#v0-2-0\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2026-09-11</p>"}
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
