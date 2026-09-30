selector_to_html = {"a[href=\"#flagsparse-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagSparse Documentation<a class=\"headerlink\" href=\"#flagsparse-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"user_guide/run-tests.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Running Tests and Benchmarks<a class=\"headerlink\" href=\"#running-tests-and-benchmarks\" title=\"Link to this heading\">#</a></h1><h2>Operator Test Runners<a class=\"headerlink\" href=\"#operator-test-runners\" title=\"Link to this heading\">#</a></h2>", "a[href=\"reference/operator-registry.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Operator Registry<a class=\"headerlink\" href=\"#operator-registry\" title=\"Link to this heading\">#</a></h1><p>The complete operator registry is maintained at <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagSparse/blob/main/conf/operators.yaml\">FlagSparse conf/operators.yaml</a>.</p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagSparse Overview<a class=\"headerlink\" href=\"#flagsparse-overview\" title=\"Link to this heading\">#</a></h1><p>FlagSparse is part of <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a>. FlagSparse is a computing library that provides sparse matrix operations and is oriented towards multiple chip backends. It defines core sparse operations such as SpMV, SpMM, SpGEMM, and SDDMM, supporting high-performance computing in fields such as scientific computing, engineering simulation, machine learning, and artificial intelligence.</p><p>FlagSparse is a high-performance sparse operator library implemented using the <a class=\"reference external\" href=\"https://github.com/triton-lang/triton\">Triton programming language</a> launched by OpenAI.</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with FlagSparse<a class=\"headerlink\" href=\"#getting-started-with-flagsparse\" title=\"Link to this heading\">#</a></h1>"}
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
