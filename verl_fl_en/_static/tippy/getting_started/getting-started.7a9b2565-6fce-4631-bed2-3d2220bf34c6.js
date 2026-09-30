selector_to_html = {"a[href=\"requirements.html#flagos-dependencies\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FlagOS Dependencies<a class=\"headerlink\" href=\"#flagos-dependencies\" title=\"Link to this heading\">#</a></h2>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Quick Setup<a class=\"headerlink\" href=\"#quick-setup\" title=\"Link to this heading\">#</a></h1><h2>Docker Images (Recommended)<a class=\"headerlink\" href=\"#docker-images-recommended\" title=\"Link to this heading\">#</a></h2><p>Pre-built Docker images are available for each platform:</p>", "a[href=\"install.html#docker-images-recommended\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Docker Images (Recommended)<a class=\"headerlink\" href=\"#docker-images-recommended\" title=\"Link to this heading\">#</a></h2><p>Pre-built Docker images are available for each platform:</p>", "a[href=\"requirements.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><h2>Supported Hardwares<a class=\"headerlink\" href=\"#supported-hardwares\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html#operating-system\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Operating System<a class=\"headerlink\" href=\"#operating-system\" title=\"Link to this heading\">#</a></h2><p>Linux (official)</p>", "a[href=\"install.html#install-from-source\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Install from Source<a class=\"headerlink\" href=\"#install-from-source\" title=\"Link to this heading\">#</a></h2><h3>Prerequisites<a class=\"headerlink\" href=\"#prerequisites\" title=\"Link to this heading\">#</a></h3><p>Ensure you have the required software dependencies installed. See <a class=\"reference internal\" href=\"requirements.html\"><span class=\"std std-doc\">Requirements</span></a> for details.</p>", "a[href=\"#getting-started-with-verl-fl\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with verl-FL<a class=\"headerlink\" href=\"#getting-started-with-verl-fl\" title=\"Link to this heading\">#</a></h1><p>This section covers the requirements for installing verl-FL and guides you through installing verl-FL on different hardware platforms.</p>", "a[href=\"requirements.html#supported-hardwares\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Supported Hardwares<a class=\"headerlink\" href=\"#supported-hardwares\" title=\"Link to this heading\">#</a></h2>", "a[href=\"requirements.html#software\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Software<a class=\"headerlink\" href=\"#software\" title=\"Link to this heading\">#</a></h2>"}
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
