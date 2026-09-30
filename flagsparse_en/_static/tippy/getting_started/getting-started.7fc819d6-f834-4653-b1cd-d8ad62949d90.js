selector_to_html = {"a[href=\"install.html#install-runtime-dependencies\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Install Runtime Dependencies<a class=\"headerlink\" href=\"#install-runtime-dependencies\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#getting-started-with-flagsparse\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with FlagSparse<a class=\"headerlink\" href=\"#getting-started-with-flagsparse\" title=\"Link to this heading\">#</a></h1>", "a[href=\"install.html#clone-and-install\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Clone and Install<a class=\"headerlink\" href=\"#clone-and-install\" title=\"Link to this heading\">#</a></h2><p>Use <code class=\"docutils literal notranslate\"><span class=\"pre\">--no-build-isolation</span></code> to avoid downloading build deps when offline.</p>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Install FlagSparse<a class=\"headerlink\" href=\"#install-flagsparse\" title=\"Link to this heading\">#</a></h1><h2>Clone and Install<a class=\"headerlink\" href=\"#clone-and-install\" title=\"Link to this heading\">#</a></h2><p>Use <code class=\"docutils literal notranslate\"><span class=\"pre\">--no-build-isolation</span></code> to avoid downloading build deps when offline.</p>", "a[href=\"install.html#verify-installation\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Verify Installation<a class=\"headerlink\" href=\"#verify-installation\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><h2>Hardware<a class=\"headerlink\" href=\"#hardware\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html#software\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Software<a class=\"headerlink\" href=\"#software\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html#hardware\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Hardware<a class=\"headerlink\" href=\"#hardware\" title=\"Link to this heading\">#</a></h2>"}
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
