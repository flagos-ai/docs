selector_to_html = {"a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagAudio \u6982\u89c8<a class=\"headerlink\" href=\"#flagaudio\" title=\"Link to this heading\">#</a></h1><p>FlagAudio \u662f <a class=\"reference external\" href=\"https://flagos.io/Home\">FlagOS</a> \u7684\u7ec4\u6210\u90e8\u5206\u3002FlagAudio \u662f\u4e00\u4e2a\u9075\u5faa Audio \u6807\u51c6\u63a5\u53e3\u7684\u591a\u540e\u7aef\u8ba1\u7b97\u5e93\uff0c\u63d0\u4f9b\u9762\u5411\u97f3\u9891\u4fe1\u53f7\u5904\u7406\u548c\u8bed\u97f3 AI \u5e94\u7528\u7684\u9ad8\u6027\u80fd\u8ba1\u7b97\u89e3\u51b3\u65b9\u6848\uff0c\u6db5\u76d6\u4ece\u539f\u59cb\u97f3\u9891\u5230\u6a21\u578b\u8f93\u5165\u7684\u5b8c\u6574\u5904\u7406\u94fe\u8def\u3002</p><p>FlagAudio \u662f\u4f7f\u7528 OpenAI \u63a8\u51fa\u7684 <a class=\"reference external\" href=\"https://github.com/triton-lang/triton\">Triton \u7f16\u7a0b\u8bed\u8a00</a> \u5b9e\u73b0\u7684\u9ad8\u6027\u80fd\u901a\u7528\u7b97\u5b50\u5e93\u3002</p>", "a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagAudio \u5feb\u901f\u5165\u95e8<a class=\"headerlink\" href=\"#flagaudio\" title=\"Link to this heading\">#</a></h1>", "a[href=\"#flagaudio\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagAudio \u6587\u6863<a class=\"headerlink\" href=\"#flagaudio\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">\u5feb\u901f\u5165\u95e8</span></a></p>"}
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
