selector_to_html = {"a[href=\"#quantum-error-correction\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Quantum error correction<a class=\"headerlink\" href=\"#quantum-error-correction\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagquantum.qec</span></code> connects syndrome extraction, decoding, correction and\nlogical-result analysis. The reference experiment is a three-data-qubit\nrepetition-code memory experiment with an injected error:</p>", "a[href=\"#local-hamiltonian-gradients\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Local Hamiltonian gradients<a class=\"headerlink\" href=\"#local-hamiltonian-gradients\" title=\"Link to this heading\">#</a></h2><p>For batch-size-one statevector circuits with real, constant-coefficient Z and\nZZ terms, <code class=\"docutils literal notranslate\"><span class=\"pre\">Hamiltonian.expectation</span></code> exposes a memory-bounded adjoint path:</p>", "a[href=\"#algorithm-units\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Algorithm units<a class=\"headerlink\" href=\"#algorithm-units\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagquantum.algorithms</span></code> composes user-facing algorithm units on top of the\nstable circuit and runtime API. They are exported from the subpackage surface\nrather than the <code class=\"docutils literal notranslate\"><span class=\"pre\">fq</span></code> alias.</p>", "a[href=\"#qpu-digital-twins\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">QPU digital twins<a class=\"headerlink\" href=\"#qpu-digital-twins\" title=\"Link to this heading\">#</a></h2><p>A digital twin is a calibration-conditioned model of one device, built from a\n<code class=\"docutils literal notranslate\"><span class=\"pre\">NoiseModel</span></code> carrying a device profile. The execution target and ordered\nphysical mapping become part of the immutable twin identity:</p>", "a[href=\"#algorithms-error-correction-and-digital-twins\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Algorithms, error correction and digital twins<a class=\"headerlink\" href=\"#algorithms-error-correction-and-digital-twins\" title=\"Link to this heading\">#</a></h1><h2>Algorithm units<a class=\"headerlink\" href=\"#algorithm-units\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagquantum.algorithms</span></code> composes user-facing algorithm units on top of the\nstable circuit and runtime API. They are exported from the subpackage surface\nrather than the <code class=\"docutils literal notranslate\"><span class=\"pre\">fq</span></code> alias.</p>"}
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
