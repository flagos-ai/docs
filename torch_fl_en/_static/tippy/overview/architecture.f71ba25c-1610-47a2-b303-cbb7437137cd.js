selector_to_html = {"a[href=\"#architecture\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Architecture<a class=\"headerlink\" href=\"#architecture\" title=\"Link to this heading\">#</a></h1><p>Torch-FL registers one PyTorch device and routes every operator that reaches it.</p><p><a data-lightbox=\"image-set\" href=\"../_images/torch-fl.png\">\n<img alt=\"Torch-FL architecture\" src=\"../_images/torch-fl.png\"/></a>\n</p>", "a[href=\"#operator-dispatch\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Operator dispatch<a class=\"headerlink\" href=\"#operator-dispatch\" title=\"Link to this heading\">#</a></h2><p>Operator implementations are reached through one dispatch key and one routing table:</p>", "a[href=\"#import-time-phases\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Import-time phases<a class=\"headerlink\" href=\"#import-time-phases\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">import</span> <span class=\"pre\">torch_fl</span></code> runs a fixed sequence of side effects. The order is load-bearing \u2014 a wrong order produces a <code class=\"docutils literal notranslate\"><span class=\"pre\">dlopen</span></code> abort or a wrong-vendor build rather than a Python exception \u2014 so it lives in one place:</p>", "a[href=\"#component-layout\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Component layout<a class=\"headerlink\" href=\"#component-layout\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#device-registration\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Device registration<a class=\"headerlink\" href=\"#device-registration\" title=\"Link to this heading\">#</a></h2><p>At import, Torch-FL claims the <code class=\"docutils literal notranslate\"><span class=\"pre\">PrivateUse1</span></code> dispatch key and publishes it under the name <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code>:</p>"}
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
