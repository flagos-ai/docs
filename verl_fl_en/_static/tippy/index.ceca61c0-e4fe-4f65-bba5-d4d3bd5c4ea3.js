selector_to_html = {"a[href=\"#verl-fl-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-FL Documentation<a class=\"headerlink\" href=\"#verl-fl-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with verl-FL<a class=\"headerlink\" href=\"#getting-started-with-verl-fl\" title=\"Link to this heading\">#</a></h1><p>This section covers the requirements for installing verl-FL and guides you through installing verl-FL on different hardware platforms.</p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-FL User Guide<a class=\"headerlink\" href=\"#verl-fl-user-guide\" title=\"Link to this heading\">#</a></h1><p>This section provides detailed guidance on using verl-FL for end-to-end GRPO training across different hardware platforms.</p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-FL Overview<a class=\"headerlink\" href=\"#verl-fl-overview\" title=\"Link to this heading\">#</a></h1><p>verl-FL is a fork of verl designed to support diverse AI accelerators. It is built on top of <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a>, a unified open-source AI system software stack, and integrates key components including the training engines <a class=\"reference external\" href=\"https://github.com/flagos-ai/Megatron-LM-FL\">Megatron-LM-FL</a> and <a class=\"reference external\" href=\"https://github.com/flagos-ai/TransformerEngine-FL\">Transformer-Engine-FL</a>, as well as the inference engine <a class=\"reference external\" href=\"https://github.com/flagos-ai/vllm-plugin-FL\">vllm-plugin-FL</a>.</p><p>While upstream verl is tightly coupled to CUDA, verl-FL introduces a platform abstraction layer and integrates FlagOS ecosystem components to enable heterogeneous distributed training without modifying upstream business logic.</p>"}
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
