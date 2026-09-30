selector_to_html = {"a[href=\"#workflow\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Workflow<a class=\"headerlink\" href=\"#workflow\" title=\"Link to this heading\">#</a></h1><p>The following diagram briefly demonstrates how to use FlagScale to run a training, inference, serving, or reinforcement learning task in a general way.</p><p><a data-lightbox=\"image-set\" href=\"../_images/flagscale-workflow.png\">\n<img alt=\"alt text\" src=\"../_images/flagscale-workflow.png\"/></a>\n</p>"}
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
