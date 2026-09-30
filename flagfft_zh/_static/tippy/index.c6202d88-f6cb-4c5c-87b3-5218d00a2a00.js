selector_to_html = {"a[href=\"#flagfft\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT \u6587\u6863<a class=\"headerlink\" href=\"#flagfft\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5feb\u901f\u5165\u95e8</span></a></p>", "a[href=\"reference/api-reference.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT C API \u53c2\u8003<a class=\"headerlink\" href=\"#flagfft-c-api\" title=\"Link to this heading\">#</a></h1><h2>\u8ba1\u5212\u521b\u5efa<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2>", "a[href=\"reference/tle-reference.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">TLE \u53c2\u8003<a class=\"headerlink\" href=\"#tle\" title=\"Link to this heading\">#</a></h1><p>\u672c\u9875\u9762\u4ecb\u7ecd\u7f16\u5199 FlagFFT Triton \u5185\u6838\u65f6\u4f7f\u7528\u7684 FlagTree/TLE API\u3002</p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT \u6982\u89c8<a class=\"headerlink\" href=\"#flagfft\" title=\"Link to this heading\">#</a></h1><p>FlagFFT \u662f\u4e00\u4e2a\u5b9e\u9a8c\u6027\u7684 C++ FFT \u5e93\uff0c\u63d0\u4f9b\u4e0e cuFFT \u98ce\u683c\u517c\u5bb9\u7684 API \u4ee5\u53ca\u57fa\u4e8e Triton/TLE \u751f\u6210\u7684 CUDA \u5185\u6838\u3002\u516c\u5f00\u7684\u8fd0\u884c\u65f6\u63a5\u53e3\u4e3a C \u8bed\u8a00\uff1bPython \u4ec5\u7528\u4e8e Triton/TLE JIT \u6e90\u7801\u751f\u6210\uff08\u5185\u90e8\u4ee3\u7801\u751f\u6210\uff09\u3002</p><p>FlagFFT \u662f <a class=\"reference external\" href=\"https://flagos.io/\">FlagOS</a> \u751f\u6001\u7cfb\u7edf\u7684\u7ec4\u6210\u90e8\u5206\uff0c\u4e3a\u79d1\u5b66\u8ba1\u7b97\u3001\u4fe1\u53f7\u5904\u7406\u548c\u673a\u5668\u5b66\u4e60\u5de5\u4f5c\u8d1f\u8f7d\u63d0\u4f9b\u9ad8\u6027\u80fd FFT \u8ba1\u7b97\u3002</p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT \u7528\u6237\u6307\u5357<a class=\"headerlink\" href=\"#flagfft\" title=\"Link to this heading\">#</a></h1><h2>\u4f7f\u7528 C API<a class=\"headerlink\" href=\"#c-api\" title=\"Link to this heading\">#</a></h2><p>FlagFFT \u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">include/flagfft.h</span></code> \u4e2d\u63d0\u4f9b\u4e0e cuFFT \u517c\u5bb9\u7684 C API\u3002</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagFFT \u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#flagfft\" title=\"Link to this heading\">#</a></h1>"}
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
