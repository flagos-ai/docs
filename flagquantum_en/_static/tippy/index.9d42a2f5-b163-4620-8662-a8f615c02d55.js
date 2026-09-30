selector_to_html = {"a[href=\"#flagquantum-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagQuantum Documentation<a class=\"headerlink\" href=\"#flagquantum-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">User Guide<a class=\"headerlink\" href=\"#user-guide\" title=\"Link to this heading\">#</a></h1><p>This guide covers how to use FlagQuantum for quantum circuit simulation and\ntraining: building programs, planning and running them, training with PyTorch,\nchoosing a simulation representation, adding noise and measurement, scaling\nacross ranks, and moving the same program to hardware.</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started<a class=\"headerlink\" href=\"#getting-started\" title=\"Link to this heading\">#</a></h1><p>This section covers the requirements for installing FlagQuantum and guides you\nthrough the installation process.</p>", "a[href=\"FlagQuantum_overview/FlagQuantum-overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagQuantum Overview<a class=\"headerlink\" href=\"#flagquantum-overview\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum is a sharded, differentiable quantum simulation and training\nframework built on PyTorch. It turns quantum circuits into trainable models,\noffers several simulation representations behind one program, and reaches\ndomestic accelerators through FlagOS. It is part of the FlagOS ecosystem \u2014 a\nunified, open-source AI system software stack that fosters an open technology\necosystem by seamlessly integrating various models, systems, and chips.</p>", "a[href=\"reference/reference.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Reference<a class=\"headerlink\" href=\"#reference\" title=\"Link to this heading\">#</a></h1><p>Stable interfaces, configuration and support boundaries.</p>"}
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
