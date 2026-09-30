selector_to_html = {"a[href=\"#id6\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5de5\u4f5c\u6d41\u7a0b<a class=\"headerlink\" href=\"#id6\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#python\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Python \u8fb9\u754c<a class=\"headerlink\" href=\"#python\" title=\"Link to this heading\">#</a></h3><p>\u539f\u751f\u8fd0\u884c\u65f6\u8c03\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">python</span> <span class=\"pre\">-m</span> <span class=\"pre\">flagfft_codegen.jit_source</span></code>\uff1b\u6240\u9009\u7684 Python \u73af\u5883\u5fc5\u987b\u63d0\u4f9b\u517c\u5bb9\u7684 Triton/TLE \u4f9d\u8d56\u3002\u751f\u6210\u7684 JIT \u6e90\u7801/\u5143\u6570\u636e\u5b58\u653e\u5728\u53ef\u6267\u884c\u6587\u4ef6\u65c1\u8fb9\u7684 <code class=\"docutils literal notranslate\"><span class=\"pre\">.flagfft</span></code> \u4e2d\u3002</p>", "a[href=\"#id3\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u539f\u59cb\u6267\u884c\u8282\u70b9<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#flagfft\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT \u6982\u89c8<a class=\"headerlink\" href=\"#flagfft\" title=\"Link to this heading\">#</a></h1><p>FlagFFT \u662f\u4e00\u4e2a\u5b9e\u9a8c\u6027\u7684 C++ FFT \u5e93\uff0c\u63d0\u4f9b\u4e0e cuFFT \u98ce\u683c\u517c\u5bb9\u7684 API \u4ee5\u53ca\u57fa\u4e8e Triton/TLE \u751f\u6210\u7684 CUDA \u5185\u6838\u3002\u516c\u5f00\u7684\u8fd0\u884c\u65f6\u63a5\u53e3\u4e3a C \u8bed\u8a00\uff1bPython \u4ec5\u7528\u4e8e Triton/TLE JIT \u6e90\u7801\u751f\u6210\uff08\u5185\u90e8\u4ee3\u7801\u751f\u6210\uff09\u3002</p><p>FlagFFT \u662f <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> \u751f\u6001\u7cfb\u7edf\u7684\u7ec4\u6210\u90e8\u5206\uff0c\u4e3a\u79d1\u5b66\u8ba1\u7b97\u3001\u4fe1\u53f7\u5904\u7406\u548c\u673a\u5668\u5b66\u4e60\u5de5\u4f5c\u8d1f\u8f7d\u63d0\u4f9b\u9ad8\u6027\u80fd FFT \u8ba1\u7b97\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u67b6\u6784<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><h3>C++ \u8fd0\u884c\u65f6<a class=\"headerlink\" href=\"#c\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#cli\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">CLI \u5de5\u5177<a class=\"headerlink\" href=\"#cli\" title=\"Link to this heading\">#</a></h3><p><code class=\"docutils literal notranslate\"><span class=\"pre\">src/cli_tools/common/</span></code> \u62e5\u6709 <code class=\"docutils literal notranslate\"><span class=\"pre\">CaseSpec</span></code>\u3001\u786e\u5b9a\u6027\u7f13\u51b2\u533a\u751f\u6210\u3001FlagFFT/cuFFT \u8c03\u5ea6\u548c\u6bd4\u8f83\u3002cuFFT \u4ec5\u5728 CLI \u4e2d\u7528\u4f5c CUDA \u9a8c\u8bc1/\u6027\u80fd\u57fa\u51c6\u3002</p>", "a[href=\"#id4\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u6784\u5efa\u9009\u9879<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id5\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">\u6d4b\u8bd5<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#c\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">C++ \u8fd0\u884c\u65f6<a class=\"headerlink\" href=\"#c\" title=\"Link to this heading\">#</a></h3>"}
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
