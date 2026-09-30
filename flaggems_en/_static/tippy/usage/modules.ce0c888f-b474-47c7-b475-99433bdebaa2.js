selector_to_html = {"a[href=\"#building-custom-models-using-flaggems-modules\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Building Custom Models Using FlagGems modules<a class=\"headerlink\" href=\"#building-custom-models-using-flaggems-modules\" title=\"Link to this heading\">#</a></h1><p>In some scenarios, users may want to build their own models from scratch\nor to adapt existing ones to better suit their specific use cases.\nTo support this, <em>FlagGems</em> provides a growing collection of high-performance modules\ncommonly used in large language models (LLMs).</p><p>These components are implemented using <em>FlagGems</em>-accelerated operators\nand can be used in the way you use any standard <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.nn.Module</span></code>.\nYou can seamlessly integrate them into your system to benefit from kernel-level acceleration\nwithout writing custom CUDA code or Triton code.</p>", "a[href=\"#modules-available\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Modules Available<a class=\"headerlink\" href=\"#modules-available\" title=\"Link to this heading\">#</a></h2><p>We encourage users to use these as drop-in replacements for the equivalent PyTorch layers.\nMore components such as fused attention, MoE layers, and transformer blocks\nare under development.</p>"}
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
