selector_to_html = {"a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u4eae\u70b9<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>FlagTree \u521d\u59cb\u7248\u672c\u57fa\u4e8e Triton 3.1 \u6784\u5efa\uff0c\u5f15\u5165\u5bf9\u591a\u79cd AI \u82af\u7247\u540e\u7aef\u7684\u652f\u6301\u3002\u5728\u65e9\u671f\u9636\u6bb5\uff0c\u9879\u76ee\u65e8\u5728\u4fdd\u6301\u4e0e\u73b0\u6709\u540e\u7aef\u9002\u914d\u65b9\u6848\u7684\u517c\u5bb9\u6027\uff0c\u540c\u65f6\u7edf\u4e00\u4ee3\u7801\u5e93\uff0c\u5b9e\u73b0\u5feb\u901f\u7684\u5355\u7248\u672c\u591a\u540e\u7aef\u652f\u6301\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u65b0\u7279\u6027<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5df2\u77e5\u95ee\u9898<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flagtree-0-1-0\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.1.0 \u53d1\u5e03<a class=\"headerlink\" href=\"#flagtree-0-1-0\" title=\"Link to this heading\">#</a></h1><h2>\u4eae\u70b9<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>FlagTree \u521d\u59cb\u7248\u672c\u57fa\u4e8e Triton 3.1 \u6784\u5efa\uff0c\u5f15\u5165\u5bf9\u591a\u79cd AI \u82af\u7247\u540e\u7aef\u7684\u652f\u6301\u3002\u5728\u65e9\u671f\u9636\u6bb5\uff0c\u9879\u76ee\u65e8\u5728\u4fdd\u6301\u4e0e\u73b0\u6709\u540e\u7aef\u9002\u914d\u65b9\u6848\u7684\u517c\u5bb9\u6027\uff0c\u540c\u65f6\u7edf\u4e00\u4ee3\u7801\u5e93\uff0c\u5b9e\u73b0\u5feb\u901f\u7684\u5355\u7248\u672c\u591a\u540e\u7aef\u652f\u6301\u3002</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5c55\u671b<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>FlagTree \u5c06\u7ee7\u7eed\u6295\u5165 Triton \u751f\u6001\uff0c\u91cd\u70b9\u8ddf\u8e2a Triton \u7248\u672c\u66f4\u65b0\u3001\u96c6\u6210 AI \u82af\u7247\u540e\u7aef\u3001\u63d0\u5347\u7f16\u8bd1\u6548\u7387\u4ee5\u53ca\u589e\u5f3a\u8de8\u5e73\u53f0\u517c\u5bb9\u6027\u3002\u6b64\u5916\uff0cFlagTree \u5c06\u63a2\u7d22\u5728\u901a\u7528\u53ef\u7528\u6027\u4e0e\u82af\u7247\u7279\u5b9a\u4f18\u5316\u9700\u6c42\u4e4b\u95f4\u53d6\u5f97\u5e73\u8861\uff0c\u4e3a\u786c\u4ef6\u5b58\u50a8\u5c42\u7ea7\u3001\u5e76\u884c\u5c42\u7ea7\u548c\u52a0\u901f\u5355\u5143\u63d0\u4f9b\u517c\u5bb9\u7684\u8bed\u8a00\u7ea7\u7edf\u4e00\u62bd\u8c61\u548c\u663e\u5f0f\u89c4\u8303\u3002</p>"}
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
