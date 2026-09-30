selector_to_html = {"a[href=\"#flaggems-vllm-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagGems-vLLM Documentation<a class=\"headerlink\" href=\"#flaggems-vllm-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagGems-vLLM Overview<a class=\"headerlink\" href=\"#flaggems-vllm-overview\" title=\"Link to this heading\">#</a></h1><p>FlagGems-vLLM is part of <a class=\"reference external\" href=\"https://flagos.io/Home\">FlagOS</a>. FlagGems-vLLM is a high-performance operator library designed for multiple hardware backends. It provides optimized implementations of common vLLM operators and supports high-performance inference and deployment for a variety of widely used models.</p><p>FlagGems-vLLM is a high-performance deep learning operator library implemented using the <a class=\"reference external\" href=\"https://github.com/openai/triton\">Triton programming language</a> launched by OpenAI.</p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">User Guide<a class=\"headerlink\" href=\"#user-guide\" title=\"Link to this heading\">#</a></h1><p>This section guides you on how to test FlagGems-vLLM operators and use the operators in the vLLM inference workflows.</p>", "a[href=\"user_guide/run-tests-and-benchmark.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Run tests and benchmark<a class=\"headerlink\" href=\"#run-tests-and-benchmark\" title=\"Link to this heading\">#</a></h1><p>This section covers how to run tests and benchmarks for FlagGems-vLLM to validate correctness and measure operator performance.</p><p>The following commands are verified in the FlagGems-vLLM repository and can be used for quick validation after installation.</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started<a class=\"headerlink\" href=\"#getting-started\" title=\"Link to this heading\">#</a></h1><p>This section covers the requirements for installing and running FlagGems-vLLM and guides you through installing and using its optimized operators.</p>"}
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
