selector_to_html = {"a[href=\"#flaggems-vllm-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagGems-vLLM Overview<a class=\"headerlink\" href=\"#flaggems-vllm-overview\" title=\"Link to this heading\">#</a></h1><p>FlagGems-vLLM is part of <a class=\"reference external\" href=\"https://flagos.io/Home\">FlagOS</a>. FlagGems-vLLM is a high-performance operator library designed for multiple hardware backends. It provides optimized implementations of common vLLM operators and supports high-performance inference and deployment for a variety of widely used models.</p><p>FlagGems-vLLM is a high-performance deep learning operator library implemented using the <a class=\"reference external\" href=\"https://github.com/openai/triton\">Triton programming language</a> launched by OpenAI.</p>", "a[href=\"features.html#relationship-with-flaggems-and-vllm-plugin-fl\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Relationship with FlagGems and vllm-plugin-fl<a class=\"headerlink\" href=\"#relationship-with-flaggems-and-vllm-plugin-fl\" title=\"Link to this heading\">#</a></h2><p>The three repositories are used together but have different responsibilities:</p>", "a[href=\"features.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h1><p>FlagGems-vLLM provides the following key features:</p>"}
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
