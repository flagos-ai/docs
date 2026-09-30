selector_to_html = {"a[href=\"#flaggems-vllm-plugin-fl\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4e0e FlagGems \u548c vllm-plugin-fl \u7684\u5173\u7cfb<a class=\"headerlink\" href=\"#flaggems-vllm-plugin-fl\" title=\"Link to this heading\">#</a></h2><p>\u8fd9\u4e09\u4e2a\u4ed3\u5e93\u914d\u5408\u4f7f\u7528\uff0c\u4f46\u5404\u81ea\u627f\u62c5\u4e0d\u540c\u7684\u804c\u8d23\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagGems-vLLM \u63d0\u4f9b\u4ee5\u4e0b\u5173\u952e\u7279\u6027\uff1a</p>"}
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
