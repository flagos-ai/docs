selector_to_html = {"a[href=\"#user-interface-layer-uil\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">User Interface Layer (UIL)<a class=\"headerlink\" href=\"#user-interface-layer-uil\" title=\"Link to this heading\">#</a></h3><p>The public C API defined in <code class=\"docutils literal notranslate\"><span class=\"pre\">flagcx/include/flagcx.h</span></code>. It exposes:</p>", "a[href=\"#portable-abstraction-layer-pal\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Portable Abstraction Layer (PAL)<a class=\"headerlink\" href=\"#portable-abstraction-layer-pal\" title=\"Link to this heading\">#</a></h3><p>Hardware abstraction via the adaptor pattern. Each build selects exactly one device adaptor and two CCL adaptors (host + device):</p>", "a[href=\"#architecture\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Architecture<a class=\"headerlink\" href=\"#architecture\" title=\"Link to this heading\">#</a></h2><p>FlagCX is organized into three layers:</p>", "a[href=\"#overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Overview<a class=\"headerlink\" href=\"#overview\" title=\"Link to this heading\">#</a></h1><p>FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.</p><p>FlagCX leverages native collective communication libraries to provide full single-chip communication support across platforms. Beyond its native x-CCL integrations, FlagCX introduces original device-buffer IPC and device-buffer RDMA technologies, enabling high-performance P2P operations for both cross-chip and single-chip scenarios. These mechanisms can be seamlessly combined with native x-CCL backends to deliver optimized performance for cross-chip collective communications.</p>", "a[href=\"application-integration.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Application integration<a class=\"headerlink\" href=\"#application-integration\" title=\"Link to this heading\">#</a></h1><p>FlagCX integrates with upper-layer applications such as <a class=\"reference external\" href=\"https://pytorch.org/\">PyTorch</a> and\n<a class=\"reference external\" href=\"https://github.com/PaddlePaddle/\">PaddlePaddle</a>.\nThe table below lists the frameworks supported by FlagCX and their related communication operations,\nwhere the <code class=\"docutils literal notranslate\"><span class=\"pre\">batch_XXX</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">XXX_coalesced</span></code> ops refer to the usage of group primitives.</p>", "a[href=\"backend-support.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Backend support<a class=\"headerlink\" href=\"#backend-support\" title=\"Link to this heading\">#</a></h1><p>The following table summarizes the currently supported communication backends and their corresponding capabilities.</p>", "a[href=\"#communication-runtime-layer-crl\"]": "<h3 class=\"tippy-header\" style=\"margin-top: 0;\">Communication Runtime Layer (CRL)<a class=\"headerlink\" href=\"#communication-runtime-layer-crl\" title=\"Link to this heading\">#</a></h3><p>The runtime implements four execution strategies (runners), selected based on communicator type and environment configuration:</p>"}
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
