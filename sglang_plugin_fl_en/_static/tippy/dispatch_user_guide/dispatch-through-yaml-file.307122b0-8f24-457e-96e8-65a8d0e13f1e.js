selector_to_html = {"a[href=\"#skip-rotaryembedding-from-oot-dispatch-fall-through-to-sglang-native-path\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">1. Skip RotaryEmbedding from OOT dispatch (fall through to SGLang native path)<a class=\"headerlink\" href=\"#skip-rotaryembedding-from-oot-dispatch-fall-through-to-sglang-native-path\" title=\"Link to this heading\">#</a></h3><p>Expected dispatch log: only SiluAndMul and RMSNorm appear, no RotaryEmbedding.</p>", "a[href=\"#common-recipes\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Common Recipes<a class=\"headerlink\" href=\"#common-recipes\" title=\"Link to this heading\">#</a></h2><p>Each recipe shows a YAML config and expected dispatch result. Use <a class=\"reference internal\" href=\"debugg-and-diagonostics.html\"><span class=\"std std-doc\">Dispatch Log</span></a> to verify.</p>", "a[href=\"#use-pure-pytorch-reference-for-all-ops-useful-for-precision-debugging\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">3. Use pure PyTorch reference for all Ops (useful for precision debugging)<a class=\"headerlink\" href=\"#use-pure-pytorch-reference-for-all-ops-useful-for-precision-debugging\" title=\"Link to this heading\">#</a></h3><p>Expected dispatch log: reference implementations are selected when available.</p>", "a[href=\"debugg-and-diagonostics.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Debugging and diagnostics<a class=\"headerlink\" href=\"#debugging-and-diagnostics\" title=\"Link to this heading\">#</a></h1><p>This section introduces diagnostics on ops dispatch.</p>", "a[href=\"#force-rmsnorm-to-use-vendor-backend-others-use-flagos\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">2. Force RMSNorm to use vendor backend, others use flagos<a class=\"headerlink\" href=\"#force-rmsnorm-to-use-vendor-backend-others-use-flagos\" title=\"Link to this heading\">#</a></h3><p>Expected dispatch log: the first available, allowed backend is selected according to the active platform and vendor filters.</p>", "a[href=\"#dispatch-through-yaml-config-file\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Dispatch through YAML config file<a class=\"headerlink\" href=\"#dispatch-through-yaml-config-file\" title=\"Link to this heading\">#</a></h1><p>The plugin ships platform YAML defaults under <code class=\"docutils literal notranslate\"><span class=\"pre\">sglang_fl/dispatch/config/</span></code>. Available platform files include <code class=\"docutils literal notranslate\"><span class=\"pre\">ascend.yaml</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">gcu.yaml</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">hygon.yaml</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">iluvatar.yaml</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">kunlunxin.yaml</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">musa.yaml</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">nvidia.yaml</span></code>, and <code class=\"docutils literal notranslate\"><span class=\"pre\">tsingmicro.yaml</span></code>. These files provide default dispatch policy; they are not a vendor validation matrix.</p><p>Create an explicit YAML file when you want to override the platform defaults:</p>", "a[href=\"#config-fields\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Config Fields<a class=\"headerlink\" href=\"#config-fields\" title=\"Link to this heading\">#</a></h2>"}
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
