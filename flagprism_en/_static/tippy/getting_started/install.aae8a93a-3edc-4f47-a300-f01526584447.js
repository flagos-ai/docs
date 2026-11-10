selector_to_html = {"a[href=\"#build-with-flagtree\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Build with FlagTree<a class=\"headerlink\" href=\"#build-with-flagtree\" title=\"Link to this heading\">#</a></h2><p>From the FlagTree repository root:</p>", "a[href=\"#prerequisites\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Prerequisites<a class=\"headerlink\" href=\"#prerequisites\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#requirements\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Requirements<a class=\"headerlink\" href=\"#requirements\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#build-switches\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Build switches<a class=\"headerlink\" href=\"#build-switches\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#verifying-the-install\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Verifying the install<a class=\"headerlink\" href=\"#verifying-the-install\" title=\"Link to this heading\">#</a></h2><p>A core-only wheel (<code class=\"docutils literal notranslate\"><span class=\"pre\">TRITON_BUILD_FLAGPRISM=OFF</span></code>) does not include <code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree.debugger</span></code>. Use <code class=\"docutils literal notranslate\"><span class=\"pre\">debugger.is_available()</span></code> to check whether both the compiler and runtime native bindings are present.</p>", "a[href=\"#installation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Installation<a class=\"headerlink\" href=\"#installation\" title=\"Link to this heading\">#</a></h1><p>FlagPrism is built as part of the FlagTree wheel via the <code class=\"docutils literal notranslate\"><span class=\"pre\">third_party/FlagPrism</span></code> submodule. It is not published as a standalone package.</p>"}
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
