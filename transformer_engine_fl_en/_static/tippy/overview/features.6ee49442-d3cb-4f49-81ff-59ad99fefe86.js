selector_to_html = {"a[href=\"#features\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h1><h2>Multi-Backend Architecture<a class=\"headerlink\" href=\"#multi-backend-architecture\" title=\"Link to this heading\">#</a></h2><p>TransformerEngine-FL introduces a three-tier plugin-based operator dispatch system that enables chip-agnostic FP8 training and inference:</p>", "a[href=\"#fp8-convergence\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FP8 Convergence<a class=\"headerlink\" href=\"#fp8-convergence\" title=\"Link to this heading\">#</a></h2><p>FP8 has been tested extensively across different model architectures and configurations and we found <strong>no significant difference</strong> between FP8 and BF16 training loss curves. FP8 has also been validated for accuracy on downstream LLM tasks (e.g. LAMBADA and WikiText).</p><p>Validated models: T5 (770M, 11B), MPT (1.3B, 13B), GPT (5B, 22B, 175B), LLama2 (7B, 70B).</p>", "a[href=\"#framework-support\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Framework Support<a class=\"headerlink\" href=\"#framework-support\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#multi-backend-architecture\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Multi-Backend Architecture<a class=\"headerlink\" href=\"#multi-backend-architecture\" title=\"Link to this heading\">#</a></h2><p>TransformerEngine-FL introduces a three-tier plugin-based operator dispatch system that enables chip-agnostic FP8 training and inference:</p>", "a[href=\"#fp8-training-inference\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FP8 Training &amp; Inference<a class=\"headerlink\" href=\"#fp8-training-inference\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#multi-vendor-hardware-support\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Multi-Vendor Hardware Support<a class=\"headerlink\" href=\"#multi-vendor-hardware-support\" title=\"Link to this heading\">#</a></h2><p>TransformerEngine-FL supports FP8 training and inference across multiple hardware vendors through the plugin system. New vendor backends can be added through the plugin discovery mechanism without modifying core code.</p>"}
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
