selector_to_html = {"a[href=\"#compile-paddle-with-flagcx\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Compile paddle with FlagCX<a class=\"headerlink\" href=\"#compile-paddle-with-flagcx\" title=\"Link to this heading\">#</a></h2><p><strong>Note</strong>: To build Paddle with FlagCX on Iluvatar machines, we need to ensure that FlagCX is built before building Paddle</p>", "a[href=\"#guide-for-using-paddle-with-flagcx-on-iluvatar-machines\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Guide for using paddle with FlagCX on iluvatar machines<a class=\"headerlink\" href=\"#guide-for-using-paddle-with-flagcx-on-iluvatar-machines\" title=\"Link to this heading\">#</a></h1><h2>Environment setup<a class=\"headerlink\" href=\"#environment-setup\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#train-model-using-paddle-flagcx\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Train model using paddle + FlagCX<a class=\"headerlink\" href=\"#train-model-using-paddle-flagcx\" title=\"Link to this heading\">#</a></h2><p>We now support training ERNIE4.5 on Iluvatar machines using Paddle + FlagCX. Please refer to the following steps to get started</p>", "a[href=\"#environment-setup\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Environment setup<a class=\"headerlink\" href=\"#environment-setup\" title=\"Link to this heading\">#</a></h2>"}
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
