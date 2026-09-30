selector_to_html = {"a[href=\"dispatch_user_guide/dispatch-user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Operator dispatch user guide<a class=\"headerlink\" href=\"#operator-dispatch-user-guide\" title=\"Link to this heading\">#</a></h1><p>This guide describes how to use an operator dispatch system that selects between FlagGems, vendor-specific, and PyTorch reference implementations. The selection follows a priority hierarchy, from highest to lowest:</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started<a class=\"headerlink\" href=\"#getting-started\" title=\"Link to this heading\">#</a></h1><p>This section covers the requirements for installing vllm-plugin-FL and guides you through installing vllm, vllm-plugin-FL on different hardware platforms, and running a inference task.</p>", "a[href=\"#vllm-plugin-fl-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">vllm-plugin-FL Documentation<a class=\"headerlink\" href=\"#vllm-plugin-fl-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">vllm-plugin-FL Overview<a class=\"headerlink\" href=\"#vllm-plugin-fl-overview\" title=\"Link to this heading\">#</a></h1><p>vllm-plugin-FL is a plugin for the <a class=\"reference external\" href=\"https://github.com/vllm-project/vllm\">vLLM</a> inference/serving framework, built on top of <a class=\"reference external\" href=\"https://flagos.io\">FlagOS</a>, a unified open-source AI system software stack. vllm-plugin-FL extends vLLM\u2019s capabilities and performance across diverse hardware environments. Without changing vLLM\u2019s original interfaces or usage patterns, the same command can run model inference/serving on different chips. vllm-plugin-FL works with other FlagOS components, including the unified operator library <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagGems\">FlagGems</a>, the unified communication library <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagCX\">FlagCX</a>, and the unified compiler <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagTree\">FlagTree</a>.</p><p>vllm-plugin-FL is installed from a Docker image and then integrates vLLM with the FlagOS operator, communication, and compiler stack on the target chip. See <a class=\"reference internal\" href=\"getting_started/getting-started.html\"><span class=\"std std-doc\">Getting Started</span></a> for the installation flow and <a class=\"reference internal\" href=\"overview/features.html\"><span class=\"std std-doc\">Features</span></a> for what the plugin provides.</p>", "a[href=\"reference/dispatch-api-reference.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Dispatch API Reference<a class=\"headerlink\" href=\"#dispatch-api-reference\" title=\"Link to this heading\">#</a></h1><h2>Convenience Functions<a class=\"headerlink\" href=\"#convenience-functions\" title=\"Link to this heading\">#</a></h2>"}
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
