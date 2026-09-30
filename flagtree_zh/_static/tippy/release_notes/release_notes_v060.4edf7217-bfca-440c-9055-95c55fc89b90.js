selector_to_html = {"a[href=\"../getting_started/install-arm64-cpu.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u5728 Arm64 CPU \u4e0a\u5b89\u88c5<a class=\"headerlink\" href=\"#arm64-cpu\" title=\"Link to this heading\">#</a></h1><p>\u5728 Arm64 CPU \u4e0a\u5b89\u88c5 FlagTree \u4e4b\u524d\uff0c\u8bf7\u9605\u8bfb\u4ee5\u4e0b\u6ce8\u610f\u4e8b\u9879\uff1a</p>", "a[href=\"../user_guide/use-tle-cpu.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\u4f7f\u7528 TLE-CPU<a class=\"headerlink\" href=\"#tle-cpu\" title=\"Link to this heading\">#</a></h1><p>\u672c\u8282\u4ecb\u7ecd\u5982\u4f55\u4f7f\u7528 TLE-CPU\u3002TLE-CPU \u5728 trition_3.3.x \u5206\u652f\u4e0a\u53ef\u7528\u3002</p><p>TLE-CPU \u63d0\u4f9b\u7edf\u4e00\u7684\u7f16\u7a0b\u8303\u5f0f\uff0c\u8986\u76d6\u591a\u6837\u5316\u7684\u8fb9\u7f18\u7aef CPU \u7b97\u529b\u3002\u5c06 TLE \u201c\u5728 <code class=\"docutils literal notranslate\"><span class=\"pre\">@triton.jit</span></code> \u4e4b\u4e0a\u5206\u5c42\u786c\u4ef6\u6df1\u5ea6\u4f18\u5316\u201d\u7684\u7406\u5ff5\u6269\u5c55\u5230 CPU\u3002\u9488\u5bf9\u8fb9\u7f18 AI \u788e\u7247\u5316\u7684 CPU \u751f\u6001\uff08Arm64 / RISC-V / x86\uff0c\u591a\u79cd ISA \u5e76\u5b58\uff09\uff0c\u4f7f\u7528\u76f8\u540c\u7684 Triton \u7f16\u7a0b\u6a21\u578b\u548c\u96c6\u6210\u6846\u67b6\u6765\u652f\u6301\u4e0d\u540c\u7684 ISA\uff1a\u7f16\u7a0b\u6a21\u578b\u548c\u6b63\u786e\u6027\u8de8 ISA \u5171\u4eab\uff08\u666e\u901a Triton \u901a\u8fc7 LLVM \u843d\u5230\u4efb\u610f ISA\uff09\uff0c\u800c\u6bcf\u4e2a ISA \u7684\u9ad8\u6027\u80fd\u5b9e\u73b0\uff08intrinsic / C \u8fd0\u884c\u65f6\uff09\u5219\u5206\u522b\u8d21\u732e\u3002\u6a21\u578b\u4ee3\u7801\u901a\u8fc7\u7b97\u5b50\u5e93\uff08FlagGems\uff09\u7684 vendor \u5206\u53d1\u8def\u7531\u5230\u5bf9\u5e94\u7684 ISA \u5b9e\u73b0\uff0c\u65e0\u9700\u611f\u77e5\u5177\u4f53 ISA\u3002CPU \u4e0e GPU \u7684\u5dee\u5f02\u51b3\u5b9a\u4e86\u5b83\u9700\u8981\u4e00\u4e2a\u72ec\u7acb\u7684\u6269\u5c55\u9762\uff1a</p>", "a[href=\"#flagtree-0-6-0\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.6.0 \u53d1\u5e03<a class=\"headerlink\" href=\"#flagtree-0-6-0\" title=\"Link to this heading\">#</a></h1>"}
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
