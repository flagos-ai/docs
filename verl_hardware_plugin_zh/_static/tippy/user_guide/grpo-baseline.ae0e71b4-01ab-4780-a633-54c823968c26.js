selector_to_html = {"a[href=\"#flagos\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FlagOS \u5f15\u64ce\u73af\u5883\u53d8\u91cf<a class=\"headerlink\" href=\"#flagos\" title=\"Link to this heading\">#</a></h2><p>\u4f7f\u7528 FlagOS \u5f15\u64ce\uff08vendor <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code>\uff09\u65f6\uff0c\u4ee5\u4e0b\u53d8\u91cf\u63a7\u5236\u6309\u9636\u6bb5\u52a0\u901f\uff1a</p>", "a[href=\"#grpo-gsm8k\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">GRPO \u9a8c\u6536\u57fa\u7ebf\uff08GSM8K\uff09<a class=\"headerlink\" href=\"#grpo-gsm8k\" title=\"Link to this heading\">#</a></h1><p>\u65b0\u786c\u4ef6\u5e73\u53f0\u9002\u914d\u7684\u6807\u51c6\u9a8c\u6536\u6d4b\u8bd5\u662f\u4f7f\u7528 Qwen3-0.6B \u5728 GSM8K \u4e0a\u8fdb\u884c GRPO \u8bad\u7ec3\u3002\u53c2\u8003\u5b9e\u73b0\u4e3a\u4ed3\u5e93\u4e2d\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">scripts/baseline_grpo_gsm8k.sh</span></code>\u3002</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u57fa\u7ebf\u9a8c\u8bc1\u5185\u5bb9<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8fd0\u884c\u57fa\u7ebf<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u811a\u672c\u4f7f\u7528\u4ee5\u4e0b\u9ed8\u8ba4\u8d85\u53c2\u6570\uff08\u5747\u53ef\u901a\u8fc7\u73af\u5883\u53d8\u91cf\u8986\u76d6\uff09\uff1a</p>", "a[href=\"../getting_started/install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>verl-hardware-plugin \u4ee5 Python \u5305\u5f62\u5f0f\u5b89\u88c5\uff0cverl \u901a\u8fc7 <code class=\"docutils literal notranslate\"><span class=\"pre\">verl.plugins</span></code> entry-points \u7ec4\u81ea\u52a8\u53d1\u73b0\u3002</p>"}
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
