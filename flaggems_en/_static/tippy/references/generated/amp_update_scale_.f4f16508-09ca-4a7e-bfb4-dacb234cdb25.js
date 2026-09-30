selector_to_html = {"a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">KernelGen</span></code></p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Updates the AMP loss scale in-place: when <code class=\"docutils literal notranslate\"><span class=\"pre\">found_inf</span></code> is non-zero the\nscale is multiplied by <code class=\"docutils literal notranslate\"><span class=\"pre\">scale_backoff_factor</span></code> and the growth tracker\nis reset to 0; otherwise the growth tracker is incremented and, once\nit reaches <code class=\"docutils literal notranslate\"><span class=\"pre\">growth_interval</span></code>, the scale is multiplied by\n<code class=\"docutils literal notranslate\"><span class=\"pre\">scale_growth_factor</span></code> and the tracker is reset to 0.</p>", "a[href=\"#amp-update-scale\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">amp_update_scale_<a class=\"headerlink\" href=\"#amp-update-scale\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> Math | <strong>Stage:</strong> alpha | <strong>Since:</strong> 5.4</p>", "a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>"}
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
