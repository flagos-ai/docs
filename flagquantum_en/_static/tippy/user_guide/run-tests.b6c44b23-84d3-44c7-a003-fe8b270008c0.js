selector_to_html = {"a[href=\"#what-each-tier-proves\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">What each tier proves<a class=\"headerlink\" href=\"#what-each-tier-proves\" title=\"Link to this heading\">#</a></h2><p>An empty marker selection is not verification. CPU distributed tests prove\nsemantics only and are never used as scalability release evidence.</p>", "a[href=\"#run-tests\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Run tests<a class=\"headerlink\" href=\"#run-tests\" title=\"Link to this heading\">#</a></h1><p>Install the development dependencies, then run the smallest meaningful tier\nfirst and expand by blast radius.</p>"}
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
