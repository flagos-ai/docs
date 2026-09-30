selector_to_html = {"a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">Reduction</span></code></p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Backward pass for <code class=\"docutils literal notranslate\"><span class=\"pre\">cumprod</span></code>. Given the output gradient, the forward input and the forward\noutput, computes the gradient with respect to the input. Zero elements along the reduction\ndimension are handled explicitly: the reverse cumulative sum of <code class=\"docutils literal notranslate\"><span class=\"pre\">grad</span> <span class=\"pre\">*</span> <span class=\"pre\">output</span></code> divided by\n<code class=\"docutils literal notranslate\"><span class=\"pre\">input</span></code> gives the gradient for non-zero positions, while the first zero position uses a\nmodified cumulative product. Accumulation is performed in float32 for numerical stability.</p>", "a[href=\"#cumprod-backward\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">cumprod_backward<a class=\"headerlink\" href=\"#cumprod-backward\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> Math | <strong>Stage:</strong> alpha | <strong>Since:</strong> 5.5.0</p>", "a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>"}
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
