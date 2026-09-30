selector_to_html = {"a[href=\"#architecture\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Architecture<a class=\"headerlink\" href=\"#architecture\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#sparse-formats\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Sparse Formats<a class=\"headerlink\" href=\"#sparse-formats\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#operators\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Operators<a class=\"headerlink\" href=\"#operators\" title=\"Link to this heading\">#</a></h2><p>The complete operator registry is maintained at <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagSparse/blob/main/conf/operators.yaml\">FlagSparse conf/operators.yaml</a>.</p>", "a[href=\"#flagsparse-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagSparse Overview<a class=\"headerlink\" href=\"#flagsparse-overview\" title=\"Link to this heading\">#</a></h1><p>FlagSparse is part of <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a>. FlagSparse is a computing library that provides sparse matrix operations and is oriented towards multiple chip backends. It defines core sparse operations such as SpMV, SpMM, SpGEMM, and SDDMM, supporting high-performance computing in fields such as scientific computing, engineering simulation, machine learning, and artificial intelligence.</p><p>FlagSparse is a high-performance sparse operator library implemented using the <a class=\"reference external\" href=\"https://github.com/triton-lang/triton\">Triton programming language</a> launched by OpenAI.</p>", "a[href=\"#sparse-format-constructors\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Sparse Format Constructors<a class=\"headerlink\" href=\"#sparse-format-constructors\" title=\"Link to this heading\">#</a></h3><p>create_csr_matrix, create_coo_matrix, create_csc_matrix, create_bsr_matrix, create_sell_matrix, create_blocked_ell_matrix, coo_to_csr, coo_to_csc, coo_to_bsr, coo_to_sell, coo_to_blocked_ell, generate_random_sparse_matrix, read_mtx_file</p>"}
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
