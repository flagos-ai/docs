selector_to_html = {"a[href=\"#vllm-deepseek\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. \u793a\u4f8b\uff1a\u4e0e vLLM \u548c DeepSeek \u96c6\u6210<a class=\"headerlink\" href=\"#vllm-deepseek\" title=\"Link to this heading\">#</a></h2><p>\u8981\u5728\u4e00\u4e2a\u5206\u5e03\u5f0f\u7684 vLLM + DeepSeek \u90e8\u7f72\u73af\u5883\u4e2d\u542f\u7528 <em>FlagGems</em>\uff0c\u9700\u6267\u884c\u4ee5\u4e0b\u6b65\u9aa4\uff1a</p>", "a[href=\"#gpu\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u591a GPU \u4e0e\u5206\u5e03\u5f0f\u73af\u5883<a class=\"headerlink\" href=\"#gpu\" title=\"Link to this heading\">#</a></h1><p>\u5728\u73b0\u5b9e\u4e16\u754c\u7684 LLM \u90e8\u7f72\u573a\u666f\u4e2d\uff0c\u4eba\u4eec\u901a\u5e38\u9700\u8981\u591a GPU \u6216\u8005\u591a\u8282\u70b9\u7684\u73af\u5883\u6765\u652f\u6301\u8f83\u5927\u7684\u6a21\u578b\uff0c\n\u4e0e/\u6216\u5b8c\u6210\u9ad8\u541e\u5410\u91cf\u7684\u63a8\u7406\u4efb\u52a1\u3002\n<em>FlagGems</em> \u901a\u8fc7\u5141\u8bb8\u8de8\u591a\u4e2a GPU \u5b8c\u6210\u7b97\u5b50\u6267\u884c\u52a0\u901f\u6765\u652f\u6301\u8fd9\u7c7b\u4f7f\u7528\u573a\u666f\u3002</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. \u5355\u8282\u70b9\u4e0e\u591a\u8282\u70b9\u7528\u6cd5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u5bf9\u4e8e<strong>\u5355\u8282\u70b9\u90e8\u7f72</strong>\u800c\u8a00\uff0c\u96c6\u6210\u5de5\u4f5c\u662f\u76f8\u5bf9\u7b80\u5355\u76f4\u63a5\u7684\u3002\n\u4f60\u53ef\u4ee5\u5728\u4f60\u7684\u4ee3\u7801\u5f00\u59cb\u90e8\u5206 <code class=\"docutils literal notranslate\"><span class=\"pre\">import</span> <span class=\"pre\">flag_gems</span></code> \u4e4b\u540e\u8c03\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems.enable()</span></code>\u3002\n\u65e0\u9700\u5176\u4ed6\u7684\u53d8\u66f4\uff0c\u4f60\u5c31\u53ef\u4ee5\u83b7\u5f97\u7b97\u5b50\u52a0\u901f\u7684\u6548\u679c\u3002</p><p>\u7136\u800c\uff0c\u5728<strong>\u591a\u8282\u70b9\u90e8\u7f72</strong>\u73af\u5883\u4e2d\uff0c\u8fd9\u79cd\u65b9\u6cd5\u662f\u4e0d\u591f\u7684\u3002\n\u5206\u5e03\u5f0f\u7684\u63a8\u7406\u6846\u67b6\uff08\u4f8b\u5982 vLLM\uff09\u9700\u8981\u8de8\u591a\u4e2a\u8282\u70b9\u6765\u542f\u52a8\u591a\u4e2a\u5de5\u4f5c\u8fdb\u7a0b\uff0c\n\u6bcf\u4e2a\u8fdb\u7a0b\u90fd\u9700\u8981\u72ec\u7acb\u521d\u59cb\u5316 <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems</span></code>\u3002\n\u5982\u679c\u5bf9 <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems</span></code> \u7684\u542f\u7528\u6216\u6fc0\u6d3b\u64cd\u4f5c\u4ec5\u53d1\u751f\u5728\u7b2c\u4e00\u4e2a\u8282\u70b9\u7684\u542f\u52a8\u4ee3\u7801\u4e0a\uff0c\n\u5176\u4ed6\u8282\u70b9\u4e0a\u7684\u5de5\u4f5c\u8fdb\u7a0b\u4f1a\u56de\u9000\u4e3a\u9ed8\u8ba4\u7684\u7b97\u5b50\u5b9e\u73b0\uff0c\u4e5f\u5c31\u662f\u6ca1\u6709\u88ab\u52a0\u901f\u8fc7\u7684\u7248\u672c\u3002</p>"}
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
