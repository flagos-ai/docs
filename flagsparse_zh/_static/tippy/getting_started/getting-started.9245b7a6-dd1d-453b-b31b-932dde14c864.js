selector_to_html = {"a[href=\"install.html#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u9a8c\u8bc1\u5b89\u88c5<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5 FlagSparse<a class=\"headerlink\" href=\"#flagsparse\" title=\"Link to this heading\">#</a></h1><h2>\u514b\u9686\u5e76\u5b89\u88c5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">--no-build-isolation</span></code> \u53ef\u907f\u514d\u5728\u79bb\u7ebf\u65f6\u4e0b\u8f7d\u6784\u5efa\u4f9d\u8d56\u3002</p>", "a[href=\"#flagsparse\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagSparse \u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#flagsparse\" title=\"Link to this heading\">#</a></h1>", "a[href=\"install.html#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5\u8fd0\u884c\u65f6\u4f9d\u8d56<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8f6f\u4ef6<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5\u8981\u6c42<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"install.html#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u514b\u9686\u5e76\u5b89\u88c5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">--no-build-isolation</span></code> \u53ef\u907f\u514d\u5728\u79bb\u7ebf\u65f6\u4e0b\u8f7d\u6784\u5efa\u4f9d\u8d56\u3002</p>"}
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
