selector_to_html = {"a[href=\"#v0-3-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.3.0<a class=\"headerlink\" href=\"#v0-3-0\" title=\"Link to this heading\">#</a></h2><p>Megatron-LM-FL v0.3.0 synchronizes with upstream Megatron-LM v0.18.2 and requires Python &gt;= 3.12.</p>", "a[href=\"#v0-1-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.1.0<a class=\"headerlink\" href=\"#v0-1-0\" title=\"Link to this heading\">#</a></h2><p>Initial release of Megatron-LM-FL.</p>", "a[href=\"#release-notes\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Release Notes<a class=\"headerlink\" href=\"#release-notes\" title=\"Link to this heading\">#</a></h1><p>This section includes the Megatron-LM-FL release information.</p>", "a[href=\"#v0-2-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.2.0<a class=\"headerlink\" href=\"#v0-2-0\" title=\"Link to this heading\">#</a></h2>"}
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
