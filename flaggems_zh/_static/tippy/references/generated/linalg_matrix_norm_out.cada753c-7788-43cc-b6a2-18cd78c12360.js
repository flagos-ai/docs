selector_to_html = {"a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code></p>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Out-of-place version of linalg_matrix_norm,\nComputes the matrix norm over the given dimensions.\nSupports ord values: 1, -1, 2, -2, inf, -inf, \u2018fro\u2019, \u2018nuc\u2019.\nFor ord=2/-2/nuc, internally uses SVD (singular value decomposition).\nFor ord=1/-1/inf/-inf, uses max/min absolute column/row sums.\nFor ord=\u2018fro\u2019, uses Frobenius norm via per-row L2 reduction.</p>", "a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#linalg-matrix-norm-out\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">linalg_matrix_norm_out<a class=\"headerlink\" href=\"#linalg-matrix-norm-out\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> LinearAlg | <strong>Stage:</strong> beta | <strong>Since:</strong> 5.5</p>"}
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
