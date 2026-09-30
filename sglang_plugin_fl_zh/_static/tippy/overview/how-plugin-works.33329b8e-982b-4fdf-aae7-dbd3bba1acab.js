selector_to_html = {"a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8c03\u5ea6\u94a9\u5b50<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u6838\u5fc3\u673a\u5236\u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">MultiPlatformOp.dispatch_forward()</span></code> \u4e0a\u7684 AROUND \u94a9\u5b50\uff0c\u7ed3\u5408\u6807\u51c6\u5316\u8c03\u5ea6\u7cfb\u7edf\uff1a</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7a7a\u6a21\u5f0f\u8fb9\u754c<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u7a7a\u6a21\u5f0f\u662f\u4e00\u79cd\u5b89\u88c5\u4e0e\u8fd0\u884c\u65f6\u7ec4\u88c5\u673a\u5236\uff0c\u9002\u7528\u4e8e\u4ee5 CUDA \u4e3a\u5bfc\u5411\u7684\u4f9d\u8d56\u96c6\u5e76\u975e\u90e8\u7f72\u73af\u5883\u7684\u76ee\u6807\u5e73\u53f0\u3002\u5b83\u4e0d\u662f\u65e0\u8bbe\u5907\u6a21\u5f0f\u3002\u76ee\u6807\u5e73\u53f0\u4ecd\u9700\u63d0\u4f9b\u5382\u5546 torch\u3001\u9a71\u52a8\u3001\u56fa\u4ef6\u3001\u8bbe\u5907\u8fd0\u884c\u65f6\u3001\u901a\u4fe1\u5e93\u3001\u5e73\u53f0\u6ce8\u610f\u529b\u540e\u7aef\u4ee5\u53ca\u63d2\u4ef6\u672a\u8986\u76d6\u7684\u7b97\u5b50\u3002</p><p>\u6709\u5173\u7279\u5b9a\u5e73\u53f0\u7684\u8fd0\u884c\u65f6\u548c\u955c\u50cf\u9009\u62e9\uff0c\u8bf7\u4f7f\u7528\u96c6\u4e2d\u5f0f\u5382\u5546/\u6846\u67b6/\u955c\u50cf\u9009\u62e9\u9875\u9762\uff1a<a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">\u96c6\u4e2d\u5f0f\u5382\u5546/\u6846\u67b6/\u955c\u50cf\u9009\u62e9\u9875\u9762</a>\u3002</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u63d2\u4ef6\u5de5\u4f5c\u539f\u7406<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u52a0\u8f7d\u63d2\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>SGLang \u5728\u542f\u52a8\u65f6\u901a\u8fc7 setuptools entry_points \u81ea\u52a8\u53d1\u73b0\u5e76\u52a0\u8f7d\u63d2\u4ef6\u3002</p><p>\u63d2\u4ef6\u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">pyproject.toml</span></code> \u4e2d\u6ce8\u518c\u4e86\u4e24\u4e2a entry_points\uff1a</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u52a0\u8f7d\u63d2\u4ef6<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>SGLang \u5728\u542f\u52a8\u65f6\u901a\u8fc7 setuptools entry_points \u81ea\u52a8\u53d1\u73b0\u5e76\u52a0\u8f7d\u63d2\u4ef6\u3002</p><p>\u63d2\u4ef6\u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">pyproject.toml</span></code> \u4e2d\u6ce8\u518c\u4e86\u4e24\u4e2a entry_points\uff1a</p>", "a[href=\"#vllm-plugin-fl\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8c03\u5ea6\u67b6\u6784\uff08\u4e0e vllm-plugin-FL \u5171\u4eab\uff09<a class=\"headerlink\" href=\"#vllm-plugin-fl\" title=\"Link to this heading\">#</a></h2><p>\u82af\u7247\u5382\u5546\u4e3a\u4e24\u4e2a\u6846\u67b6\u5b9e\u73b0<strong>\u76f8\u540c\u7684\u540e\u7aef\u63a5\u53e3</strong>\u3002\u552f\u4e00\u7684\u6846\u67b6\u7279\u5b9a\u4ee3\u7801\u662f\u6865\u63a5\u5c42\uff0c\u7531\u63d2\u4ef6\u7ef4\u62a4\u3002</p>", "a[href=\"#aten\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen \u66ff\u6362<a class=\"headerlink\" href=\"#aten\" title=\"Link to this heading\">#</a></h2>"}
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
