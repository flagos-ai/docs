selector_to_html = {"a[href=\"override-usage.html#replacing-a-module-level-function\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. Replacing a Module-Level Function<a class=\"headerlink\" href=\"#replacing-a-module-level-function\" title=\"Link to this heading\">#</a></h2><p><strong>Scenario</strong>: Replace a standalone function in a module.</p>", "a[href=\"override-usage.html#method-key-generation-rules\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">method_key Generation Rules<a class=\"headerlink\" href=\"#method-key-generation-rules\" title=\"Link to this heading\">#</a></h2><p>The <code class=\"docutils literal notranslate\"><span class=\"pre\">target</span></code> parameter of <code class=\"docutils literal notranslate\"><span class=\"pre\">register()</span></code> is automatically converted to an internal method_key:</p>", "a[href=\"override-usage.html#replacing-a-class-method\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. Replacing a Class Method<a class=\"headerlink\" href=\"#replacing-a-class-method\" title=\"Link to this heading\">#</a></h2><p><strong>Scenario</strong>: Replace a single method in a class while keeping other methods unchanged.</p>", "a[href=\"override-usage.html#quick-start-checklist\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Quick Start Checklist<a class=\"headerlink\" href=\"#quick-start-checklist\" title=\"Link to this heading\">#</a></h2>", "a[href=\"override-usage.html#multi-vendor-support\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Multi-Vendor Support<a class=\"headerlink\" href=\"#multi-vendor-support\" title=\"Link to this heading\">#</a></h2><p>Multiple vendor implementations can be registered for the same target, selected via environment variable:</p>", "a[href=\"override-usage.html#core-concepts\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Core Concepts<a class=\"headerlink\" href=\"#core-concepts\" title=\"Link to this heading\">#</a></h2>", "a[href=\"override-usage.html#replacing-an-entire-class\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">3. Replacing an Entire Class<a class=\"headerlink\" href=\"#replacing-an-entire-class\" title=\"Link to this heading\">#</a></h2><p><strong>Scenario</strong>: Completely replace an original class with a new class. All places that instantiate the original class automatically receive the replacement class.</p>", "a[href=\"#megatron-lm-fl-user-guide\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Megatron-LM-FL User Guide<a class=\"headerlink\" href=\"#megatron-lm-fl-user-guide\" title=\"Link to this heading\">#</a></h1><p>This section provides detailed guidance on using Megatron-LM-FL.</p>", "a[href=\"override-usage.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Override Plugin Mechanism<a class=\"headerlink\" href=\"#override-plugin-mechanism\" title=\"Link to this heading\">#</a></h1><p>This document describes how to use the <code class=\"docutils literal notranslate\"><span class=\"pre\">@overridable</span></code> / <code class=\"docutils literal notranslate\"><span class=\"pre\">register()</span></code> plugin system in FlagScale, which supports replacing <code class=\"docutils literal notranslate\"><span class=\"pre\">megatron.core</span></code> (Megatron-LM-FL side) and <code class=\"docutils literal notranslate\"><span class=\"pre\">megatron.training</span></code> (FlagScale side) implementations.</p><p>Three replacement scenarios are supported:</p>"}
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
