selector_to_html = {"a[href=\"../dispatch_user_guide/dispatch-user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Operator dispatch user guide<a class=\"headerlink\" href=\"#operator-dispatch-user-guide\" title=\"Link to this heading\">#</a></h1><p>This guide describes how to use an operator dispatch system that selects between FlagGems, vendor-specific, and PyTorch reference implementations. The selection follows a priority hierarchy, from highest to lowest:</p>", "a[href=\"../getting_started/install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Install software for running an inference task<a class=\"headerlink\" href=\"#install-software-for-running-an-inference-task\" title=\"Link to this heading\">#</a></h1><h2>Install from docker image<a class=\"headerlink\" href=\"#install-from-docker-image\" title=\"Link to this heading\">#</a></h2><p>vllm-plugin-FL is installed from a pre-built Docker image. The supported versions and hardware platforms are listed in <a class=\"reference internal\" href=\"../getting_started/requirements.html\"><span class=\"std std-doc\">Requirements</span></a>.</p>", "a[href=\"#features\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h1><p>Leverages FlagGems (unified operator library) and FlagCX (unified communication library) to provide chip-agnostic inference capabilities. The same model can run on different hardware without code modifications.</p>"}
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
