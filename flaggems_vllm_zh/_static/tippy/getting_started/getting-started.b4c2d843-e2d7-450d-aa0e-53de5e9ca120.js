selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u6db5\u76d6\u4e86\u5b89\u88c5\u548c\u8fd0\u884c FlagGems-vLLM \u7684\u8981\u6c42\uff0c\u5e76\u6307\u5bfc\u60a8\u5b8c\u6210\u5b89\u88c5\u548c\u4f7f\u7528\u5176\u4f18\u5316\u7b97\u5b50\u7684\u8fc7\u7a0b\u3002</p>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5 FlagGems-vLLM<a class=\"headerlink\" href=\"#flaggems-vllm\" title=\"Link to this heading\">#</a></h1><p>\u5982\u9700\u5168\u65b0\u5b89\u88c5 FlagGems-vLLM\uff0c\u8bf7\u6309\u7167\u4ee5\u4e0b\u6b65\u9aa4\u64cd\u4f5c\u3002</p>"}
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
