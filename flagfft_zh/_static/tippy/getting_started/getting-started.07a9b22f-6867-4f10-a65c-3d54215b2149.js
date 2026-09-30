selector_to_html = {"a[href=\"requirements.html#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"install.html#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6784\u5efa\u9009\u9879<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><h3>\u4ec5\u6784\u5efa\u5e93<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h3><p>\u8fd9\u5c06\u751f\u6210 <code class=\"docutils literal notranslate\"><span class=\"pre\">build/libflagfft.so</span></code>\u3002</p>", "a[href=\"#flagfft\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT \u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#flagfft\" title=\"Link to this heading\">#</a></h1>", "a[href=\"install.html#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5\u5230\u7cfb\u7edf\uff08\u53ef\u9009\uff09<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u6784\u5efa\u540e\uff0c\u5c06\u5e93\u548c\u5de5\u5177\u5b89\u88c5\u5230\u7cfb\u7edf\u8303\u56f4\uff1a</p>", "a[href=\"install.html#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8bbe\u7f6e\u73af\u5883\u53d8\u91cf<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2>", "a[href=\"install.html#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u514b\u9686\u3001\u6784\u5efa\u5e76\u4e00\u6b65\u9a8c\u8bc1\uff1a</p>", "a[href=\"requirements.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5\u8981\u6c42<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u786c\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html#id6\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b50\u6a21\u5757<a class=\"headerlink\" href=\"#id6\" title=\"Link to this heading\">#</a></h2><p>\u8fd9\u5c06\u62c9\u53d6 <code class=\"docutils literal notranslate\"><span class=\"pre\">deps/libtriton_jit</span></code>\uff0c\u63d0\u4f9b Triton JIT \u7f16\u8bd1\u5668\u548c <code class=\"docutils literal notranslate\"><span class=\"pre\">nlohmann_json</span></code>\u3002\u66f4\u591a\u4fe1\u606f\u8bf7\u53c2\u89c1<a class=\"reference internal\" href=\"install.html\"><span class=\"std std-doc\">\u5feb\u901f\u5f00\u59cb</span></a>\u3002</p>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5 FlagFFT<a class=\"headerlink\" href=\"#flagfft\" title=\"Link to this heading\">#</a></h1><h2>\u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u514b\u9686\u3001\u6784\u5efa\u5e76\u4e00\u6b65\u9a8c\u8bc1\uff1a</p>", "a[href=\"requirements.html#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f9d\u8d56<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u60a8\u53ef\u4ee5\u51c6\u5907\u4e00\u4e2a\u5305\u542b\u4ee5\u4e0b\u4f9d\u8d56\u7684 Docker \u73af\u5883\u3002\u66f4\u591a\u4fe1\u606f\u8bf7\u53c2\u89c1<a class=\"reference internal\" href=\"install.html\"><span class=\"std std-doc\">\u5feb\u901f\u5f00\u59cb</span></a>\u3002</p>", "a[href=\"install.html#docker\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528 Docker<a class=\"headerlink\" href=\"#docker\" title=\"Link to this heading\">#</a></h2><p>\u9884\u6784\u5efa\u7684\u5305\u542b\u6240\u6709\u4f9d\u8d56\u7684\u73af\u5883\u53ef\u4f5c\u4e3a\u624b\u52a8\u8bbe\u7f6e\u7684\u66ff\u4ee3\u65b9\u6848\uff1a</p>"}
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
