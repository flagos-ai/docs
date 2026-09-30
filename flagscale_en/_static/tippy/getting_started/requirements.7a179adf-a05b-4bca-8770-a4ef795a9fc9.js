selector_to_html = {"a[href=\"#hardware-platforms\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Hardware platforms<a class=\"headerlink\" href=\"#hardware-platforms\" title=\"Link to this heading\">#</a></h2><p>FlagScale is designed to work collaboratively with FlagOS plugins. While FlagScale itself has no hardware platform requirements, you should review the hardware requirements of the specific FlagOS plugins you intend to use. For more information, see <a class=\"reference external\" href=\"https://github.com/flagos-ai/Megatron-LM-FL\">Megatron-LM-FL</a>, <a class=\"reference external\" href=\"https://github.com/flagos-ai/TransformerEngine-FL\">TransformerEngine-FL</a>, <a class=\"reference external\" href=\"https://github.com/flagos-ai/verl-FL\">VeRL-FL</a>, and <a class=\"reference external\" href=\"https://github.com/flagos-ai/vllm-plugin-FL\">vllm-plugin-FL</a>.</p><p>Training has been validated end to end on the following platforms together with Megatron-LM-FL and TransformerEngine-FL:</p>", "a[href=\"multi-platform-training.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Multi-Platform Training and Testing<a class=\"headerlink\" href=\"#multi-platform-training-and-testing\" title=\"Link to this heading\">#</a></h1><p>FlagScale has no hardware requirements of its own \u2014 it orchestrates training through the FlagOS plugins. This guide shows how to drive an end-to-end training job on four non-NVIDIA platforms (MetaX, Hygon, Ascend, T-Head PPU) with the plugin stack underneath.</p><p>Platform-specific plugin installation is documented in the plugin guides:</p>", "a[href=\"#requirements\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><p>This section includes information about the hardware platforms and models.</p>", "a[href=\"#supported-models\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Supported models<a class=\"headerlink\" href=\"#supported-models\" title=\"Link to this heading\">#</a></h2><h3>Training<a class=\"headerlink\" href=\"#training\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#serve-inference\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Serve / Inference<a class=\"headerlink\" href=\"#serve-inference\" title=\"Link to this heading\">#</a></h3><p>For the full list, see https://github.com/flagos-ai/FlagScale/tree/main/examples</p>", "a[href=\"#training\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Training<a class=\"headerlink\" href=\"#training\" title=\"Link to this heading\">#</a></h3>"}
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
