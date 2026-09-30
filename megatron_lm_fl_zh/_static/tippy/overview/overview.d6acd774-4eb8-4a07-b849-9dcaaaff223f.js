selector_to_html = {"a[href=\"#megatron-lm-fl\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Megatron-LM-FL \u6982\u89c8<a class=\"headerlink\" href=\"#megatron-lm-fl\" title=\"Link to this heading\">#</a></h1><p>Megatron-LM-FL \u662f <a class=\"reference external\" href=\"https://github.com/NVIDIA/Megatron-LM\">NVIDIA Megatron-LM</a> \u7684\u4e00\u4e2a\u5206\u652f\uff0c\u5f15\u5165\u4e86<strong>\u57fa\u4e8e\u63d2\u4ef6\u7684\u67b6\u6784</strong>\u4ee5\u652f\u6301\u591a\u79cd AI \u82af\u7247\uff0c\u6784\u5efa\u5728 <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a>\uff08\u7edf\u4e00\u5f00\u6e90 AI \u7cfb\u7edf\u8f6f\u4ef6\u6808\uff09\u4e4b\u4e0a\u3002</p><p>\u4e0a\u6e38 Megatron-LM \u4e13\u4e3a NVIDIA GPU \u4f18\u5316\uff0c\u800c Megatron-LM-FL \u901a\u8fc7\u786c\u4ef6\u62bd\u8c61\u5c42\u5c06\u5176\u6269\u5c55\uff0c\u4f7f\u5176\u80fd\u591f\u5728\u591a\u4e2a\u5e73\u53f0\u4e0a\u8fdb\u884c\u8bad\u7ec3 \u2014 \u5305\u62ec NVIDIA\uff08CUDA\uff09\u3001MetaX\u3001Moore Threads\uff08MUSA\uff09\u3001TXDA\uff08Tsingmicro\uff09\u548c NPU\uff08Ascend\uff09\u2014 \u540c\u65f6\u5bf9\u6838\u5fc3\u5e93\u7684\u4ee3\u7801\u4fb5\u5165\u6700\u5c0f\u3002</p>"}
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
