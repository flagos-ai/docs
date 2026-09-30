selector_to_html = {"a[href=\"#use-flagblas\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Use FlagBLAS<a class=\"headerlink\" href=\"#use-flagblas\" title=\"Link to this heading\">#</a></h2><p>FlagBLAS integrates directly with PyTorch. Import the package and call operators on CUDA tensors:</p>", "a[href=\"#operator-list\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Operator list<a class=\"headerlink\" href=\"#operator-list\" title=\"Link to this heading\">#</a></h2><p>The complete operator registry is maintained at <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagBLAS/blob/master/conf/operators.yaml\">FlagBLAS conf/operators.yaml</a>.</p>", "a[href=\"#flagblas-user-guide\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagBLAS User Guide<a class=\"headerlink\" href=\"#flagblas-user-guide\" title=\"Link to this heading\">#</a></h1><h2>Use FlagBLAS<a class=\"headerlink\" href=\"#use-flagblas\" title=\"Link to this heading\">#</a></h2><p>FlagBLAS integrates directly with PyTorch. Import the package and call operators on CUDA tensors:</p>"}
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
