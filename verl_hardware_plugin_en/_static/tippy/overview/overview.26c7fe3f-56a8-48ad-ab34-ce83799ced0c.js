selector_to_html = {"a[href=\"features.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h1><h2>Hardware-Agnostic Platform Abstraction<a class=\"headerlink\" href=\"#hardware-agnostic-platform-abstraction\" title=\"Link to this heading\">#</a></h2><p>Through the unified <code class=\"docutils literal notranslate\"><span class=\"pre\">PlatformBase</span></code> interface, hardware-specific logic for device management, collective communication, memory management, profiling, and rollout environment variables is abstracted into standard methods. A vendor only needs to implement one platform class and register it with <code class=\"docutils literal notranslate\"><span class=\"pre\">@PlatformRegistry.register</span></code> to integrate with verl.</p><p>For CUDA-compatible hardware such as MetaX and Iluvatar, <code class=\"docutils literal notranslate\"><span class=\"pre\">torch.cuda.is_available()</span></code> returns True on multiple chips. The platform layer introduces a <code class=\"docutils literal notranslate\"><span class=\"pre\">vendor_name</span></code> identifier and SMI-based hardware detection (for example <code class=\"docutils literal notranslate\"><span class=\"pre\">mx-smi</span></code> for MetaX and <code class=\"docutils literal notranslate\"><span class=\"pre\">ixsmi</span></code> for Iluvatar) to distinguish the actual hardware during first-time auto-detection and avoid mismatching the NVIDIA engine.</p>", "a[href=\"#architecture\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Architecture<a class=\"headerlink\" href=\"#architecture\" title=\"Link to this heading\">#</a></h2><p>The plugin integrates with verl through two registries:</p>", "a[href=\"#supported-hardware\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Supported Hardware<a class=\"headerlink\" href=\"#supported-hardware\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#relationship-to-verl-and-verl-fl\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Relationship to verl and verl-FL<a class=\"headerlink\" href=\"#relationship-to-verl-and-verl-fl\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#verl-hardware-plugin-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">verl-hardware-plugin Overview<a class=\"headerlink\" href=\"#verl-hardware-plugin-overview\" title=\"Link to this heading\">#</a></h1><p>verl-hardware-plugin provides <strong>reference implementations</strong> of multi-chip hardware platforms and training engines for <a class=\"reference external\" href=\"https://github.com/verl-project/verl\">verl</a>, the RL post-training framework. It supplies platform abstractions and training engine extensions for non-CUDA accelerators, and serves as a template for hardware vendors to adapt verl to their own devices through a unified plugin interface.</p><p>The repository is jointly developed by the ByteDance verl team and the <a class=\"reference external\" href=\"https://github.com/flagos-ai\">FlagOS</a> community.</p>"}
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
