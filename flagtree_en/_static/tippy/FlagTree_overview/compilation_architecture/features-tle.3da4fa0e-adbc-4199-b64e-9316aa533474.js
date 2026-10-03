selector_to_html = {"a[href=\"#optional-gpu-commonir-lowering\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Optional GPU CommonIR lowering<a class=\"headerlink\" href=\"#optional-gpu-commonir-lowering\" title=\"Link to this heading\">#</a></h2><p>The default NVIDIA build keeps the native TLE GPU lowering path. When CommonIR is explicitly enabled, the frontend first keeps structured buffer operations as CommonIR TileIR and then converts them to native TTGIR:</p>", "a[href=\"#tle-lite-tle-struct-and-tle-raw-introduction\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">TLE-Lite, TLE-Struct, and TLE-Raw introduction<a class=\"headerlink\" href=\"#tle-lite-tle-struct-and-tle-raw-introduction\" title=\"Link to this heading\">#</a></h2><p>TLE-Lite, TLE-Struct, and TLE-Raw are the compiler languages, located in the middle layer of the AI ecosystem. The upper layer connects AI frameworks through graph compilers and operator libraries, while the lower layer connects to various hardware runtimes.</p><p>The following diagram demonstrates the location of TLE-Lite, TLE-Struct, and TLE-Raw in the AI ecosystem.</p>", "a[href=\"#tle-lite-tle-struct-and-tle-raw\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">TLE-Lite, TLE-Struct, and TLE-Raw<a class=\"headerlink\" href=\"#tle-lite-tle-struct-and-tle-raw\" title=\"Link to this heading\">#</a></h1><p>This section introduces TLE-Lite, TLE-Struct, and TLE-Raw and how they are handled in the compilation process.</p>", "a[href=\"../../user_guide/use-tle-struct.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Use TLE-Struct<a class=\"headerlink\" href=\"#use-tle-struct\" title=\"Link to this heading\">#</a></h1><p>This section introduces how to use TLE-Struct. TLE-Struct is available on trition_3.6.x branch.</p>", "a[href=\"#tle-in-the-compilation-process\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">TLE in the compilation process<a class=\"headerlink\" href=\"#tle-in-the-compilation-process\" title=\"Link to this heading\">#</a></h2>", "a[href=\"../../user_guide/use-tle-lite.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Use TLE-Lite<a class=\"headerlink\" href=\"#use-tle-lite\" title=\"Link to this heading\">#</a></h1><p>This section introduces how to use TLE-Lite. TLE-Lite is available on trition_3.6.x branch.</p>", "a[href=\"../../user_guide/use-tle-raw.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Use TLE-Raw<a class=\"headerlink\" href=\"#use-tle-raw\" title=\"Link to this heading\">#</a></h1><p>This section introduces how to use TLE-Raw. TLE-Raw is available on trition_3.6.x branch.</p><p>TLE Raw provides a low-level extension interface for Triton, allowing users to fill capability gaps and gain fine-grained control via third-party dialects and languages (for example, using CUDA for thread-level scheduling, synchronization, and memory access). Users can choose between portability and composable optimization (via MLIR dialect integration) and maximum fine-grained control (via CUDA  integration) based on the target hardware and toolchain maturity.</p>"}
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
