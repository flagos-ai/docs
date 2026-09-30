selector_to_html = {"a[href=\"#nvidia-gpu\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5728 NVIDIA \u548c\u5929\u6570\u667a\u82af GPU \u4e0a\u8bad\u7ec3\u6307\u5357<a class=\"headerlink\" href=\"#nvidia-gpu\" title=\"Link to this heading\">#</a></h1><h2>\u73af\u5883\u914d\u7f6e<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u8bf7\u53c2\u8003 <a class=\"reference internal\" href=\"nvidia.html\"><span class=\"std std-doc\">NVIDIA</span></a> \u548c <a class=\"reference internal\" href=\"iluvatar.html\"><span class=\"std std-doc\">Iluvatar</span></a>\uff0c\u4e86\u89e3\u5728 NVIDIA \u548c\u5929\u6570\u667a\u82af\u673a\u5668\u4e0a\u7684\u73af\u5883\u914d\u7f6e\u4ee5\u53ca\u4f7f\u7528 FlagCX \u7f16\u8bd1 Paddle \u7684\u65b9\u6cd5\u3002</p>", "a[href=\"nvidia.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5728 NVIDIA GPU \u73af\u5883\u4e0b\u4f7f\u7528 Paddle \u548c FlagCX \u6307\u5357<a class=\"headerlink\" href=\"#nvidia-gpu-paddle-flagcx\" title=\"Link to this heading\">#</a></h1><h2>\u73af\u5883\u914d\u7f6e<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"iluvatar.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5728\u5929\u6570\u667a\u82af\u673a\u5668\u4e0a\u4f7f\u7528 Paddle \u548c FlagCX \u6307\u5357<a class=\"headerlink\" href=\"#paddle-flagcx\" title=\"Link to this heading\">#</a></h1><h2>\u73af\u5883\u914d\u7f6e<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u73af\u5883\u914d\u7f6e<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u8bf7\u53c2\u8003 <a class=\"reference internal\" href=\"nvidia.html\"><span class=\"std std-doc\">NVIDIA</span></a> \u548c <a class=\"reference internal\" href=\"iluvatar.html\"><span class=\"std std-doc\">Iluvatar</span></a>\uff0c\u4e86\u89e3\u5728 NVIDIA \u548c\u5929\u6570\u667a\u82af\u673a\u5668\u4e0a\u7684\u73af\u5883\u914d\u7f6e\u4ee5\u53ca\u4f7f\u7528 FlagCX \u7f16\u8bd1 Paddle \u7684\u65b9\u6cd5\u3002</p>", "a[href=\"#ai-nvidia-gpu-gpu\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5728\u5f02\u6784 AI \u52a0\u901f\u5668\u4e0a\u8bad\u7ec3\uff08NVIDIA GPU + \u5929\u6570\u667a\u82af GPU\uff09<a class=\"headerlink\" href=\"#ai-nvidia-gpu-gpu\" title=\"Link to this heading\">#</a></h2><p>\u6211\u4eec\u652f\u6301\u4f7f\u7528 NVIDIA GPU \u548c\u5929\u6570\u667a\u82af GPU \u5171\u540c\u8bad\u7ec3 ERNIE4.5\u3002\u8bf7\u53c2\u8003\u4ee5\u4e0b\u6b65\u9aa4\u5f00\u59cb</p>"}
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
