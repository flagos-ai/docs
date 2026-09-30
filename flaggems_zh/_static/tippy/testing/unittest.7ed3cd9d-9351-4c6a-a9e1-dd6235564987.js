selector_to_html = {"a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">3. \u6d4b\u8bd5\u7b97\u5b50\u7684\u6027\u80fd<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u5728 CUDA \u5e73\u53f0\u4e0a\u6d4b\u8bd5\u7b97\u5b50\u7684\u6027\u80fd\uff1a</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. \u5728\u5177\u4f53\u6a21\u578b\u4e0b\u6267\u884c\u7cbe\u5ea6\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#python\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u6d4b\u8bd5 Python \u7b97\u5b50<a class=\"headerlink\" href=\"#python\" title=\"Link to this heading\">#</a></h1><p><em>FlagGems</em> \u4f7f\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">pytest</span></code> \u6765\u9a71\u52a8\u7b97\u5b50\u7cbe\u5ea6\u6d4b\u8bd5\u548c\u6027\u80fd\u57fa\u51c6\u6d4b\u8bd5\u3002\n\u9879\u76ee\u4f7f\u7528 Triton \u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">triton.testing.do_bench</span></code> \u6765\u6267\u884c\u5185\u6838\u5c42\u7ea7\u7684\u6027\u80fd\u8bc4\u4f30\u3002</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. \u7b97\u5b50\u7cbe\u5ea6\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u8981\u5728\u7279\u5b9a\u7684\u540e\u7aef\u786c\u4ef6\uff08\u5982 CUDA\uff09\u4e0a\u8fd0\u884c\u6d4b\u8bd5\uff1a</p>"}
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
