selector_to_html = {"a[href=\"custom-backend-registration.html#quick-start\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Quick Start<a class=\"headerlink\" href=\"#quick-start\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#user-guide\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">User Guide<a class=\"headerlink\" href=\"#user-guide\" title=\"Link to this heading\">#</a></h1>", "a[href=\"custom-backend-registration.html#in-tree-approach-3-steps\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">In-tree Approach (3 Steps)<a class=\"headerlink\" href=\"#in-tree-approach-3-steps\" title=\"Link to this heading\">#</a></h2>", "a[href=\"custom-backend-registration.html#out-of-tree-approach-plugin-package\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Out-of-tree Approach (Plugin Package)<a class=\"headerlink\" href=\"#out-of-tree-approach-plugin-package\" title=\"Link to this heading\">#</a></h2><h3>Plugin Package Structure<a class=\"headerlink\" href=\"#plugin-package-structure\" title=\"Link to this heading\">#</a></h3>", "a[href=\"custom-backend-registration.html#environment-variables\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Environment Variables<a class=\"headerlink\" href=\"#environment-variables\" title=\"Link to this heading\">#</a></h2><h3>Backend Selection<a class=\"headerlink\" href=\"#backend-selection\" title=\"Link to this heading\">#</a></h3>", "a[href=\"custom-backend-registration.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">TE-FL Custom Backend Examples<a class=\"headerlink\" href=\"#te-fl-custom-backend-examples\" title=\"Link to this heading\">#</a></h1><p>This directory contains examples demonstrating two ways to add custom backends.</p>", "a[href=\"custom-backend-registration.html#examples\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Examples<a class=\"headerlink\" href=\"#examples\" title=\"Link to this heading\">#</a></h2><h3>Prefer vendor backend<a class=\"headerlink\" href=\"#prefer-vendor-backend\" title=\"Link to this heading\">#</a></h3>", "a[href=\"custom-backend-registration.html#two-approaches\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Two Approaches<a class=\"headerlink\" href=\"#two-approaches\" title=\"Link to this heading\">#</a></h2>", "a[href=\"custom-backend-registration.html#expected-output\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Expected Output<a class=\"headerlink\" href=\"#expected-output\" title=\"Link to this heading\">#</a></h2><p>When running, you should see logs like:</p>"}
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
