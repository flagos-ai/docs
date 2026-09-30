selector_to_html = {"a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code></p>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Metadata-only check that returns True when <code class=\"docutils literal notranslate\"><span class=\"pre\">self</span></code> can shallow-copy the\nTensorImpl type of <code class=\"docutils literal notranslate\"><span class=\"pre\">from</span></code>. Compatibility is decided on the tensors\u2019\nDispatchKeySets: the sets are equal, or both are dense, both are sparse\nCOO, or both are sparse compressed. It is independent of dtype and shape,\nand of device within a family, but opaque impls (meta, MKL-DNN, nested,\nquantized) only match an identical key set even though some of them\nreport a strided layout.</p>", "a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#has-compatible-shallow-copy-type\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">has_compatible_shallow_copy_type<a class=\"headerlink\" href=\"#has-compatible-shallow-copy-type\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> Tensor | <strong>Stage:</strong> alpha | <strong>Since:</strong> 5.4</p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>"}
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
