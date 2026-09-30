selector_to_html = {"a[href=\"#supported-hardwares\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Supported hardwares<a class=\"headerlink\" href=\"#supported-hardwares\" title=\"Link to this heading\">#</a></h2><p>Training with TransformerEngine-FL has been validated end to end on MetaX, Hygon, Ascend, and T-Head PPU. See <a class=\"reference internal\" href=\"install.html\"><span class=\"std std-doc\">Install</span></a> for the full procedure.</p>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Install TransformerEngine-FL<a class=\"headerlink\" href=\"#install-transformerengine-fl\" title=\"Link to this heading\">#</a></h1><p>This guide covers installing TransformerEngine-FL starting from a pre-built Docker image, and validating the installation with an end-to-end Qwen3 training job. Installation starts from the Docker image; the component packages are then installed inside the container.</p><p>The workflow uses the following FlagOS components together:</p>", "a[href=\"#operating-system\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Operating system<a class=\"headerlink\" href=\"#operating-system\" title=\"Link to this heading\">#</a></h2><p>Linux (official), WSL2 (limited support)</p>", "a[href=\"#requirements\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><h2>Supported hardwares<a class=\"headerlink\" href=\"#supported-hardwares\" title=\"Link to this heading\">#</a></h2><p>Training with TransformerEngine-FL has been validated end to end on MetaX, Hygon, Ascend, and T-Head PPU. See <a class=\"reference internal\" href=\"install.html\"><span class=\"std std-doc\">Install</span></a> for the full procedure.</p>", "a[href=\"#flagos-components-and-versions\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FlagOS components and versions<a class=\"headerlink\" href=\"#flagos-components-and-versions\" title=\"Link to this heading\">#</a></h2><p>The complete FlagOS stack used with TransformerEngine-FL, with the validated tag on each platform:</p>"}
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
