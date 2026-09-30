selector_to_html = {"a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">KernelGen</span></code></p>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Triton kernel implementation for <code class=\"docutils literal notranslate\"><span class=\"pre\">_cummin_helper</span></code>, the out-of-place helper used\nby <code class=\"docutils literal notranslate\"><span class=\"pre\">aten::cummin</span></code> / <code class=\"docutils literal notranslate\"><span class=\"pre\">aten::cummin.out</span></code>. It writes the cumulative minimum of\nelements of <code class=\"docutils literal notranslate\"><span class=\"pre\">input</span></code> along <code class=\"docutils literal notranslate\"><span class=\"pre\">dim</span></code> into the pre-allocated <code class=\"docutils literal notranslate\"><span class=\"pre\">values</span></code> tensor and the\nindex location of each minimum value into the pre-allocated <code class=\"docutils literal notranslate\"><span class=\"pre\">indices</span></code> tensor.</p>", "a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#cummin-helper\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">cummin_helper<a class=\"headerlink\" href=\"#cummin-helper\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> Math | <strong>Stage:</strong> alpha | <strong>Since:</strong> 5.4</p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>"}
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
