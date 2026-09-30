selector_to_html = {"a[href=\"paddle/README.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Training Models with Paddle and FlagCX<a class=\"headerlink\" href=\"#training-models-with-paddle-and-flagcx\" title=\"Link to this heading\">#</a></h1><p>FlagCX is now fully integrated into Paddle as an <strong>optional high-performance communication backend</strong>. This integration enables efficient distributed training on multiple hardware platforms, including support for <strong>heterogeneous training</strong> on Nvidia and Iluvatar GPUs.</p><p>Use the guides below to quickly get started with training models using Paddle + FlagCX.</p>", "a[href=\"#flagcx-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagCX Documentation<a class=\"headerlink\" href=\"#flagcx-documentation\" title=\"Link to this heading\">#</a></h1><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">User Guide<a class=\"headerlink\" href=\"#user-guide\" title=\"Link to this heading\">#</a></h1><h2>Environment configuration<a class=\"headerlink\" href=\"#environment-configuration\" title=\"Link to this heading\">#</a></h2><p>Refer to the environment setup section in the <a class=\"reference internal\" href=\"getting-started.html\"><span class=\"std std-doc\">Getting Started</span></a> page.</p>", "a[href=\"flagcx_overview/flagcx-overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Overview<a class=\"headerlink\" href=\"#overview\" title=\"Link to this heading\">#</a></h1><p>FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.</p><p>FlagCX leverages native collective communication libraries to provide full single-chip communication support across platforms. Beyond its native x-CCL integrations, FlagCX introduces original device-buffer IPC and device-buffer RDMA technologies, enabling high-performance P2P operations for both cross-chip and single-chip scenarios. These mechanisms can be seamlessly combined with native x-CCL backends to deliver optimized performance for cross-chip collective communications.</p>", "a[href=\"getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started<a class=\"headerlink\" href=\"#getting-started\" title=\"Link to this heading\">#</a></h1><h2>Environment setup<a class=\"headerlink\" href=\"#environment-setup\" title=\"Link to this heading\">#</a></h2><p><strong>Reference Command for Container Creation:</strong></p><p>Modify the <code class=\"docutils literal notranslate\"><span class=\"pre\">&lt;Docker</span> <span class=\"pre\">name&gt;</span> <span class=\"pre\">&lt;mount</span> <span class=\"pre\">directory&gt;</span> <span class=\"pre\">&lt;mount</span> <span class=\"pre\">point&gt;</span></code> and choose the <code class=\"docutils literal notranslate\"><span class=\"pre\">&lt;Docker</span> <span class=\"pre\">Image&gt;</span></code> as needed.</p>"}
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
