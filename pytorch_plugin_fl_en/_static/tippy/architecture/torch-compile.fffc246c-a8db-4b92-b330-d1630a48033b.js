selector_to_html = {"a[href=\"#environment-variables\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Environment variables<a class=\"headerlink\" href=\"#environment-variables\" title=\"Link to this heading\">#</a></h2><p>Routing variables such as <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_BACKEND_CONFIG</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_OP_&lt;op&gt;</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_FORCE_BACKEND</span></code> still apply to compiled kernels, because the compiled graph dispatches through the same routing table.</p>", "a[href=\"#flagtree-compilation\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree compilation<a class=\"headerlink\" href=\"#flagtree-compilation\" title=\"Link to this heading\">#</a></h2><p><a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagTree\">FlagTree</a> is a Triton fork whose compiler targets many vendor backends. It integrates by <strong>substitution at install time</strong>, which is the whole thing to understand about it:</p>", "a[href=\"#troubleshooting\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Troubleshooting<a class=\"headerlink\" href=\"#troubleshooting\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#torch-compile-integration\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">torch.compile Integration<a class=\"headerlink\" href=\"#torch-compile-integration\" title=\"Link to this heading\">#</a></h1><p>The <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> device supports <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.compile</span></code> for automatic kernel fusion and reduced dispatch overhead. The graph stays on the <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> device: there is no device round trip and no copy at the graph boundary.</p>", "a[href=\"#performance\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Performance<a class=\"headerlink\" href=\"#performance\" title=\"Link to this heading\">#</a></h2><p>Fusion gain is verified for correctness (<code class=\"docutils literal notranslate\"><span class=\"pre\">tests/integration/test_compile.py</span></code>); benchmarking the gain against stock Inductor on CUDA is still open work. Structurally the two should land close together \u2014 same fusion passes, same Triton codegen, no per-call copy \u2014 but that is an expectation, not a measurement.</p>", "a[href=\"#backend-internals\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Backend internals<a class=\"headerlink\" href=\"#backend-internals\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#quick-start\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Quick start<a class=\"headerlink\" href=\"#quick-start\" title=\"Link to this heading\">#</a></h2><p>Compilation modes:</p>", "a[href=\"#platform-notes\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Platform notes<a class=\"headerlink\" href=\"#platform-notes\" title=\"Link to this heading\">#</a></h2>"}
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
