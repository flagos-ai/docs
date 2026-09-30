selector_to_html = {"a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u67b6\u6784<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u8bbe\u5907\u5143\u6570\u636e\u9075\u5faa FlagGems/FlagGems-vLLM \u7684\u7ea6\u5b9a\uff1b\u9876\u5c42\u5305\u5bfc\u51fa\u4e86\u7a20\u5bc6\u3001paged\u3001\u9012\u5f52\u3001KDA/GDN2 \u4e0e MiniMax API\uff1bSageAttention \u4e0e Parallel NSA \u4f7f\u7528\u5b50\u6a21\u5757\u5165\u53e3\u3002\u5382\u5546\u5f00\u53d1\u63a5\u53e3\u4f4d\u4e8e <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_attn.runtime.backend._&lt;vendor&gt;</span></code>\uff0c\u4e0d\u89c6\u4e3a\u7a33\u5b9a\u7684\u516c\u5f00 API\u3002</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5de5\u4f5c\u6d41\u7a0b<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flagattention\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagAttention \u6982\u89c8<a class=\"headerlink\" href=\"#flagattention\" title=\"Link to this heading\">#</a></h1><p>FlagAttention \u662f <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> \u7684\u7ec4\u6210\u90e8\u5206\u3002\u5b83\u662f\u4e00\u7ec4\u4f7f\u7528 <a class=\"reference external\" href=\"https://github.com/triton-lang/triton\">Triton \u8bed\u8a00</a> \u5b9e\u73b0\u7684\u5185\u5b58\u9ad8\u6548 attention \u7b97\u5b50\uff0c\u9762\u5411\u9700\u8981\u81ea\u5b9a\u4e49 attention score \u53d8\u6362\u3001paged/sparse KV cache \u5e03\u5c40\u6216\u9012\u5f52\u7ebf\u6027\u6ce8\u610f\u529b kernel \u7684\u8bad\u7ec3\u4e0e\u63a8\u7406\u4efb\u52a1\u3002</p><p>\u4e0e <a class=\"reference external\" href=\"https://arxiv.org/abs/2205.14135\">FlashAttention</a> \u7c7b\u4f3c\uff0c\u7a20\u5bc6\u7b97\u5b50\u901a\u8fc7\u5206\u5757\u548c\u91cd\u8ba1\u7b97\u907f\u514d\u5b9e\u4f53\u5316\u5b8c\u6574\u7684 attention matrix\u3002\u4ed3\u5e93\u8fd8\u5305\u542b\u89e3\u7801\u3001\u5757\u7a00\u758f\u3001\u91cf\u5316\u548c\u9012\u5f52\u7b97\u5b50\uff0c\u5b83\u4eec\u5e76\u4e0d\u5c40\u9650\u4e8e\u6807\u51c6 scaled dot-product attention \u63a5\u53e3\u3002</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>"}
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
