selector_to_html = {"a[href=\"#storage-and-compute\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Storage and compute<a class=\"headerlink\" href=\"#storage-and-compute\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#amp-targets\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">AMP targets<a class=\"headerlink\" href=\"#amp-targets\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">torch.autocast(\"flagos\")</span></code> supports <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.float16</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.bfloat16</span></code> as lower-precision targets, using the standard PyTorch autocast policy groups: matmul and convolution prefer the selected lower-precision dtype, numerically sensitive operations (logarithm, normalization) use float32, and mixed inputs follow the promote policy. <strong>Float32 and float64 are not valid autocast targets.</strong></p>", "a[href=\"#dtype-support\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Dtype support<a class=\"headerlink\" href=\"#dtype-support\" title=\"Link to this heading\">#</a></h1><p>Torch-FL preserves the requested dtype for tensor <strong>storage</strong> and follows PyTorch\u2019s promotion rules for tensor-tensor operations. Compute coverage is bounded by the vendor library each backend uses, and AMP target support is a separate question from eager dtype support: a dtype the storage layer accepts is not automatically accepted by every operator.</p>", "a[href=\"#what-a-passing-test-means\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">What a passing test means<a class=\"headerlink\" href=\"#what-a-passing-test-means\" title=\"Link to this heading\">#</a></h2><p>The integration suites compare results against CPU references where a native kernel is unavailable, so a passing test means the operation follows the documented PyTorch contract \u2014 not necessarily that it used a native vendor kernel.</p>", "a[href=\"#boundaries\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Boundaries<a class=\"headerlink\" href=\"#boundaries\" title=\"Link to this heading\">#</a></h2><p>Where a vendor operator does not accept a dtype, the operator is served by the correctness-first CPU fallback, which computes on the host and copies the correctly typed result back to the device. The fallback is correctness-oriented and may be slower than a native kernel \u2014 it is a documented coverage boundary, not a failure.</p>"}
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
