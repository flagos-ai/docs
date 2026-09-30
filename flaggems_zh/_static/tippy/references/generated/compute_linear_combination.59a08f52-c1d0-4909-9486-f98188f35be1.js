selector_to_html = {"a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">KernelGen</span></code></p>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Computes a batched linear combination: given <code class=\"docutils literal notranslate\"><span class=\"pre\">coefficients</span></code> of shape\n<code class=\"docutils literal notranslate\"><span class=\"pre\">[m,</span> <span class=\"pre\">n]</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">input</span></code> of shape <code class=\"docutils literal notranslate\"><span class=\"pre\">[n,</span> <span class=\"pre\">...]</span></code>, returns an output of shape\n<code class=\"docutils literal notranslate\"><span class=\"pre\">[m,</span> <span class=\"pre\">...]</span></code> where <code class=\"docutils literal notranslate\"><span class=\"pre\">output[i,</span> <span class=\"pre\">...]</span> <span class=\"pre\">=</span> <span class=\"pre\">sum_j</span> <span class=\"pre\">coefficients[i,</span> <span class=\"pre\">j]</span> <span class=\"pre\">*</span> <span class=\"pre\">input[j,</span> <span class=\"pre\">...]</span></code>\n(equivalent to <code class=\"docutils literal notranslate\"><span class=\"pre\">coefficients</span> <span class=\"pre\">@</span> <span class=\"pre\">input.flatten(1)</span></code>). Backs the string-padding\nform dispatched by <code class=\"docutils literal notranslate\"><span class=\"pre\">torch._compute_linear_combination</span></code>.</p>", "a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#compute-linear-combination\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">compute_linear_combination<a class=\"headerlink\" href=\"#compute-linear-combination\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> BLAS | <strong>Stage:</strong> alpha | <strong>Since:</strong> 5.4</p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>"}
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
