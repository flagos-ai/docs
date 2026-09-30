selector_to_html = {"a[href=\"#packaging\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Packaging<a class=\"headerlink\" href=\"#packaging\" title=\"Link to this heading\">#</a></h1><p>Creating a source or binary distribution is similar to\n<a class=\"reference internal\" href=\"#../installation/#install-from-source\"><span class=\"xref myst\">building and installing from source</span></a>.\nIt involves invoking a build-frontend (such as <code class=\"docutils literal notranslate\"><span class=\"pre\">pip</span></code> or <code class=\"docutils literal notranslate\"><span class=\"pre\">build</span></code>) and pass the command\nto the build-backend (<code class=\"docutils literal notranslate\"><span class=\"pre\">scikit-build-core</span></code> here).</p>", "a[href=\"#using-the-pip-build-frontend\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. Using the <code class=\"docutils literal notranslate\"><span class=\"pre\">pip</span></code> build frontend<a class=\"headerlink\" href=\"#using-the-pip-build-frontend\" title=\"Link to this heading\">#</a></h2><p>Alternatively, you can build a wheel with <code class=\"docutils literal notranslate\"><span class=\"pre\">pip</span></code>:</p>", "a[href=\"#using-the-build-build-frontend\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. Using the <code class=\"docutils literal notranslate\"><span class=\"pre\">build</span></code> build frontend<a class=\"headerlink\" href=\"#using-the-build-build-frontend\" title=\"Link to this heading\">#</a></h2><p>To build a wheel with the <code class=\"docutils literal notranslate\"><span class=\"pre\">build</span></code> package (recommended).</p>"}
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
