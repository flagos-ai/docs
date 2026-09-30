selector_to_html = {"a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5df2\u516c\u5f00\u7684\u6027\u80fd\u4e3b\u5f20<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2><p>FlagQuantum \u516c\u5e03\u5b9e\u6d4b\u6027\u80fd\u4e3b\u5f20\u65f6\uff0c\u4f1a\u540c\u65f6\u7ed9\u51fa\u539f\u59cb\u4ea7\u7269\u3001\u5176\u6458\u8981\u3001\u8bb0\u5f55\u73af\u5883\u4e0e\u786e\u5207\u8303\u56f4\uff0c\u5e76\u7ee7\u627f\u6240\u5c5e\u80fd\u529b\u7684\u6210\u719f\u5ea6\u3002\u6ca1\u6709\u7ecf\u8fc7\u5ba1\u8ba1\u7684\u4ea7\u7269\u65f6\uff0c\u672c\u9875\u4e0d\u505a\u4efb\u4f55\u6027\u80fd\u4e3b\u5f20\u3002</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u90e8\u7f72\u3001\u4e92\u64cd\u4f5c\u4e0e\u7814\u7a76\u6027\u63a5\u53e3<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6784\u5efa\u3001\u6a21\u62df\u4e0e\u8bad\u7ec3<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u80fd\u529b\u53c2\u8003<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum \u516c\u5f00\u6bcf\u4e2a\u80fd\u529b\u7684\u6210\u719f\u5ea6\uff0c\u800c\u4e0d\u662f\u9760\u793a\u4f8b\u53bb\u6697\u793a\u3002\u672c\u9875\u662f\u6458\u8981\uff1b\u4ed3\u5e93\u4e2d\u7ecf\u673a\u5668\u6821\u9a8c\u7684\u80fd\u529b\u77e9\u9635\u624d\u662f\u6743\u5a01\u6765\u6e90\u3002</p>", "a[href=\"#flagos\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5206\u5e03\u5f0f\u4e0e FlagOS \u6267\u884c<a class=\"headerlink\" href=\"#flagos\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5982\u4f55\u7406\u89e3\u6210\u719f\u5ea6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u6210\u719f\u5ea6\u53ea\u5bf9\u6bcf\u4e2a\u80fd\u529b\u6240\u58f0\u660e\u7684\u8303\u56f4\u6210\u7acb\u3002\u672c\u5730\u3001\u590d\u5236\u3001\u5207\u7247\u6216\u4ec5\u505c\u7559\u5728\u89c4\u5212\u9636\u6bb5\u7684\u6267\u884c\u8def\u5f84\u90fd\u4e0d\u6784\u6210\u5206\u5e03\u5f0f\u53ef\u6269\u5c55\u6027\u8bc1\u636e\u3002\u7a33\u5b9a\u7684\u516c\u5f00 API \u4e5f\u4e0d\u4f1a\u63d0\u5347\u67d0\u4e2a\u5b9e\u9a8c\u6027\u540e\u7aef\u7684\u7b49\u7ea7\u3002</p>"}
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
