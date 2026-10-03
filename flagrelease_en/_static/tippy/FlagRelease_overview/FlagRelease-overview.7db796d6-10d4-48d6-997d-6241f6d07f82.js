selector_to_html = {"a[href=\"#flagrelease-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagRelease Overview<a class=\"headerlink\" href=\"#flagrelease-overview\" title=\"Link to this heading\">#</a></h1><p>FlagRelease is a platform dedicated to the automatic migration, adaptation and release of large models  across different AI hardwares.</p><p>FlagRelease is built upon the unified and open-source AI system software stack FlagOS, which provides cross-hardware adaptation capabilities. FlagRelease establishes a standardized pipeline that supports the following:</p>"}
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
