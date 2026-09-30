selector_to_html = {"a[href=\"#several-simulation-representations-one-program\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Several simulation representations, one program<a class=\"headerlink\" href=\"#several-simulation-representations-one-program\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#measurement-noise-and-error-correction\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Measurement, noise and error correction<a class=\"headerlink\" href=\"#measurement-noise-and-error-correction\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#distributed-and-accelerator-execution\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Distributed and accelerator execution<a class=\"headerlink\" href=\"#distributed-and-accelerator-execution\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#pytorch-native-quantum-training\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">PyTorch-native quantum training<a class=\"headerlink\" href=\"#pytorch-native-quantum-training\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#deployment-interop-and-ecosystem\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Deployment, interop and ecosystem<a class=\"headerlink\" href=\"#deployment-interop-and-ecosystem\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#compilation-and-export\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Compilation and export<a class=\"headerlink\" href=\"#compilation-and-export\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#features\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h1><h2>PyTorch-native quantum training<a class=\"headerlink\" href=\"#pytorch-native-quantum-training\" title=\"Link to this heading\">#</a></h2>"}
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
