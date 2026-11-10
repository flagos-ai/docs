selector_to_html = {"a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u91c7\u96c6\u7b49\u7ea7<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">level</span></code> \u548c <code class=\"docutils literal notranslate\"><span class=\"pre\">addr_level</span></code> \u5c5e\u4e8e\u91c7\u96c6\u7b56\u7565\uff0c\u901a\u8fc7 <code class=\"docutils literal notranslate\"><span class=\"pre\">activate()</span></code> \u914d\u7f6e\uff1a</p>", "a[href=\"#id4\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u53ef\u7528\u6027<a class=\"headerlink\" href=\"#id4\" title=\"Link to this heading\">#</a></h2><p>\u6210\u529f\u5bfc\u5165\u540e\uff0c<code class=\"docutils literal notranslate\"><span class=\"pre\">debugger.is_available()</span></code> \u53ef\u68c0\u67e5\u7f16\u8bd1\u5668\u548c\u8fd0\u884c\u65f6 native binding \u662f\u5426\u540c\u65f6\u53ef\u7528\u3002core-only wheel\uff08<code class=\"docutils literal notranslate\"><span class=\"pre\">TRITON_BUILD_FLAGPRISM=OFF</span></code>\uff09\u4e0d\u5305\u542b <code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree.debugger</span></code>\u3002</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5feb\u901f\u5f00\u59cb<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>\u5e94\u5728\u7f16\u8bd1\u9700\u8981\u8c03\u8bd5\u7684 kernel \u4e4b\u524d\u8c03\u7528 <code class=\"docutils literal notranslate\"><span class=\"pre\">debugger.activate()</span></code>\u3002\u5b83\u5f00\u542f\u8fdb\u7a0b\u7ea7 Debugger pipeline\uff0c\u4f46\u4e0d\u8bb0\u5f55 Python\u3001PyTorch \u6216 <code class=\"docutils literal notranslate\"><span class=\"pre\">torch_npu</span></code> operation\uff1b\u53ea\u6709 collect marker \u4e4b\u95f4\u7684 Triton operation \u624d\u4f1a\u88ab\u91c7\u96c6\u3002</p>", "a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u914d\u7f6e<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">debugger.configure()</span></code> \u4fee\u6539\u540e\u7eed <code class=\"docutils literal notranslate\"><span class=\"pre\">activate()</span></code> \u4f7f\u7528\u7684\u9ed8\u8ba4\u914d\u7f6e\uff0c\u672a\u4f20\u5165\u7684\u5b57\u6bb5\u4fdd\u6301\u5f53\u524d\u503c\u3002</p>", "a[href=\"#api\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u516c\u5f00 API<a class=\"headerlink\" href=\"#api\" title=\"Link to this heading\">#</a></h2><p>\u552f\u4e00\u7684\u516c\u5f00 Python \u5bfc\u5165\u8def\u5f84\u662f\uff1a</p>", "a[href=\"#debugger\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Debugger<a class=\"headerlink\" href=\"#debugger\" title=\"Link to this heading\">#</a></h1><p>FlagPrism Debugger \u7528\u4e8e\u89c2\u5bdf Triton kernel \u5185\u90e8\u7684\u6570\u503c\u3001\u5185\u5b58\u8bbf\u95ee\u548c operation \u6267\u884c\u72b6\u6001\u3002\u5b83\u5c06\u7f16\u8bd1\u671f\u9759\u6001 metadata \u4e0e device \u8fd0\u884c\u671f\u8bb0\u5f55\u5173\u8054\uff0c\u5bfc\u51fa Triton \u8bed\u53e5\u7ea7\u62a5\u544a\u3001IR op \u7ea7\u62a5\u544a\u548c level-2 NumPy artifact\uff0c\u7528\u4e8e\u5b9a\u4f4d\u6570\u503c\u5f02\u5e38\u3001\u5f02\u5e38\u8bbf\u5b58\u548c kernel \u5185\u90e8\u6570\u636e\u6d41\u95ee\u9898\u3002</p><p>\u52a8\u6001\u91c7\u96c6\u548c hidden-argument launch \u8def\u5f84\u5df2\u5728\u6607\u817e/CANN9\u3001\u5929\u6570/CoreX 4.4\uff08LLVM 22\uff09\u3001MUSA/mthreads 4.3.5 \u4e0e NVIDIA CUDA \u540e\u7aef\u9a8c\u8bc1\u3002</p>"}
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
