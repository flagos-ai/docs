selector_to_html = {"a[href=\"#debugging-and-diagnostics\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Debugging and diagnostics<a class=\"headerlink\" href=\"#debugging-and-diagnostics\" title=\"Link to this heading\">#</a></h1><p>This section introduces diagnostics on ops dispatch.</p>", "a[href=\"#troubleshoot-numerical-precision-issues-through-precision-bisection\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Troubleshoot numerical precision issues through Precision Bisection<a class=\"headerlink\" href=\"#troubleshoot-numerical-precision-issues-through-precision-bisection\" title=\"Link to this heading\">#</a></h2><p>When numerical differences appear, isolate the responsible layer. If output diverges at Step N but not Step N-1, the responsible layer/op is isolated.</p>", "a[href=\"#policy-and-backend-resolution\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Policy and backend resolution<a class=\"headerlink\" href=\"#policy-and-backend-resolution\" title=\"Link to this heading\">#</a></h2><p>Dispatch is policy-based rather than a fixed <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span> <span class=\"pre\">&gt;</span> <span class=\"pre\">vendor</span> <span class=\"pre\">&gt;</span> <span class=\"pre\">reference</span></code> chain. When an operation does not use the expected implementation, check the effective configuration and backend availability:</p>", "a[href=\"#distributed-and-flagcx-diagnostics\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Distributed and FlagCX diagnostics<a class=\"headerlink\" href=\"#distributed-and-flagcx-diagnostics\" title=\"Link to this heading\">#</a></h2><p>For distributed communication failures, verify the selected <code class=\"docutils literal notranslate\"><span class=\"pre\">SGLANG_FL_DIST_BACKEND</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGCX_PATH</span></code> when FlagCX is expected, device visibility, network configuration, and tensor/pipeline parallel settings. Platform-specific framework, image, and network-device prerequisites are documented on the <a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">centralized vendor/framework/image-selection page</a>.</p>", "a[href=\"#common-issues\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Common Issues<a class=\"headerlink\" href=\"#common-issues\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#dispatch-log\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Dispatch log<a class=\"headerlink\" href=\"#dispatch-log\" title=\"Link to this heading\">#</a></h2><p>See which backend each fused op resolved to (written at server startup):</p>", "a[href=\"#aten-replacement-log\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen replacement log<a class=\"headerlink\" href=\"#aten-replacement-log\" title=\"Link to this heading\">#</a></h2><p>Record which PyTorch ATen ops were replaced by FlagGems:</p>"}
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
