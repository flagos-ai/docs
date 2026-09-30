selector_to_html = {"a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Install FlagAudio<a class=\"headerlink\" href=\"#install-flagaudio\" title=\"Link to this heading\">#</a></h1><h2>Install Build Dependencies<a class=\"headerlink\" href=\"#install-build-dependencies\" title=\"Link to this heading\">#</a></h2>", "a[href=\"install.html#install-build-dependencies\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Install Build Dependencies<a class=\"headerlink\" href=\"#install-build-dependencies\" title=\"Link to this heading\">#</a></h2>", "a[href=\"install.html#clone-and-install-flagaudio\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Clone and Install FlagAudio<a class=\"headerlink\" href=\"#clone-and-install-flagaudio\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#getting-started-with-flagaudio\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with FlagAudio<a class=\"headerlink\" href=\"#getting-started-with-flagaudio\" title=\"Link to this heading\">#</a></h1>"}
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
