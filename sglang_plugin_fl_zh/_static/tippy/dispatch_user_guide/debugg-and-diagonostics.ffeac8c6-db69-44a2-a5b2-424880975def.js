selector_to_html = {"a[href=\"#flagcx\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5206\u5e03\u5f0f\u4e0e FlagCX \u8bca\u65ad<a class=\"headerlink\" href=\"#flagcx\" title=\"Link to this heading\">#</a></h2><p>\u5bf9\u4e8e\u5206\u5e03\u5f0f\u901a\u4fe1\u6545\u969c\uff0c\u8bf7\u68c0\u67e5\u6240\u9009\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">SGLANG_FL_DIST_BACKEND</span></code>\u3001\u9884\u671f\u4f7f\u7528 FlagCX \u65f6\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGCX_PATH</span></code>\u3001\u8bbe\u5907\u53ef\u89c1\u6027\u3001\u7f51\u7edc\u914d\u7f6e\u4ee5\u53ca\u5f20\u91cf\u5e76\u884c / \u6d41\u6c34\u7ebf\u5e76\u884c\u8bbe\u7f6e\u3002\u5e73\u53f0\u7279\u5b9a\u7684\u6846\u67b6\u3001\u955c\u50cf\u548c\u7f51\u7edc\u8bbe\u5907\u524d\u7f6e\u6761\u4ef6\u8bb0\u5f55\u5728<a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">\u96c6\u4e2d\u5f0f\u5382\u5546 / \u6846\u67b6 / \u955c\u50cf\u9009\u62e9\u9875\u9762</a>\u4e2d\u3002</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u8c03\u8bd5\u4e0e\u8bca\u65ad<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u7b97\u5b50\u8c03\u5ea6\u7684\u8bca\u65ad\u65b9\u6cd5\u3002</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u901a\u8fc7\u7cbe\u5ea6\u4e8c\u5206\u6cd5\u6392\u67e5\u6570\u503c\u7cbe\u5ea6\u95ee\u9898<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u5f53\u51fa\u73b0\u6570\u503c\u5dee\u5f02\u65f6\uff0c\u9694\u79bb\u51fa\u5bfc\u81f4\u95ee\u9898\u7684\u5c42\u3002\u5982\u679c\u8f93\u51fa\u5728\u7b2c N \u6b65\u53d1\u6563\u4f46\u7b2c N-1 \u6b65\u6b63\u5e38\uff0c\u5219\u95ee\u9898\u5c42 / \u7b97\u5b50\u88ab\u5b9a\u4f4d\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b56\u7565\u4e0e\u540e\u7aef\u89e3\u6790<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u8c03\u5ea6\u91c7\u7528\u57fa\u4e8e\u7b56\u7565\u7684\u65b9\u5f0f\uff0c\u800c\u4e0d\u662f\u56fa\u5b9a\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span> <span class=\"pre\">&gt;</span> <span class=\"pre\">vendor</span> <span class=\"pre\">&gt;</span> <span class=\"pre\">reference</span></code> \u94fe\u3002\u5f53\u7b97\u5b50\u672a\u4f7f\u7528\u9884\u671f\u5b9e\u73b0\u65f6\uff0c\u8bf7\u68c0\u67e5\u6709\u6548\u914d\u7f6e\u548c\u540e\u7aef\u53ef\u7528\u6027\uff1a</p>", "a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5e38\u89c1\u95ee\u9898<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8c03\u5ea6\u65e5\u5fd7<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u67e5\u770b\u6bcf\u4e2a\u878d\u5408\u7b97\u5b50\u89e3\u6790\u5230\u54ea\u4e2a\u540e\u7aef\uff08\u5728\u670d\u52a1\u5668\u542f\u52a8\u65f6\u5199\u5165\uff09\uff1a</p>", "a[href=\"#aten\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen \u66ff\u6362\u65e5\u5fd7<a class=\"headerlink\" href=\"#aten\" title=\"Link to this heading\">#</a></h2><p>\u8bb0\u5f55\u54ea\u4e9b PyTorch ATen \u7b97\u5b50\u88ab FlagGems \u66ff\u6362\uff1a</p>"}
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
