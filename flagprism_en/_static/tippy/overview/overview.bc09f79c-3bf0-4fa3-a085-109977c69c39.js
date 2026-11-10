selector_to_html = {"a[href=\"#components\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Components<a class=\"headerlink\" href=\"#components\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#build-modes\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Build modes<a class=\"headerlink\" href=\"#build-modes\" title=\"Link to this heading\">#</a></h2><p>The Python wheel supports exactly two build modes:</p>", "a[href=\"#relationship-to-flagtree\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Relationship to FlagTree<a class=\"headerlink\" href=\"#relationship-to-flagtree\" title=\"Link to this heading\">#</a></h2><p>FlagTree is a unified, multi-backend compiler that enables Triton programs to run across diverse AI accelerators. FlagPrism complements FlagTree with observability tools that help developers debug kernel correctness, analyze runtime behavior, identify performance bottlenecks, and optimize Triton workloads.</p><p>FlagTree consumes FlagPrism as the <code class=\"docutils literal notranslate\"><span class=\"pre\">third_party/FlagPrism</span></code> submodule. The standalone <code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree-debugger</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree-profiler</span></code> wheels are no longer published. Running <code class=\"docutils literal notranslate\"><span class=\"pre\">pip</span> <span class=\"pre\">wheel</span> <span class=\"pre\">.</span></code> from the FlagTree repository builds the core, Debugger, and Profiler in one CMake graph and packages them into a single FlagTree wheel:</p>", "a[href=\"#status\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Status<a class=\"headerlink\" href=\"#status\" title=\"Link to this heading\">#</a></h2><p>FlagPrism is delivered through the FlagTree submodule and installed as part of the FlagTree wheel.</p>", "a[href=\"#backend-support\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Backend support<a class=\"headerlink\" href=\"#backend-support\" title=\"Link to this heading\">#</a></h2><p>The following matrix tracks the FlagPrism enablement roadmap. It describes Debugger and Profiler integration, not the availability of the corresponding FlagTree compiler backend.</p>", "a[href=\"#overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Overview<a class=\"headerlink\" href=\"#overview\" title=\"Link to this heading\">#</a></h1><p>FlagPrism is a multi-backend debugging and performance-analysis toolkit for Triton programs. It provides a consistent observability workflow across NVIDIA GPUs and diverse AI accelerators: it observes Triton kernels at both compile time and runtime, connects source-level context with Triton IR operations and device events, and turns the collected data into reports that help developers understand correctness, memory behavior, and performance across heterogeneous backends.</p>"}
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
