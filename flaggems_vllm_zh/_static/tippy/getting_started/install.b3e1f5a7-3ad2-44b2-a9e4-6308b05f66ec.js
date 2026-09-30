selector_to_html = {"a[href=\"#flaggems-vllm\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5 FlagGems-vLLM<a class=\"headerlink\" href=\"#flaggems-vllm\" title=\"Link to this heading\">#</a></h1><p>\u5982\u9700\u5168\u65b0\u5b89\u88c5 FlagGems-vLLM\uff0c\u8bf7\u6309\u7167\u4ee5\u4e0b\u6b65\u9aa4\u64cd\u4f5c\u3002</p>"}
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
