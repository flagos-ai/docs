selector_to_html = {"a[href=\"#sglang-plugin-fl-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">sglang-plugin-FL Documentation<a class=\"headerlink\" href=\"#sglang-plugin-fl-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"dispatch_user_guide/dispatch-user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Operator Dispatch User Guide<a class=\"headerlink\" href=\"#operator-dispatch-user-guide\" title=\"Link to this heading\">#</a></h1><p>The dispatch system provides operator replacement and distributed communication configuration through YAML files and environment variables. You can control the replacement layers independently and configure platform-aware communication backends.</p><p>The dispatch system supports both YAML configuration and environment variables for fine-grained control. Environment variables take precedence over YAML config.</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started<a class=\"headerlink\" href=\"#getting-started\" title=\"Link to this heading\">#</a></h1><p>This section covers the requirements for installing sglang-plugin-FL and guides you through the installation process and running an inference task.</p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">sglang-plugin-FL Overview<a class=\"headerlink\" href=\"#sglang-plugin-fl-overview\" title=\"Link to this heading\">#</a></h1><p>sglang-plugin-FL is an out-of-tree (OOT) plugin for <a class=\"reference external\" href=\"https://github.com/sgl-project/sglang\">SGLang</a>, built on FlagOS\u2019s unified multi-chip backend \u2014 including the unified operator library <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagGems\">FlagGems</a> and the unified communication library <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagCX\">FlagCX</a>. It extends SGLang\u2019s inference capabilities across diverse hardware platforms. Without changing SGLang\u2019s original interfaces or usage patterns, the same command can run model inference on different chips.</p>", "a[href=\"reference/dispatch-reference-and-example.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Environment variable references and examples<a class=\"headerlink\" href=\"#environment-variable-references-and-examples\" title=\"Link to this heading\">#</a></h1><p>This page documents the references and examples of environment variables for sglang-plugin-FL.</p><p>The effective configuration precedence is:</p>"}
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
