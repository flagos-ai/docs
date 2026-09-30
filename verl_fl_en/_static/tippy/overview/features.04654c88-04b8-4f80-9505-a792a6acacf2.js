selector_to_html = {"a[href=\"#heterogeneous-distributed-training\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Heterogeneous Distributed Training<a class=\"headerlink\" href=\"#heterogeneous-distributed-training\" title=\"Link to this heading\">#</a></h2><p>Cross-vendor collective communication via FlagCX enables heterogeneous training across NVIDIA GPU and Moore Threads MUSA nodes. One node runs actor/critic (NVIDIA, FSDP), the other runs rollout (Moore Threads MUSA, vLLM), with weight synchronization and device isolation managed through Ray runtime context.</p>", "a[href=\"#multi-vendor-hardware-support\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Multi-Vendor Hardware Support<a class=\"headerlink\" href=\"#multi-vendor-hardware-support\" title=\"Link to this heading\">#</a></h2><p>verl-FL supports NVIDIA, Huawei Ascend, MetaX, Moore Threads, and CPU platforms. See <a class=\"reference internal\" href=\"../getting_started/requirements.html#supported-hardwares\"><span class=\"std std-ref\">Supported Hardwares</span></a> for details.</p>", "a[href=\"#features\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h1><h2>Unified Platform Abstraction Layer<a class=\"headerlink\" href=\"#unified-platform-abstraction-layer\" title=\"Link to this heading\">#</a></h2><p>Strategy Pattern design under <code class=\"docutils literal notranslate\"><span class=\"pre\">verl/plugin/platform/</span></code> decouples business logic from hardware-specific calls, enabling support for CUDA, Ascend NPU, MetaX (MACA), Moore Threads (MUSA), CPU, and future accelerators.</p>", "a[href=\"#unified-platform-abstraction-layer\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Unified Platform Abstraction Layer<a class=\"headerlink\" href=\"#unified-platform-abstraction-layer\" title=\"Link to this heading\">#</a></h2><p>Strategy Pattern design under <code class=\"docutils literal notranslate\"><span class=\"pre\">verl/plugin/platform/</span></code> decouples business logic from hardware-specific calls, enabling support for CUDA, Ascend NPU, MetaX (MACA), Moore Threads (MUSA), CPU, and future accelerators.</p>", "a[href=\"#flagos-training-engine-integration\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FlagOS Training Engine Integration<a class=\"headerlink\" href=\"#flagos-training-engine-integration\" title=\"Link to this heading\">#</a></h2><p>Pluggable backends via FlagOS ecosystem components for multi-chip GRPO training:</p>", "a[href=\"../getting_started/requirements.html#supported-hardwares\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Supported Hardwares<a class=\"headerlink\" href=\"#supported-hardwares\" title=\"Link to this heading\">#</a></h2>"}
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
