selector_to_html = {"a[href=\"requirements.html#hardware\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Hardware<a class=\"headerlink\" href=\"#hardware\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><h2>Hardware<a class=\"headerlink\" href=\"#hardware\" title=\"Link to this heading\">#</a></h2>", "a[href=\"install.html#verify-the-installation\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Verify the Installation<a class=\"headerlink\" href=\"#verify-the-installation\" title=\"Link to this heading\">#</a></h2><p>Device detection uses the available PyTorch device and Triton target. It can be overridden before importing the package:</p>", "a[href=\"requirements.html#software\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Software<a class=\"headerlink\" href=\"#software\" title=\"Link to this heading\">#</a></h2><p>PyTorch and the accelerator runtime are intentionally not hard dependencies, because the correct packages depend on the device and driver stack. Install them before FlagAttention.</p>", "a[href=\"install.html#clone-and-install\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Clone and Install<a class=\"headerlink\" href=\"#clone-and-install\" title=\"Link to this heading\">#</a></h2><p>Clone the repository and install FlagAttention with the Triton development extra:</p>", "a[href=\"install.html#build-a-wheel\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Build a Wheel<a class=\"headerlink\" href=\"#build-a-wheel\" title=\"Link to this heading\">#</a></h2><p>Packaging uses PEP 517 and setuptools-scm; there is no <code class=\"docutils literal notranslate\"><span class=\"pre\">setup.py</span></code>:</p>", "a[href=\"#getting-started-with-flagattention\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with FlagAttention<a class=\"headerlink\" href=\"#getting-started-with-flagattention\" title=\"Link to this heading\">#</a></h1>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Install FlagAttention<a class=\"headerlink\" href=\"#install-flagattention\" title=\"Link to this heading\">#</a></h1><h2>Clone and Install<a class=\"headerlink\" href=\"#clone-and-install\" title=\"Link to this heading\">#</a></h2><p>Clone the repository and install FlagAttention with the Triton development extra:</p>"}
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
