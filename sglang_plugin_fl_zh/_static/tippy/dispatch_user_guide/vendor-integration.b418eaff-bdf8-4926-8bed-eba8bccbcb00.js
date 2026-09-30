selector_to_html = {"a[href=\"#impl\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">3. \u7b97\u5b50\u5b9e\u73b0\uff08impl/\uff09<a class=\"headerlink\" href=\"#impl\" title=\"Link to this heading\">#</a></h2><p>\u6bcf\u4e2a\u7b97\u5b50\u51fd\u6570\u63a5\u6536\u6807\u51c6\u5316\u53c2\u6570\uff08\u4e0e vllm-plugin-FL \u76f8\u540c\uff09\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5382\u5546\u96c6\u6210<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u82af\u7247\u5382\u5546\u901a\u8fc7\u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">dispatch/backends/vendor/</span></code> \u4e0b\u6dfb\u52a0\u540e\u7aef\u76ee\u5f55\u8fdb\u884c\u96c6\u6210\uff1a</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5382\u5546\u540e\u7aef\u81ea\u52a8\u53d1\u73b0<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u63d2\u4ef6\u5728\u542f\u52a8\u65f6\u626b\u63cf <code class=\"docutils literal notranslate\"><span class=\"pre\">dispatch/backends/vendor/*/register_ops.py</span></code>\u3002\u5982\u679c <code class=\"docutils literal notranslate\"><span class=\"pre\">is_available()</span></code> \u8fd4\u56de True\uff0c\u8be5\u5382\u5546\u7684\u7b97\u5b50\u5373\u88ab\u6ce8\u518c\u3002\u65e0\u9700\u4fee\u6539\u5176\u4ed6\u6587\u4ef6\u3002</p><p>\u5982\u6709\u9700\u8981\uff0c\u53ef\u9009\u96c6\u6210\u94a9\u5b50\u53ef\u4ee5\u6dfb\u52a0\u5e73\u53f0\u7279\u5b9a\u884c\u4e3a\uff1a</p>", "a[href=\"#register-ops-py\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. \u6ce8\u518c\uff08register_ops.py\uff09<a class=\"headerlink\" href=\"#register-ops-py\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#my-chip-py\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. \u540e\u7aef\u7c7b\uff08my_chip.py\uff09<a class=\"headerlink\" href=\"#my-chip-py\" title=\"Link to this heading\">#</a></h2>"}
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
