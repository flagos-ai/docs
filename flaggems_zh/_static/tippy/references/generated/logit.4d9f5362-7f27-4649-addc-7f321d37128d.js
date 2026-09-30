selector_to_html = {"a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">pointwise</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">KernelGen</span></code></p>", "a[href=\"#logit\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">logit<a class=\"headerlink\" href=\"#logit\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> LinearAlg | <strong>Stage:</strong> stable | <strong>Since:</strong> 5.3</p>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Returns a new tensor with the logit of the elements of <code class=\"docutils literal notranslate\"><span class=\"pre\">input</span></code>.\n<code class=\"docutils literal notranslate\"><span class=\"pre\">input</span></code> is clamped to <code class=\"docutils literal notranslate\"><span class=\"pre\">[eps,</span> <span class=\"pre\">1-eps]</span></code> when <code class=\"docutils literal notranslate\"><span class=\"pre\">eps</span></code> is not None.\nWhen eps is None and <code class=\"docutils literal notranslate\"><span class=\"pre\">input&lt;0</span></code> or <code class=\"docutils literal notranslate\"><span class=\"pre\">input&gt;1</span></code>, the function will yield NaN.</p>", "a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>"}
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
