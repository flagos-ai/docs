selector_to_html = {"a[href=\"#tutorials\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Tutorials<a class=\"headerlink\" href=\"#tutorials\" title=\"Link to this heading\">#</a></h1><p>The tutorial series teaches the concepts behind the runnable examples. Read the\nnotebooks in order as a new user, but each one also stands alone.</p>", "a[href=\"#recommended-smoke-runs\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Recommended smoke runs<a class=\"headerlink\" href=\"#recommended-smoke-runs\" title=\"Link to this heading\">#</a></h2><p>Examples report a correctness reference before speed: the VQE and MPS examples\nprint an exact dense ground-state energy for the small Hamiltonian plus the\nfinal energy gap, and the classifier compares against teacher-generated data.</p>", "a[href=\"#examples-beyond-the-tutorials\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Examples beyond the tutorials<a class=\"headerlink\" href=\"#examples-beyond-the-tutorials\" title=\"Link to this heading\">#</a></h2>"}
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
