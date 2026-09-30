selector_to_html = {"a[href=\"#license\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">License<a class=\"headerlink\" href=\"#license\" title=\"Link to this heading\">#</a></h2><p>Apache License 2.0.</p>", "a[href=\"#project-links\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Project Links<a class=\"headerlink\" href=\"#project-links\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#upstream-verl-documentation\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Upstream verl Documentation<a class=\"headerlink\" href=\"#upstream-verl-documentation\" title=\"Link to this heading\">#</a></h2><p>For verl features and commands not specific to hardware plugins, refer to the <a class=\"reference external\" href=\"https://verl.readthedocs.io/en/latest/index.html\">verl Documentation</a>.</p>", "a[href=\"#related-flagos-components\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Related FlagOS Components<a class=\"headerlink\" href=\"#related-flagos-components\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#references\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">References<a class=\"headerlink\" href=\"#references\" title=\"Link to this heading\">#</a></h1><h2>Project Links<a class=\"headerlink\" href=\"#project-links\" title=\"Link to this heading\">#</a></h2>"}
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
