selector_to_html = {"a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">fused</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">vLLM</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">MoE</span></code></p>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Fused MoE with GPTQ INT8 (uint8b128) W8A16 weights; Triton wna16 fused-dequant GEMM with SwiGLU activation, aligned with vLLM\u2019s fused_marlin_moe call signature.</p>", "a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#fused-marlin-moe-w8a16-int8\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">fused_marlin_moe_w8a16_int8<a class=\"headerlink\" href=\"#fused-marlin-moe-w8a16-int8\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> NeuralNetwork | <strong>Stage:</strong> beta | <strong>Since:</strong> 5.4</p>"}
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
