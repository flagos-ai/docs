selector_to_html = {"a[href=\"#v5-4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v5.4<a class=\"headerlink\" href=\"#v5-4\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2026-09-28</p>", "a[href=\"#v2-2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v2.2<a class=\"headerlink\" href=\"#v2-2\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2025-04-17</p>", "a[href=\"#v5-3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v5.3<a class=\"headerlink\" href=\"#v5-3\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2026-06-24</p>", "a[href=\"#v5-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v5.0<a class=\"headerlink\" href=\"#v5-0\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2026-03-26</p>", "a[href=\"#v4-1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v4.1<a class=\"headerlink\" href=\"#v4-1\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2025-11-01</p>", "a[href=\"#v2-1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v2.1<a class=\"headerlink\" href=\"#v2-1\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2024-09-05</p>", "a[href=\"#v4-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v4.0<a class=\"headerlink\" href=\"#v4-0\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2025-10-31</p>", "a[href=\"#v3-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v3.0<a class=\"headerlink\" href=\"#v3-0\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2025-07-14</p>", "a[href=\"#v4-2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v4.2<a class=\"headerlink\" href=\"#v4-2\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2026-01-04</p>", "a[href=\"#v2-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v2.0<a class=\"headerlink\" href=\"#v2-0\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2024-05-31</p>", "a[href=\"#v1-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v1.0<a class=\"headerlink\" href=\"#v1-0\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2024-05-10</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u53d8\u66f4\u5386\u53f2<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>v5.4<a class=\"headerlink\" href=\"#v5-4\" title=\"Link to this heading\">#</a></h2><p><strong>\u53d1\u5e03\u65e5\u671f</strong>\uff1a2026-09-28</p>"}
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
