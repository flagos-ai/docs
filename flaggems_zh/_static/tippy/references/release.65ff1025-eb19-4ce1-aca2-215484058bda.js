selector_to_html = {"a[href=\"#build\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. \u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">build</span></code> \u6784\u5efa\u524d\u7aef<a class=\"headerlink\" href=\"#build\" title=\"Link to this heading\">#</a></h2><p>\u8981\u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">build</span></code> \u5305\uff08\u5efa\u8bae\uff09\u6765\u6784\u5efa\u4e00\u4e2a wheel \u5305\uff0c\u6267\u884c\u4ee5\u4e0b\u547d\u4ee4\uff1a</p>", "a[href=\"#pip\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. \u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">pip</span></code> \u6784\u5efa\u524d\u7aef<a class=\"headerlink\" href=\"#pip\" title=\"Link to this heading\">#</a></h2><p>\u53e6\u4e00\u79cd\u65b9\u5f0f\u662f\u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">pip</span></code> \u6765\u751f\u6210 wheel \u5305\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5173\u4e8e\u6253\u5305\u4e0e\u53d1\u5e03<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u521b\u5efa\u6e90\u7801\u6216\u4e8c\u8fdb\u5236\u53d1\u884c\u5305\u7684\u8fc7\u7a0b\u7c7b\u4f3c\u4e8e\u57fa\u4e8e<a class=\"reference internal\" href=\"#../installation/#install-from-source\"><span class=\"xref myst\">\u6e90\u7801\u6765\u6784\u5efa\u548c\u5b89\u88c5</span></a>\u7684\u8fc7\u7a0b\u3002\n\u6253\u5305\u8fc7\u7a0b\u5305\u62ec\u5bf9\u524d\u7aef\uff08\u5982 <code class=\"docutils literal notranslate\"><span class=\"pre\">pip</span></code> \u6216 <code class=\"docutils literal notranslate\"><span class=\"pre\">build</span></code>\uff09\u7684\u8c03\u7528\u4ee5\u53ca\u5c06\u547d\u4ee4\u53d1\u9001\u7ed9\u540e\u7aef\n\uff08<code class=\"docutils literal notranslate\"><span class=\"pre\">scikit-build-core</span></code>\uff09\u7684\u52a8\u4f5c\u3002</p>"}
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
