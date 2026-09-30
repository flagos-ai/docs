selector_to_html = {"a[href=\"#layer-2-sglang-fused-kernels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Layer 2 \u2014 SGLang Fused Kernels<a class=\"headerlink\" href=\"#layer-2-sglang-fused-kernels\" title=\"Link to this heading\">#</a></h2><p>Intercepts SGLang\u2019s custom fused ops via HookRegistry AROUND hooks, routing through a standardized dispatch system (aligned with vllm-plugin-FL) to select the best available backend:</p>", "a[href=\"#layer-3-distributed-communication\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Layer 3 \u2014 Distributed Communication<a class=\"headerlink\" href=\"#layer-3-distributed-communication\" title=\"Link to this heading\">#</a></h2><p>Replaces NCCL-based collectives with CommunicatorFL (backed by FlagCX or torch.distributed), enabling multi-card inference on different hardware backends. Supports all_reduce, all_gather, reduce_scatter, send, and recv operations, with platform-aware backend selection and pipeline-parallel communication support.</p><p><a data-lightbox=\"image-set\" href=\"../_images/sglang-plugin-fl-arch.png\">\n<img alt=\"alt text\" src=\"../_images/sglang-plugin-fl-arch.png\"/></a>\n</p>", "a[href=\"#layer-1-aten-operators\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Layer 1 \u2014 ATen Operators<a class=\"headerlink\" href=\"#layer-1-aten-operators\" title=\"Link to this heading\">#</a></h2><p>Replaces PyTorch\u2019s low-level ops (matmul, softmax, embedding, etc.) with FlagGems Triton kernels via PyTorch\u2019s dispatch mechanism. When <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems.enable()</span></code> is called, the PyTorch dispatch table registers Triton kernels for ATen ops, providing hardware-accelerated implementations without code changes.</p>", "a[href=\"#features\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h1><p>SGLang\u2019s inference engine relies on NVIDIA-specific components: flashinfer for attention, sgl_kernel for fused CUDA kernels, and NCCL for distributed communication. Running on alternative hardware (Huawei Ascend, Cambricon MLU, Iluvatar, etc.) would otherwise require invasive source modifications.</p><p>This plugin provides a non-intrusive adaptation layer through three levels of replacement and extension:</p>"}
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
