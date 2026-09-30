selector_to_html = {"a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u5b50<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u5b8c\u6574\u7684\u7b97\u5b50\u6ce8\u518c\u8868\u7ef4\u62a4\u5728 <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagSparse/blob/main/conf/operators.yaml\">FlagSparse conf/operators.yaml</a>\u3002</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7a00\u758f\u683c\u5f0f<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flagsparse\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagSparse \u6982\u89c8<a class=\"headerlink\" href=\"#flagsparse\" title=\"Link to this heading\">#</a></h1><p>FlagSparse \u662f <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> \u7684\u7ec4\u6210\u90e8\u5206\u3002FlagSparse \u662f\u4e00\u4e2a\u9762\u5411\u591a\u82af\u7247\u540e\u7aef\u7684\u7a00\u758f\u77e9\u9635\u8fd0\u7b97\u5e93\uff0c\u5b9a\u4e49\u4e86 SpMV\u3001SpMM\u3001SpGEMM\u3001SDDMM \u7b49\u6838\u5fc3\u7a00\u758f\u64cd\u4f5c\uff0c\u652f\u6301\u79d1\u5b66\u8ba1\u7b97\u3001\u5de5\u7a0b\u4eff\u771f\u3001\u673a\u5668\u5b66\u4e60\u548c\u4eba\u5de5\u667a\u80fd\u7b49\u9886\u57df\u7684\u9ad8\u6027\u80fd\u8ba1\u7b97\u3002</p><p>FlagSparse \u662f\u4f7f\u7528 OpenAI \u63a8\u51fa\u7684 <a class=\"reference external\" href=\"https://github.com/triton-lang/triton\">Triton \u7f16\u7a0b\u8bed\u8a00</a> \u5b9e\u73b0\u7684\u9ad8\u6027\u80fd\u7a00\u758f\u7b97\u5b50\u5e93\u3002</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u67b6\u6784<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u7a00\u758f\u683c\u5f0f\u6784\u9020\u51fd\u6570<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h3><p>create_csr_matrix\u3001create_coo_matrix\u3001create_csc_matrix\u3001create_bsr_matrix\u3001create_sell_matrix\u3001create_blocked_ell_matrix\u3001coo_to_csr\u3001coo_to_csc\u3001coo_to_bsr\u3001coo_to_sell\u3001coo_to_blocked_ell\u3001generate_random_sparse_matrix\u3001read_mtx_file</p>"}
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
