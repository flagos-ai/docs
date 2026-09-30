selector_to_html = {"a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with FlagBLAS<a class=\"headerlink\" href=\"#getting-started-with-flagblas\" title=\"Link to this heading\">#</a></h1>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagBLAS Overview<a class=\"headerlink\" href=\"#flagblas-overview\" title=\"Link to this heading\">#</a></h1><p>FlagBLAS is a high-performance general-purpose operator library that follows the BLAS (Basic Linear Algebra Subprograms) standard interface, oriented towards multiple chip backends. It is part of the <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> ecosystem and defines core operations for numerical calculations such as vectors and matrices, supporting high-performance computing in scientific computing, engineering simulation, machine learning, and artificial intelligence.</p><p>FlagBLAS is implemented using the <a class=\"reference external\" href=\"https://github.com/openai/triton\">Triton programming language</a> launched by OpenAI, enabling portable kernel code across diverse hardware.</p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagBLAS User Guide<a class=\"headerlink\" href=\"#flagblas-user-guide\" title=\"Link to this heading\">#</a></h1><h2>Use FlagBLAS<a class=\"headerlink\" href=\"#use-flagblas\" title=\"Link to this heading\">#</a></h2><p>FlagBLAS integrates directly with PyTorch. Import the package and call operators on CUDA tensors:</p>", "a[href=\"#flagblas-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagBLAS Documentation<a class=\"headerlink\" href=\"#flagblas-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>"}
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
