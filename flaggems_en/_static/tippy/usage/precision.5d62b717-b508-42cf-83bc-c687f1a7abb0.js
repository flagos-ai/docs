selector_to_html = {"a[href=\"#how-to-enable\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">How to Enable<a class=\"headerlink\" href=\"#how-to-enable\" title=\"Link to this heading\">#</a></h2><p>Enabling precision checking requires two steps:</p>", "a[href=\"#disabling\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Disabling<a class=\"headerlink\" href=\"#disabling\" title=\"Link to this heading\">#</a></h2><p>To disable precision checking at runtime:</p>", "a[href=\"#configuration\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Configuration<a class=\"headerlink\" href=\"#configuration\" title=\"Link to this heading\">#</a></h2><p>You can customize the precision checking behavior by passing parameters\nto <code class=\"docutils literal notranslate\"><span class=\"pre\">enable_precision_check()</span></code>.</p>", "a[href=\"#precision-checking-experimental\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Precision Checking (Experimental)<a class=\"headerlink\" href=\"#precision-checking-experimental\" title=\"Link to this heading\">#</a></h1><p>FlagGems provides an experimental precision-checking mechanism that\nautomatically compares the output of FlagGems operators against native\nPyTorch (CPU) results, and logs any discrepancies to a file.\nThis is useful for verifying numerical correctness during development.</p>", "a[href=\"#log-output\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Log Output<a class=\"headerlink\" href=\"#log-output\" title=\"Link to this heading\">#</a></h2><p>Precision check results are written to <code class=\"docutils literal notranslate\"><span class=\"pre\">~/.flaggems/precision.log</span></code> by default.\nOnly operators that fail the tolerance check will be logged.</p><p>Sample log content:</p>", "a[href=\"#behavior-details\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Behavior Details<a class=\"headerlink\" href=\"#behavior-details\" title=\"Link to this heading\">#</a></h2><p>The precision checker has several built-in safeguards to minimize\nperformance impact:</p>", "a[href=\"#how-it-works\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">How It Works<a class=\"headerlink\" href=\"#how-it-works\" title=\"Link to this heading\">#</a></h2><p>When <code class=\"docutils literal notranslate\"><span class=\"pre\">PrecisionCheckRegister</span></code> is used as the registrar, each operator\nis wrapped with a precision-checking decorator. The wrapper:</p>"}
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
