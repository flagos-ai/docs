selector_to_html = {"a[href=\"#flir-unified-intermediate-layer\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FLIR: Unified intermediate layer<a class=\"headerlink\" href=\"#flir-unified-intermediate-layer\" title=\"Link to this heading\">#</a></h1><h2>Overview<a class=\"headerlink\" href=\"#overview\" title=\"Link to this heading\">#</a></h2><p>FLIR is a multi-backend unified intermediate layer that serves as the central hub for lowering Triton extensions intermediate representations (for example, Hints, Ops, and TLE) to hardware-specific dialects. When you use Hints and TLE features, FLIR feature is automatically used without any user intervention.</p>", "a[href=\"#position-in-the-compilation-pipeline\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Position in the compilation pipeline<a class=\"headerlink\" href=\"#position-in-the-compilation-pipeline\" title=\"Link to this heading\">#</a></h2><p>The following diagram indicates the\nposition of the FLIR in the compilation pipeline.</p><p><a data-lightbox=\"image-set\" href=\"../../_images/flagtree_position.png\">\n<img alt=\"alt text\" src=\"../../_images/flagtree_position.png\"/></a>\n</p>", "a[href=\"#core-capabilities\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Core capabilities<a class=\"headerlink\" href=\"#core-capabilities\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#overview\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Overview<a class=\"headerlink\" href=\"#overview\" title=\"Link to this heading\">#</a></h2><p>FLIR is a multi-backend unified intermediate layer that serves as the central hub for lowering Triton extensions intermediate representations (for example, Hints, Ops, and TLE) to hardware-specific dialects. When you use Hints and TLE features, FLIR feature is automatically used without any user intervention.</p>"}
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
