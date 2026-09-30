selector_to_html = {"a[href=\"../reference/capabilities.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Capability reference<a class=\"headerlink\" href=\"#capability-reference\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum publishes the maturity of every capability instead of implying it\nfrom an example. This page is a summary; the repository\u2019s machine-validated\ncapability matrix is authoritative.</p>", "a[href=\"#support-boundaries\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Support boundaries<a class=\"headerlink\" href=\"#support-boundaries\" title=\"Link to this heading\">#</a></h2><p>Implementing a feature is not the same as supporting it in production.\nFlagQuantum publishes the maturity of every capability \u2014 release certified,\nproduction supported, development evidence, or experimental \u2014 in the\n<a class=\"reference internal\" href=\"../reference/capabilities.html\"><span class=\"std std-doc\">capability reference</span></a>, and the tested workflows\nand remaining research goals are listed there rather than implied by an\nexample.</p>", "a[href=\"#why-flagquantum\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Why FlagQuantum?<a class=\"headerlink\" href=\"#why-flagquantum\" title=\"Link to this heading\">#</a></h2><p>As quantum circuits grow in qubit count and depth, exact simulation becomes\nprohibitively expensive, and moving a working model onto real hardware usually\nmeans rewriting it. FlagQuantum addresses both problems with one public model:</p>", "a[href=\"#flagquantum-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagQuantum Overview<a class=\"headerlink\" href=\"#flagquantum-overview\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum is a sharded, differentiable quantum simulation and training\nframework built on PyTorch. It turns quantum circuits into trainable models,\noffers several simulation representations behind one program, and reaches\ndomestic accelerators through FlagOS. It is part of the FlagOS ecosystem \u2014 a\nunified, open-source AI system software stack that fosters an open technology\necosystem by seamlessly integrating various models, systems, and chips.</p>", "a[href=\"#key-concepts\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Key concepts<a class=\"headerlink\" href=\"#key-concepts\" title=\"Link to this heading\">#</a></h2><p>Planning is not execution evidence. A plan describes intent and estimates;\nruntime records describe what actually ran.</p>", "a[href=\"#one-program-several-execution-targets\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">One program, several execution targets<a class=\"headerlink\" href=\"#one-program-several-execution-targets\" title=\"Link to this heading\">#</a></h2><p>The architectural invariant is simple: backend selection may change execution,\nbut it must not change the meaning of the program or the result contract.</p>", "a[href=\"#who-it-is-for\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Who it is for<a class=\"headerlink\" href=\"#who-it-is-for\" title=\"Link to this heading\">#</a></h2>"}
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
