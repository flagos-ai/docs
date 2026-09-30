selector_to_html = {"a[href=\"#project-structure\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Project structure<a class=\"headerlink\" href=\"#project-structure\" title=\"Link to this heading\">#</a></h1><p>Platform YAML files provide default dispatch policy for a detected platform. They are not a vendor validation matrix. Vendor-specific framework selection, runtime images, validation status, installation commands, and adaptation procedures are maintained on the centralized page: <a class=\"reference external\" href=\"https://flagos.io/resourcedownload?lang=en\">centralized vendor/framework/image-selection page</a>.</p>"}
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
