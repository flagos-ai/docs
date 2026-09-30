selector_to_html = {"a[href=\"#megatron-lm-fl-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Megatron-LM-FL Documentation<a class=\"headerlink\" href=\"#megatron-lm-fl-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with Megatron-LM-FL<a class=\"headerlink\" href=\"#getting-started-with-megatron-lm-fl\" title=\"Link to this heading\">#</a></h1><p>This section covers the requirements for installing Megatron-LM-FL and guides you through installing Megatron-LM-FL on different hardware platforms.</p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Megatron-LM-FL User Guide<a class=\"headerlink\" href=\"#megatron-lm-fl-user-guide\" title=\"Link to this heading\">#</a></h1><p>This section provides detailed guidance on using Megatron-LM-FL.</p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Megatron-LM-FL Overview<a class=\"headerlink\" href=\"#megatron-lm-fl-overview\" title=\"Link to this heading\">#</a></h1><p>Megatron-LM-FL is a fork of <a class=\"reference external\" href=\"https://github.com/NVIDIA/Megatron-LM\">NVIDIA Megatron-LM</a> that introduces a <strong>plugin-based architecture</strong> for supporting diverse AI chips, built on top of <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a>, a unified open-source AI system software stack.</p><p>While upstream Megatron-LM is optimized exclusively for NVIDIA GPUs, Megatron-LM-FL extends it with a hardware abstraction layer that enables training on multiple platforms \u2014 including NVIDIA (CUDA), MetaX, Moore Threads (MUSA), TXDA (Tsingmicro), and NPU (Ascend) \u2014 with minimal code intrusion to the core library.</p>"}
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
