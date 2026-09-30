selector_to_html = {"a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#linalg-norm\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">linalg_norm<a class=\"headerlink\" href=\"#linalg-norm\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> LinearAlg | <strong>Stage:</strong> beta | <strong>Since:</strong> 5.4</p>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code></p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Computes a vector or matrix norm, mirroring torch.linalg.norm dispatch.\nThe vector branch (ord=None/2/1/0/p/\u00b1inf, dim as int or 1-tuple or None)\nreuses linalg_vector_norm; the matrix branch (ord=\u2018fro\u2019/\u2018nuc\u2019/\u00b11/\u00b12/\u00b1inf,\ndim as 2-tuple) reuses linalg_matrix_norm.</p>", "a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>"}
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
