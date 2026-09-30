selector_to_html = {"a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">skip_precision_check</span></code></p>", "a[href=\"#topk\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">topk<a class=\"headerlink\" href=\"#topk\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> Tensor | <strong>Stage:</strong> stable | <strong>Since:</strong> 2.1 | <strong>C++:</strong> 4.0</p>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Returns the <code class=\"docutils literal notranslate\"><span class=\"pre\">k</span></code> largest elements of the given <code class=\"docutils literal notranslate\"><span class=\"pre\">input</span></code> tensor along a given dimension.\nIf <code class=\"docutils literal notranslate\"><span class=\"pre\">dim</span></code> is not given, the last dimension of the <code class=\"docutils literal notranslate\"><span class=\"pre\">input</span></code> is chosen.\nIf <code class=\"docutils literal notranslate\"><span class=\"pre\">largest</span></code> is False then the <code class=\"docutils literal notranslate\"><span class=\"pre\">k</span></code> smallest elements are returned.</p>", "a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>"}
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
