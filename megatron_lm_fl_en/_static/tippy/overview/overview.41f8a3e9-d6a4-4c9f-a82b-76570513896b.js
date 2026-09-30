selector_to_html = {"a[href=\"#megatron-lm-fl-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Megatron-LM-FL Overview<a class=\"headerlink\" href=\"#megatron-lm-fl-overview\" title=\"Link to this heading\">#</a></h1><p>Megatron-LM-FL is a fork of <a class=\"reference external\" href=\"https://github.com/NVIDIA/Megatron-LM\">NVIDIA Megatron-LM</a> that introduces a <strong>plugin-based architecture</strong> for supporting diverse AI chips, built on top of <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a>, a unified open-source AI system software stack.</p><p>While upstream Megatron-LM is optimized exclusively for NVIDIA GPUs, Megatron-LM-FL extends it with a hardware abstraction layer that enables training on multiple platforms \u2014 including NVIDIA (CUDA), MetaX, Moore Threads (MUSA), TXDA (Tsingmicro), and NPU (Ascend) \u2014 with minimal code intrusion to the core library.</p>"}
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
