selector_to_html = {"a[href=\"#common-architecture\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Common architecture<a class=\"headerlink\" href=\"#common-architecture\" title=\"Link to this heading\">#</a></h1><p>This section introduces the common architecture between FlagTree and Triton. The common architecture comprises <strong>AST Processing</strong>, <strong>Backend Compilation</strong>, and <strong>Runtime System</strong> modules that handle the compilation process.</p><p>The following list introduces directories in FlagTree and the functions of each module:</p>"}
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
