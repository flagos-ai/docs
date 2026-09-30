selector_to_html = {"a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4ea4\u7ed9\u89c4\u5212\u5668\u5224\u65ad<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u5982\u679c\u4e0d\u786e\u5b9a\u54ea\u79cd\u8868\u793a\u5408\u9002\uff0c\u5148\u505a\u89c4\u5212\uff1a\u8fd0\u884c\u65f6\u89c4\u5212\u5668\u4f1a\u62a5\u544a\u6240\u9009\u7684\u8868\u793a\u3001\u68af\u5ea6\u652f\u6301\u4e0e\u4efb\u4f55\u963b\u585e\u9879\uff0c\u800c\u4e0d\u662f\u5728\u6267\u884c\u65f6\u624d\u5931\u8d25\u3002</p>", "a[href=\"../reference/capabilities.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u80fd\u529b\u53c2\u8003<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum \u516c\u5f00\u6bcf\u4e2a\u80fd\u529b\u7684\u6210\u719f\u5ea6\uff0c\u800c\u4e0d\u662f\u9760\u793a\u4f8b\u53bb\u6697\u793a\u3002\u672c\u9875\u662f\u6458\u8981\uff1b\u4ed3\u5e93\u4e2d\u7ecf\u673a\u5668\u6821\u9a8c\u7684\u80fd\u529b\u77e9\u9635\u624d\u662f\u6743\u5a01\u6765\u6e90\u3002</p>", "a[href=\"#mps\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">MPS \u4e0e\u5f20\u91cf\u7f51\u7edc\u5de5\u4f5c\u6d41<a class=\"headerlink\" href=\"#mps\" title=\"Link to this heading\">#</a></h2><p>1000 \u6bd4\u7279\u7684 dimer \u793a\u4f8b\u662f\u9762\u5411 PyTorch \u4fa7 JAX/MPS \u8def\u5f84\u7684\u7ed3\u6784\u5316 MPS \u57fa\u51c6\uff0c\u5e76\u4e0d\u662f\u5bf9\u4efb\u610f 1000 \u6bd4\u7279\u7ebf\u8def\u7684\u4e3b\u5f20\u3002\u6bcf\u79cd\u8868\u793a\u7684\u51c6\u786e\u9002\u7528\u8303\u56f4\u89c1<a class=\"reference internal\" href=\"../reference/capabilities.html\"><span class=\"std std-doc\">\u80fd\u529b\u53c2\u8003</span></a>\u3002</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u663e\u5f0f\u8bf7\u6c42\u67d0\u79cd\u8868\u793a<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>\u672c\u5730\u6001\u5411\u91cf\u6267\u884c\u662f\u9ed8\u8ba4\u8def\u5f84\u3002\u9700\u8981\u65f6\u53ef\u663e\u5f0f\u9009\u62e9\u5f53\u524d\u8fdb\u7a0b\u53ef\u63a7\u7684\u4e00\u5f20 GPU\uff1a</p>", "a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u6a21\u62df\u8868\u793a<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum \u5728\u540c\u4e00\u4efd\u7a0b\u5e8f\u4e4b\u540e\u63d0\u4f9b\u591a\u5957\u6a21\u62df\u8868\u793a\uff0c\u56e0\u6b64\u8d1f\u8f7d\u53d8\u5316\u65f6\u65e0\u9700\u91cd\u5199\u6a21\u578b\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4e0d\u6539\u4ee3\u7801\u5207\u6362\u8868\u793a<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u540c\u4e00\u4e2a\u6df7\u5408\u6a21\u578b\u2014\u2014<code class=\"docutils literal notranslate\"><span class=\"pre\">torch.nn.Linear</span></code> \u7f16\u7801\u5668\u63a5\u5230 <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.Module</span></code> \u91cf\u5b50\u5c42\u2014\u2014\u5728\u6bcf\u79cd\u8868\u793a\u4e0a\u90fd\u7528\u540c\u4e00\u4e2a PyTorch \u4f18\u5316\u5faa\u73af\u8bad\u7ec3\u3002</p>"}
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
