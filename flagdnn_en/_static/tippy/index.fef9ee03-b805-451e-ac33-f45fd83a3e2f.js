selector_to_html = {"a[href=\"#flagdnn-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagDNN Documentation<a class=\"headerlink\" href=\"#flagdnn-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagDNN Overview<a class=\"headerlink\" href=\"#flagdnn-overview\" title=\"Link to this heading\">#</a></h1><p>FlagDNN is part of <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a>. FlagDNN is a deep neural network computing library oriented towards multiple chip backends. It provides high-performance implementations of common deep learning operators, supporting efficient computation in fields such as deep learning, computer vision, natural language processing, and artificial intelligence.</p><p>FlagDNN is a high-performance deep learning operator library implemented using the <a class=\"reference external\" href=\"https://github.com/openai/triton\">Triton programming language</a> launched by OpenAI.</p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagDNN User Guide<a class=\"headerlink\" href=\"#flagdnn-user-guide\" title=\"Link to this heading\">#</a></h1><h2>Use FlagDNN<a class=\"headerlink\" href=\"#use-flagdnn\" title=\"Link to this heading\">#</a></h2><p>FlagDNN integrates directly with PyTorch. Import the package and call operators on CUDA tensors:</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with FlagDNN<a class=\"headerlink\" href=\"#getting-started-with-flagdnn\" title=\"Link to this heading\">#</a></h1>"}
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
