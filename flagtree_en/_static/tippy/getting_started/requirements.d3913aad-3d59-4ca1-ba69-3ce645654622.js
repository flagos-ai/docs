selector_to_html = {"a[href=\"#requirements\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><p>This section includes requirements about using FlagTree, including supported platforms and dependencies. FlagTree can be successfully installed and run only when all requirements are met.</p>", "a[href=\"#features-on-different-branches\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Features on different branches<a class=\"headerlink\" href=\"#features-on-different-branches\" title=\"Link to this heading\">#</a></h2><p>FlagTree\u2019s extension components are currently available on some backends:</p>", "a[href=\"#backend-integrations\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Backend integrations<a class=\"headerlink\" href=\"#backend-integrations\" title=\"Link to this heading\">#</a></h2><p>The following backends have been integrated into FlagTree. For new vendors, you can refer to the following code links for your integrations:</p>", "a[href=\"#backends-triton-versions-and-branches\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Backends, Triton versions, and branches<a class=\"headerlink\" href=\"#backends-triton-versions-and-branches\" title=\"Link to this heading\">#</a></h2><p>Each backend is based on different versions of Triton, and therefore resides in different protected branches. All these protected branches have equal status. CI/CD runners are provisioned for every backend listed in the table.</p>", "a[href=\"#system-software-requirements\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">System software requirements<a class=\"headerlink\" href=\"#system-software-requirements\" title=\"Link to this heading\">#</a></h2><p>You may need the following system softwares:</p>"}
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
