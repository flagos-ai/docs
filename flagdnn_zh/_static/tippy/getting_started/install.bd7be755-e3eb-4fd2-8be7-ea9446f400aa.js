selector_to_html = {"a[href=\"#flagdnn\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5 FlagDNN<a class=\"headerlink\" href=\"#flagdnn\" title=\"Link to this heading\">#</a></h1><h2>\u5b89\u88c5\u6784\u5efa\u4f9d\u8d56<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u514b\u9686\u5e76\u5b89\u88c5 FlagDNN<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5\u6784\u5efa\u4f9d\u8d56<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u9a8c\u8bc1\u5b89\u88c5<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u5b89\u88c5\u5b8c\u6210\u540e\uff0c\u9a8c\u8bc1 FlagDNN \u662f\u5426\u53ef\u5bfc\u5165\uff1a</p>"}
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
