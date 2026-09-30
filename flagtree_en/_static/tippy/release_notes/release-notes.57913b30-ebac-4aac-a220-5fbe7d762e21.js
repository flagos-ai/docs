selector_to_html = {"a[href=\"release_notes_v050.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.5.0 Release<a class=\"headerlink\" href=\"#flagtree-0-5-0-release\" title=\"Link to this heading\">#</a></h1>", "a[href=\"release_notes_v010.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.1.0 release<a class=\"headerlink\" href=\"#flagtree-0-1-0-release\" title=\"Link to this heading\">#</a></h1><h2>Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2><p>FlagTree\u2019s initial release is built on Triton 3.1, introducing support for diverse AI chip backends. In its early stage, the project aims to maintain compatibility with existing backend adaptation solutions while unifying the codebase to enable rapid single-version multi-backend support.</p>", "a[href=\"release_notes_v040.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.4.0 release<a class=\"headerlink\" href=\"#flagtree-0-4-0-release\" title=\"Link to this heading\">#</a></h1>", "a[href=\"release_notes_v060.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.6.0 Release<a class=\"headerlink\" href=\"#flagtree-0-6-0-release\" title=\"Link to this heading\">#</a></h1>", "a[href=\"release_notes_v030.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.3.0 release<a class=\"headerlink\" href=\"#flagtree-0-3-0-release\" title=\"Link to this heading\">#</a></h1><h2>Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2><p>FlagTree inherits capabilities from the previous version, continuously integrates new backends, and strengthens the ecosystem matrix. The project is currently in its early stage, aiming to be compatible with existing adaptation solutions for various chip backends, unify code repositories, create a collaborative code-building platform, and quickly achieve single-repository multi-backend support. Meanwhile, it continues to develop unified programming interface extensions, build intermediate layer representation and conversion extensions (FLIR), and enhance hardware awareness and compilation guidance support capabilities and scope (flagtree_hints).</p>", "a[href=\"release_notes_v020.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.2.0 release<a class=\"headerlink\" href=\"#flagtree-0-2-0-release\" title=\"Link to this heading\">#</a></h1><h2>Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2><p>FlagTree inherits capabilities from the previous version, continuously integrates new backends, expands support for Triton versions, and provides hardware-aware optimization capabilities. The project is currently in its early stages, aiming to be compatible with existing adaptation solutions for various AI chip backends, unify the code repository, build a code co-construction platform, and quickly implement multi-backend support in a single repository.</p>", "a[href=\"release_notes_v070.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.7.0 Release<a class=\"headerlink\" href=\"#flagtree-0-7-0-release\" title=\"Link to this heading\">#</a></h1>", "a[href=\"#release-notes\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Release Notes<a class=\"headerlink\" href=\"#release-notes\" title=\"Link to this heading\">#</a></h1><p>This section includes the FlagTree release information.</p>"}
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
