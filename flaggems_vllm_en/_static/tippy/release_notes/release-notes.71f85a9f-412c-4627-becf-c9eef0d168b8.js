selector_to_html = {"a[href=\"#v0-2-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.2.0<a class=\"headerlink\" href=\"#v0-2-0\" title=\"Link to this heading\">#</a></h2>", "a[href=\"../reference/operator_list.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Operator List<a class=\"headerlink\" href=\"#operator-list\" title=\"Link to this heading\">#</a></h1><p>This page lists the operators exported by FlagGems-vLLM, sourced from <code class=\"docutils literal notranslate\"><span class=\"pre\">src/flaggems_vllm/ops/__init__.py</span></code>.</p><p>FlagGems-vLLM provides optimized implementations of common vLLM operators using the Triton programming language. The following 109 operators are currently exported:</p>", "a[href=\"#release-notes\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Release Notes<a class=\"headerlink\" href=\"#release-notes\" title=\"Link to this heading\">#</a></h1><p>This section includes the release information for FlagGems-vLLM.</p>", "a[href=\"#v0-1-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.1.0<a class=\"headerlink\" href=\"#v0-1-0\" title=\"Link to this heading\">#</a></h2>"}
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
