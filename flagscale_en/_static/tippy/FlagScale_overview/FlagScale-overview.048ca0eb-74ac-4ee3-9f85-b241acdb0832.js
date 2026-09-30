selector_to_html = {"a[href=\"workflow.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Workflow<a class=\"headerlink\" href=\"#workflow\" title=\"Link to this heading\">#</a></h1><p>The following diagram briefly demonstrates how to use FlagScale to run a training, inference, serving, or reinforcement learning task in a general way.</p><p><a data-lightbox=\"image-set\" href=\"../_images/flagscale-workflow.png\">\n<img alt=\"alt text\" src=\"../_images/flagscale-workflow.png\"/></a>\n</p>", "a[href=\"features.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h1><p>FlagScale provides a unified toolkit covering the complete lifecycle of large language models, multimodal models, and embodied AI models. It integrates multiple open-source backend engines under a single configuration and CLI interface, enabling consistent operation across diverse chip vendors. Key features include:</p>", "a[href=\"#flagscale-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagScale Overview<a class=\"headerlink\" href=\"#flagscale-overview\" title=\"Link to this heading\">#</a></h1><p>FlagScale is a core component of <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> \u2014 a unified, open-source AI system software stack that fosters an open technology ecosystem by seamlessly integrating various models, systems, and chips. Following the principle of \u201cdevelop once, migrate across various chips\u201d, FlagOS aims to unlock the full computational potential of hardware, break down barriers between different chip software stacks, and effectively reduce migration costs.</p><p>As the central toolkit of this ecosystem, FlagScale provides a unified interface covering the complete lifecycle of large language models, multimodal models, and embodied AI models. It integrates multiple open-source backend engines under a single configuration and CLI interface, supporting key workflows including model training, reinforcement learning, and inference \u2014 with consistent operation across diverse chip vendors.</p>"}
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
