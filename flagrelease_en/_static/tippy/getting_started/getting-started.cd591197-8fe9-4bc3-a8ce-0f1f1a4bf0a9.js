selector_to_html = {"a[href=\"#getting-started\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started<a class=\"headerlink\" href=\"#getting-started\" title=\"Link to this heading\">#</a></h1><p>This section covers general steps from downloading open-source model weights to deploying and executing models.</p><p>The outputs of FlagRelease include validated large-model files and integrated FlagOS Docker images. By using these artifacts, users can rapidly deploy and run large models on different hardware platforms without performing model migration themselves or configuring complex software environments.</p>", "a[href=\"#general-workflow\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">General Workflow<a class=\"headerlink\" href=\"#general-workflow\" title=\"Link to this heading\">#</a></h2><p>The general workflow is as follows:</p>", "a[href=\"#operation-steps\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Operation Steps<a class=\"headerlink\" href=\"#operation-steps\" title=\"Link to this heading\">#</a></h2>"}
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
