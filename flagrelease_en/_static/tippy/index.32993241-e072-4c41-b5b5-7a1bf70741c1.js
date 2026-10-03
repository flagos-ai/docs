selector_to_html = {"a[href=\"FlagRelease_overview/FlagRelease-overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagRelease Overview<a class=\"headerlink\" href=\"#flagrelease-overview\" title=\"Link to this heading\">#</a></h1><p>FlagRelease is a platform dedicated to the automatic migration, adaptation and release of large models  across different AI hardwares.</p><p>FlagRelease is built upon the unified and open-source AI system software stack FlagOS, which provides cross-hardware adaptation capabilities. FlagRelease establishes a standardized pipeline that supports the following:</p>", "a[href=\"#flagrelease-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagRelease Documentation<a class=\"headerlink\" href=\"#flagrelease-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"model-list.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Model List<a class=\"headerlink\" href=\"#model-list\" title=\"Link to this heading\">#</a></h1><p>This section includes FlagOS hardware-specific versions of open-source large models.</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started<a class=\"headerlink\" href=\"#getting-started\" title=\"Link to this heading\">#</a></h1><p>This section covers general steps from downloading open-source model weights to deploying and executing models.</p><p>The outputs of FlagRelease include validated large-model files and integrated FlagOS Docker images. By using these artifacts, users can rapidly deploy and run large models on different hardware platforms without performing model migration themselves or configuring complex software environments.</p>", "a[href=\"release_guide/release-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagRelease Release Guide<a class=\"headerlink\" href=\"#flagrelease-release-guide\" title=\"Link to this heading\">#</a></h1><h2>What is FlagRelease<a class=\"headerlink\" href=\"#what-is-flagrelease\" title=\"Link to this heading\">#</a></h2><p>FlagRelease is an automated model evaluation and release pipeline that supports NVIDIA, Ascend, Metax, Hygon, and other GPU platforms for:</p>"}
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
