selector_to_html = {"a[href=\"#vendor-integration\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Vendor integration<a class=\"headerlink\" href=\"#vendor-integration\" title=\"Link to this heading\">#</a></h1><p>Chip vendors integrate by adding a backend directory under <code class=\"docutils literal notranslate\"><span class=\"pre\">dispatch/backends/vendor/</span></code>:</p>", "a[href=\"#vendor-backend-auto-discovery\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Vendor backend auto-discovery<a class=\"headerlink\" href=\"#vendor-backend-auto-discovery\" title=\"Link to this heading\">#</a></h2><p>The plugin scans <code class=\"docutils literal notranslate\"><span class=\"pre\">dispatch/backends/vendor/*/register_ops.py</span></code> at startup. If <code class=\"docutils literal notranslate\"><span class=\"pre\">is_available()</span></code> returns True, the vendor\u2019s ops are registered. No other files need modification.</p><p>Optional integration hooks can add platform-specific behavior when needed:</p>", "a[href=\"#backend-class-my-chip-py\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. Backend class (my_chip.py)<a class=\"headerlink\" href=\"#backend-class-my-chip-py\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#registration-register-ops-py\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. Registration (register_ops.py)<a class=\"headerlink\" href=\"#registration-register-ops-py\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#operator-implementations-impl\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">3. Operator implementations (impl/)<a class=\"headerlink\" href=\"#operator-implementations-impl\" title=\"Link to this heading\">#</a></h2><p>Each op function receives standardized arguments (same as vllm-plugin-FL):</p>"}
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
