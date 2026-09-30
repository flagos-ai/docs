selector_to_html = {"a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">KernelGen</span></code></p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Accumulates the elements of <code class=\"docutils literal notranslate\"><span class=\"pre\">source</span></code> into <code class=\"docutils literal notranslate\"><span class=\"pre\">input</span></code> at the indices specified\nby <code class=\"docutils literal notranslate\"><span class=\"pre\">index</span></code> along <code class=\"docutils literal notranslate\"><span class=\"pre\">dim</span></code>, using <code class=\"docutils literal notranslate\"><span class=\"pre\">prod</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">mean</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">amax</span></code>, or <code class=\"docutils literal notranslate\"><span class=\"pre\">amin</span></code> reduction.</p>", "a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#index-reduce\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">index_reduce_<a class=\"headerlink\" href=\"#index-reduce\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> Tensor | <strong>Stage:</strong> beta | <strong>Since:</strong> 5.4</p>"}
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
