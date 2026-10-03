selector_to_html = {"a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5b58\u50a8\u4e0e\u8ba1\u7b97<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u6570\u636e\u7c7b\u578b\u652f\u6301<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>Torch-FL \u4f1a\u4e3a\u5f20\u91cf<strong>\u5b58\u50a8</strong>\u4fdd\u7559\u8bf7\u6c42\u7684\u6570\u636e\u7c7b\u578b\uff0c\u5e76\u5bf9\u5f20\u91cf\u95f4\u8fd0\u7b97\u9075\u5faa PyTorch \u7684\u63d0\u5347\uff08promotion\uff09\u89c4\u5219\u3002\u8ba1\u7b97\u8986\u76d6\u8303\u56f4\u53d7\u5404\u540e\u7aef\u6240\u7528\u5382\u5546\u5e93\u9650\u5236\uff1b\u6b64\u5916\uff0cAMP \u76ee\u6807\u652f\u6301\u4e0e eager \u7c7b\u578b\u652f\u6301\u662f\u4e24\u4e2a\u72ec\u7acb\u95ee\u9898\uff1a\u5b58\u50a8\u5c42\u63a5\u53d7\u7684\u7c7b\u578b\uff0c\u5e76\u4e0d\u610f\u5473\u7740\u6bcf\u4e2a\u7b97\u5b50\u90fd\u63a5\u53d7\u3002</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u8fb9\u754c<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u5f53\u5382\u5546\u7b97\u5b50\u4e0d\u63a5\u53d7\u67d0\u7c7b\u578b\u65f6\uff0c\u8be5\u7b97\u5b50\u7531\u4ee5\u5b9e\u73b0\u6b63\u786e\u6027\u4e3a\u5148\u7684 CPU \u56de\u9000\u627f\u63a5\uff1a\u5728\u4e3b\u673a\u4e0a\u8ba1\u7b97\uff0c\u518d\u628a\u7c7b\u578b\u6b63\u786e\u7684\u7ed3\u679c\u62f7\u56de\u8bbe\u5907\u3002\u8be5\u56de\u9000\u4ee5\u6b63\u786e\u6027\u4e3a\u76ee\u6807\uff0c\u53ef\u80fd\u6162\u4e8e\u539f\u751f\u5185\u6838 \u2014\u2014 \u8fd9\u662f\u6210\u6587\u7684\u8986\u76d6\u8fb9\u754c\uff0c\u800c\u975e\u6545\u969c\u3002</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u901a\u8fc7\u6d4b\u8bd5\u610f\u5473\u7740\u4ec0\u4e48<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u5728\u7f3a\u5c11\u539f\u751f\u5185\u6838\u65f6\uff0c\u96c6\u6210\u6d4b\u8bd5\u5957\u4ef6\u4f1a\u5c06\u7ed3\u679c\u4e0e CPU \u53c2\u8003\u5b9e\u73b0\u5bf9\u6bd4\uff1b\u56e0\u6b64\u6d4b\u8bd5\u901a\u8fc7\u610f\u5473\u7740\u8be5\u7b97\u5b50\u9075\u5faa\u6210\u6587\u7684 PyTorch \u5951\u7ea6 \u2014\u2014 \u800c<strong>\u4e0d\u4e00\u5b9a</strong>\u610f\u5473\u7740\u5b83\u4f7f\u7528\u4e86\u5382\u5546\u539f\u751f\u5185\u6838\u3002</p>", "a[href=\"#amp\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">AMP \u76ee\u6807\u7c7b\u578b<a class=\"headerlink\" href=\"#amp\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">torch.autocast(\"flagos\")</span></code> \u652f\u6301 <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.float16</span></code> \u4e0e <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.bfloat16</span></code> \u4f5c\u4e3a\u4f4e\u7cbe\u5ea6\u76ee\u6807\uff0c\u91c7\u7528 PyTorch \u6807\u51c6 autocast \u7b56\u7565\u7ec4\uff1a\u77e9\u9635\u4e58\u4e0e\u5377\u79ef\u4f18\u5148\u4f7f\u7528\u6240\u9009\u4f4e\u7cbe\u5ea6\u7c7b\u578b\uff0c\u6570\u503c\u654f\u611f\u7b97\u5b50\uff08\u5bf9\u6570\u3001\u5f52\u4e00\u5316\uff09\u4f7f\u7528 float32\uff0c\u6df7\u5408\u8f93\u5165\u9075\u5faa promote \u7b56\u7565\u3002<strong>float32 \u4e0e float64 \u4e0d\u662f\u5408\u6cd5\u7684 autocast \u76ee\u6807\u3002</strong></p>"}
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
