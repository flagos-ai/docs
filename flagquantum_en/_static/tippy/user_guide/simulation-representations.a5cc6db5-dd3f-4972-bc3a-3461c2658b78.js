selector_to_html = {"a[href=\"#mps-and-tensor-network-workflows\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">MPS and tensor-network workflows<a class=\"headerlink\" href=\"#mps-and-tensor-network-workflows\" title=\"Link to this heading\">#</a></h2><p>The 1000-qubit dimer example is a structure-aware MPS benchmark for the\nPyTorch-facing JAX/MPS path; it is not a claim about arbitrary 1000-qubit\ncircuits. See the <a class=\"reference internal\" href=\"../reference/capabilities.html\"><span class=\"std std-doc\">capability reference</span></a> for the\nexact scope of every representation.</p>", "a[href=\"../reference/capabilities.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Capability reference<a class=\"headerlink\" href=\"#capability-reference\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum publishes the maturity of every capability instead of implying it\nfrom an example. This page is a summary; the repository\u2019s machine-validated\ncapability matrix is authoritative.</p>", "a[href=\"#request-a-representation-explicitly\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Request a representation explicitly<a class=\"headerlink\" href=\"#request-a-representation-explicitly\" title=\"Link to this heading\">#</a></h2><p>Local statevector execution is the default. Select one locally controlled GPU\nexplicitly when you need it:</p>", "a[href=\"#ask-the-planner\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Ask the planner<a class=\"headerlink\" href=\"#ask-the-planner\" title=\"Link to this heading\">#</a></h2><p>When you are unsure which representation fits, plan first: the runtime planner\nreports the selected representation, gradient support and any blockers instead\nof failing at execution time.</p>", "a[href=\"#simulation-representations\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Simulation representations<a class=\"headerlink\" href=\"#simulation-representations\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum exposes several simulation representations behind one program, so a\nmodel does not have to be rewritten when the workload changes.</p>", "a[href=\"#switch-representation-without-editing-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Switch representation without editing code<a class=\"headerlink\" href=\"#switch-representation-without-editing-code\" title=\"Link to this heading\">#</a></h2><p>The same hybrid model \u2014 a <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.nn.Linear</span></code> encoder feeding an <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Module</span></code>\nquantum layer \u2014 trains on each representation in one PyTorch optimizer loop.</p>"}
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
