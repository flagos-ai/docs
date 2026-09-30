selector_to_html = {"a[href=\"#v0-1-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.1.0<a class=\"headerlink\" href=\"#v0-1-0\" title=\"Link to this heading\">#</a></h2><p>vllm-plugin-FL v0.1.0 requires <a class=\"reference external\" href=\"https://github.com/vllm-project/vllm/tree/v0.13.0\">vllm v0.13.0</a>. Supported platforms: NVIDIA, Ascend, T-Head, MetaX, Iluvatar.</p>", "a[href=\"#v0-2-2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.2.2<a class=\"headerlink\" href=\"#v0-2-2\" title=\"Link to this heading\">#</a></h2><p>vllm-plugin-FL v0.2.2 requires <a class=\"reference external\" href=\"https://github.com/vllm-project/vllm/tree/v0.20.2\">vllm v0.20.2</a>. Supported platforms: NVIDIA, Hygon DCU.</p>", "a[href=\"#release-notes\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Release Notes<a class=\"headerlink\" href=\"#release-notes\" title=\"Link to this heading\">#</a></h1><p>This section includes the vllm-plugin-FL release information.</p>", "a[href=\"#v0-3-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.3.0<a class=\"headerlink\" href=\"#v0-3-0\" title=\"Link to this heading\">#</a></h2><p>vllm-plugin-FL v0.3.0 requires <a class=\"reference external\" href=\"https://github.com/vllm-project/vllm/tree/v0.24.0\">vllm v0.24.0</a>.</p>"}
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
