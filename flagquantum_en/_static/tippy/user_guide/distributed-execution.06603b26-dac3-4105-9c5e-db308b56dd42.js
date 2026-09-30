selector_to_html = {"a[href=\"#sharded-statevector\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Sharded statevector<a class=\"headerlink\" href=\"#sharded-statevector\" title=\"Link to this heading\">#</a></h2><p>Under an initialized multi-rank process group, the same statevector module and\nresult surface automatically use the native sharded statevector runtime.\nDistribution topology comes from the execution environment, not from a second\nmode vocabulary.</p>", "a[href=\"#rank-owned-mps\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Rank-owned MPS<a class=\"headerlink\" href=\"#rank-owned-mps\" title=\"Link to this heading\">#</a></h2><p>Distributed MPS training keeps forward, backward and optimizer state\nrank-owned. It is the path for large low-entanglement systems that do not fit\non one device, and it supports checkpoint and resume with matched restart\nsemantics. An experimental <code class=\"docutils literal notranslate\"><span class=\"pre\">adam_lbfgs</span></code> schedule with owner-local\nlimited-memory histories is available for bonded systems.</p>", "a[href=\"hardware-and-remote.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Hardware and remote targets<a class=\"headerlink\" href=\"#hardware-and-remote-targets\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum runs the same program on locally controlled resources and on\nexternal execution destinations. The two are named differently on purpose:\n<code class=\"docutils literal notranslate\"><span class=\"pre\">ExecutionOptions</span></code> describes the current process\u2019s devices, while <code class=\"docutils literal notranslate\"><span class=\"pre\">target</span></code>\nnames an external system.</p>", "a[href=\"#flagos-accelerators\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FlagOS accelerators<a class=\"headerlink\" href=\"#flagos-accelerators\" title=\"Link to this heading\">#</a></h2><p>On a FlagOS-supported accelerator, the same program runs on the logical\n<code class=\"docutils literal notranslate\"><span class=\"pre\">flagos:0</span></code> device through Torch-FL, so distributed transports and collectives\nfollow the FlagOS route. See\n<a class=\"reference internal\" href=\"hardware-and-remote.html\"><span class=\"std std-doc\">Hardware and remote targets</span></a>.</p>", "a[href=\"#distributed-execution\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Distributed execution<a class=\"headerlink\" href=\"#distributed-execution\" title=\"Link to this heading\">#</a></h1><p>Distributed execution extends the same programming model to genuinely sharded\nworkloads. One logical workload is split across ranks; replicated execution is\nnever presented as capacity scaling.</p>", "a[href=\"#what-distributed-evidence-means-here\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">What distributed evidence means here<a class=\"headerlink\" href=\"#what-distributed-evidence-means-here\" title=\"Link to this heading\">#</a></h2>"}
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
