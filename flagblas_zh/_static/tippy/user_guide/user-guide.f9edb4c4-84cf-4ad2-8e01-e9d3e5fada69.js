selector_to_html = {"a[href=\"#flagblas\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagBLAS \u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#flagblas\" title=\"Link to this heading\">#</a></h1><h2>\u4f7f\u7528 FlagBLAS<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>FlagBLAS \u76f4\u63a5\u4e0e PyTorch \u96c6\u6210\u3002\u5bfc\u5165\u5305\u5e76\u5bf9 CUDA \u5f20\u91cf\u8c03\u7528\u7b97\u5b50\uff1a</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528 FlagBLAS<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>FlagBLAS \u76f4\u63a5\u4e0e PyTorch \u96c6\u6210\u3002\u5bfc\u5165\u5305\u5e76\u5bf9 CUDA \u5f20\u91cf\u8c03\u7528\u7b97\u5b50\uff1a</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u5b50\u5217\u8868<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u5b8c\u6574\u7684\u7b97\u5b50\u6ce8\u518c\u8868\u7ef4\u62a4\u5728 <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagBLAS/blob/master/conf/operators.yaml\">FlagBLAS conf/operators.yaml</a>\u3002</p>"}
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
