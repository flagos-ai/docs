selector_to_html = {"a[href=\"#model-list\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Model List<a class=\"headerlink\" href=\"#model-list\" title=\"Link to this heading\">#</a></h1><p>This section includes the hardware-adapted models released through FlagRelease.</p>", "a[href=\"model-list-cloud.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Model List on Cloud GPU<a class=\"headerlink\" href=\"#model-list-on-cloud-gpu\" title=\"Link to this heading\">#</a></h1><h2>On Tencent Cloud HAI<a class=\"headerlink\" href=\"#on-tencent-cloud-hai\" title=\"Link to this heading\">#</a></h2>", "a[href=\"model-list-cloud.html#on-tencent-cloud-hai\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">On Tencent Cloud HAI<a class=\"headerlink\" href=\"#on-tencent-cloud-hai\" title=\"Link to this heading\">#</a></h2>", "a[href=\"model-list-cloud.html#on-aliyun\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">On Aliyun<a class=\"headerlink\" href=\"#on-aliyun\" title=\"Link to this heading\">#</a></h2>", "a[href=\"model-list-huggingface.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Models on Hugging Face<a class=\"headerlink\" href=\"#models-on-hugging-face\" title=\"Link to this heading\">#</a></h1>", "a[href=\"model-list-modelscope.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Models on ModelScope<a class=\"headerlink\" href=\"#models-on-modelscope\" title=\"Link to this heading\">#</a></h1>", "a[href=\"model-list-aihuanxin.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Models on AI Huanxin<a class=\"headerlink\" href=\"#models-on-ai-huanxin\" title=\"Link to this heading\">#</a></h1>"}
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
