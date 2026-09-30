selector_to_html = {"a[href=\"#accuracy-in-the-context-of-models\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. Accuracy in the context of models<a class=\"headerlink\" href=\"#accuracy-in-the-context-of-models\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#accuracy-tests-for-operators\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. Accuracy tests for operators<a class=\"headerlink\" href=\"#accuracy-tests-for-operators\" title=\"Link to this heading\">#</a></h2><p>To run unit tests on a specific backend like CUDA:</p>", "a[href=\"#testing-python-operators\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Testing Python Operators<a class=\"headerlink\" href=\"#testing-python-operators\" title=\"Link to this heading\">#</a></h1><p><em>FlagGems</em> uses <code class=\"docutils literal notranslate\"><span class=\"pre\">pytest</span></code> for operator accuracy testing and performance benchmarking.\nIt  leverages Triton\u2019s <code class=\"docutils literal notranslate\"><span class=\"pre\">triton.testing.do_bench</span></code> for kernel-level performance evaluation.</p>", "a[href=\"#test-operator-performance\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">3. Test operator performance<a class=\"headerlink\" href=\"#test-operator-performance\" title=\"Link to this heading\">#</a></h2><p>To test CUDA performance</p>"}
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
