selector_to_html = {"a[href=\"#execution\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Execution<a class=\"headerlink\" href=\"#execution\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#types\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Types<a class=\"headerlink\" href=\"#types\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#transform-types\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Transform Types<a class=\"headerlink\" href=\"#transform-types\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#plan-creation\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Plan Creation<a class=\"headerlink\" href=\"#plan-creation\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#status-codes\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Status Codes<a class=\"headerlink\" href=\"#status-codes\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flagfft-c-api-reference\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT C API Reference<a class=\"headerlink\" href=\"#flagfft-c-api-reference\" title=\"Link to this heading\">#</a></h1><h2>Plan Creation<a class=\"headerlink\" href=\"#plan-creation\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#stream-and-lifecycle\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Stream and Lifecycle<a class=\"headerlink\" href=\"#stream-and-lifecycle\" title=\"Link to this heading\">#</a></h2>"}
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
