selector_to_html = {"a[href=\"#flagtree-0-2-0-release\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.2.0 release<a class=\"headerlink\" href=\"#flagtree-0-2-0-release\" title=\"Link to this heading\">#</a></h1><h2>Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2><p>FlagTree inherits capabilities from the previous version, continuously integrates new backends, expands support for Triton versions, and provides hardware-aware optimization capabilities. The project is currently in its early stages, aiming to be compatible with existing adaptation solutions for various AI chip backends, unify the code repository, build a code co-construction platform, and quickly implement multi-backend support in a single repository.</p>", "a[href=\"#highlights\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Highlights<a class=\"headerlink\" href=\"#highlights\" title=\"Link to this heading\">#</a></h2><p>FlagTree inherits capabilities from the previous version, continuously integrates new backends, expands support for Triton versions, and provides hardware-aware optimization capabilities. The project is currently in its early stages, aiming to be compatible with existing adaptation solutions for various AI chip backends, unify the code repository, build a code co-construction platform, and quickly implement multi-backend support in a single repository.</p>", "a[href=\"#new-features\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">New features<a class=\"headerlink\" href=\"#new-features\" title=\"Link to this heading\">#</a></h2><p>Currently supported backends include triton_shared cpu, iluvatar, xpu (klx), mthreads, <strong>metax</strong>, <strong>aipu</strong>(arm npu), <strong>ascend</strong> npu &amp; cpu, <strong>tsingmicro</strong>, cambricon, with <strong>bold</strong> indicating newly added ones. <br/>\nEach new backend maintains the capabilities of the previous version: cross-platform compilation and rapid verification, plugin-based high-differentiation modules, CI/CD, and quality management capabilities. <br/>\nJointly developing common extensions for the middleware layer with backend vendors, and open-sourcing standardized PyTorch backend extensions to support Triton / FlagTree practices. <br/></p>", "a[href=\"#looking-ahead\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">Looking ahead<a class=\"headerlink\" href=\"#looking-ahead\" title=\"Link to this heading\">#</a></h2><p>GPGPU backend code will be integrated, decoupling backend differentiation changes from TritonGPU; non-GPGPU backends will be horizontally integrated on the FLIR foundation, with unified design for common passes. <br/>\nProviding Triton adaptation version upgrade guides for backend vendors: 3.0 -&gt; 3.1 -&gt; 3.2 -&gt; 3.3. <br/>\nCI/CD will add FlagGems operator library functional testing. <br/>\nIntegrating C++ Runtime functionality to reduce runtime overhead outside of kernels to be on par with CUDA. <br/></p>"}
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
