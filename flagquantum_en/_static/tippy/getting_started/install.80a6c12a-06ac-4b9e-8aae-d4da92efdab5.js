selector_to_html = {"a[href=\"#next-steps\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Next steps<a class=\"headerlink\" href=\"#next-steps\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><p>This section includes information about the hardware platforms and software\nrequirements for FlagQuantum.</p>", "a[href=\"#install-flagquantum\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Install FlagQuantum<a class=\"headerlink\" href=\"#install-flagquantum\" title=\"Link to this heading\">#</a></h1><p>Read <a class=\"reference internal\" href=\"requirements.html\"><span class=\"std std-doc\">Requirements</span></a> before proceeding.</p>", "a[href=\"../user_guide/training-with-pytorch.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Training with PyTorch<a class=\"headerlink\" href=\"#training-with-pytorch\" title=\"Link to this heading\">#</a></h1><p>Execution and training are intentionally separate. A trainable program is an\n<code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Module</span></code> inside an ordinary PyTorch training loop.</p>", "a[href=\"../user_guide/basic-usage.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Basic usage<a class=\"headerlink\" href=\"#basic-usage\" title=\"Link to this heading\">#</a></h1><p>Create a circuit, inspect its plan, execute it and read the result. This is the\nshortest complete journey through the stable API.</p>", "a[href=\"#steps\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Steps<a class=\"headerlink\" href=\"#steps\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#development-containers\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Development containers<a class=\"headerlink\" href=\"#development-containers\" title=\"Link to this heading\">#</a></h2><p>The repository also ships development container definitions for CPU and CUDA\nenvironments, with and without JAX and the QSteed compiler. Follow the\ncontainer guide in the repository when you prefer a prepared environment; the\nimages install FlagQuantum from the checkout and include JupyterLab, and none\nof them contain provider credentials.</p>", "a[href=\"../user_guide/simulation-representations.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Simulation representations<a class=\"headerlink\" href=\"#simulation-representations\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum exposes several simulation representations behind one program, so a\nmodel does not have to be rewritten when the workload changes.</p>"}
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
