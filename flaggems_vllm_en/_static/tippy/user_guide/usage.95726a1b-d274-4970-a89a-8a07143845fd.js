selector_to_html = {"a[href=\"../reference/operator_list.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Operator List<a class=\"headerlink\" href=\"#operator-list\" title=\"Link to this heading\">#</a></h1><p>This page lists the operators exported by FlagGems-vLLM, sourced from <code class=\"docutils literal notranslate\"><span class=\"pre\">src/flaggems_vllm/ops/__init__.py</span></code>.</p><p>FlagGems-vLLM provides optimized implementations of common vLLM operators using the Triton programming language. The following 109 operators are currently exported:</p>", "a[href=\"#use-operators\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Use operators<a class=\"headerlink\" href=\"#use-operators\" title=\"Link to this heading\">#</a></h1><p>After installing FlagGems-vLLM, you can use its optimized operators directly in your Python code.</p><p>For example, import the library and call the operators on CUDA tensors:</p>"}
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
