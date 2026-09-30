selector_to_html = {"a[href=\"#features\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Features<a class=\"headerlink\" href=\"#features\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flagaudio-overview\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagAudio Overview<a class=\"headerlink\" href=\"#flagaudio-overview\" title=\"Link to this heading\">#</a></h1><p>FlagAudio is part of <a class=\"reference external\" href=\"https://flagos.io/Home\">FlagOS</a>. FlagAudio is a multi-backend computing library that adheres to Audio standard interfaces. It delivers a high-performance computing solution designed for audio signal processing and speech AI applications, offering a complete processing chain from raw audio to model input.</p><p>FlagAudio is a high-performance general-purpose operator library implemented using the <a class=\"reference external\" href=\"https://github.com/triton-lang/triton\">Triton programming language</a> launched by OpenAI.</p>"}
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
