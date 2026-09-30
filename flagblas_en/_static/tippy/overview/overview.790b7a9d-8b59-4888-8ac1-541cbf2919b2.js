selector_to_html = {"a[href=\"#features\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flagblas-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagBLAS Overview<a class=\"headerlink\" href=\"#flagblas-overview\" title=\"Link to this heading\">#</a></h1><p>FlagBLAS is a high-performance general-purpose operator library that follows the BLAS (Basic Linear Algebra Subprograms) standard interface, oriented towards multiple chip backends. It is part of the <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> ecosystem and defines core operations for numerical calculations such as vectors and matrices, supporting high-performance computing in scientific computing, engineering simulation, machine learning, and artificial intelligence.</p><p>FlagBLAS is implemented using the <a class=\"reference external\" href=\"https://github.com/openai/triton\">Triton programming language</a> launched by OpenAI, enabling portable kernel code across diverse hardware.</p>", "a[href=\"#architecture\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Architecture<a class=\"headerlink\" href=\"#architecture\" title=\"Link to this heading\">#</a></h2><p>FlagBLAS follows the standard BLAS interface hierarchy:</p>"}
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
