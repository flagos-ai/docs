selector_to_html = {"a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code></p>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Puts values from the tensor <code class=\"docutils literal notranslate\"><span class=\"pre\">values</span></code> into the tensor <code class=\"docutils literal notranslate\"><span class=\"pre\">input</span></code> using the indices specified\nin <code class=\"docutils literal notranslate\"><span class=\"pre\">indices</span></code> (which is a tuple of Tensors), matching <code class=\"docutils literal notranslate\"><span class=\"pre\">aten._unsafe_index_put</span></code>. The\nunsafe variant skips autograd history recording and assumes the caller passes valid\nindices; it shares the semantics of <code class=\"docutils literal notranslate\"><span class=\"pre\">index_put</span></code>, including the <code class=\"docutils literal notranslate\"><span class=\"pre\">accumulate</span></code> flag.</p>", "a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#unsafe-index-put\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">unsafe_index_put<a class=\"headerlink\" href=\"#unsafe-index-put\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> Tensor | <strong>Stage:</strong> beta | <strong>Since:</strong> 5.5</p>"}
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
