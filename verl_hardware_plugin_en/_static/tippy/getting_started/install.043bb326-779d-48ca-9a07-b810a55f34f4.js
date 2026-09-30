selector_to_html = {"a[href=\"#platform-specific-setup\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Platform-Specific Setup<a class=\"headerlink\" href=\"#platform-specific-setup\" title=\"Link to this heading\">#</a></h2><p>Each hardware platform has its own base image, driver mounts, and environment requirements. Use the vendor-provided container images where available.</p>", "a[href=\"#prerequisites\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Prerequisites<a class=\"headerlink\" href=\"#prerequisites\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#preparing-data-and-models\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Preparing Data and Models<a class=\"headerlink\" href=\"#preparing-data-and-models\" title=\"Link to this heading\">#</a></h2><p>The platform guides use Qwen3-0.6B and GSM8K as the reference end-to-end example:</p>", "a[href=\"../user_guide/user-guide.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">User Guide<a class=\"headerlink\" href=\"#user-guide\" title=\"Link to this heading\">#</a></h1><p>This section provides guidance on running verl RL post-training workloads across hardware platforms with verl-hardware-plugin.</p>", "a[href=\"../references/reference.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">References<a class=\"headerlink\" href=\"#references\" title=\"Link to this heading\">#</a></h1><h2>Project Links<a class=\"headerlink\" href=\"#project-links\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#platform-selection\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Platform Selection<a class=\"headerlink\" href=\"#platform-selection\" title=\"Link to this heading\">#</a></h2><p>The platform is auto-detected at startup. You can override it with the <code class=\"docutils literal notranslate\"><span class=\"pre\">VERL_PLATFORM</span></code> environment variable:</p>", "a[href=\"#install-from-source\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Install from Source<a class=\"headerlink\" href=\"#install-from-source\" title=\"Link to this heading\">#</a></h2><p>After installation, no additional configuration in verl is required. When verl starts, it imports all packages registered under the <code class=\"docutils literal notranslate\"><span class=\"pre\">verl.plugins</span></code> group, which triggers registration of all platforms and engines.</p><p>To verify registration:</p>", "a[href=\"#installation\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Installation<a class=\"headerlink\" href=\"#installation\" title=\"Link to this heading\">#</a></h1><p>verl-hardware-plugin is installed as a Python package and discovered by verl automatically through the <code class=\"docutils literal notranslate\"><span class=\"pre\">verl.plugins</span></code> entry-points group.</p>"}
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
