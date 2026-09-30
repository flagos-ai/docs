selector_to_html = {"a[href=\"#flagos-engine-environment-variables\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FlagOS Engine Environment Variables<a class=\"headerlink\" href=\"#flagos-engine-environment-variables\" title=\"Link to this heading\">#</a></h2><p>When running with the FlagOS engine (vendor <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code>), the following variables control stage-scoped acceleration:</p>", "a[href=\"#running-the-baseline\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Running the Baseline<a class=\"headerlink\" href=\"#running-the-baseline\" title=\"Link to this heading\">#</a></h2><p>The script uses these default hyperparameters (all overridable via environment variables):</p>", "a[href=\"../getting_started/install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Installation<a class=\"headerlink\" href=\"#installation\" title=\"Link to this heading\">#</a></h1><p>verl-hardware-plugin is installed as a Python package and discovered by verl automatically through the <code class=\"docutils literal notranslate\"><span class=\"pre\">verl.plugins</span></code> entry-points group.</p>", "a[href=\"#grpo-acceptance-baseline-gsm8k\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">GRPO Acceptance Baseline (GSM8K)<a class=\"headerlink\" href=\"#grpo-acceptance-baseline-gsm8k\" title=\"Link to this heading\">#</a></h1><p>The standard acceptance test for a new hardware platform adaptation is GRPO training on GSM8K with Qwen3-0.6B. The reference implementation is <code class=\"docutils literal notranslate\"><span class=\"pre\">scripts/baseline_grpo_gsm8k.sh</span></code> in the repository.</p>", "a[href=\"#what-the-baseline-validates\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">What the Baseline Validates<a class=\"headerlink\" href=\"#what-the-baseline-validates\" title=\"Link to this heading\">#</a></h2>"}
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
