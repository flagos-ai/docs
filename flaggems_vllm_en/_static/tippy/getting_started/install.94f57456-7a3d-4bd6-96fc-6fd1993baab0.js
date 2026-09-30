selector_to_html = {"a[href=\"#install-flaggems-vllm\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Install FlagGems-vLLM<a class=\"headerlink\" href=\"#install-flaggems-vllm\" title=\"Link to this heading\">#</a></h1><p>For a fresh installation of FlagGems-vLLM, follow the steps below.</p>"}
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
