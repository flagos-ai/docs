selector_to_html = {"a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code></p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Indexes <code class=\"docutils literal notranslate\"><span class=\"pre\">input</span></code> along each dimension with the given indices, matching\n<code class=\"docutils literal notranslate\"><span class=\"pre\">aten._unsafe_index</span></code>. Unlike the safe <code class=\"docutils literal notranslate\"><span class=\"pre\">index</span></code> operator, it performs no\nbounds checking and rejects <code class=\"docutils literal notranslate\"><span class=\"pre\">bool</span></code> / <code class=\"docutils literal notranslate\"><span class=\"pre\">int8</span></code> masks.</p>", "a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#unsafe-index\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">unsafe_index<a class=\"headerlink\" href=\"#unsafe-index\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> Reduction | <strong>Stage:</strong> beta | <strong>Since:</strong> 5.4</p>"}
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
