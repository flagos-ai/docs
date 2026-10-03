selector_to_html = {"a[href=\"#missing-vendor-libraries\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Missing vendor libraries<a class=\"headerlink\" href=\"#missing-vendor-libraries\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#profiler-and-torch-compile\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Profiler and torch.compile<a class=\"headerlink\" href=\"#profiler-and-torch-compile\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#troubleshooting\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Troubleshooting<a class=\"headerlink\" href=\"#troubleshooting\" title=\"Link to this heading\">#</a></h1><p>Symptom-first fixes for the problems that recur across platforms. A device count of 0 with a working driver, a symbol error at import, or a crash in one operator usually traces back to import order, a missing vendor library, or the wrong compiler \u2014 the sections below cover each in turn.</p>", "a[href=\"#distributed\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Distributed<a class=\"headerlink\" href=\"#distributed\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#import-order\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Import order<a class=\"headerlink\" href=\"#import-order\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">import</span> <span class=\"pre\">torch_fl</span></code> must come <strong>before</strong> <code class=\"docutils literal notranslate\"><span class=\"pre\">import</span> <span class=\"pre\">torch</span></code> in a fresh process on every CUDA-ABI platform (CUDA, MetaX, PPU, DCU). At import, Torch-FL preloads the vendor <code class=\"docutils literal notranslate\"><span class=\"pre\">libtorch</span></code> and the CUDA assets; if <code class=\"docutils literal notranslate\"><span class=\"pre\">torch</span></code> is imported first, PyTorch caches its stub CUDA hooks and the preload has no effect.</p>", "a[href=\"#compiler-and-triton\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Compiler and Triton<a class=\"headerlink\" href=\"#compiler-and-triton\" title=\"Link to this heading\">#</a></h2><p>FlagGems routes resolve kernels by name at dispatch time, so a FlagGems-backed operator raises rather than silently falling back when the package is missing. To confirm what actually served a call, run with <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_LOG=dispatch</span></code>.</p>", "a[href=\"#torch-flagos-device-count-returns-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\"><code class=\"docutils literal notranslate\"><span class=\"pre\">torch.flagos.device_count()</span></code> returns 0<a class=\"headerlink\" href=\"#torch-flagos-device-count-returns-0\" title=\"Link to this heading\">#</a></h2><p>Work through these in order:</p>"}
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
