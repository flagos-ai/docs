selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u5b50\u6ce8\u518c\u8868<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u5b8c\u6574\u7684\u7b97\u5b50\u6ce8\u518c\u8868\uff08\u542b\u5404\u7b97\u5b50\u9636\u6bb5\u3001\u6d4b\u8bd5\u4e0e benchmark \u5165\u53e3\uff09\u7ef4\u62a4\u5728 <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagAttention/blob/main/conf/operators.yaml\">FlagAttention conf/operators.yaml</a>\u3002</p>"}
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
