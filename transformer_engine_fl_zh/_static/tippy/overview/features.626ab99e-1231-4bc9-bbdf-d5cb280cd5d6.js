selector_to_html = {"a[href=\"#id1\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u7279\u6027<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h1><h2>\u591a\u540e\u7aef\u67b6\u6784<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>TransformerEngine-FL \u5f15\u5165\u4e86\u4e09\u5c42\u57fa\u4e8e\u63d2\u4ef6\u7684\u7b97\u5b50\u8c03\u5ea6\u7cfb\u7edf\uff0c\u5b9e\u73b0\u82af\u7247\u65e0\u5173\u7684 FP8 \u8bad\u7ec3\u548c\u63a8\u7406\uff1a</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6846\u67b6\u652f\u6301<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u591a\u4f9b\u5e94\u5546\u786c\u4ef6\u652f\u6301<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p>TransformerEngine-FL \u901a\u8fc7\u63d2\u4ef6\u7cfb\u7edf\u652f\u6301\u8de8\u591a\u4e2a\u786c\u4ef6\u4f9b\u5e94\u5546\u7684 FP8 \u8bad\u7ec3\u548c\u63a8\u7406\u3002\u65b0\u7684\u4f9b\u5e94\u5546\u540e\u7aef\u53ef\u4ee5\u901a\u8fc7\u63d2\u4ef6\u53d1\u73b0\u673a\u5236\u6dfb\u52a0\uff0c\u65e0\u9700\u4fee\u6539\u6838\u5fc3\u4ee3\u7801\u3002</p>", "a[href=\"#id5\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FP8 \u6536\u655b\u6027<a class=\"headerlink\" href=\"#id5\" title=\"Link to this heading\">#</a></h2><p>FP8 \u5df2\u5728\u4e0d\u540c\u6a21\u578b\u67b6\u6784\u548c\u914d\u7f6e\u4e0a\u8fdb\u884c\u4e86\u5e7f\u6cdb\u6d4b\u8bd5\uff0c\u6211\u4eec\u53d1\u73b0 FP8 \u548c BF16 \u8bad\u7ec3\u635f\u5931\u66f2\u7ebf\u4e4b\u95f4<strong>\u6ca1\u6709\u663e\u8457\u5dee\u5f02</strong>\u3002FP8 \u5728\u4e0b\u6e38 LLM \u4efb\u52a1\uff08\u4f8b\u5982 LAMBADA \u548c WikiText\uff09\u4e0a\u7684\u51c6\u786e\u6027\u4e5f\u5df2\u5f97\u5230\u9a8c\u8bc1\u3002</p><p>\u5df2\u9a8c\u8bc1\u7684\u6a21\u578b\uff1aT5\uff08770M\u300111B\uff09\u3001MPT\uff081.3B\u300113B\uff09\u3001GPT\uff085B\u300122B\u3001175B\uff09\u3001LLama2\uff087B\u300170B\uff09\u3002</p>", "a[href=\"#fp8\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FP8 \u8bad\u7ec3\u4e0e\u63a8\u7406<a class=\"headerlink\" href=\"#fp8\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u591a\u540e\u7aef\u67b6\u6784<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>TransformerEngine-FL \u5f15\u5165\u4e86\u4e09\u5c42\u57fa\u4e8e\u63d2\u4ef6\u7684\u7b97\u5b50\u8c03\u5ea6\u7cfb\u7edf\uff0c\u5b9e\u73b0\u82af\u7247\u65e0\u5173\u7684 FP8 \u8bad\u7ec3\u548c\u63a8\u7406\uff1a</p>"}
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
