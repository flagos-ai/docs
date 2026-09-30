selector_to_html = {"a[href=\"#release-notes\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Release Notes<a class=\"headerlink\" href=\"#release-notes\" title=\"Link to this heading\">#</a></h1><h2>v0.2.0<a class=\"headerlink\" href=\"#v0-2-0\" title=\"Link to this heading\">#</a></h2><p>This release expands sglang-plugin-FL\u2019s dispatch, platform configuration, and runtime configuration surface for <code class=\"docutils literal notranslate\"><span class=\"pre\">v0.1.0</span> <span class=\"pre\">\u2192</span> <span class=\"pre\">v0.2.0</span></code>.</p>", "a[href=\"#v0-1-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.1.0<a class=\"headerlink\" href=\"#v0-1-0\" title=\"Link to this heading\">#</a></h2><p>Initial release of sglang-plugin-FL.</p>", "a[href=\"#v0-2-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.2.0<a class=\"headerlink\" href=\"#v0-2-0\" title=\"Link to this heading\">#</a></h2><p>This release expands sglang-plugin-FL\u2019s dispatch, platform configuration, and runtime configuration surface for <code class=\"docutils literal notranslate\"><span class=\"pre\">v0.1.0</span> <span class=\"pre\">\u2192</span> <span class=\"pre\">v0.2.0</span></code>.</p>"}
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
