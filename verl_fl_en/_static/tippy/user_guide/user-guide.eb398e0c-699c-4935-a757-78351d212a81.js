selector_to_html = {"a[href=\"platform-abstraction.html#what-a-validated-run-looks-like\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">What a Validated Run Looks Like<a class=\"headerlink\" href=\"#what-a-validated-run-looks-like\" title=\"Link to this heading\">#</a></h2>", "a[href=\"platform-abstraction.html#heterogeneous-training-with-flagcx\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Heterogeneous Training with FlagCX<a class=\"headerlink\" href=\"#heterogeneous-training-with-flagcx\" title=\"Link to this heading\">#</a></h2><p><a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagCX\">FlagCX</a> is the unified cross-vendor communication backend. It lets one cluster mix accelerators: NVIDIA nodes run actor/critic (FSDP) while Moore Threads MUSA nodes run rollout (vLLM), with weight synchronization and device isolation handled through the Ray runtime context.</p>", "a[href=\"platform-abstraction.html#adding-a-new-backend\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Adding a New Backend<a class=\"headerlink\" href=\"#adding-a-new-backend\" title=\"Link to this heading\">#</a></h2><p>See <code class=\"docutils literal notranslate\"><span class=\"pre\">verl/plugin/platform/README.md</span></code> in the repository for a fully annotated template.</p>", "a[href=\"#verl-fl-user-guide\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-FL User Guide<a class=\"headerlink\" href=\"#verl-fl-user-guide\" title=\"Link to this heading\">#</a></h1><p>This section provides detailed guidance on using verl-FL for end-to-end GRPO training across different hardware platforms.</p>", "a[href=\"platform-abstraction.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Platform Abstraction and Multi-Chip Training<a class=\"headerlink\" href=\"#platform-abstraction-and-multi-chip-training\" title=\"Link to this heading\">#</a></h1><p>verl-FL replaces the hard-coded <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.cuda</span></code> calls of upstream verl with a platform abstraction layer, and integrates the FlagOS training engines, so the same RL post-training script runs on NVIDIA, Huawei Ascend, MetaX (MACA), Moore Threads (MUSA), and CPU. This page describes the abstraction, the engine plugins, and the validated end-to-end workflows.</p>", "a[href=\"platform-abstraction.html#engine-plugin-architecture\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Engine Plugin Architecture<a class=\"headerlink\" href=\"#engine-plugin-architecture\" title=\"Link to this heading\">#</a></h2><p>Training engines are pluggable and registered per device:</p>", "a[href=\"platform-abstraction.html#platform-abstraction-layer\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Platform Abstraction Layer<a class=\"headerlink\" href=\"#platform-abstraction-layer\" title=\"Link to this heading\">#</a></h2><p>The abstraction lives under <code class=\"docutils literal notranslate\"><span class=\"pre\">verl/plugin/platform/</span></code> and follows the Strategy Pattern:</p>"}
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
