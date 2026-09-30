selector_to_html = {"a[href=\"custom-backend-registration.html#id12\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u793a\u4f8b<a class=\"headerlink\" href=\"#id12\" title=\"Link to this heading\">#</a></h2><h3>\u4f18\u5148\u4f7f\u7528\u4f9b\u5e94\u5546\u540e\u7aef<a class=\"headerlink\" href=\"#id13\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1>", "a[href=\"custom-backend-registration.html#out-of-tree\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Out-of-tree \u65b9\u5f0f\uff08\u63d2\u4ef6\u5305\uff09<a class=\"headerlink\" href=\"#out-of-tree\" title=\"Link to this heading\">#</a></h2><h3>\u63d2\u4ef6\u5305\u7ed3\u6784<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h3>", "a[href=\"custom-backend-registration.html#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u73af\u5883\u53d8\u91cf<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2><h3>\u540e\u7aef\u9009\u62e9<a class=\"headerlink\" href=\"#id6\" title=\"Link to this heading\">#</a></h3>", "a[href=\"custom-backend-registration.html#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"custom-backend-registration.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">TE-FL \u81ea\u5b9a\u4e49\u540e\u7aef\u793a\u4f8b<a class=\"headerlink\" href=\"#te-fl\" title=\"Link to this heading\">#</a></h1><p>\u672c\u6587\u6863\u4ecb\u7ecd\u6dfb\u52a0\u81ea\u5b9a\u4e49\u540e\u7aef\u7684\u4e24\u79cd\u65b9\u5f0f\u3002</p>", "a[href=\"custom-backend-registration.html#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4e24\u79cd\u65b9\u5f0f<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"custom-backend-registration.html#in-tree-3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">In-tree \u65b9\u5f0f\uff083 \u6b65\uff09<a class=\"headerlink\" href=\"#in-tree-3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"custom-backend-registration.html#id17\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u9884\u671f\u8f93\u51fa<a class=\"headerlink\" href=\"#id17\" title=\"Link to this heading\">#</a></h2><p>\u8fd0\u884c\u65f6\uff0c\u60a8\u5e94\u8be5\u770b\u5230\u7c7b\u4f3c\u4ee5\u4e0b\u7684\u65e5\u5fd7\uff1a</p>"}
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
