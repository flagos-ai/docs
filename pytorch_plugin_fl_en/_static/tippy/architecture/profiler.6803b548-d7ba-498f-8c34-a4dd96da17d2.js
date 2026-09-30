selector_to_html = {"a[href=\"#debugging\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Debugging<a class=\"headerlink\" href=\"#debugging\" title=\"Link to this heading\">#</a></h2><p>Two warnings are deliberately not gated by <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_TRACE</span></code> \u2014 an empty linked-activity callback and an activity-record layout mismatch \u2014 because both silently zero device time.</p>", "a[href=\"#correlation-ids\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Correlation ids<a class=\"headerlink\" href=\"#correlation-ids\" title=\"Link to this heading\">#</a></h2><p>A trace carries two independent numbering schemes, both called \u201ccorrelation\u201d. They look alike and mean different things:</p>", "a[href=\"#three-layer-architecture\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Three-layer architecture<a class=\"headerlink\" href=\"#three-layer-architecture\" title=\"Link to this heading\">#</a></h2><p>Adding a vendor means writing one file: a tracer that satisfies the vendor-agnostic interface.</p>", "a[href=\"#profiler-integration\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Profiler Integration<a class=\"headerlink\" href=\"#profiler-integration\" title=\"Link to this heading\">#</a></h1><p><code class=\"docutils literal notranslate\"><span class=\"pre\">torch.profiler</span></code> supports the <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> device through a device tracer compiled into the wheel. A trace from <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.profiler.profile(activities=[CPU,</span> <span class=\"pre\">PrivateUse1])</span></code> is structurally equivalent to the trace of the same workload on <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.cuda</span></code>:</p>", "a[href=\"#parity-test-and-baseline\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Parity test and baseline<a class=\"headerlink\" href=\"#parity-test-and-baseline\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">tests/integration/test_profiler_parity.py</span></code> compares a <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> trace against a baseline captured on native <code class=\"docutils literal notranslate\"><span class=\"pre\">torch+cuda</span></code>. All seven assertions check structure, never counts or durations:</p>", "a[href=\"#known-gaps\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Known gaps<a class=\"headerlink\" href=\"#known-gaps\" title=\"Link to this heading\">#</a></h2>"}
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
