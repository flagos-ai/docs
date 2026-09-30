selector_to_html = {"a[href=\"#inspect-without-executing\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Inspect without executing<a class=\"headerlink\" href=\"#inspect-without-executing\" title=\"Link to this heading\">#</a></h2><p>When you only need the decision, use the circuit-level planner:</p>", "a[href=\"#local-options-and-remote-targets\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Local options and remote targets<a class=\"headerlink\" href=\"#local-options-and-remote-targets\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">fq.ExecutionOptions</span></code> describes resources controlled by the current process,\nsuch as <code class=\"docutils literal notranslate\"><span class=\"pre\">device=\"cuda:0\"</span></code> or a simulation <code class=\"docutils literal notranslate\"><span class=\"pre\">mode</span></code>. The <code class=\"docutils literal notranslate\"><span class=\"pre\">target</span></code> argument is\nreserved for external execution destinations such as a Jiuding workspace or a\nQuafu backend. See <a class=\"reference internal\" href=\"hardware-and-remote.html\"><span class=\"std std-doc\">Hardware and remote targets</span></a>.</p>", "a[href=\"hardware-and-remote.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Hardware and remote targets<a class=\"headerlink\" href=\"#hardware-and-remote-targets\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum runs the same program on locally controlled resources and on\nexternal execution destinations. The two are named differently on purpose:\n<code class=\"docutils literal notranslate\"><span class=\"pre\">ExecutionOptions</span></code> describes the current process\u2019s devices, while <code class=\"docutils literal notranslate\"><span class=\"pre\">target</span></code>\nnames an external system.</p>", "a[href=\"#basic-usage\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Basic usage<a class=\"headerlink\" href=\"#basic-usage\" title=\"Link to this heading\">#</a></h1><p>Create a circuit, inspect its plan, execute it and read the result. This is the\nshortest complete journey through the stable API.</p>", "a[href=\"#plan-then-execute-the-same-plan\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Plan, then execute the same plan<a class=\"headerlink\" href=\"#plan-then-execute-the-same-plan\" title=\"Link to this heading\">#</a></h2><p>Planning explains what will run and why. Passing the plan to <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.run</span></code> executes\nthat exact plan without replanning or recompiling, and <code class=\"docutils literal notranslate\"><span class=\"pre\">result.plan</span> <span class=\"pre\">is</span> <span class=\"pre\">plan</span></code>\nholds in the same process. Plan identity covers the canonical IR, resolved\nexecution semantics, compiler pipeline, required environment and the selected\ndecision, and it survives a JSON round trip:</p>"}
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
