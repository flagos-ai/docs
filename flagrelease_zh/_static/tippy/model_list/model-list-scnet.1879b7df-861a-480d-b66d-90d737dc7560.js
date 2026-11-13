selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u8d85\u7b97\u4e92\u8054\u7f51\u6a21\u578b\u5217\u8868<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u8d85\u7b97\u4e92\u8054\u7f51 AI \u793e\u533a\u91cc\u7684 FlagOS \u4e0b\u8f7d\u5165\u53e3\uff1a</p><p><a class=\"reference external\" href=\"https://www.scnet.cn/ui/aihub/models?authenticated=FlagOS\">https://www.scnet.cn/ui/aihub/models?authenticated=FlagOS</a></p>"}
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
