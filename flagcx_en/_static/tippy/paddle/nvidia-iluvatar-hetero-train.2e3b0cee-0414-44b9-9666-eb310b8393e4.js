selector_to_html = {"a[href=\"#training-on-heterogeneous-ai-accelerators-nvidia-gpu-iluvatar-gpu\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Training on heterogeneous ai accelerators (nvidia GPU + iluvatar GPU)<a class=\"headerlink\" href=\"#training-on-heterogeneous-ai-accelerators-nvidia-gpu-iluvatar-gpu\" title=\"Link to this heading\">#</a></h2><p>We now support training ERNIE4.5 using Nvidia GPUs and Iluvatar GPUs together. Please refer to the following steps to get started</p>", "a[href=\"#environment-setup\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Environment setup<a class=\"headerlink\" href=\"#environment-setup\" title=\"Link to this heading\">#</a></h2><p>Please refer to <a class=\"reference internal\" href=\"nvidia.html\"><span class=\"std std-doc\">NVIDIA</span></a> and <a class=\"reference internal\" href=\"iluvatar.html\"><span class=\"std std-doc\">Iluvatar</span></a> for environment setup and compiling Paddle with FlagCX on Nvidia and Iluvatar machines.</p>", "a[href=\"iluvatar.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Guide for using paddle with FlagCX on iluvatar machines<a class=\"headerlink\" href=\"#guide-for-using-paddle-with-flagcx-on-iluvatar-machines\" title=\"Link to this heading\">#</a></h1><h2>Environment setup<a class=\"headerlink\" href=\"#environment-setup\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#guide-for-training-on-nvidia-and-iluvatar-gpus\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Guide for training on nvidia and iluvatar GPUs<a class=\"headerlink\" href=\"#guide-for-training-on-nvidia-and-iluvatar-gpus\" title=\"Link to this heading\">#</a></h1><h2>Environment setup<a class=\"headerlink\" href=\"#environment-setup\" title=\"Link to this heading\">#</a></h2><p>Please refer to <a class=\"reference internal\" href=\"nvidia.html\"><span class=\"std std-doc\">NVIDIA</span></a> and <a class=\"reference internal\" href=\"iluvatar.html\"><span class=\"std std-doc\">Iluvatar</span></a> for environment setup and compiling Paddle with FlagCX on Nvidia and Iluvatar machines.</p>", "a[href=\"nvidia.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Guide for using paddle with FlagCX on nvidia GPU environment<a class=\"headerlink\" href=\"#guide-for-using-paddle-with-flagcx-on-nvidia-gpu-environment\" title=\"Link to this heading\">#</a></h1><h2>Environment setup<a class=\"headerlink\" href=\"#environment-setup\" title=\"Link to this heading\">#</a></h2>"}
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
