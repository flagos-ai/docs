selector_to_html = {"a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">KernelGen</span></code></p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Triton kernel implementation for <code class=\"docutils literal notranslate\"><span class=\"pre\">_fill_mem_eff_dropout_mask_</span></code>, the in-place\nhelper used by the memory efficient attention dropout path. It fills a\ncontiguous 4D float32 tensor of shape <code class=\"docutils literal notranslate\"><span class=\"pre\">(batch,</span> <span class=\"pre\">heads,</span> <span class=\"pre\">queries,</span> <span class=\"pre\">keys)</span></code> with\nrandom uniform values in [0, 1) drawn from a Philox4x32-10 stream\nidentified by <code class=\"docutils literal notranslate\"><span class=\"pre\">seed</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">offset</span></code>.</p>", "a[href=\"#fill-mem-eff-dropout-mask\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">fill_mem_eff_dropout_mask_<a class=\"headerlink\" href=\"#fill-mem-eff-dropout-mask\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> NeuralNetwork | <strong>Stage:</strong> alpha | <strong>Since:</strong> 5.4</p>", "a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>"}
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
