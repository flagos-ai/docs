selector_to_html = {"a[href=\"#real-quantum-hardware\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Real quantum hardware<a class=\"headerlink\" href=\"#real-quantum-hardware\" title=\"Link to this heading\">#</a></h2><p>Naming a compiler and a provider target explicitly keeps the journey\nfail-closed \u2014 the path never selects or substitutes a compiler or provider\nimplicitly:</p>", "a[href=\"#boundaries\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Boundaries<a class=\"headerlink\" href=\"#boundaries\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#deployment-packages\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Deployment packages<a class=\"headerlink\" href=\"#deployment-packages\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagquantum.deployment.create_deployment_package</span></code> binds trained parameters,\ncompiles for a target and seals an auditable package that can be persisted,\nsigned or submitted later. Preflight validates the program against a target and\nidentity-checks the exact package without contacting a provider:</p>", "a[href=\"#remote-jobs\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Remote jobs<a class=\"headerlink\" href=\"#remote-jobs\" title=\"Link to this heading\">#</a></h2><p>Renderer-side submission is convenient for Notebooks: <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.run()</span></code> waits for a\nresult, while <code class=\"docutils literal notranslate\"><span class=\"pre\">fq.submit()</span></code> returns as soon as preparation and the provider\u2019s\nacknowledgement finish, so the kernel stays available while a task is queued.</p>", "a[href=\"#hardware-and-remote-targets\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Hardware and remote targets<a class=\"headerlink\" href=\"#hardware-and-remote-targets\" title=\"Link to this heading\">#</a></h1><p>FlagQuantum runs the same program on locally controlled resources and on\nexternal execution destinations. The two are named differently on purpose:\n<code class=\"docutils literal notranslate\"><span class=\"pre\">ExecutionOptions</span></code> describes the current process\u2019s devices, while <code class=\"docutils literal notranslate\"><span class=\"pre\">target</span></code>\nnames an external system.</p>", "a[href=\"#flagos-accelerators-through-torch-fl\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">FlagOS accelerators through Torch-FL<a class=\"headerlink\" href=\"#flagos-accelerators-through-torch-fl\" title=\"Link to this heading\">#</a></h2><p><code class=\"docutils literal notranslate\"><span class=\"pre\">flagquantum</span></code> depends on PyTorch, not Torch-FL. Importing FlagQuantum, querying\nbackends or running CPU and CUDA never imports <code class=\"docutils literal notranslate\"><span class=\"pre\">torch_fl</span></code>; the optional provider\nis activated only when <code class=\"docutils literal notranslate\"><span class=\"pre\">flagos</span></code> is explicitly selected, and an absent or\nincompatible Torch-FL installation fails at activation with a diagnostic error\ninstead of disabling CPU or CUDA.</p>"}
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
