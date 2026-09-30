selector_to_html = {"a[href=\"#aipu\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">AIPU<a class=\"headerlink\" href=\"#aipu\" title=\"Link to this heading\">#</a></h3><p>For Hints usage information, see <a class=\"reference internal\" href=\"#\"><span class=\"std std-doc\">Use Hints</span></a>.</p>", "a[href=\"#\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Use Hints<a class=\"headerlink\" href=\"#use-hints\" title=\"Link to this heading\">#</a></h1><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree_hints</span></code> allows users to provide optimization hints to the compiler through trailing comments in the Triton Kernel code.</p><p>You can simply add hints by placing a trailing comment with the format <code class=\"docutils literal notranslate\"><span class=\"pre\">#</span> <span class=\"pre\">@hint:</span> <span class=\"pre\">&lt;hint_name&gt;</span></code> on the same line as operations like <code class=\"docutils literal notranslate\"><span class=\"pre\">tl.load</span></code>.</p>", "a[href=\"#nvidia\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">NVIDIA<a class=\"headerlink\" href=\"#nvidia\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#use-hints\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Use Hints<a class=\"headerlink\" href=\"#use-hints\" title=\"Link to this heading\">#</a></h1><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree_hints</span></code> allows users to provide optimization hints to the compiler through trailing comments in the Triton Kernel code.</p><p>You can simply add hints by placing a trailing comment with the format <code class=\"docutils literal notranslate\"><span class=\"pre\">#</span> <span class=\"pre\">@hint:</span> <span class=\"pre\">&lt;hint_name&gt;</span></code> on the same line as operations like <code class=\"docutils literal notranslate\"><span class=\"pre\">tl.load</span></code>.</p>", "a[href=\"#huawei-ascend\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Huawei Ascend<a class=\"headerlink\" href=\"#huawei-ascend\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#supported-hints\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Supported hints<a class=\"headerlink\" href=\"#supported-hints\" title=\"Link to this heading\">#</a></h2><p>The following tables list the optimization hints applicable to Triton operations for compilation on different backends.</p>"}
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
