selector_to_html = {"a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7ebf\u6027\u4e0e\u77e9\u9635<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#dsa\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">DSA \u2014 \u6df1\u5ea6\u7a00\u758f\u6ce8\u610f\u529b<a class=\"headerlink\" href=\"#dsa\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#moe\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6df7\u5408\u4e13\u5bb6\uff08MoE\uff09<a class=\"headerlink\" href=\"#moe\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u5b50\u5217\u8868<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u9875\u5217\u51fa\u4e86 FlagGems-vLLM \u5bfc\u51fa\u7684\u7b97\u5b50\uff0c\u6765\u6e90\u4e8e <code class=\"docutils literal notranslate\"><span class=\"pre\">src/flaggems_vllm/ops/__init__.py</span></code>\u3002</p><p>FlagGems-vLLM \u4f7f\u7528 Triton \u7f16\u7a0b\u8bed\u8a00\u63d0\u4f9b\u4e86\u5e38\u7528 vLLM \u7b97\u5b50\u7684\u4f18\u5316\u5b9e\u73b0\u3002\u76ee\u524d\u5171\u5bfc\u51fa\u4ee5\u4e0b 109 \u4e2a\u7b97\u5b50\uff1a</p>", "a[href=\"#id6\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5f52\u7ea6\u4e0e\u5de5\u5177<a class=\"headerlink\" href=\"#id6\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#deepseek-v4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">DeepSeek V4 \u6ce8\u610f\u529b<a class=\"headerlink\" href=\"#deepseek-v4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#qwen4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Qwen4<a class=\"headerlink\" href=\"#qwen4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5f52\u4e00\u5316<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id7\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u91cf\u5316<a class=\"headerlink\" href=\"#id7\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6fc0\u6d3b\u4e0e\u95e8\u63a7<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#fla-flash\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FLA \u2014 Flash \u7ebf\u6027\u6ce8\u610f\u529b<a class=\"headerlink\" href=\"#fla-flash\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#rwkv\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">RWKV<a class=\"headerlink\" href=\"#rwkv\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#mhc\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">MHC \u2014 \u6d41\u5f62\u7ea6\u675f\u8d85\u8fde\u63a5<a class=\"headerlink\" href=\"#mhc\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6ce8\u610f\u529b<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>"}
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
