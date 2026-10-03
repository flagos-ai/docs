selector_to_html = {"a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5bfc\u5165\u987a\u5e8f<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u5728\u6240\u6709 CUDA-ABI \u5e73\u53f0\uff08CUDA\u3001MetaX\u3001PPU\u3001DCU\uff09\u4e0a\uff0c\u65b0\u8fdb\u7a0b\u91cc <code class=\"docutils literal notranslate\"><span class=\"pre\">import</span> <span class=\"pre\">torch_fl</span></code> \u5fc5\u987b<strong>\u5148\u4e8e</strong> <code class=\"docutils literal notranslate\"><span class=\"pre\">import</span> <span class=\"pre\">torch</span></code>\u3002\u5bfc\u5165\u65f6 Torch-FL \u4f1a\u9884\u52a0\u8f7d\u5382\u5546 <code class=\"docutils literal notranslate\"><span class=\"pre\">libtorch</span></code> \u4e0e CUDA \u8d44\u6e90\uff1b\u82e5\u5148\u5bfc\u5165 <code class=\"docutils literal notranslate\"><span class=\"pre\">torch</span></code>\uff0cPyTorch \u4f1a\u7f13\u5b58\u5176 stub CUDA hooks\uff0c\u9884\u52a0\u8f7d\u5c31\u5931\u53bb\u4f5c\u7528\u3002</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5e38\u89c1\u6545\u969c\u6392\u67e5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u6309\u75c7\u72b6\u7ed9\u51fa\u8de8\u5e73\u53f0\u53cd\u590d\u51fa\u73b0\u7684\u95ee\u9898\u7684\u89e3\u51b3\u529e\u6cd5\u3002\u9a71\u52a8\u6b63\u5e38\u4f46\u8bbe\u5907\u6570\u4e3a 0\u3001\u5bfc\u5165\u65f6\u7b26\u53f7\u9519\u8bef\u3001\u6216\u5355\u4e2a\u7b97\u5b50\u5d29\u6e83\uff0c\u901a\u5e38\u90fd\u6307\u5411\u5bfc\u5165\u987a\u5e8f\u3001\u7f3a\u5931\u7684\u5382\u5546\u5e93\u3001\u6216\u7f16\u8bd1\u5668\u4e0d\u5339\u914d\u8fd9\u4e09\u7c7b\u539f\u56e0\uff0c\u4e0b\u5217\u5404\u8282\u9010\u4e00\u8986\u76d6\u3002</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7f3a\u5931\u7684\u5382\u5546\u5e93<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5206\u5e03\u5f0f<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#torch-compile\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6027\u80fd\u5206\u6790\u4e0e torch.compile<a class=\"headerlink\" href=\"#torch-compile\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#triton\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7f16\u8bd1\u5668\u4e0e Triton<a class=\"headerlink\" href=\"#triton\" title=\"Link to this heading\">#</a></h2><p>FlagGems \u8def\u7531\u5728\u5206\u53d1\u65f6\u6309\u540d\u79f0\u89e3\u6790\u5185\u6838\uff0c\u56e0\u6b64\u7f3a\u5c11\u8be5\u5305\u65f6 FlagGems \u652f\u6491\u7684\u7b97\u5b50\u4f1a<strong>\u62a5\u9519</strong>\u800c\u4e0d\u4f1a\u9759\u9ed8\u56de\u9000\u3002\u8981\u786e\u8ba4\u67d0\u6b21\u8c03\u7528\u5b9e\u9645\u7531\u8c01\u670d\u52a1\uff0c\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_LOG=dispatch</span></code> \u8fd0\u884c\u3002</p>", "a[href=\"#torch-flagos-device-count-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\"><code class=\"docutils literal notranslate\"><span class=\"pre\">torch.flagos.device_count()</span></code> \u8fd4\u56de 0<a class=\"headerlink\" href=\"#torch-flagos-device-count-0\" title=\"Link to this heading\">#</a></h2><p>\u6309\u987a\u5e8f\u6392\u67e5\uff1a</p>"}
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
