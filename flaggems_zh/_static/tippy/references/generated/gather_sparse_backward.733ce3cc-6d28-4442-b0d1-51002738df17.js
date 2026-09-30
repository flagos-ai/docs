selector_to_html = {"a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">KernelGen</span></code></p>", "a[href=\"#gather-sparse-backward\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">gather_sparse_backward<a class=\"headerlink\" href=\"#gather-sparse-backward\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> Tensor | <strong>Stage:</strong> alpha | <strong>Since:</strong> 5.4</p>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Backward of <code class=\"docutils literal notranslate\"><span class=\"pre\">gather()</span></code> producing a sparse (COO) gradient w.r.t. <code class=\"docutils literal notranslate\"><span class=\"pre\">self</span></code>. Each entry of the flattened <code class=\"docutils literal notranslate\"><span class=\"pre\">grad</span></code>/<code class=\"docutils literal notranslate\"><span class=\"pre\">index</span></code> contributes one non-zero at the gather position <code class=\"docutils literal notranslate\"><span class=\"pre\">index[...,</span> <span class=\"pre\">]</span></code> along <code class=\"docutils literal notranslate\"><span class=\"pre\">dim</span></code> (the other coordinates are the unraveled index of the entry). The result is an uncoalesced sparse COO tensor of size <code class=\"docutils literal notranslate\"><span class=\"pre\">self.size()</span></code>.</p>", "a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>"}
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
