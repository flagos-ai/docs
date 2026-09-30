selector_to_html = {"a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code></p>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Applies 3D average-pooling operation in <code class=\"docutils literal notranslate\"><span class=\"pre\">kD</span> <span class=\"pre\">\\times</span> <span class=\"pre\">kH</span> <span class=\"pre\">\\times</span> <span class=\"pre\">kW</span></code> regions by step size\n<code class=\"docutils literal notranslate\"><span class=\"pre\">sD</span> <span class=\"pre\">\\times</span> <span class=\"pre\">sH</span> <span class=\"pre\">\\times</span> <span class=\"pre\">sW</span></code> steps.</p>", "a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#avg-pool3d\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">avg_pool3d<a class=\"headerlink\" href=\"#avg-pool3d\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> NeuralNetwork | <strong>Stage:</strong> beta | <strong>Since:</strong> 5.3</p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>"}
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
