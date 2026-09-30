selector_to_html = {"a[href=\"#architecture\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Architecture<a class=\"headerlink\" href=\"#architecture\" title=\"Link to this heading\">#</a></h2><p>FlagDNN follows a layered architecture:</p>", "a[href=\"#features\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flagdnn-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagDNN Overview<a class=\"headerlink\" href=\"#flagdnn-overview\" title=\"Link to this heading\">#</a></h1><p>FlagDNN is part of <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a>. FlagDNN is a deep neural network computing library oriented towards multiple chip backends. It provides high-performance implementations of common deep learning operators, supporting efficient computation in fields such as deep learning, computer vision, natural language processing, and artificial intelligence.</p><p>FlagDNN is a high-performance deep learning operator library implemented using the <a class=\"reference external\" href=\"https://github.com/openai/triton\">Triton programming language</a> launched by OpenAI.</p>", "a[href=\"#workflow\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Workflow<a class=\"headerlink\" href=\"#workflow\" title=\"Link to this heading\">#</a></h2>"}
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
