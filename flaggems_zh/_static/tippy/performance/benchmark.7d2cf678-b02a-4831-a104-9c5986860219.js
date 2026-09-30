selector_to_html = {"a[href=\"#flaggems\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagGems \u4e2d\u7684\u6027\u80fd\u57fa\u51c6\u6d4b\u8bd5<a class=\"headerlink\" href=\"#flaggems\" title=\"Link to this heading\">#</a></h1><p>\u6211\u4eec\u5efa\u8bae\u5f00\u53d1\u8005\u57fa\u4e8e\u4e0b\u9762\u7684\u8fc7\u7a0b\u6765\u4e3a\u65b0\u7684\u7b97\u5b50\u6dfb\u52a0\u6d4b\u8bd5\u7528\u4f8b\u3002\n\u8fd9\u4e9b\u6b65\u9aa4\u65e2\u9002\u7528\u4e8e Python \u5b9e\u73b0\u7684\u7b97\u5b50\uff0c\u4e5f\u9002\u7528\u4e8e C++ \u5c01\u88c5\u7684\u7b97\u5b50\u3002</p>"}
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
