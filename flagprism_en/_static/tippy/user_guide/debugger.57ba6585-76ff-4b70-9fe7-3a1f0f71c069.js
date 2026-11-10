selector_to_html = {"a[href=\"#quick-start\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Quick start<a class=\"headerlink\" href=\"#quick-start\" title=\"Link to this heading\">#</a></h2><p>Call <code class=\"docutils literal notranslate\"><span class=\"pre\">debugger.activate()</span></code> before compiling the kernel you want to debug. It enables a process-level Debugger pipeline but does not record Python, PyTorch, or <code class=\"docutils literal notranslate\"><span class=\"pre\">torch_npu</span></code> operations; only Triton operations between the collect markers are captured.</p>", "a[href=\"#public-api\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Public API<a class=\"headerlink\" href=\"#public-api\" title=\"Link to this heading\">#</a></h2><p>The only public Python import path is:</p>", "a[href=\"#availability\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Availability<a class=\"headerlink\" href=\"#availability\" title=\"Link to this heading\">#</a></h2><p>After a successful import, <code class=\"docutils literal notranslate\"><span class=\"pre\">debugger.is_available()</span></code> reports whether both the compiler and runtime native bindings are present. A core-only wheel (<code class=\"docutils literal notranslate\"><span class=\"pre\">TRITON_BUILD_FLAGPRISM=OFF</span></code>) does not include <code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree.debugger</span></code>.</p>", "a[href=\"#debugger\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Debugger<a class=\"headerlink\" href=\"#debugger\" title=\"Link to this heading\">#</a></h1><p>FlagPrism Debugger observes values, memory access, and operation execution inside a Triton kernel. It associates compile-time static metadata with device-runtime records, then exports Triton statement-level reports, IR op-level reports, and level-2 NumPy artifacts. It is used to locate numerical anomalies, abnormal memory access, and in-kernel data-flow issues.</p><p>The dynamic collection and hidden-argument launch path is validated on Ascend/CANN9, Tianshu/CoreX 4.4 (LLVM 22), MUSA/mthreads 4.3.5, and NVIDIA CUDA.</p>", "a[href=\"#collection-levels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Collection levels<a class=\"headerlink\" href=\"#collection-levels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">level</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">addr_level</span></code> are collection strategies configured through <code class=\"docutils literal notranslate\"><span class=\"pre\">activate()</span></code>:</p>", "a[href=\"#configuration\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Configuration<a class=\"headerlink\" href=\"#configuration\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">debugger.configure()</span></code> changes the defaults used by subsequent <code class=\"docutils literal notranslate\"><span class=\"pre\">activate()</span></code> calls; unspecified fields keep their current values.</p>"}
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
