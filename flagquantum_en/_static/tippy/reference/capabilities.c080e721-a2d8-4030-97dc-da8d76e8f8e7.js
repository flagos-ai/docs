selector_to_html = {"a[href=\"#distributed-and-flagos-execution\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Distributed and FlagOS execution<a class=\"headerlink\" href=\"#distributed-and-flagos-execution\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#deployment-interoperability-and-research-surfaces\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Deployment, interoperability and research surfaces<a class=\"headerlink\" href=\"#deployment-interoperability-and-research-surfaces\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#validated-public-performance-claims\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Validated public performance claims<a class=\"headerlink\" href=\"#validated-public-performance-claims\" title=\"Link to this heading\">#</a></h2><p>Where FlagQuantum publishes a measured performance claim, it names the raw\nartifact, its digest, the recorded environment and the exact scope, and it\ninherits the maturity of the capability it belongs to. Claims without an\naudited artifact are not made here.</p>", "a[href=\"#how-to-read-maturity\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">How to read maturity<a class=\"headerlink\" href=\"#how-to-read-maturity\" title=\"Link to this heading\">#</a></h2><p>Maturity applies only to the scope stated for each capability. A local,\nreplicated, sliced or planned execution path is not distributed scalability\nevidence. A stable public API does not promote an experimental backend.</p>", "a[href=\"#build-simulation-and-training\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Build, simulation and training<a class=\"headerlink\" href=\"#build-simulation-and-training\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#capability-reference\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Capability reference<a class=\"headerlink\" href=\"#capability-reference\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum publishes the maturity of every capability instead of implying it\nfrom an example. This page is a summary; the repository\u2019s machine-validated\ncapability matrix is authoritative.</p>"}
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
