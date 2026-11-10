selector_to_html = {"a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8981\u6c42<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6784\u5efa\u5f00\u5173<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u9a8c\u8bc1\u5b89\u88c5<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>core-only wheel\uff08<code class=\"docutils literal notranslate\"><span class=\"pre\">TRITON_BUILD_FLAGPRISM=OFF</span></code>\uff09\u4e0d\u5305\u542b <code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree.debugger</span></code>\u3002\u53ef\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">debugger.is_available()</span></code> \u68c0\u67e5\u7f16\u8bd1\u5668\u4e0e\u8fd0\u884c\u65f6 native binding \u662f\u5426\u540c\u65f6\u5b58\u5728\u3002</p>", "a[href=\"#flagtree\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u968f FlagTree \u6784\u5efa<a class=\"headerlink\" href=\"#flagtree\" title=\"Link to this heading\">#</a></h2><p>\u5728 FlagTree \u4ed3\u5e93\u6839\u76ee\u5f55\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagPrism \u901a\u8fc7 <code class=\"docutils literal notranslate\"><span class=\"pre\">third_party/FlagPrism</span></code> \u5b50\u6a21\u5757\u4f5c\u4e3a FlagTree wheel \u7684\u4e00\u90e8\u5206\u6784\u5efa\uff0c\u4e0d\u5355\u72ec\u53d1\u5e03\u4e3a\u72ec\u7acb\u5305\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u524d\u7f6e\u6761\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>"}
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
