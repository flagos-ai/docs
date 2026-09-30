selector_to_html = {"a[href=\"#custom-directives\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Custom Directives<a class=\"headerlink\" href=\"#custom-directives\" title=\"Link to this heading\">#</a></h2><h3>operator-list<a class=\"headerlink\" href=\"#operator-list\" title=\"Link to this heading\">#</a></h3><p>Generate operator table from <code class=\"docutils literal notranslate\"><span class=\"pre\">conf/operators.yaml</span></code>:</p>", "a[href=\"#directory-structure\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Directory Structure<a class=\"headerlink\" href=\"#directory-structure\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#live-preview\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Live Preview<a class=\"headerlink\" href=\"#live-preview\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#readthedocs-configuration\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ReadTheDocs Configuration<a class=\"headerlink\" href=\"#readthedocs-configuration\" title=\"Link to this heading\">#</a></h2><p>Copy the example config to repository root:</p>", "a[href=\"#quick-start\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Quick Start<a class=\"headerlink\" href=\"#quick-start\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flaggems-sphinx-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagGems Sphinx Documentation<a class=\"headerlink\" href=\"#flaggems-sphinx-documentation\" title=\"Link to this heading\">#</a></h1><p>This directory contains the Sphinx/MyST documentation for FlagGems.</p>", "a[href=\"#operator-list\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">operator-list<a class=\"headerlink\" href=\"#operator-list\" title=\"Link to this heading\">#</a></h3><p>Generate operator table from <code class=\"docutils literal notranslate\"><span class=\"pre\">conf/operators.yaml</span></code>:</p>"}
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
