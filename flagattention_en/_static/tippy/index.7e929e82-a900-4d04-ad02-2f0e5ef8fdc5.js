selector_to_html = {"a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with FlagAttention<a class=\"headerlink\" href=\"#getting-started-with-flagattention\" title=\"Link to this heading\">#</a></h1>", "a[href=\"reference/operator-registry.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Operator Registry<a class=\"headerlink\" href=\"#operator-registry\" title=\"Link to this heading\">#</a></h1><p>The complete registry, including stages, tests and benchmark entry points, is maintained at <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagAttention/blob/main/conf/operators.yaml\">FlagAttention conf/operators.yaml</a>.</p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagAttention Overview<a class=\"headerlink\" href=\"#flagattention-overview\" title=\"Link to this heading\">#</a></h1><p>FlagAttention is part of <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a>. It is a collection of memory-efficient attention operators implemented in the <a class=\"reference external\" href=\"https://github.com/triton-lang/triton\">Triton language</a>, targeting model training and inference workloads that need custom attention-score transformations, paged or sparse KV-cache layouts, or recurrent linear-attention kernels.</p><p>Like <a class=\"reference external\" href=\"https://arxiv.org/abs/2205.14135\">FlashAttention</a>, the dense kernels tile the computation and recompute intermediates instead of materializing the full attention matrix. The repository also contains decoding, block-sparse, quantized, and recurrent operators that do not fit the standard scaled-dot-product-attention interface.</p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">User Guide<a class=\"headerlink\" href=\"#user-guide\" title=\"Link to this heading\">#</a></h1><h2>Dense attention<a class=\"headerlink\" href=\"#dense-attention\" title=\"Link to this heading\">#</a></h2><h3>FlashAttention<a class=\"headerlink\" href=\"#flashattention\" title=\"Link to this heading\">#</a></h3><p>The complete interface is:</p>", "a[href=\"#flagattention-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagAttention Documentation<a class=\"headerlink\" href=\"#flagattention-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>"}
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
