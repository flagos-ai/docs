selector_to_html = {"a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">KernelGen</span></code></p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>The backward pass for <code class=\"docutils literal notranslate\"><span class=\"pre\">hardswish</span></code>. Computes the gradient of the hardswish activation\nfunction: piecewise derivative <code class=\"docutils literal notranslate\"><span class=\"pre\">0</span></code> for <code class=\"docutils literal notranslate\"><span class=\"pre\">x</span> <span class=\"pre\">&lt;=</span> <span class=\"pre\">-3</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">(2x</span> <span class=\"pre\">+</span> <span class=\"pre\">3)</span> <span class=\"pre\">/</span> <span class=\"pre\">6</span></code> for <code class=\"docutils literal notranslate\"><span class=\"pre\">-3</span> <span class=\"pre\">&lt;</span> <span class=\"pre\">x</span> <span class=\"pre\">&lt;</span> <span class=\"pre\">3</span></code>,\nand <code class=\"docutils literal notranslate\"><span class=\"pre\">1</span></code> for <code class=\"docutils literal notranslate\"><span class=\"pre\">x</span> <span class=\"pre\">&gt;=</span> <span class=\"pre\">3</span></code>.</p>", "a[href=\"#hardswish-backward\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">hardswish_backward<a class=\"headerlink\" href=\"#hardswish-backward\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> Math | <strong>Stage:</strong> alpha | <strong>Since:</strong> 5.4</p>", "a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>"}
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
