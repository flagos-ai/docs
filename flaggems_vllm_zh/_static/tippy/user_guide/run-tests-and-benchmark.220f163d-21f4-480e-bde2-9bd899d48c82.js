selector_to_html = {"a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8fd0\u884c\u57fa\u51c6\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u8fd0\u884c vLLM \u4e13\u7528\u7b97\u5b50\u7684\u57fa\u51c6\u6d4b\u8bd5\uff1a</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8fd0\u884c\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u8fd0\u884c\u7279\u5b9a\u7b97\u5b50\u6d4b\u8bd5\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u8fd0\u884c\u6d4b\u8bd5\u548c\u57fa\u51c6<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u5982\u4f55\u8fd0\u884c FlagGems-vLLM \u7684\u6d4b\u8bd5\u548c\u57fa\u51c6\uff0c\u4ee5\u9a8c\u8bc1\u6b63\u786e\u6027\u5e76\u8861\u91cf\u7b97\u5b50\u6027\u80fd\u3002</p><p>\u4ee5\u4e0b\u547d\u4ee4\u5df2\u5728 FlagGems-vLLM \u4ed3\u5e93\u4e2d\u9a8c\u8bc1\uff0c\u53ef\u7528\u4e8e\u5b89\u88c5\u540e\u7684\u5feb\u901f\u9a8c\u8bc1\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5bfc\u5165\u5192\u70df\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>"}
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
