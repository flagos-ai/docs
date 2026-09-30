selector_to_html = {"a[href=\"#source-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Source Code<a class=\"headerlink\" href=\"#source-code\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#labels\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Labels<a class=\"headerlink\" href=\"#labels\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">aten</span></code>, <code class=\"docutils literal notranslate\"><span class=\"pre\">KernelGen</span></code></p>", "a[href=\"#aten-mapping\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">ATen Mapping<a class=\"headerlink\" href=\"#aten-mapping\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#description\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Description<a class=\"headerlink\" href=\"#description\" title=\"Link to this heading\">#</a></h2><p>Second-order backward of a convolution, supporting both 1D (3-D operands\n[N, C, L]) and 2D (4-D operands [N, C, H, W]) cases. Given the gradients of\nthe first-order gradients (ggI, ggW, ggb) and the output gradient (gO),\nreturns the gradients of the scalar <code class=\"docutils literal notranslate\"><span class=\"pre\">&lt;gX,</span> <span class=\"pre\">ggI&gt;</span> <span class=\"pre\">+</span> <span class=\"pre\">&lt;gW,</span> <span class=\"pre\">ggW&gt;</span> <span class=\"pre\">+</span> <span class=\"pre\">&lt;gB,</span> <span class=\"pre\">ggb&gt;</span></code> with\nrespect to (gO, input, weight). The 2D path runs on Triton conv /\nconv-transpose kernels plus a custom Triton weight-gradient correlation\nkernel; 1D reuses the 2D path by unsqueezing the lone spatial axis\n(mirroring how <code class=\"docutils literal notranslate\"><span class=\"pre\">conv1d</span></code> delegates to <code class=\"docutils literal notranslate\"><span class=\"pre\">conv2d</span></code>). 3D (5-D operands) is not\nyet supported and raises <code class=\"docutils literal notranslate\"><span class=\"pre\">NotImplementedError</span></code>.</p>", "a[href=\"#convolution-double-backward\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">convolution_double_backward<a class=\"headerlink\" href=\"#convolution-double-backward\" title=\"Link to this heading\">#</a></h1><p><strong>Kind:</strong> Convolution | <strong>Stage:</strong> alpha | <strong>Since:</strong> 5.4</p>", "a[href=\"#tests\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Tests<a class=\"headerlink\" href=\"#tests\" title=\"Link to this heading\">#</a></h2>"}
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
