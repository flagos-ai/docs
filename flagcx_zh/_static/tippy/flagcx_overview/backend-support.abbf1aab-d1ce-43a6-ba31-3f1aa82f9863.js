selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u540e\u7aef\u652f\u6301<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u4e0b\u8868\u603b\u7ed3\u4e86\u5f53\u524d\u652f\u6301\u7684\u901a\u4fe1\u540e\u7aef\u53ca\u5176\u5bf9\u5e94\u7684\u529f\u80fd\u3002</p>"}
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
