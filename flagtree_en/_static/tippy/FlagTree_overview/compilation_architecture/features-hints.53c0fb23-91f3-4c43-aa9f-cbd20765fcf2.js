selector_to_html = {"a[href=\"#hints-introduction\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Hints introduction<a class=\"headerlink\" href=\"#hints-introduction\" title=\"Link to this heading\">#</a></h2><p>Hints provides a non-invasive performance hints injection mechanism that enables hardware-aware optimizations while maintaining full compatibility with native Triton code. The mechanism is simple: programmers add inline comments (<code class=\"docutils literal notranslate\"><span class=\"pre\">#@hint:</span> <span class=\"pre\">&lt;hint_name&gt;</span></code>) to the corresponding Triton operations (for example, <code class=\"docutils literal notranslate\"><span class=\"pre\">tl.load</span></code>) to provide hardware-aware optimization hints. These hints are encoded as MLIR (Multi-Level Intermediate Representation) attributes during compilation, enabling the mid-end and backend to apply hardware-aware optimizations and multi-platform dynamic adaptation based on an elastic verification strategy.</p><p>This mechanism provides the following characteristics:</p>", "a[href=\"../../user_guide/use-hints.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Use Hints<a class=\"headerlink\" href=\"#use-hints\" title=\"Link to this heading\">#</a></h1><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree_hints</span></code> allows users to provide optimization hints to the compiler through trailing comments in the Triton Kernel code.</p><p>You can simply add hints by placing a trailing comment with the format <code class=\"docutils literal notranslate\"><span class=\"pre\">#</span> <span class=\"pre\">@hint:</span> <span class=\"pre\">&lt;hint_name&gt;</span></code> on the same line as operations like <code class=\"docutils literal notranslate\"><span class=\"pre\">tl.load</span></code>.</p>", "a[href=\"#hints-in-the-compilation-process\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Hints in the compilation process<a class=\"headerlink\" href=\"#hints-in-the-compilation-process\" title=\"Link to this heading\">#</a></h2><p>Hints extends TTIR operations with attributes to enable hardware-aware optimizations. The implementation involves AST processing, TTIR attribute encoding, and backend pass distribution.</p>", "a[href=\"#hints\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Hints<a class=\"headerlink\" href=\"#hints\" title=\"Link to this heading\">#</a></h1><p>This section introduces Hints and how Hints are handled in the compilation process.</p>"}
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
