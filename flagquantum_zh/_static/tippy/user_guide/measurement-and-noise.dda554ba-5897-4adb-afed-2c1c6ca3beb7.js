selector_to_html = {"a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u52a8\u6001\u7ebf\u8def<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2><p>\u5019\u9009\u7a33\u5b9a\u7ea7\u7684\u6784\u9020\u51fd\u6570\u4e0e\u5b9e\u9a8c\u6027\u6267\u884c\u662f\u9694\u79bb\u7684\uff1a</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u786c\u4ef6\u6ce1\u5229\u6d4b\u91cf\u89c4\u5212<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u5728\u57fa\u4e8e\u91c7\u6837\u7684\u786c\u4ef6\u4e0a\u6d4b\u91cf\u542b X\u3001Y\u3001Z \u9879\u7684\u54c8\u5bc6\u987f\u91cf\u65f6\uff0c\u53ef\u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">create_pauli_measurement_plan</span></code>\u3002\u5b83\u4f1a\u8d2a\u5fc3\u5730\u5bf9\u91cf\u5b50\u4f4d\u9010\u4f4d\u5bf9\u6613\u7684\u9879\u5206\u7ec4\u3001\u8ffd\u52a0\u6240\u9700\u7684\u57fa\u53d8\u6362\u65cb\u8f6c\uff0c\u5e76\u4e3a\u6bcf\u7ec4\u751f\u6210\u4e00\u4e2a\u5df2\u5c01\u88c5\u7684\u90e8\u7f72\u5305\uff1a</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u566a\u58f0\u6a21\u578b<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u7a33\u5b9a\u7684\u542b\u566a\u6267\u884c\u5728\u89c4\u5212\u9636\u6bb5\u63a5\u53d7 <code class=\"docutils literal notranslate\"><span class=\"pre\">flagquantum.noise.NoiseModel</span></code>\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u6d4b\u91cf\u4e0e\u566a\u58f0<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u53ef\u89c2\u6d4b\u91cf\u4e0e\u8f93\u51fa<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.X</span></code>\u3001<code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Y</span></code>\u3001<code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Z</span></code> \u63cf\u8ff0\u6570\u5b66\u4e0a\u7684\u53ef\u89c2\u6d4b\u91cf\uff0c\u518d\u4ece <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.plan</span></code> \u6216 <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.run</span></code> \u8bf7\u6c42\u5177\u540d\u8f93\u51fa\u3002\u6ce1\u5229\u4e58\u79ef\u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">@</span></code>\uff1b\u54c8\u5bc6\u987f\u91cf\u6c42\u548c\u4e0e\u5b9e\u6570\u7cfb\u6570\u4f7f\u7528\u666e\u901a\u7b97\u672f\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u53ef\u89c2\u6d4b\u91cf\u4e0e\u8f93\u51fa<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.X</span></code>\u3001<code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Y</span></code>\u3001<code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Z</span></code> \u63cf\u8ff0\u6570\u5b66\u4e0a\u7684\u53ef\u89c2\u6d4b\u91cf\uff0c\u518d\u4ece <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.plan</span></code> \u6216 <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.run</span></code> \u8bf7\u6c42\u5177\u540d\u8f93\u51fa\u3002\u6ce1\u5229\u4e58\u79ef\u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">@</span></code>\uff1b\u54c8\u5bc6\u987f\u91cf\u6c42\u548c\u4e0e\u5b9e\u6570\u7cfb\u6570\u4f7f\u7528\u666e\u901a\u7b97\u672f\u3002</p>"}
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
