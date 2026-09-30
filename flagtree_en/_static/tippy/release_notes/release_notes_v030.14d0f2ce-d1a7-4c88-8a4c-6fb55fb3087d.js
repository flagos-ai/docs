selector_to_html = {"a[href=\"#flagtree-0-3-0-release\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.3.0 release<a class=\"headerlink\" href=\"#flagtree-0-3-0-release\" title=\"Link to this heading\">#</a></h1><h2>Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2><p>FlagTree inherits capabilities from the previous version, continuously integrates new backends, and strengthens the ecosystem matrix. The project is currently in its early stage, aiming to be compatible with existing adaptation solutions for various chip backends, unify code repositories, create a collaborative code-building platform, and quickly achieve single-repository multi-backend support. Meanwhile, it continues to develop unified programming interface extensions, build intermediate layer representation and conversion extensions (FLIR), and enhance hardware awareness and compilation guidance support capabilities and scope (flagtree_hints).</p>", "a[href=\"#highlights\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2><p>FlagTree inherits capabilities from the previous version, continuously integrates new backends, and strengthens the ecosystem matrix. The project is currently in its early stage, aiming to be compatible with existing adaptation solutions for various chip backends, unify code repositories, create a collaborative code-building platform, and quickly achieve single-repository multi-backend support. Meanwhile, it continues to develop unified programming interface extensions, build intermediate layer representation and conversion extensions (FLIR), and enhance hardware awareness and compilation guidance support capabilities and scope (flagtree_hints).</p>", "a[href=\"#new-features\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">New features<a class=\"headerlink\" href=\"#new-features\" title=\"Link to this heading\">#</a></h2><p>Currently supported backends include triton_shared cpu, iluvatar, xpu (klx), mthreads, metax, aipu(arm npu), ascend npu &amp; cpu, tsingmicro, cambricon, <strong>hcu</strong>, with <strong>bold</strong> indicating newly added ones. <br/>\nEach new backend maintains the capabilities of the previous version: cross-platform compilation and rapid verification, plugin-based high-differentiation modules, CI/CD, and quality management capabilities. <br/></p>", "a[href=\"#looking-ahead\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Looking ahead<a class=\"headerlink\" href=\"#looking-ahead\" title=\"Link to this heading\">#</a></h2><p>Improving GPGPU backend integration, decoupling backend specialization from main code implementation to establish an engineering foundation for FlagTree\u2019s general extensions and optimizations. <br/>\nAiming to comprehensively cover various implementation styles in the operator library, enhancing FLIR compilation completeness to match multiple backend requirements and enable compilation for more backends. <br/>\nflagtree_hints will continue to explore operator performance optimization potential on different backends along both TritonGPU and Linalg compile-paths. <br/></p>"}
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
