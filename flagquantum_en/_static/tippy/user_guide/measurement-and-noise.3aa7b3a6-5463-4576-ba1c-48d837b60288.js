selector_to_html = {"a[href=\"#dynamic-circuits\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Dynamic circuits<a class=\"headerlink\" href=\"#dynamic-circuits\" title=\"Link to this heading\">#</a></h2><p>The candidate-stable builder is isolated from experimental execution:</p>", "a[href=\"#measurement-and-noise\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Measurement and noise<a class=\"headerlink\" href=\"#measurement-and-noise\" title=\"Link to this heading\">#</a></h1><h2>Observables and outputs<a class=\"headerlink\" href=\"#observables-and-outputs\" title=\"Link to this heading\">#</a></h2><p>Describe mathematical observables with <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.X</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Y</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Z</span></code>, then request\nnamed outputs from <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.plan</span></code> or <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.run</span></code>. Pauli products use <code class=\"docutils literal notranslate\"><span class=\"pre\">@</span></code>; Hamiltonian\nsums and real coefficients use ordinary arithmetic.</p>", "a[href=\"#noise-models\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Noise models<a class=\"headerlink\" href=\"#noise-models\" title=\"Link to this heading\">#</a></h2><p>Stable noisy execution accepts a <code class=\"docutils literal notranslate\"><span class=\"pre\">flagquantum.noise.NoiseModel</span></code> during planning:</p>", "a[href=\"#hardware-pauli-measurement-planning\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Hardware Pauli measurement planning<a class=\"headerlink\" href=\"#hardware-pauli-measurement-planning\" title=\"Link to this heading\">#</a></h2><p>Use <code class=\"docutils literal notranslate\"><span class=\"pre\">create_pauli_measurement_plan</span></code> to measure a Hamiltonian containing X, Y\nand Z terms on shot-based hardware. It greedily groups qubit-wise-commuting\nterms, appends the required basis rotations and creates one sealed deployment\npackage per group:</p>", "a[href=\"#observables-and-outputs\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Observables and outputs<a class=\"headerlink\" href=\"#observables-and-outputs\" title=\"Link to this heading\">#</a></h2><p>Describe mathematical observables with <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.X</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Y</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Z</span></code>, then request\nnamed outputs from <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.plan</span></code> or <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.run</span></code>. Pauli products use <code class=\"docutils literal notranslate\"><span class=\"pre\">@</span></code>; Hamiltonian\nsums and real coefficients use ordinary arithmetic.</p>"}
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
