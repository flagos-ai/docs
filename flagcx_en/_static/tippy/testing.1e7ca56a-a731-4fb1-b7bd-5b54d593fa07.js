selector_to_html = {"a[href=\"#performance-tests-test-perf-device-api\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Performance Tests (<code class=\"docutils literal notranslate\"><span class=\"pre\">test/perf/device_api/</span></code>)<a class=\"headerlink\" href=\"#performance-tests-test-perf-device-api\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#tests\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h1><h2>Performance Test<a class=\"headerlink\" href=\"#performance-test\" title=\"Link to this heading\">#</a></h2><p>Performance tests are maintained in <code class=\"docutils literal notranslate\"><span class=\"pre\">test/perf/</span></code>, organized by API level:</p>", "a[href=\"#performance-test\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Performance Test<a class=\"headerlink\" href=\"#performance-test\" title=\"Link to this heading\">#</a></h2><p>Performance tests are maintained in <code class=\"docutils literal notranslate\"><span class=\"pre\">test/perf/</span></code>, organized by API level:</p>", "a[href=\"#host-api-performance-test\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Host API Performance Test<a class=\"headerlink\" href=\"#host-api-performance-test\" title=\"Link to this heading\">#</a></h3><p>Note that the default MPI install path is set to <code class=\"docutils literal notranslate\"><span class=\"pre\">/usr/local/mpi</span></code>, you may specify the MPI path with:</p>", "a[href=\"#correctness-tests-test-unittest-device-api\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Correctness Tests (<code class=\"docutils literal notranslate\"><span class=\"pre\">test/unittest/device_api/</span></code>)<a class=\"headerlink\" href=\"#correctness-tests-test-unittest-device-api\" title=\"Link to this heading\">#</a></h3><p>Build:</p>", "a[href=\"#device-api-test\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Device API Test<a class=\"headerlink\" href=\"#device-api-test\" title=\"Link to this heading\">#</a></h2><p>Device API tests are organized in two directories:</p>"}
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
