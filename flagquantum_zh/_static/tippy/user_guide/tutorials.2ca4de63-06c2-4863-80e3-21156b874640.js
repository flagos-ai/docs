selector_to_html = {"a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u63a8\u8350\u7684\u5192\u70df\u8fd0\u884c<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u793a\u4f8b\u4f1a\u5148\u62a5\u544a\u6b63\u786e\u6027\u53c2\u8003\uff0c\u518d\u8c08\u901f\u5ea6\uff1aVQE \u4e0e MPS \u793a\u4f8b\u4f1a\u6253\u5370\u5c0f\u54c8\u5bc6\u987f\u91cf\u7684\u7cbe\u786e\u7a20\u5bc6\u57fa\u6001\u80fd\u91cf\u4ee5\u53ca\u6700\u7ec8\u80fd\u91cf\u5dee\uff0c\u5206\u7c7b\u5668\u5219\u4e0e\u6559\u5e08\u7ebf\u8def\u751f\u6210\u7684\u6570\u636e\u5bf9\u6bd4\u3002</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u6559\u7a0b<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u6559\u7a0b\u7cfb\u5217\u8bb2\u89e3\u53ef\u8fd0\u884c\u793a\u4f8b\u80cc\u540e\u7684\u6982\u5ff5\u3002\u65b0\u7528\u6237\u5efa\u8bae\u6309\u987a\u5e8f\u9605\u8bfb\uff0c\u4f46\u6bcf\u4e2a\u7b14\u8bb0\u672c\u540c\u6837\u53ef\u4ee5\u72ec\u7acb\u4f7f\u7528\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6559\u7a0b\u4e4b\u5916\u7684\u793a\u4f8b<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>"}
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
