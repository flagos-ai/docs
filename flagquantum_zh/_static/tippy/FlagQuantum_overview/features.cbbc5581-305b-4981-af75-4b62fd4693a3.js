selector_to_html = {"a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5206\u5e03\u5f0f\u4e0e\u52a0\u901f\u5668\u6267\u884c<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6d4b\u91cf\u3001\u566a\u58f0\u4e0e\u7ea0\u9519<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id6\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u90e8\u7f72\u3001\u4e92\u64cd\u4f5c\u4e0e\u751f\u6001<a class=\"headerlink\" href=\"#id6\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7f16\u8bd1\u4e0e\u5bfc\u51fa<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>PyTorch \u539f\u751f\u7684\u91cf\u5b50\u8bad\u7ec3<a class=\"headerlink\" href=\"#pytorch\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#pytorch\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">PyTorch \u539f\u751f\u7684\u91cf\u5b50\u8bad\u7ec3<a class=\"headerlink\" href=\"#pytorch\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u591a\u5957\u6a21\u62df\u8868\u793a\uff0c\u4e00\u4efd\u7a0b\u5e8f<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>"}
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
