selector_to_html = {"a[href=\"install.html#set-environment-variables\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Set Environment Variables<a class=\"headerlink\" href=\"#set-environment-variables\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html#hardware\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Hardware<a class=\"headerlink\" href=\"#hardware\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><h2>Hardware<a class=\"headerlink\" href=\"#hardware\" title=\"Link to this heading\">#</a></h2>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Install FlagFFT<a class=\"headerlink\" href=\"#install-flagfft\" title=\"Link to this heading\">#</a></h1><h2>Quick Start<a class=\"headerlink\" href=\"#quick-start\" title=\"Link to this heading\">#</a></h2><p>Clone, build, and verify in one go:</p>", "a[href=\"install.html#install-to-system-optional\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Install to System (Optional)<a class=\"headerlink\" href=\"#install-to-system-optional\" title=\"Link to this heading\">#</a></h2><p>After building, install the library and tools system-wide:</p>", "a[href=\"requirements.html#submodule\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Submodule<a class=\"headerlink\" href=\"#submodule\" title=\"Link to this heading\">#</a></h2><p>This pulls in <code class=\"docutils literal notranslate\"><span class=\"pre\">deps/libtriton_jit</span></code>, which provides the Triton JIT compiler and <code class=\"docutils literal notranslate\"><span class=\"pre\">nlohmann_json</span></code>. For more information, see <a class=\"reference internal\" href=\"install.html\"><span class=\"std std-doc\">Quick Start</span></a>.</p>", "a[href=\"install.html#quick-start\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Quick Start<a class=\"headerlink\" href=\"#quick-start\" title=\"Link to this heading\">#</a></h2><p>Clone, build, and verify in one go:</p>", "a[href=\"install.html#use-docker\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Use Docker<a class=\"headerlink\" href=\"#use-docker\" title=\"Link to this heading\">#</a></h2><p>A pre-built environment with all dependencies is available as an alternative to manual setup:</p>", "a[href=\"install.html#build-options\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Build Options<a class=\"headerlink\" href=\"#build-options\" title=\"Link to this heading\">#</a></h2><h3>Build Library Only<a class=\"headerlink\" href=\"#build-library-only\" title=\"Link to this heading\">#</a></h3><p>This produces <code class=\"docutils literal notranslate\"><span class=\"pre\">build/libflagfft.so</span></code>.</p>", "a[href=\"requirements.html#dependencies\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Dependencies<a class=\"headerlink\" href=\"#dependencies\" title=\"Link to this heading\">#</a></h2><p>You can prepare a docker environment with the following dependencies. For more information, see <a class=\"reference internal\" href=\"install.html\"><span class=\"std std-doc\">Quick Start</span></a>.</p>", "a[href=\"#getting-started-with-flagfft\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with FlagFFT<a class=\"headerlink\" href=\"#getting-started-with-flagfft\" title=\"Link to this heading\">#</a></h1>"}
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
