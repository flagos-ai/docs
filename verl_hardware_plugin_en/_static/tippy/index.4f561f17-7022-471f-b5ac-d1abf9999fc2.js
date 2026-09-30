selector_to_html = {"a[href=\"getting_started/getting-started.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Getting Started with verl-hardware-plugin<a class=\"headerlink\" href=\"#getting-started-with-verl-hardware-plugin\" title=\"Link to this heading\">#</a></h1><p>This section covers the requirements for installing verl-hardware-plugin and guides you through installing it on different hardware platforms.</p>", "a[href=\"overview/overview.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-hardware-plugin Overview<a class=\"headerlink\" href=\"#verl-hardware-plugin-overview\" title=\"Link to this heading\">#</a></h1><p>verl-hardware-plugin provides <strong>reference implementations</strong> of multi-chip hardware platforms and training engines for <a class=\"reference external\" href=\"https://github.com/verl-project/verl\">verl</a>, the RL post-training framework. It supplies platform abstractions and training engine extensions for non-CUDA accelerators, and serves as a template for hardware vendors to adapt verl to their own devices through a unified plugin interface.</p><p>The repository is jointly developed by the ByteDance verl team and the <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a> community.</p>", "a[href=\"#verl-hardware-plugin-documentation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-hardware-plugin Documentation<a class=\"headerlink\" href=\"#verl-hardware-plugin-documentation\" title=\"Link to this heading\">#</a></h1><p>verl-hardware-plugin provides multi-chip hardware platform and engine plugins for <a class=\"reference external\" href=\"https://github.com/verl-project/verl\">verl</a>. It is jointly developed by the ByteDance verl team and the <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a> community, and allows the same RL post-training code to run on NVIDIA, MetaX, Iluvatar, Cambricon MLU, Enflame, and Intel XPU hardware.</p><p><a class=\"sd-sphinx-override sd-btn sd-text-wrap sd-btn-primary sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold reference internal\" href=\"getting_started/getting-started.html\"><span class=\"doc std std-doc\">Getting Started</span></a></p>", "a[href=\"user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">User Guide<a class=\"headerlink\" href=\"#user-guide\" title=\"Link to this heading\">#</a></h1><p>This section provides guidance on running verl RL post-training workloads across hardware platforms with verl-hardware-plugin.</p>"}
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
