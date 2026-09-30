selector_to_html = {"a[href=\"#architecture\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Architecture<a class=\"headerlink\" href=\"#architecture\" title=\"Link to this heading\">#</a></h2><h3>Platform Abstraction Layer<a class=\"headerlink\" href=\"#platform-abstraction-layer\" title=\"Link to this heading\">#</a></h3><p>verl-FL introduces a Strategy Pattern platform abstraction under <code class=\"docutils literal notranslate\"><span class=\"pre\">verl/plugin/platform/</span></code>:</p>", "a[href=\"#engine-plugin-architecture\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Engine Plugin Architecture<a class=\"headerlink\" href=\"#engine-plugin-architecture\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#platform-abstraction-layer\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Platform Abstraction Layer<a class=\"headerlink\" href=\"#platform-abstraction-layer\" title=\"Link to this heading\">#</a></h3><p>verl-FL introduces a Strategy Pattern platform abstraction under <code class=\"docutils literal notranslate\"><span class=\"pre\">verl/plugin/platform/</span></code>:</p>", "a[href=\"#heterogeneous-training-architecture\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Heterogeneous Training Architecture<a class=\"headerlink\" href=\"#heterogeneous-training-architecture\" title=\"Link to this heading\">#</a></h3><p><a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagCX\">FlagCX</a> serves as the unified cross-vendor communication backend, replacing NCCL for heterogeneous setups. This enables weight synchronization and device isolation across CUDA and MUSA nodes via Ray runtime context:</p>", "a[href=\"#verl-fl-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-FL Overview<a class=\"headerlink\" href=\"#verl-fl-overview\" title=\"Link to this heading\">#</a></h1><p>verl-FL is a fork of verl designed to support diverse AI accelerators. It is built on top of <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a>, a unified open-source AI system software stack, and integrates key components including the training engines <a class=\"reference external\" href=\"https://github.com/flagos-ai/Megatron-LM-FL\">Megatron-LM-FL</a> and <a class=\"reference external\" href=\"https://github.com/flagos-ai/TransformerEngine-FL\">Transformer-Engine-FL</a>, as well as the inference engine <a class=\"reference external\" href=\"https://github.com/flagos-ai/vllm-plugin-FL\">vllm-plugin-FL</a>.</p><p>While upstream verl is tightly coupled to CUDA, verl-FL introduces a platform abstraction layer and integrates FlagOS ecosystem components to enable heterogeneous distributed training without modifying upstream business logic.</p>"}
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
