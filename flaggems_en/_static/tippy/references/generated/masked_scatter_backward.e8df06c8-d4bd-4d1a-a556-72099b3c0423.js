selector_to_html = {"a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code></p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Backward of <code class=\"docutils literal notranslate\"><span class=\"pre\">masked_scatter</span></code> with respect to the <code class=\"docutils literal notranslate\"><span class=\"pre\">source</span></code> tensor.\nReturns a tensor of shape <code class=\"docutils literal notranslate\"><span class=\"pre\">sizes</span></code> where the first <code class=\"docutils literal notranslate\"><span class=\"pre\">mask.sum()</span></code> elements\nare the gradient values from the positions where <code class=\"docutils literal notranslate\"><span class=\"pre\">mask</span></code> was True\n(obtained via stream-compaction / masked_select), and the remaining\nelements are zero (the tail of <code class=\"docutils literal notranslate\"><span class=\"pre\">source</span></code> that was never consumed by the\nforward pass).</p>", "a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#masked-scatter-backward\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">masked_scatter_backward<a class=\"headerlink\" href=\"#masked-scatter-backward\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> tensor | <strong>Stage:</strong> alpha | <strong>Since:</strong> 5.4</p>"}
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
