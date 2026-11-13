selector_to_html = {"a[href=\"#model-list-on-cloud-gpu\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Model List on Cloud GPU<a class=\"headerlink\" href=\"#model-list-on-cloud-gpu\" title=\"Link to this heading\">#</a></h1><h2>On Tencent Cloud HAI<a class=\"headerlink\" href=\"#on-tencent-cloud-hai\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#on-aliyun\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">On Aliyun<a class=\"headerlink\" href=\"#on-aliyun\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#on-tencent-cloud-hai\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">On Tencent Cloud HAI<a class=\"headerlink\" href=\"#on-tencent-cloud-hai\" title=\"Link to this heading\">#</a></h2>"}
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
