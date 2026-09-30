selector_to_html = {"a[href=\"#software\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Software<a class=\"headerlink\" href=\"#software\" title=\"Link to this heading\">#</a></h2><p>Per-platform software stacks (vendor driver, firmware, <code class=\"docutils literal notranslate\"><span class=\"pre\">torch</span></code> extension such as <code class=\"docutils literal notranslate\"><span class=\"pre\">torch_mlu</span></code>, and communication libraries such as CNCL/MCCL/IXCCL) are provided by the respective hardware vendors. See each platform\u2019s installation guide for details.</p>", "a[href=\"#operating-system\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Operating System<a class=\"headerlink\" href=\"#operating-system\" title=\"Link to this heading\">#</a></h2><p>Linux (official).</p>", "a[href=\"#requirements\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h1><h2>Supported Hardware<a class=\"headerlink\" href=\"#supported-hardware\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#supported-hardware\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Supported Hardware<a class=\"headerlink\" href=\"#supported-hardware\" title=\"Link to this heading\">#</a></h2>"}
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
