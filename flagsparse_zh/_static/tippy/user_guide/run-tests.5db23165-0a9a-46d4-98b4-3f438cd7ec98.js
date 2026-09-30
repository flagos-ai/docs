selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u8fd0\u884c\u6d4b\u8bd5\u548c\u57fa\u51c6\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u7b97\u5b50\u6d4b\u8bd5\u8fd0\u884c\u5668<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u72ec\u7acb\u6d4b\u8bd5\u811a\u672c<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><h3>test_gather.py / test_scatter.py \u2014\u2014 gather/scatter \u57fa\u51c6\u6d4b\u8bd5<a class=\"headerlink\" href=\"#test-gather-py-test-scatter-py-gather-scatter\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-gather-py-test-scatter-py-gather-scatter\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_gather.py / test_scatter.py \u2014\u2014 gather/scatter \u57fa\u51c6\u6d4b\u8bd5<a class=\"headerlink\" href=\"#test-gather-py-test-scatter-py-gather-scatter\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#ci-cd\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">CI/CD<a class=\"headerlink\" href=\"#ci-cd\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#test-spmm-coo-py-coo-spmm\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spmm_coo.py \u2014\u2014 COO SpMM<a class=\"headerlink\" href=\"#test-spmm-coo-py-coo-spmm\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-spsm-py-spsm\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spsm.py \u2014\u2014 SpSM\uff08\u4e09\u89d2\u77e9\u9635-\u77e9\u9635\u6c42\u89e3\uff09<a class=\"headerlink\" href=\"#test-spsm-py-spsm\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-sddmm-py-csr-sddmm\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_sddmm.py \u2014\u2014 CSR SDDMM<a class=\"headerlink\" href=\"#test-sddmm-py-csr-sddmm\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-spgemm-py-csr-spgemm\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spgemm.py \u2014\u2014 CSR SpGEMM<a class=\"headerlink\" href=\"#test-spgemm-py-csr-spgemm\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-spmv-coo-py-coo-spmv\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spmv_coo.py \u2014\u2014 COO SpMV<a class=\"headerlink\" href=\"#test-spmv-coo-py-coo-spmv\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-spsv-py-spsv\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spsv.py \u2014\u2014 SpSV\uff08\u4e09\u89d2\u6c42\u89e3\uff09<a class=\"headerlink\" href=\"#test-spsv-py-spsv\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#test-spmv-py-csr-spmv\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spmv.py \u2014\u2014 CSR SpMV<a class=\"headerlink\" href=\"#test-spmv-py-csr-spmv\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#pytest\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u76f4\u63a5 pytest \u7cbe\u5ea6\u5957\u4ef6<a class=\"headerlink\" href=\"#pytest\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#test-spmm-py-csr-spmm\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">test_spmm.py \u2014\u2014 CSR SpMM<a class=\"headerlink\" href=\"#test-spmm-py-csr-spmm\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u5b50\u6d4b\u8bd5\u8fd0\u884c\u5668<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>"}
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
