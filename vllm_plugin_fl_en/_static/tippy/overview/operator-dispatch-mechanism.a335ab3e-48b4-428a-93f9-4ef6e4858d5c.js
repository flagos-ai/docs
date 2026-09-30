selector_to_html = {"a[href=\"#priority-selection-flow\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Priority selection flow<a class=\"headerlink\" href=\"#priority-selection-flow\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#backend-implementation-kind-backendimplkind\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">1. Backend implementation kind (BackendImplKind)<a class=\"headerlink\" href=\"#backend-implementation-kind-backendimplkind\" title=\"Link to this heading\">#</a></h3><p><code class=\"docutils literal notranslate\"><span class=\"pre\">types.py</span></code> includes backend implementation kinds as follows:</p>", "a[href=\"#selection-policy\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">3. Selection policy<a class=\"headerlink\" href=\"#selection-policy\" title=\"Link to this heading\">#</a></h3><p><code class=\"docutils literal notranslate\"><span class=\"pre\">policy.py</span></code> includes selection policy.</p><p>Policy controls operator implementation selection:</p>", "a[href=\"#plugin-integration-points\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Plugin integration points<a class=\"headerlink\" href=\"#plugin-integration-points\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#directory-structure\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Directory structure<a class=\"headerlink\" href=\"#directory-structure\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#operator-implementation-opimpl\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">2. Operator implementation (OpImpl)<a class=\"headerlink\" href=\"#operator-implementation-opimpl\" title=\"Link to this heading\">#</a></h3><p><code class=\"docutils literal notranslate\"><span class=\"pre\">types.py</span></code> includes operator implementation\uff0ceach operator implementation contains:</p>", "a[href=\"#dispatch-flow-diagram\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Dispatch flow diagram<a class=\"headerlink\" href=\"#dispatch-flow-diagram\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#core-concepts\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Core concepts<a class=\"headerlink\" href=\"#core-concepts\" title=\"Link to this heading\">#</a></h2><h3>1. Backend implementation kind (BackendImplKind)<a class=\"headerlink\" href=\"#backend-implementation-kind-backendimplkind\" title=\"Link to this heading\">#</a></h3><p><code class=\"docutils literal notranslate\"><span class=\"pre\">types.py</span></code> includes backend implementation kinds as follows:</p>", "a[href=\"#operator-dispatch-mechanism\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Operator dispatch mechanism<a class=\"headerlink\" href=\"#operator-dispatch-mechanism\" title=\"Link to this heading\">#</a></h1><p>This directory implements the operator dispatch mechanism for vllm-plugin-FL, providing a flexible operator dispatch system that selects between different backend implementations (FlagGems, PyTorch, vendor-specific) based on availability and policy configuration.</p>", "a[href=\"#architecture-overview\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Architecture overview<a class=\"headerlink\" href=\"#architecture-overview\" title=\"Link to this heading\">#</a></h2><h3>Dispatch flow diagram<a class=\"headerlink\" href=\"#dispatch-flow-diagram\" title=\"Link to this heading\">#</a></h3>"}
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
