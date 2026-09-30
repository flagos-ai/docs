selector_to_html = {"a[href=\"#new-features\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">New features<a class=\"headerlink\" href=\"#new-features\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#known-issues\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Known issues<a class=\"headerlink\" href=\"#known-issues\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#highlights\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2><p>FlagTree\u2019s initial release is built on Triton 3.1, introducing support for diverse AI chip backends. In its early stage, the project aims to maintain compatibility with existing backend adaptation solutions while unifying the codebase to enable rapid single-version multi-backend support.</p>", "a[href=\"#looking-ahead\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Looking ahead<a class=\"headerlink\" href=\"#looking-ahead\" title=\"Link to this heading\">#</a></h2><p>FlagTree will continue investing in the Triton ecosystem, focusing on tracking Triton version updates, integrating AI chip backends, improving compilation efficiency, and enhancing cross-platform compatibility. Additionally, FlagTree will explore balancing general usability with chip-specific optimization requirements, providing compatible language-level unified abstractions and explicit specifications for hardware storage hierarchies, parallelism levels, and acceleration units.</p>", "a[href=\"#flagtree-0-1-0-release\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.1.0 release<a class=\"headerlink\" href=\"#flagtree-0-1-0-release\" title=\"Link to this heading\">#</a></h1><h2>Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2><p>FlagTree\u2019s initial release is built on Triton 3.1, introducing support for diverse AI chip backends. In its early stage, the project aims to maintain compatibility with existing backend adaptation solutions while unifying the codebase to enable rapid single-version multi-backend support.</p>"}
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
