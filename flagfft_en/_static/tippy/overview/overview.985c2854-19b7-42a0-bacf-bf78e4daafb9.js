selector_to_html = {"a[href=\"#flagfft-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT Overview<a class=\"headerlink\" href=\"#flagfft-overview\" title=\"Link to this heading\">#</a></h1><p>FlagFFT is an experimental C++ FFT library with a cuFFT-style API and Triton/TLE-generated CUDA kernels. The public runtime interface is C; Python is retained only for Triton/TLE JIT source generation (internal codegen).</p><p>FlagFFT is part of the <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> ecosystem and provides high-performance FFT computations for scientific computing, signal processing, and machine learning workloads.</p>", "a[href=\"#features\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#tests\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#c-runtime\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">C++ Runtime<a class=\"headerlink\" href=\"#c-runtime\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#architecture\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Architecture<a class=\"headerlink\" href=\"#architecture\" title=\"Link to this heading\">#</a></h2><h3>C++ Runtime<a class=\"headerlink\" href=\"#c-runtime\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#python-boundary\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Python Boundary<a class=\"headerlink\" href=\"#python-boundary\" title=\"Link to this heading\">#</a></h3><p>The native runtime invokes <code class=\"docutils literal notranslate\"><span class=\"pre\">python</span> <span class=\"pre\">-m</span> <span class=\"pre\">flagfft_codegen.jit_source</span></code>; the chosen Python environment must supply compatible Triton/TLE dependencies. Generated JIT source/metadata live in <code class=\"docutils literal notranslate\"><span class=\"pre\">.flagfft</span></code> beside the executable.</p>", "a[href=\"#raw-execution-nodes\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Raw Execution Nodes<a class=\"headerlink\" href=\"#raw-execution-nodes\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#build-options\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Build Options<a class=\"headerlink\" href=\"#build-options\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#cli-tools\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">CLI Tools<a class=\"headerlink\" href=\"#cli-tools\" title=\"Link to this heading\">#</a></h3><p><code class=\"docutils literal notranslate\"><span class=\"pre\">src/cli_tools/common/</span></code> owns <code class=\"docutils literal notranslate\"><span class=\"pre\">CaseSpec</span></code>, deterministic buffer generation, FlagFFT/cuFFT dispatch, and comparison. cuFFT is used only in the CLI as the CUDA validation/performance oracle.</p>", "a[href=\"#workflow\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Workflow<a class=\"headerlink\" href=\"#workflow\" title=\"Link to this heading\">#</a></h2>"}
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
