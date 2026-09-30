selector_to_html = {"a[href=\"#flaggems\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagGems \u5b9e\u9a8c\u6027\u7b97\u5b50<a class=\"headerlink\" href=\"#flaggems\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u5217\u4e3e <em>FlagGems</em> \u4e2d\u7684\u5b9e\u9a8c\u6027\u7b97\u5b50\u3002\u8fd9\u4e9b\u7b97\u5b50\u4e0e PyTorch \u7684\u539f\u751f\u5b9e\u73b0\u76f8\u6bd4\uff0c\n\u80fd\u591f\u8fbe\u5230\u5e73\u5747 0.8 \u500d\u6216\u66f4\u9ad8\u7684\u6027\u80fd\u3002</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8bf4\u660e<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6309\u6027\u80fd\u6392\u5217\u7684\u7b97\u5b50\u5217\u8868<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p><strong>\u56fe\u4f8b</strong>\uff1a</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u5b50\u5206\u7c7b\u8bf4\u660e<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6027\u80fd\u6570\u636e\u6982\u89c8<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>"}
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
