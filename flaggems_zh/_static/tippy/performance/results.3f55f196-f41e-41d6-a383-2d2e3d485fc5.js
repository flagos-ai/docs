selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u6027\u80fd\u6d4b\u8bd5\u7ed3\u679c<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u4ee5\u4e0b\u8868\u683c\u5c55\u793a\u4e86\u5404\u5e73\u53f0\u7684\u51c6\u786e\u6027\u548c\u6027\u80fd\u57fa\u51c6\u6d4b\u8bd5\u7ed3\u679c\u3002\u4f7f\u7528\u6807\u7b7e\u9875\u5207\u6362\u4e0d\u540c\u5e73\u53f0\u3002\n\u5217\u53ef\u4ee5\u6392\u5e8f\u548c\u8fc7\u6ee4\u3002</p>"}
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
