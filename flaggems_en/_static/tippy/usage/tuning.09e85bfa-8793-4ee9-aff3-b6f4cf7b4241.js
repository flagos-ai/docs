selector_to_html = {"a[href=\"#how-libtuner-works\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">How LibTuner works?<a class=\"headerlink\" href=\"#how-libtuner-works\" title=\"Link to this heading\">#</a></h3><p>Triton typically performs auto-tuning during the first few executions of a new input shape,\nwhich may cause latency spikes \u2014 especially in latency-sensitive inference systems.\n<code class=\"docutils literal notranslate\"><span class=\"pre\">LibTuner</span></code> addresses this with:</p>", "a[href=\"#pre-tuning-model-shapes-for-inference-scenarios\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Pre-tuning model shapes for inference scenarios<a class=\"headerlink\" href=\"#pre-tuning-model-shapes-for-inference-scenarios\" title=\"Link to this heading\">#</a></h2><p><em>FlagGems</em> provides <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagGems/blob/v4.2.0/src/flag_gems/utils/libentry.py#L206\"><code class=\"docutils literal notranslate\"><span class=\"pre\">LibTuner</span></code></a>,\na lightweight enhancement to the auto-tuning system in Triton.\n<code class=\"docutils literal notranslate\"><span class=\"pre\">LibTuner</span></code> introduces a <strong>persistent, per-device tuning cache</strong> that\nhelps mitigate some runtime overhead in the default auto-tuning process in Triton.</p>", "a[href=\"#how-to-use-pre-tuning\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">How to Use Pre-tuning<a class=\"headerlink\" href=\"#how-to-use-pre-tuning\" title=\"Link to this heading\">#</a></h3><p>To proactively warm up your system in order to populate the tuning cache:</p>", "a[href=\"#achieving-optimal-performance-with-flaggems\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Achieving Optimal Performance with FlagGems<a class=\"headerlink\" href=\"#achieving-optimal-performance-with-flaggems\" title=\"Link to this heading\">#</a></h1><p>While <em>FlagGems</em> kernels are designed for high performance usage scenarios,\nachieving optimal end-to-end speed in full model deployments still demands\nfor careful integration and consideration of the system\u2019s runtime behavior.\nIn particular, two common performance bottlenecks are:</p>"}
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
