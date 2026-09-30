selector_to_html = {"a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u91cf\u5b50\u7ea0\u9519<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagquantum.qec</span></code> \u8fde\u63a5\u75c7\u72b6\u63d0\u53d6\u3001\u8bd1\u7801\u3001\u7ea0\u6b63\u4e0e\u903b\u8f91\u7ed3\u679c\u5206\u6790\u3002\u53c2\u8003\u5b9e\u9a8c\u662f\u4e00\u4e2a\u6ce8\u5165\u9519\u8bef\u7684\u4e09\u6570\u636e\u6bd4\u7279\u91cd\u590d\u7801\u5b58\u50a8\u5b9e\u9a8c\uff1a</p>", "a[href=\"#qpu\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">QPU \u6570\u5b57\u5b6a\u751f<a class=\"headerlink\" href=\"#qpu\" title=\"Link to this heading\">#</a></h2><p>\u6570\u5b57\u5b6a\u751f\u662f\u4e00\u53f0\u8bbe\u5907\u7684\u6807\u5b9a\u6761\u4ef6\u6a21\u578b\uff0c\u7531\u643a\u5e26\u8bbe\u5907\u914d\u7f6e\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">NoiseModel</span></code> \u6784\u5efa\u3002\u6267\u884c\u76ee\u6807\u4e0e\u6709\u5e8f\u7269\u7406\u6620\u5c04\u4f1a\u6210\u4e3a\u5b6a\u751f\u4e0d\u53ef\u53d8\u8eab\u4efd\u7684\u4e00\u90e8\u5206\uff1a</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u672c\u5730\u54c8\u5bc6\u987f\u91cf\u68af\u5ea6<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u5bf9\u4e8e\u6279\u5927\u5c0f\u4e3a 1\u3001\u7cfb\u6570\u4e3a\u5b9e\u5e38\u6570\u7684 Z \u4e0e ZZ \u9879\u6001\u5411\u91cf\u7ebf\u8def\uff0c<code class=\"docutils literal notranslate\"><span class=\"pre\">Hamiltonian.expectation</span></code> \u63d0\u4f9b\u4e86\u4e00\u6761\u5185\u5b58\u53d7\u9650\u7684\u4f34\u968f\u8def\u5f84\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u6cd5\u3001\u7ea0\u9519\u4e0e\u6570\u5b57\u5b6a\u751f<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u7b97\u6cd5\u5355\u5143<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagquantum.algorithms</span></code> \u5728\u7a33\u5b9a\u7684\u7ebf\u8def\u4e0e\u8fd0\u884c\u65f6 API \u4e4b\u4e0a\u7ec4\u5408\u9762\u5411\u7528\u6237\u7684\u7b97\u6cd5\u5355\u5143\u3002\u5b83\u4eec\u4ece\u5b50\u5305\u63a5\u53e3\u5bfc\u51fa\uff0c\u800c\u4e0d\u662f\u901a\u8fc7 <code class=\"docutils literal notranslate\"><span class=\"pre\">fq</span></code> \u522b\u540d\u5bfc\u51fa\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7b97\u6cd5\u5355\u5143<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagquantum.algorithms</span></code> \u5728\u7a33\u5b9a\u7684\u7ebf\u8def\u4e0e\u8fd0\u884c\u65f6 API \u4e4b\u4e0a\u7ec4\u5408\u9762\u5411\u7528\u6237\u7684\u7b97\u6cd5\u5355\u5143\u3002\u5b83\u4eec\u4ece\u5b50\u5305\u63a5\u53e3\u5bfc\u51fa\uff0c\u800c\u4e0d\u662f\u901a\u8fc7 <code class=\"docutils literal notranslate\"><span class=\"pre\">fq</span></code> \u522b\u540d\u5bfc\u51fa\u3002</p>"}
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
