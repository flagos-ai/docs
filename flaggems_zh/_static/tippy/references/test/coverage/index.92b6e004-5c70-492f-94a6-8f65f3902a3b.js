selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5355\u5143\u6d4b\u8bd5\u8986\u76d6\u7387<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>CI \u751f\u6210\u7684\u5355\u5143\u6d4b\u8bd5\u8986\u76d6\u7387\u62a5\u544a\uff1a</p>"}
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
