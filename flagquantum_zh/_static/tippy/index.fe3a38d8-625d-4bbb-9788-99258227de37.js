selector_to_html = {"a[href=\"reference/reference.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u53c2\u8003\u8d44\u6599<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u7a33\u5b9a\u63a5\u53e3\u3001\u914d\u7f6e\u4e0e\u652f\u6301\u8fb9\u754c\u3002</p>", "a[href=\"#flagquantum\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagQuantum \u6587\u6863<a class=\"headerlink\" href=\"#flagquantum\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5feb\u901f\u5165\u95e8</span></a></p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u6307\u5357\u4ecb\u7ecd\u5982\u4f55\u7528 FlagQuantum \u505a\u91cf\u5b50\u7ebf\u8def\u7684\u6a21\u62df\u4e0e\u8bad\u7ec3\uff1a\u6784\u5efa\u7a0b\u5e8f\u3001\u89c4\u5212\u4e0e\u8fd0\u884c\u3001\u4f7f\u7528 PyTorch \u8bad\u7ec3\u3001\u9009\u62e9\u6a21\u62df\u8868\u793a\u3001\u52a0\u5165\u566a\u58f0\u4e0e\u6d4b\u91cf\u3001\u8de8 rank \u6269\u5c55\uff0c\u5e76\u628a\u540c\u4e00\u4efd\u7a0b\u5e8f\u8fc1\u79fb\u5230\u786c\u4ef6\u4e0a\u3002</p>", "a[href=\"FlagQuantum_overview/FlagQuantum-overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagQuantum \u6982\u89c8<a class=\"headerlink\" href=\"#flagquantum\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum \u662f\u6784\u5efa\u5728 PyTorch \u4e4b\u4e0a\u7684\u5206\u7247\u3001\u53ef\u5fae\u91cf\u5b50\u6a21\u62df\u4e0e\u8bad\u7ec3\u6846\u67b6\u3002\u5b83\u628a\u91cf\u5b50\u7ebf\u8def\u53d8\u6210\u53ef\u8bad\u7ec3\u6a21\u578b\uff0c\u8ba9\u540c\u4e00\u4efd\u7a0b\u5e8f\u5728\u591a\u79cd\u6a21\u62df\u8868\u793a\u4e4b\u95f4\u5207\u6362\uff0c\u5e76\u901a\u8fc7 FlagOS \u89e6\u8fbe\u56fd\u4ea7\u52a0\u901f\u5668\u3002FlagQuantum \u662f FlagOS \u751f\u6001\u7684\u4e00\u90e8\u5206\u2014\u2014FlagOS \u662f\u4e00\u5957\u7edf\u4e00\u7684\u5f00\u6e90 AI \u7cfb\u7edf\u8f6f\u4ef6\u6808\uff0c\u901a\u8fc7\u65e0\u7f1d\u6574\u5408\u5404\u7c7b\u6a21\u578b\u3001\u7cfb\u7edf\u4e0e\u82af\u7247\u6765\u6784\u5efa\u5f00\u653e\u6280\u672f\u751f\u6001\u3002</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u5b89\u88c5 FlagQuantum \u7684\u73af\u5883\u8981\u6c42\uff0c\u5e76\u5f15\u5bfc\u4f60\u5b8c\u6210\u5b89\u88c5\u8fc7\u7a0b\u3002</p>"}
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
