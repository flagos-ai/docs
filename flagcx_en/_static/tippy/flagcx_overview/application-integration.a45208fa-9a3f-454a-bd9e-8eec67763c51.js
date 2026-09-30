selector_to_html = {"a[href=\"#application-integration\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Application integration<a class=\"headerlink\" href=\"#application-integration\" title=\"Link to this heading\">#</a></h1><p>FlagCX integrates with upper-layer applications such as <a class=\"reference external\" href=\"https://pytorch.org/\">PyTorch</a> and\n<a class=\"reference external\" href=\"https://github.com/PaddlePaddle/\">PaddlePaddle</a>.\nThe table below lists the frameworks supported by FlagCX and their related communication operations,\nwhere the <code class=\"docutils literal notranslate\"><span class=\"pre\">batch_XXX</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">XXX_coalesced</span></code> ops refer to the usage of group primitives.</p>"}
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
