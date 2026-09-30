selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u901a\u7528\u67b6\u6784<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd FlagTree \u4e0e Triton \u4e4b\u95f4\u7684\u901a\u7528\u67b6\u6784\u3002\u8be5\u901a\u7528\u67b6\u6784\u5305\u542b <strong>AST \u5904\u7406</strong>\u3001<strong>\u540e\u7aef\u7f16\u8bd1</strong>\u548c<strong>\u8fd0\u884c\u65f6\u7cfb\u7edf</strong>\u6a21\u5757\uff0c\u8d1f\u8d23\u5904\u7406\u7f16\u8bd1\u8fc7\u7a0b\u3002</p><p>\u4ee5\u4e0b\u5217\u8868\u4ecb\u7ecd\u4e86 FlagTree \u4e2d\u7684\u76ee\u5f55\u4ee5\u53ca\u5404\u6a21\u5757\u7684\u529f\u80fd\uff1a</p>"}
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
