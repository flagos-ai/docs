selector_to_html = {"a[href=\"#individual-test-scripts\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Individual Test Scripts<a class=\"headerlink\" href=\"#individual-test-scripts\" title=\"Link to this heading\">#</a></h2><h3>test_gather.py / test_scatter.py \u2013 gather/scatter benchmarks<a class=\"headerlink\" href=\"#test-gather-py-test-scatter-py-gather-scatter-benchmarks\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-spmv-py-csr-spmv\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spmv.py \u2013 CSR SpMV<a class=\"headerlink\" href=\"#test-spmv-py-csr-spmv\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#running-tests-and-benchmarks\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Running Tests and Benchmarks<a class=\"headerlink\" href=\"#running-tests-and-benchmarks\" title=\"Link to this heading\">#</a></h1><h2>Operator Test Runners<a class=\"headerlink\" href=\"#operator-test-runners\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#test-spmm-py-csr-spmm\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spmm.py \u2013 CSR SpMM<a class=\"headerlink\" href=\"#test-spmm-py-csr-spmm\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-spsv-py-spsv-triangular-solve\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spsv.py \u2013 SpSV (triangular solve)<a class=\"headerlink\" href=\"#test-spsv-py-spsv-triangular-solve\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-spmm-coo-py-coo-spmm\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spmm_coo.py \u2013 COO SpMM<a class=\"headerlink\" href=\"#test-spmm-coo-py-coo-spmm\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-sddmm-py-csr-sddmm\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_sddmm.py \u2013 CSR SDDMM<a class=\"headerlink\" href=\"#test-sddmm-py-csr-sddmm\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#ci-cd\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">CI/CD<a class=\"headerlink\" href=\"#ci-cd\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#test-gather-py-test-scatter-py-gather-scatter-benchmarks\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_gather.py / test_scatter.py \u2013 gather/scatter benchmarks<a class=\"headerlink\" href=\"#test-gather-py-test-scatter-py-gather-scatter-benchmarks\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-spmv-coo-py-coo-spmv\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spmv_coo.py \u2013 COO SpMV<a class=\"headerlink\" href=\"#test-spmv-coo-py-coo-spmv\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-spsm-py-spsm-triangular-matrix-matrix-solve\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spsm.py \u2013 SpSM (triangular matrix-matrix solve)<a class=\"headerlink\" href=\"#test-spsm-py-spsm-triangular-matrix-matrix-solve\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-spgemm-py-csr-spgemm\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spgemm.py \u2013 CSR SpGEMM<a class=\"headerlink\" href=\"#test-spgemm-py-csr-spgemm\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#operator-test-runners\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Operator Test Runners<a class=\"headerlink\" href=\"#operator-test-runners\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#direct-pytest-accuracy-suite\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Direct pytest Accuracy Suite<a class=\"headerlink\" href=\"#direct-pytest-accuracy-suite\" title=\"Link to this heading\">#</a></h2>"}
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
