selector_to_html = {"a[href=\"environment-variables.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Environment Variables<a class=\"headerlink\" href=\"#environment-variables\" title=\"Link to this heading\">#</a></h1><p>Torch-FL has one namespace of its own, <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_*</span></code>, plus a second set belonging to other projects (torch, FlagGems, FlagCX, TileLang, vendor SDKs) that it reads but does not own. This page documents the variables a user configures; the authoritative, complete list is the <code class=\"docutils literal notranslate\"><span class=\"pre\">VARIABLES</span></code> registry in <code class=\"docutils literal notranslate\"><span class=\"pre\">torch_fl/_env.py</span></code>, checked against the upstream <code class=\"docutils literal notranslate\"><span class=\"pre\">docs/reference/environment-variables.md</span></code> by a unit test.</p><p>Nothing here is required to run a wheel: a wheel routes, compiles and runs with an empty environment. These variables select a different build, override a setting for measurement, or turn on a diagnostic.</p>", "a[href=\"compatibility.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Compatibility and Platform Support<a class=\"headerlink\" href=\"#compatibility-and-platform-support\" title=\"Link to this heading\">#</a></h1><h2>Status definitions<a class=\"headerlink\" href=\"#status-definitions\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#intentional-asymmetries\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Intentional asymmetries<a class=\"headerlink\" href=\"#intentional-asymmetries\" title=\"Link to this heading\">#</a></h2><p>These are design decisions, not gaps waiting to be filled:</p>", "a[href=\"#device-runtime-and-python-layers\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Device runtime and Python layers<a class=\"headerlink\" href=\"#device-runtime-and-python-layers\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#kernel-sets\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Kernel sets<a class=\"headerlink\" href=\"#kernel-sets\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_BUILD_*</span></code> switches decide which kernel sets a wheel compiles. Which are on by default is a property of the platform, not a per-build choice:</p>", "a[href=\"#operator-path\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Operator path<a class=\"headerlink\" href=\"#operator-path\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#platform-capability-matrix\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Platform capability matrix<a class=\"headerlink\" href=\"#platform-capability-matrix\" title=\"Link to this heading\">#</a></h1><p>What each <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGOS_ACCELERATOR</span></code> value actually provides: which operator path its wheels build, where its device runtime comes from, and which routing decisions it makes by default. This is the per-platform answer to \u201cdoes my accelerator support X at all\u201d, one level below the <a class=\"reference internal\" href=\"compatibility.html\"><span class=\"doc\">compatibility matrix</span></a> (which reports validation status per capability).</p>"}
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
