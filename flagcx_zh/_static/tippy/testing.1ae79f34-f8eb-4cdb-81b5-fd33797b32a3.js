selector_to_html = {"a[href=\"#test-unittest-device-api\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u6b63\u786e\u6027\u6d4b\u8bd5 (<code class=\"docutils literal notranslate\"><span class=\"pre\">test/unittest/device_api/</span></code>)<a class=\"headerlink\" href=\"#test-unittest-device-api\" title=\"Link to this heading\">#</a></h3><p>\u6784\u5efa\uff1a</p>", "a[href=\"#test-perf-device-api\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u6027\u80fd\u6d4b\u8bd5 (<code class=\"docutils literal notranslate\"><span class=\"pre\">test/perf/device_api/</span></code>)<a class=\"headerlink\" href=\"#test-perf-device-api\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6027\u80fd\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u6027\u80fd\u6d4b\u8bd5\u4f4d\u4e8e <code class=\"docutils literal notranslate\"><span class=\"pre\">test/perf/</span></code>\uff0c\u6309 API \u7ea7\u522b\u7ec4\u7ec7\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u6027\u80fd\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u6027\u80fd\u6d4b\u8bd5\u4f4d\u4e8e <code class=\"docutils literal notranslate\"><span class=\"pre\">test/perf/</span></code>\uff0c\u6309 API \u7ea7\u522b\u7ec4\u7ec7\uff1a</p>", "a[href=\"#device-api\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Device API \u6d4b\u8bd5<a class=\"headerlink\" href=\"#device-api\" title=\"Link to this heading\">#</a></h2><p>Device API \u6d4b\u8bd5\u7ec4\u7ec7\u5728\u4e24\u4e2a\u76ee\u5f55\u4e2d\uff1a</p>", "a[href=\"#host-api\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Host API \u6027\u80fd\u6d4b\u8bd5<a class=\"headerlink\" href=\"#host-api\" title=\"Link to this heading\">#</a></h3><p>\u6ce8\u610f\uff0c\u9ed8\u8ba4 MPI \u5b89\u88c5\u8def\u5f84\u8bbe\u7f6e\u4e3a <code class=\"docutils literal notranslate\"><span class=\"pre\">/usr/local/mpi</span></code>\uff0c\u60a8\u53ef\u4ee5\u901a\u8fc7\u4ee5\u4e0b\u65b9\u5f0f\u6307\u5b9a MPI \u8def\u5f84\uff1a</p>"}
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
