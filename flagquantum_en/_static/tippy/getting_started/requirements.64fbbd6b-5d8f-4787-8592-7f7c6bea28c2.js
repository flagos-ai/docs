selector_to_html = {"a[href=\"#support-boundaries-to-read-before-choosing-a-target\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Support boundaries to read before choosing a target<a class=\"headerlink\" href=\"#support-boundaries-to-read-before-choosing-a-target\" title=\"Link to this heading\">#</a></h2><p>The maturity of every capability, and what each target has actually been\nexecuted with, is published in the\n<a class=\"reference internal\" href=\"../reference/capabilities.html\"><span class=\"std std-doc\">capability reference</span></a>. An implemented API is not\nautomatically production support.</p>", "a[href=\"../reference/capabilities.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Capability reference<a class=\"headerlink\" href=\"#capability-reference\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum publishes the maturity of every capability instead of implying it\nfrom an example. This page is a summary; the repository\u2019s machine-validated\ncapability matrix is authoritative.</p>", "a[href=\"#software-requirements\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Software requirements<a class=\"headerlink\" href=\"#software-requirements\" title=\"Link to this heading\">#</a></h2><p>The released package depends on PyTorch only. Everything else is optional.</p>", "a[href=\"#supported-hardware-platforms\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Supported hardware platforms<a class=\"headerlink\" href=\"#supported-hardware-platforms\" title=\"Link to this heading\">#</a></h2><p>FlagQuantum does not detect or dispatch a specific domestic accelerator by\ndevice name. Torch-FL owns vendor detection, runtime activation and the\ncompatibility route, and exposes it through the <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> contract.</p>", "a[href=\"#optional-dependency-groups\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Optional dependency groups<a class=\"headerlink\" href=\"#optional-dependency-groups\" title=\"Link to this heading\">#</a></h2><p>Interoperability adapters are optional control-plane boundaries: importing\n<code class=\"docutils literal notranslate\"><span class=\"pre\">flagquantum</span></code> never imports Qiskit, PennyLane, Cirq or another external\nframework.</p>", "a[href=\"#requirements\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><p>This section includes information about the hardware platforms and software\nrequirements for FlagQuantum.</p>"}
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
