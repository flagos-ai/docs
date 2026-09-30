selector_to_html = {"a[href=\"requirements.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u73af\u5883\u8981\u6c42<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd FlagQuantum \u7684\u786c\u4ef6\u5e73\u53f0\u4e0e\u8f6f\u4ef6\u8981\u6c42\u3002</p>", "a[href=\"../user_guide/simulation-representations.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u6a21\u62df\u8868\u793a<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum \u5728\u540c\u4e00\u4efd\u7a0b\u5e8f\u4e4b\u540e\u63d0\u4f9b\u591a\u5957\u6a21\u62df\u8868\u793a\uff0c\u56e0\u6b64\u8d1f\u8f7d\u53d8\u5316\u65f6\u65e0\u9700\u91cd\u5199\u6a21\u578b\u3002</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4e0b\u4e00\u6b65<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6b65\u9aa4<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flagquantum\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b89\u88c5 FlagQuantum<a class=\"headerlink\" href=\"#flagquantum\" title=\"Link to this heading\">#</a></h1><p>\u8bf7\u5148\u9605\u8bfb<a class=\"reference internal\" href=\"requirements.html\"><span class=\"std std-doc\">\u73af\u5883\u8981\u6c42</span></a>\u3002</p>", "a[href=\"../user_guide/basic-usage.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u57fa\u672c\u7528\u6cd5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u6784\u5efa\u7ebf\u8def\u3001\u67e5\u770b\u89c4\u5212\u3001\u6267\u884c\u5e76\u8bfb\u53d6\u7ed3\u679c\u3002\u8fd9\u662f\u8d2f\u7a7f\u7a33\u5b9a API \u7684\u6700\u77ed\u5b8c\u6574\u8def\u5f84\u3002</p>", "a[href=\"../user_guide/training-with-pytorch.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528 PyTorch \u8bad\u7ec3<a class=\"headerlink\" href=\"#pytorch\" title=\"Link to this heading\">#</a></h1><p>\u6267\u884c\u4e0e\u8bad\u7ec3\u662f\u6709\u610f\u5206\u5f00\u7684\u3002\u53ef\u8bad\u7ec3\u7a0b\u5e8f\u5c31\u662f\u653e\u5728\u5e38\u89c4 PyTorch \u8bad\u7ec3\u5faa\u73af\u91cc\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Module</span></code>\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5f00\u53d1\u5bb9\u5668<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u4ed3\u5e93\u540c\u65f6\u63d0\u4f9b\u9762\u5411 CPU \u4e0e CUDA \u73af\u5883\u7684\u5f00\u53d1\u5bb9\u5668\u5b9a\u4e49\uff0c\u5e76\u533a\u5206\u662f\u5426\u5305\u542b JAX \u4e0e QSteed \u7f16\u8bd1\u5668\u3002\u5982\u679c\u4f60\u66f4\u5e0c\u671b\u4f7f\u7528\u51c6\u5907\u597d\u7684\u73af\u5883\uff0c\u8bf7\u6309\u4ed3\u5e93\u4e2d\u7684\u5bb9\u5668\u6307\u5357\u64cd\u4f5c\uff1b\u955c\u50cf\u4ece\u672c\u5730\u68c0\u51fa\u5b89\u88c5 FlagQuantum \u5e76\u5185\u7f6e JupyterLab\uff0c\u4e14\u90fd\u4e0d\u5305\u542b\u63d0\u4f9b\u65b9\u51ed\u636e\u3002</p>"}
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
