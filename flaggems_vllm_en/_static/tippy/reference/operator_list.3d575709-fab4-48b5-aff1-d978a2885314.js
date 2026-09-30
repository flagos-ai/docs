selector_to_html = {"a[href=\"#normalization\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Normalization<a class=\"headerlink\" href=\"#normalization\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#mhc-manifold-constrained-hyper-connections\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">MHC - Manifold-Constrained Hyper-Connections<a class=\"headerlink\" href=\"#mhc-manifold-constrained-hyper-connections\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#mixture-of-experts-moe\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Mixture of Experts (MoE)<a class=\"headerlink\" href=\"#mixture-of-experts-moe\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#quantization\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Quantization<a class=\"headerlink\" href=\"#quantization\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#reduction-and-utility\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Reduction and Utility<a class=\"headerlink\" href=\"#reduction-and-utility\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#fla-flash-linear-attention\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FLA - Flash Linear Attention<a class=\"headerlink\" href=\"#fla-flash-linear-attention\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#qwen4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Qwen4<a class=\"headerlink\" href=\"#qwen4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#dsa-deep-sparse-attention\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">DSA - Deep Sparse Attention<a class=\"headerlink\" href=\"#dsa-deep-sparse-attention\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#operator-list\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Operator List<a class=\"headerlink\" href=\"#operator-list\" title=\"Link to this heading\">#</a></h1><p>This page lists the operators exported by FlagGems-vLLM, sourced from <code class=\"docutils literal notranslate\"><span class=\"pre\">src/flaggems_vllm/ops/__init__.py</span></code>.</p><p>FlagGems-vLLM provides optimized implementations of common vLLM operators using the Triton programming language. The following 109 operators are currently exported:</p>", "a[href=\"#linear-and-matrix\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Linear and Matrix<a class=\"headerlink\" href=\"#linear-and-matrix\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#attention\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Attention<a class=\"headerlink\" href=\"#attention\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#deepseek-v4-attention\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">DeepSeek V4 Attention<a class=\"headerlink\" href=\"#deepseek-v4-attention\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#activation-and-gating\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Activation and Gating<a class=\"headerlink\" href=\"#activation-and-gating\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#rwkv\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">RWKV<a class=\"headerlink\" href=\"#rwkv\" title=\"Link to this heading\">#</a></h2>"}
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
