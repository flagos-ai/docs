selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u5b89\u88c5 FlagQuantum \u7684\u73af\u5883\u8981\u6c42\uff0c\u5e76\u5f15\u5bfc\u4f60\u5b8c\u6210\u5b89\u88c5\u8fc7\u7a0b\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f60\u7684\u7b2c\u4e00\u4e2a\u91cf\u5b50\u6a21\u578b<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>FlagQuantum \u662f PyTorch \u4f18\u5148\u7684\u6846\u67b6\uff0c\u56e0\u6b64\u6700\u77ed\u7684\u4e0a\u624b\u8def\u5f84\u5c31\u662f\u4e00\u4e2a\u53ef\u8bad\u7ec3\u7684\u5c0f\u7ebf\u8def\u3002\u4e0b\u9762\u7684\u793a\u4f8b\u6784\u5efa\u4e00\u4e2a\u53cc\u6bd4\u7279\u7ebf\u8def\uff0c\u901a\u8fc7\u6700\u5c0f\u5316\u6d4b\u91cf\u5f97\u5230\u7684\u671f\u671b\u503c\u6765\u5b66\u4e60\u5176\u65cb\u8f6c\u89d2\uff0c\u6700\u540e\u6253\u5370\u8bad\u7ec3\u540e\u7684\u6d4b\u91cf\u7ed3\u679c\u3002\u5b83\u4e0d\u9700\u8981 GPU\u3001\u51ed\u636e\u6216\u4efb\u4f55\u53ef\u9009\u540e\u7aef\u3002</p>", "a[href=\"install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5 FlagQuantum<a class=\"headerlink\" href=\"#flagquantum\" title=\"Link to this heading\">#</a></h1><p>\u8bf7\u5148\u9605\u8bfb<a class=\"reference internal\" href=\"requirements.html\"><span class=\"std std-doc\">\u73af\u5883\u8981\u6c42</span></a>\u3002</p>", "a[href=\"../user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u6307\u5357\u4ecb\u7ecd\u5982\u4f55\u7528 FlagQuantum \u505a\u91cf\u5b50\u7ebf\u8def\u7684\u6a21\u62df\u4e0e\u8bad\u7ec3\uff1a\u6784\u5efa\u7a0b\u5e8f\u3001\u89c4\u5212\u4e0e\u8fd0\u884c\u3001\u4f7f\u7528 PyTorch \u8bad\u7ec3\u3001\u9009\u62e9\u6a21\u62df\u8868\u793a\u3001\u52a0\u5165\u566a\u58f0\u4e0e\u6d4b\u91cf\u3001\u8de8 rank \u6269\u5c55\uff0c\u5e76\u628a\u540c\u4e00\u4efd\u7a0b\u5e8f\u8fc1\u79fb\u5230\u786c\u4ef6\u4e0a\u3002</p>", "a[href=\"requirements.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u73af\u5883\u8981\u6c42<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd FlagQuantum \u7684\u786c\u4ef6\u5e73\u53f0\u4e0e\u8f6f\u4ef6\u8981\u6c42\u3002</p>"}
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
