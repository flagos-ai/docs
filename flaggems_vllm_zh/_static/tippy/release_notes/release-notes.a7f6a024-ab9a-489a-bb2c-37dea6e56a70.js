selector_to_html = {"a[href=\"../reference/operator_list.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u5b50\u5217\u8868<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u9875\u5217\u51fa\u4e86 FlagGems-vLLM \u5bfc\u51fa\u7684\u7b97\u5b50\uff0c\u6765\u6e90\u4e8e <code class=\"docutils literal notranslate\"><span class=\"pre\">src/flaggems_vllm/ops/__init__.py</span></code>\u3002</p><p>FlagGems-vLLM \u4f7f\u7528 Triton \u7f16\u7a0b\u8bed\u8a00\u63d0\u4f9b\u4e86\u5e38\u7528 vLLM \u7b97\u5b50\u7684\u4f18\u5316\u5b9e\u73b0\u3002\u76ee\u524d\u5171\u5bfc\u51fa\u4ee5\u4e0b 109 \u4e2a\u7b97\u5b50\uff1a</p>", "a[href=\"#v0-1-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.1.0<a class=\"headerlink\" href=\"#v0-1-0\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#v0-2-0\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">v0.2.0<a class=\"headerlink\" href=\"#v0-2-0\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u53d1\u5e03\u8bf4\u660e<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u5305\u542b FlagGems-vLLM \u7684\u53d1\u5e03\u4fe1\u606f\u3002</p>"}
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
