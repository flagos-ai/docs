selector_to_html = {"a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u540e\u7aef\u5185\u90e8\u7ec4\u6210<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u7f16\u8bd1\u6a21\u5f0f\uff1a</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5e73\u53f0\u5dee\u5f02<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6027\u80fd<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u878d\u5408\u6536\u76ca\u5df2\u505a\u6b63\u786e\u6027\u9a8c\u8bc1\uff08<code class=\"docutils literal notranslate\"><span class=\"pre\">tests/integration/test_compile.py</span></code>\uff09\uff1b\u4e0e CUDA \u4e0a\u5b98\u65b9 Inductor \u7684\u6536\u76ca\u5bf9\u6bd4\u57fa\u51c6\u6d4b\u8bd5\u4ecd\u5f85\u5f00\u5c55\u3002\u4ece\u7ed3\u6784\u4e0a\u770b\u4e24\u8005\u5e94\u5f53\u63a5\u8fd1 \u2014\u2014 \u76f8\u540c\u7684\u878d\u5408 pass\u3001\u76f8\u540c\u7684 Triton \u4ee3\u7801\u751f\u6210\u3001\u56e0\u4e3a\u8ba1\u7b97\u56fe\u7559\u5728 flagos \u800c\u4e0d\u5b58\u5728\u6bcf\u6b21\u8c03\u7528\u7684\u62f7\u8d1d \u2014\u2014 \u4f46\u8fd9\u662f\u9884\u671f\u800c\u975e\u5b9e\u6d4b\u7ed3\u8bba\u3002</p>", "a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u73af\u5883\u53d8\u91cf<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2><p>\u8def\u7531\u76f8\u5173\u53d8\u91cf\uff08<code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_BACKEND_CONFIG</span></code>\u3001<code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_OP_&lt;op&gt;</span></code>\u3001<code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_FORCE_BACKEND</span></code>\uff09\u540c\u6837\u4f5c\u7528\u4e8e\u7f16\u8bd1\u540e\u7684\u5185\u6838\uff0c\u56e0\u4e3a\u7f16\u8bd1\u51fa\u7684\u8ba1\u7b97\u56fe\u8d70\u540c\u4e00\u5f20\u8def\u7531\u8868\u3002</p>", "a[href=\"#torch-compile\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">torch.compile \u96c6\u6210<a class=\"headerlink\" href=\"#torch-compile\" title=\"Link to this heading\">#</a></h1><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> \u8bbe\u5907\u652f\u6301 <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.compile</span></code>\uff0c\u53ef\u5b9e\u73b0\u81ea\u52a8\u5185\u6838\u878d\u5408\u5e76\u964d\u4f4e\u8c03\u5ea6\u5f00\u9500\u3002\u8ba1\u7b97\u56fe\u59cb\u7ec8\u7559\u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> \u8bbe\u5907\u4e0a\uff1a\u4e0d\u5b58\u5728\u8bbe\u5907\u5f80\u8fd4\uff0c\u4e5f\u6ca1\u6709\u56fe\u8fb9\u754c\u5904\u7684\u62f7\u8d1d\u3002</p>", "a[href=\"#id6\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6545\u969c\u6392\u67e5<a class=\"headerlink\" href=\"#id6\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flagtree\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree \u7f16\u8bd1<a class=\"headerlink\" href=\"#flagtree\" title=\"Link to this heading\">#</a></h2><p><a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagTree\">FlagTree</a> \u662f Triton \u7684\u5206\u652f\uff0c\u5176\u7f16\u8bd1\u5668\u9762\u5411\u591a\u79cd\u5382\u5546\u540e\u7aef\u3002\u5b83\u7684\u96c6\u6210\u65b9\u5f0f\u662f\u5728<strong>\u5b89\u88c5\u671f\u66ff\u6362</strong>\uff0c\u8fd9\u662f\u7406\u89e3\u5b83\u7684\u5173\u952e\uff1a</p>"}
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
