selector_to_html = {"a[href=\"#required-dependencies\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Required dependencies<a class=\"headerlink\" href=\"#required-dependencies\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#optional-dependencies\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Optional dependencies<a class=\"headerlink\" href=\"#optional-dependencies\" title=\"Link to this heading\">#</a></h3>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Install FlagFFT<a class=\"headerlink\" href=\"#install-flagfft\" title=\"Link to this heading\">#</a></h1><h2>Quick Start<a class=\"headerlink\" href=\"#quick-start\" title=\"Link to this heading\">#</a></h2><p>Clone, build, and verify in one go:</p>", "a[href=\"#submodule\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Submodule<a class=\"headerlink\" href=\"#submodule\" title=\"Link to this heading\">#</a></h2><p>This pulls in <code class=\"docutils literal notranslate\"><span class=\"pre\">deps/libtriton_jit</span></code>, which provides the Triton JIT compiler and <code class=\"docutils literal notranslate\"><span class=\"pre\">nlohmann_json</span></code>. For more information, see <a class=\"reference internal\" href=\"install.html\"><span class=\"std std-doc\">Quick Start</span></a>.</p>", "a[href=\"#dependencies\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Dependencies<a class=\"headerlink\" href=\"#dependencies\" title=\"Link to this heading\">#</a></h2><p>You can prepare a docker environment with the following dependencies. For more information, see <a class=\"reference internal\" href=\"install.html\"><span class=\"std std-doc\">Quick Start</span></a>.</p>", "a[href=\"#hardware\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Hardware<a class=\"headerlink\" href=\"#hardware\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#requirements\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><h2>Hardware<a class=\"headerlink\" href=\"#hardware\" title=\"Link to this heading\">#</a></h2>"}
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
