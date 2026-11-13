selector_to_html = {"a[href=\"#models-on-scnet\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Models on SCNet<a class=\"headerlink\" href=\"#models-on-scnet\" title=\"Link to this heading\">#</a></h1><p>FlagOS download entry on the SCNet (Supercomputing Internet) AI community:</p><p><a class=\"reference external\" href=\"https://www.scnet.cn/ui/aihub/models?authenticated=FlagOS\">https://www.scnet.cn/ui/aihub/models?authenticated=FlagOS</a></p>"}
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
