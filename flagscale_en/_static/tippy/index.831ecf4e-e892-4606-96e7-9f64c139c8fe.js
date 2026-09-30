selector_to_html = {"a[href=\"FlagScale_overview/FlagScale-overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagScale Overview<a class=\"headerlink\" href=\"#flagscale-overview\" title=\"Link to this heading\">#</a></h1><p>FlagScale is a core component of <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> \u2014 a unified, open-source AI system software stack that fosters an open technology ecosystem by seamlessly integrating various models, systems, and chips. Following the principle of \u201cdevelop once, migrate across various chips\u201d, FlagOS aims to unlock the full computational potential of hardware, break down barriers between different chip software stacks, and effectively reduce migration costs.</p><p>As the central toolkit of this ecosystem, FlagScale provides a unified interface covering the complete lifecycle of large language models, multimodal models, and embodied AI models. It integrates multiple open-source backend engines under a single configuration and CLI interface, supporting key workflows including model training, reinforcement learning, and inference \u2014 with consistent operation across diverse chip vendors.</p>", "a[href=\"#flagscale-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagScale Documentation<a class=\"headerlink\" href=\"#flagscale-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started<a class=\"headerlink\" href=\"#getting-started\" title=\"Link to this heading\">#</a></h1><h2>Overview<a class=\"headerlink\" href=\"#overview\" title=\"Link to this heading\">#</a></h2><p>FlagScale leverages <a class=\"reference external\" href=\"https://github.com/facebookresearch/hydra\">Hydra</a> for configuration management. The configurations are organized into two levels: an outer experiment-level YAML file and an inner task-level YAML file.</p>"}
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
