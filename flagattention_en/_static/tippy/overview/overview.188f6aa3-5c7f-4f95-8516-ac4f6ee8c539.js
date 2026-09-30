selector_to_html = {"a[href=\"#flagattention-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagAttention Overview<a class=\"headerlink\" href=\"#flagattention-overview\" title=\"Link to this heading\">#</a></h1><p>FlagAttention is part of <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a>. It is a collection of memory-efficient attention operators implemented in the <a class=\"reference external\" href=\"https://github.com/triton-lang/triton\">Triton language</a>, targeting model training and inference workloads that need custom attention-score transformations, paged or sparse KV-cache layouts, or recurrent linear-attention kernels.</p><p>Like <a class=\"reference external\" href=\"https://arxiv.org/abs/2205.14135\">FlashAttention</a>, the dense kernels tile the computation and recompute intermediates instead of materializing the full attention matrix. The repository also contains decoding, block-sparse, quantized, and recurrent operators that do not fit the standard scaled-dot-product-attention interface.</p>", "a[href=\"#features\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#architecture\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Architecture<a class=\"headerlink\" href=\"#architecture\" title=\"Link to this heading\">#</a></h2><p>Device metadata follows the FlagGems/FlagGems-vLLM convention, and the top-level package exports the dense, paged, recurrent, KDA/GDN2 and MiniMax APIs. SageAttention and Parallel NSA are submodule APIs. Vendor-specific development interfaces live under <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_attn.runtime.backend._&lt;vendor&gt;</span></code> and are not treated as stable public APIs.</p>", "a[href=\"#workflow\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Workflow<a class=\"headerlink\" href=\"#workflow\" title=\"Link to this heading\">#</a></h2>"}
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
