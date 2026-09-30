selector_to_html = {"a[href=\"requirements.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><p>This section includes information about the hardware platforms and software\nrequirements for FlagQuantum.</p>", "a[href=\"#getting-started\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started<a class=\"headerlink\" href=\"#getting-started\" title=\"Link to this heading\">#</a></h1><p>This section covers the requirements for installing FlagQuantum and guides you\nthrough the installation process.</p>", "a[href=\"../user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">User Guide<a class=\"headerlink\" href=\"#user-guide\" title=\"Link to this heading\">#</a></h1><p>This guide covers how to use FlagQuantum for quantum circuit simulation and\ntraining: building programs, planning and running them, training with PyTorch,\nchoosing a simulation representation, adding noise and measurement, scaling\nacross ranks, and moving the same program to hardware.</p>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Install FlagQuantum<a class=\"headerlink\" href=\"#install-flagquantum\" title=\"Link to this heading\">#</a></h1><p>Read <a class=\"reference internal\" href=\"requirements.html\"><span class=\"std std-doc\">Requirements</span></a> before proceeding.</p>", "a[href=\"#your-first-quantum-model\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Your first quantum model<a class=\"headerlink\" href=\"#your-first-quantum-model\" title=\"Link to this heading\">#</a></h2><p>FlagQuantum is a PyTorch-first framework, so the shortest path to a working\nprogram is a small trainable circuit. The example below builds a two-qubit\ncircuit, learns its rotation angle by minimizing the measured expectation\nvalue, and prints the trained measurement. It needs no GPU, no credentials and\nno optional backend.</p>"}
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
