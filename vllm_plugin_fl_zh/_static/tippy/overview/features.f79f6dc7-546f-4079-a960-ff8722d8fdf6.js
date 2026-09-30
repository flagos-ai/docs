selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u5229\u7528 FlagGems\uff08\u7edf\u4e00\u7b97\u5b50\u5e93\uff09\u548c FlagCX\uff08\u7edf\u4e00\u901a\u4fe1\u5e93\uff09\u63d0\u4f9b\u82af\u7247\u65e0\u5173\u7684\u63a8\u7406\u80fd\u529b\u3002\u540c\u4e00\u6a21\u578b\u53ef\u5728\u4e0d\u540c\u786c\u4ef6\u4e0a\u8fd0\u884c\uff0c\u65e0\u9700\u4fee\u6539\u4ee3\u7801\u3002</p>", "a[href=\"../dispatch_user_guide/dispatch-user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u5b50\u8c03\u5ea6\u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u6307\u5357\u4ecb\u7ecd\u5982\u4f55\u4f7f\u7528\u7b97\u5b50\u8c03\u5ea6\u7cfb\u7edf\uff0c\u8be5\u7cfb\u7edf\u5728 FlagGems\u3001\u5382\u5546\u7279\u5b9a\u5b9e\u73b0\u548c PyTorch \u53c2\u8003\u5b9e\u73b0\u4e4b\u95f4\u8fdb\u884c\u9009\u62e9\u3002\u9009\u62e9\u9075\u5faa\u4f18\u5148\u7ea7\u5c42\u7ea7\uff0c\u4ece\u9ad8\u5230\u4f4e\uff1a</p>", "a[href=\"../getting_started/install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5\u8fd0\u884c\u63a8\u7406\u4efb\u52a1\u6240\u9700\u7684\u8f6f\u4ef6<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u4ece Docker \u955c\u50cf\u5b89\u88c5<a class=\"headerlink\" href=\"#docker\" title=\"Link to this heading\">#</a></h2><p>vllm-plugin-FL \u901a\u8fc7\u9884\u6784\u5efa\u7684 Docker \u955c\u50cf\u5b89\u88c5\u3002\u53d7\u652f\u6301\u7684\u7248\u672c\u4e0e\u786c\u4ef6\u5e73\u53f0\u89c1<a class=\"reference internal\" href=\"../getting_started/requirements.html\"><span class=\"std std-doc\">\u8981\u6c42</span></a>\u3002</p>"}
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
