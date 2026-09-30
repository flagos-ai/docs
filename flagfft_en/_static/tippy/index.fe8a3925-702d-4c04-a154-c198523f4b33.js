selector_to_html = {"a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT User Guide<a class=\"headerlink\" href=\"#flagfft-user-guide\" title=\"Link to this heading\">#</a></h1><h2>Use the C API<a class=\"headerlink\" href=\"#use-the-c-api\" title=\"Link to this heading\">#</a></h2><p>FlagFFT exposes a cuFFT-compatible C API in <code class=\"docutils literal notranslate\"><span class=\"pre\">include/flagfft.h</span></code>.</p>", "a[href=\"reference/api-reference.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT C API Reference<a class=\"headerlink\" href=\"#flagfft-c-api-reference\" title=\"Link to this heading\">#</a></h1><h2>Plan Creation<a class=\"headerlink\" href=\"#plan-creation\" title=\"Link to this heading\">#</a></h2>", "a[href=\"reference/tle-reference.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">TLE Reference<a class=\"headerlink\" href=\"#tle-reference\" title=\"Link to this heading\">#</a></h1><p>This page covers FlagTree/TLE APIs useful when authoring FlagFFT Triton kernels.</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with FlagFFT<a class=\"headerlink\" href=\"#getting-started-with-flagfft\" title=\"Link to this heading\">#</a></h1>", "a[href=\"#flagfft-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT Documentation<a class=\"headerlink\" href=\"#flagfft-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Get Started</span></a></p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT Overview<a class=\"headerlink\" href=\"#flagfft-overview\" title=\"Link to this heading\">#</a></h1><p>FlagFFT is an experimental C++ FFT library with a cuFFT-style API and Triton/TLE-generated CUDA kernels. The public runtime interface is C; Python is retained only for Triton/TLE JIT source generation (internal codegen).</p><p>FlagFFT is part of the <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> ecosystem and provides high-performance FFT computations for scientific computing, signal processing, and machine learning workloads.</p>"}
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
