selector_to_html = {"a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u9009\u62e9\u76ee\u6807\u524d\u5e94\u4e86\u89e3\u7684\u652f\u6301\u8fb9\u754c<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2><p>\u6bcf\u4e2a\u80fd\u529b\u7684\u6210\u719f\u5ea6\uff0c\u4ee5\u53ca\u5404\u76ee\u6807\u5b9e\u9645\u6267\u884c\u8fc7\u4ec0\u4e48\uff0c\u90fd\u516c\u5e03\u5728<a class=\"reference internal\" href=\"../reference/capabilities.html\"><span class=\"std std-doc\">\u80fd\u529b\u53c2\u8003</span></a>\u4e2d\u3002\u5b9e\u73b0\u4e86\u67d0\u4e2a API\uff0c\u5e76\u4e0d\u7b49\u4e8e\u81ea\u52a8\u83b7\u5f97\u751f\u4ea7\u652f\u6301\u3002</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u53ef\u9009\u4f9d\u8d56\u5206\u7ec4<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u4e92\u64cd\u4f5c\u9002\u914d\u5668\u5c5e\u4e8e\u53ef\u9009\u7684\u63a7\u5236\u9762\u8fb9\u754c\uff1a<code class=\"docutils literal notranslate\"><span class=\"pre\">import</span> <span class=\"pre\">flagquantum</span></code> \u6c38\u8fdc\u4e0d\u4f1a\u8fde\u5e26\u5bfc\u5165 Qiskit\u3001PennyLane\u3001Cirq \u6216\u5176\u4ed6\u5916\u90e8\u6846\u67b6\u3002</p>", "a[href=\"../reference/capabilities.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u80fd\u529b\u53c2\u8003<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum \u516c\u5f00\u6bcf\u4e2a\u80fd\u529b\u7684\u6210\u719f\u5ea6\uff0c\u800c\u4e0d\u662f\u9760\u793a\u4f8b\u53bb\u6697\u793a\u3002\u672c\u9875\u662f\u6458\u8981\uff1b\u4ed3\u5e93\u4e2d\u7ecf\u673a\u5668\u6821\u9a8c\u7684\u80fd\u529b\u77e9\u9635\u624d\u662f\u6743\u5a01\u6765\u6e90\u3002</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u652f\u6301\u7684\u786c\u4ef6\u5e73\u53f0<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>FlagQuantum \u4e0d\u4f1a\u6309\u8bbe\u5907\u540d\u53bb\u63a2\u6d4b\u6216\u6d3e\u53d1\u67d0\u4e2a\u5177\u4f53\u56fd\u4ea7\u52a0\u901f\u5668\u3002\u5382\u5546\u63a2\u6d4b\u3001\u8fd0\u884c\u65f6\u6fc0\u6d3b\u4e0e\u517c\u5bb9\u8def\u7531\u90fd\u7531 Torch-FL \u8d1f\u8d23\uff0c\u5e76\u901a\u8fc7 <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> \u5951\u7ea6\u66b4\u9732\u51fa\u6765\u3002</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u73af\u5883\u8981\u6c42<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd FlagQuantum \u7684\u786c\u4ef6\u5e73\u53f0\u4e0e\u8f6f\u4ef6\u8981\u6c42\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8f6f\u4ef6\u8981\u6c42<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u6b63\u5f0f\u53d1\u5e03\u7684\u5305\u53ea\u4f9d\u8d56 PyTorch\uff0c\u5176\u4f59\u90fd\u662f\u53ef\u9009\u9879\u3002</p>"}
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
