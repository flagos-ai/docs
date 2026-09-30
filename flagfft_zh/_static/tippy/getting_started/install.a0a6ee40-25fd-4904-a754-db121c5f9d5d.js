selector_to_html = {"a[href=\"#id3\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u4ec5\u6784\u5efa\u5e93<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h3><p>\u8fd9\u5c06\u751f\u6210 <code class=\"docutils literal notranslate\"><span class=\"pre\">build/libflagfft.so</span></code>\u3002</p>", "a[href=\"#docker\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528 Docker<a class=\"headerlink\" href=\"#docker\" title=\"Link to this heading\">#</a></h2><p>\u9884\u6784\u5efa\u7684\u5305\u542b\u6240\u6709\u4f9d\u8d56\u7684\u73af\u5883\u53ef\u4f5c\u4e3a\u624b\u52a8\u8bbe\u7f6e\u7684\u66ff\u4ee3\u65b9\u6848\uff1a</p>", "a[href=\"#flagfft\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5 FlagFFT<a class=\"headerlink\" href=\"#flagfft\" title=\"Link to this heading\">#</a></h1><h2>\u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u514b\u9686\u3001\u6784\u5efa\u5e76\u4e00\u6b65\u9a8c\u8bc1\uff1a</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6784\u5efa\u9009\u9879<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><h3>\u4ec5\u6784\u5efa\u5e93<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h3><p>\u8fd9\u5c06\u751f\u6210 <code class=\"docutils literal notranslate\"><span class=\"pre\">build/libflagfft.so</span></code>\u3002</p>", "a[href=\"#cli\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u6784\u5efa\u5e93 + CLI + \u6d4b\u8bd5<a class=\"headerlink\" href=\"#cli\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5\u5230\u7cfb\u7edf\uff08\u53ef\u9009\uff09<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u6784\u5efa\u540e\uff0c\u5c06\u5e93\u548c\u5de5\u5177\u5b89\u88c5\u5230\u7cfb\u7edf\u8303\u56f4\uff1a</p>", "a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8bbe\u7f6e\u73af\u5883\u53d8\u91cf<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u514b\u9686\u3001\u6784\u5efa\u5e76\u4e00\u6b65\u9a8c\u8bc1\uff1a</p>"}
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
