selector_to_html = {"a[href=\"#selective-operator-enablement\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Selective Operator Enablement<a class=\"headerlink\" href=\"#selective-operator-enablement\" title=\"Link to this heading\">#</a></h1><p>When enabling <em>FlagGems</em>, you can use several optional parameters for\nbetter control over how the operator acceleration is applied in your application.\nThis allows for more flexible integration and easier debugging or profiling\nwhen working with complex workflows.</p><p>Currently, <em>FlagGems</em> provides three ways for you to selectively enable or disable\ncertain operators.</p>"}
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
