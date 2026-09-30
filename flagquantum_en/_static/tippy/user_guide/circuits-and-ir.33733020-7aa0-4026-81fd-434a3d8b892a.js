selector_to_html = {"a[href=\"#circuits-and-flagquantum-ir\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Circuits and FlagQuantum IR<a class=\"headerlink\" href=\"#circuits-and-flagquantum-ir\" title=\"Link to this heading\">#</a></h1><h2>Circuit construction<a class=\"headerlink\" href=\"#circuit-construction\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Circuit(n_qubits=...)</span></code> is the preferred public spelling for circuit size.\nPositional construction, <code class=\"docutils literal notranslate\"><span class=\"pre\">n_wires=</span></code> and the legacy <code class=\"docutils literal notranslate\"><span class=\"pre\">nqubits=</span></code> remain\ncompatible; conflicting aliases fail during construction. Runtime, compiler and\nIR internals continue to use <em>wire</em> for logical mappings.</p>", "a[href=\"#errors\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Errors<a class=\"headerlink\" href=\"#errors\" title=\"Link to this heading\">#</a></h2><p>Catch stable lifecycle categories from <code class=\"docutils literal notranslate\"><span class=\"pre\">flagquantum.errors</span></code>:</p>", "a[href=\"#ir-serialization-and-validation\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">IR serialization and validation<a class=\"headerlink\" href=\"#ir-serialization-and-validation\" title=\"Link to this heading\">#</a></h2><p>FlagQuantum IR is versioned, serializable and validated. <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.CircuitIR</span></code> is part\nof the stable surface, and <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.IR_VERSION</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.IRSerializationError</span></code> and\n<code class=\"docutils literal notranslate\"><span class=\"pre\">fq.IRValidationError</span></code> describe the boundary. Incompatible schema changes\nrequire an explicit migration.</p>", "a[href=\"#target-aware-compilation-and-routing\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Target-aware compilation and routing<a class=\"headerlink\" href=\"#target-aware-compilation-and-routing\" title=\"Link to this heading\">#</a></h2><p>When a concrete topology matters, provide an explicit coupling map:</p>", "a[href=\"#target-independent-optimization\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Target-independent optimization<a class=\"headerlink\" href=\"#target-independent-optimization\" title=\"Link to this heading\">#</a></h2><p>Compiler optimization is an expert-facing, target-independent transformation\nthat returns new IR and leaves the input unchanged:</p>", "a[href=\"#circuit-construction\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Circuit construction<a class=\"headerlink\" href=\"#circuit-construction\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Circuit(n_qubits=...)</span></code> is the preferred public spelling for circuit size.\nPositional construction, <code class=\"docutils literal notranslate\"><span class=\"pre\">n_wires=</span></code> and the legacy <code class=\"docutils literal notranslate\"><span class=\"pre\">nqubits=</span></code> remain\ncompatible; conflicting aliases fail during construction. Runtime, compiler and\nIR internals continue to use <em>wire</em> for logical mappings.</p>"}
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
