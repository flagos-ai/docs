selector_to_html = {"a[href=\"run-tests-and-benchmark.html#run-tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Run tests<a class=\"headerlink\" href=\"#run-tests\" title=\"Link to this heading\">#</a></h2><p>Run a focused operator test:</p>", "a[href=\"run-tests-and-benchmark.html#run-benchmark\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Run benchmark<a class=\"headerlink\" href=\"#run-benchmark\" title=\"Link to this heading\">#</a></h2><p>Run focused benchmarks for vLLM-specific operators:</p>", "a[href=\"run-tests-and-benchmark.html#import-smoke-test\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Import smoke test<a class=\"headerlink\" href=\"#import-smoke-test\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#user-guide\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">User Guide<a class=\"headerlink\" href=\"#user-guide\" title=\"Link to this heading\">#</a></h1><p>This section guides you on how to test FlagGems-vLLM operators and use the operators in the vLLM inference workflows.</p>", "a[href=\"run-tests-and-benchmark.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Run tests and benchmark<a class=\"headerlink\" href=\"#run-tests-and-benchmark\" title=\"Link to this heading\">#</a></h1><p>This section covers how to run tests and benchmarks for FlagGems-vLLM to validate correctness and measure operator performance.</p><p>The following commands are verified in the FlagGems-vLLM repository and can be used for quick validation after installation.</p>", "a[href=\"usage.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Use operators<a class=\"headerlink\" href=\"#use-operators\" title=\"Link to this heading\">#</a></h1><p>After installing FlagGems-vLLM, you can use its optimized operators directly in your Python code.</p><p>For example, import the library and call the operators on CUDA tensors:</p>"}
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
