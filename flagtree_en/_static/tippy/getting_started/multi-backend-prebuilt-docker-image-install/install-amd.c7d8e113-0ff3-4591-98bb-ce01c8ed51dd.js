selector_to_html = {"a[href=\"#source-free-installation-for-triton-3-6\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">1.2 Source-free Installation (for Triton 3.6)<a class=\"headerlink\" href=\"#source-free-installation-for-triton-3-6\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#manually-download-the-triton-dependencies\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">2.2 Manually download the Triton dependencies<a class=\"headerlink\" href=\"#manually-download-the-triton-dependencies\" title=\"Link to this heading\">#</a></h3><p>The Triton dependencies are already downloaded and installed in the image.\nIf your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.</p>", "a[href=\"#quick-start\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. Quick start<a class=\"headerlink\" href=\"#quick-start\" title=\"Link to this heading\">#</a></h2><h3>1.1 Use the image (for Triton 3.6)<a class=\"headerlink\" href=\"#use-the-image-for-triton-3-6\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#build-from-source\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. Build from Source<a class=\"headerlink\" href=\"#build-from-source\" title=\"Link to this heading\">#</a></h2><h3>2.1 Manually download the LLVM<a class=\"headerlink\" href=\"#manually-download-the-llvm\" title=\"Link to this heading\">#</a></h3><p>If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.</p>", "a[href=\"#amd-amd\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">\ud83d\udcab AMD <a class=\"reference external\" href=\"https://github.com/flagos-ai/FlagTree/tree/main/third_party/amd/\">amd</a><a class=\"headerlink\" href=\"#amd-amd\" title=\"Link to this heading\">#</a></h1><h2>1. Quick start<a class=\"headerlink\" href=\"#quick-start\" title=\"Link to this heading\">#</a></h2><h3>1.1 Use the image (for Triton 3.6)<a class=\"headerlink\" href=\"#use-the-image-for-triton-3-6\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#testing-and-validation\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">3. Testing and validation<a class=\"headerlink\" href=\"#testing-and-validation\" title=\"Link to this heading\">#</a></h2><p>After installing <code class=\"docutils literal notranslate\"><span class=\"pre\">flagtree</span></code>, you can check it with:</p>", "a[href=\"#manually-download-the-llvm\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">2.1 Manually download the LLVM<a class=\"headerlink\" href=\"#manually-download-the-llvm\" title=\"Link to this heading\">#</a></h3><p>If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.</p>", "a[href=\"#build-commands\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">2.3 Build Commands<a class=\"headerlink\" href=\"#build-commands\" title=\"Link to this heading\">#</a></h3>", "a[href=\"#use-the-image-for-triton-3-6\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">1.1 Use the image (for Triton 3.6)<a class=\"headerlink\" href=\"#use-the-image-for-triton-3-6\" title=\"Link to this heading\">#</a></h3>"}
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
