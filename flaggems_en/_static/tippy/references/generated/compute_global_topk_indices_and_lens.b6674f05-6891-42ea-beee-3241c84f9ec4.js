selector_to_html = {"a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">fused</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">Attention</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">vLLM</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">DeepSeekV4</span></code></p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Converts local top-k sparse attention indices to global KV-cache indices and computes\nvalid top-k lengths for DeepSeekV4 attention.</p>", "a[href=\"#compute-global-topk-indices-and-lens\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">compute_global_topk_indices_and_lens<a class=\"headerlink\" href=\"#compute-global-topk-indices-and-lens\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> NeuralNetwork | <strong>Stage:</strong> beta | <strong>Since:</strong> 5.3</p>", "a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>"}
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
