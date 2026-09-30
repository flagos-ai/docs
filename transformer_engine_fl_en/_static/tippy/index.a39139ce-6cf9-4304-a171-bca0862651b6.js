selector_to_html = {"a[href=\"#transformerengine-fl-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">TransformerEngine-FL Documentation<a class=\"headerlink\" href=\"#transformerengine-fl-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with TransformerEngine-FL<a class=\"headerlink\" href=\"#getting-started-with-transformerengine-fl\" title=\"Link to this heading\">#</a></h1><p>This section covers the requirements for installing TransformerEngine-FL and guides you through installing TransformerEngine-FL on different hardware platforms.</p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">User Guide<a class=\"headerlink\" href=\"#user-guide\" title=\"Link to this heading\">#</a></h1>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">TransformerEngine-FL Overview<a class=\"headerlink\" href=\"#transformerengine-fl-overview\" title=\"Link to this heading\">#</a></h1><p>TransformerEngine-FL is a fork of <a class=\"reference external\" href=\"https://github.com/NVIDIA/TransformerEngine\">NVIDIA Transformer Engine</a> (TE) that introduces a plugin-based architecture for supporting diverse AI chips, built on top of <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a>, a unified open-source AI system software stack. It extends TE\u2019s FP8 training and inference capabilities across diverse hardware environments. Without changing TE\u2019s original interfaces or usage patterns, the same model code can run FP8 mixed-precision training and inference on different AI chip platforms.</p><p>Transformer Engine (TE) is a library for accelerating Transformer models on NVIDIA GPUs, including using 8-bit floating point (FP8) precision on Hopper, Ada, and Blackwell GPUs, to provide better performance with lower memory utilization in both training and inference. TE provides a collection of highly optimized building blocks for popular Transformer architectures and an automatic mixed precision-like API that can be used seamlessly with your framework-specific code. TE also includes a framework agnostic C++ API that can be integrated with other deep learning libraries to enable FP8 support for Transformers.</p>"}
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
