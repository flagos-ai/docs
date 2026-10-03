selector_to_html = {"a[href=\"#vendor-status\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Vendor status<a class=\"headerlink\" href=\"#vendor-status\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#distributed-collectives\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Distributed Collectives<a class=\"headerlink\" href=\"#distributed-collectives\" title=\"Link to this heading\">#</a></h1><p>Torch-FL provides distributed support for the <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> device through <code class=\"docutils literal notranslate\"><span class=\"pre\">ProcessGroupFlagOS</span></code>, a native <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.distributed.ProcessGroup</span></code> subclass. It is registered at import, so <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.distributed.init_process_group(\"flagos\")</span></code> works with no <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.distributed.*</span></code> monkeypatching.</p>", "a[href=\"#ddp\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">DDP<a class=\"headerlink\" href=\"#ddp\" title=\"Link to this heading\">#</a></h3><p>At import, Torch-FL patches <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.nn.parallel.DistributedDataParallel.__init__</span></code>. When the model lives on a <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> device, the patch:</p>", "a[href=\"#limitations\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Limitations<a class=\"headerlink\" href=\"#limitations\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#usage\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Usage<a class=\"headerlink\" href=\"#usage\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">torch_fl.distributed</span></code> exposes <code class=\"docutils literal notranslate\"><span class=\"pre\">init_process_group</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">DistributedDataParallel</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">move_buffers_to_device</span></code>. With the native backend registered you can equally call <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.distributed.init_process_group(\"flagos\")</span></code> directly, or let it be selected automatically from <code class=\"docutils literal notranslate\"><span class=\"pre\">device_id=torch.device(\"privateuseone:0\")</span></code>.</p>", "a[href=\"#backend-selection\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Backend selection<a class=\"headerlink\" href=\"#backend-selection\" title=\"Link to this heading\">#</a></h2><p>The inner communication backend is resolved at group-construction time, in priority order:</p>", "a[href=\"#how-it-works\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">How it works<a class=\"headerlink\" href=\"#how-it-works\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> tensors and the vendor\u2019s tensors share the same physical device memory, so a collective only needs a metadata conversion, not a copy:</p>"}
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
