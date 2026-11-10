selector_to_html = {"a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Overview<a class=\"headerlink\" href=\"#overview\" title=\"Link to this heading\">#</a></h1><p>FlagPrism is a multi-backend debugging and performance-analysis toolkit for Triton programs. It provides a consistent observability workflow across NVIDIA GPUs and diverse AI accelerators: it observes Triton kernels at both compile time and runtime, connects source-level context with Triton IR operations and device events, and turns the collected data into reports that help developers understand correctness, memory behavior, and performance across heterogeneous backends.</p>", "a[href=\"#flagprism\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagPrism<a class=\"headerlink\" href=\"#flagprism\" title=\"Link to this heading\">#</a></h1><p>FlagPrism is a multi-backend debugging and performance-analysis toolkit for <a class=\"reference external\" href=\"https://github.com/triton-lang/triton\">Triton</a> programs, built for the <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagTree\">FlagTree</a> ecosystem. It centrally maintains the <code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree.debugger</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree.profiler</span></code> components and provides a consistent observability workflow across NVIDIA GPUs and diverse AI accelerators.</p><p><a data-lightbox=\"image-set\" href=\"_images/flagprism-architecture.png\">\n<img alt=\"FlagPrism architecture\" src=\"_images/flagprism-architecture.png\"/></a>\n</p>", "a[href=\"#project-links\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Project links<a class=\"headerlink\" href=\"#project-links\" title=\"Link to this heading\">#</a></h2>", "a[href=\"getting_started/install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Installation<a class=\"headerlink\" href=\"#installation\" title=\"Link to this heading\">#</a></h1><p>FlagPrism is built as part of the FlagTree wheel via the <code class=\"docutils literal notranslate\"><span class=\"pre\">third_party/FlagPrism</span></code> submodule. It is not published as a standalone package.</p>", "a[href=\"user_guide/profiler.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Profiler<a class=\"headerlink\" href=\"#profiler\" title=\"Link to this heading\">#</a></h1><p>FlagTree Profiler is a lightweight profiler for Triton. It provides program context, metadata, and hardware performance metrics for the GPU kernels invoked from Python code, and aggregates records into tree, timeline, Hatchet, metadata, and vendor-specific outputs.</p>", "a[href=\"user_guide/debugger.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Debugger<a class=\"headerlink\" href=\"#debugger\" title=\"Link to this heading\">#</a></h1><p>FlagPrism Debugger observes values, memory access, and operation execution inside a Triton kernel. It associates compile-time static metadata with device-runtime records, then exports Triton statement-level reports, IR op-level reports, and level-2 NumPy artifacts. It is used to locate numerical anomalies, abnormal memory access, and in-kernel data-flow issues.</p><p>The dynamic collection and hidden-argument launch path is validated on Ascend/CANN9, Tianshu/CoreX 4.4 (LLVM 22), MUSA/mthreads 4.3.5, and NVIDIA CUDA.</p>"}
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
