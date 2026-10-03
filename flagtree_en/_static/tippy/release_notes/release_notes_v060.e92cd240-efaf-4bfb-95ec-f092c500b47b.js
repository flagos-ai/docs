selector_to_html = {"a[href=\"#flagtree-0-6-0-release\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FlagTree 0.6.0 Release<a class=\"headerlink\" href=\"#flagtree-0-6-0-release\" title=\"Link to this heading\">#</a></h1>", "a[href=\"../getting_started/install-arm64-cpu.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Install on Arm64 CPU<a class=\"headerlink\" href=\"#install-on-arm64-cpu\" title=\"Link to this heading\">#</a></h1><p>Before installing the FlagTree on Arm64 CPU, please read the following notes:</p>", "a[href=\"../user_guide/use-tle-cpu.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Use TLE-CPU<a class=\"headerlink\" href=\"#use-tle-cpu\" title=\"Link to this heading\">#</a></h1><p>This section introduces how to use TLE-CPU. TLE-CPU is available on trition_3.3.x branch.</p><p>TLE-CPU allows a unified programming paradigm covering diverse edge-side CPU compute power. Extends TLE\u2019s philosophy of \u201clayering hardware deep optimizations on top of <code class=\"docutils literal notranslate\"><span class=\"pre\">@triton.jit</span></code>\u201d to CPUs. Targeting the fragmented CPU ecosystem for edge AI (Arm64 / RISC-V / x86 with multiple coexisting ISAs), it uses the same Triton programming model and integration framework to support diverse ISAs: programming model and correctness are shared across ISAs (plain Triton lands on any ISA via LLVM), while each ISA\u2019s high-performance implementation (intrinsic / C runtime) is contributed separately. Model code is routed to the corresponding ISA implementation through the operator library (FlagGems) vendor dispatch, eliminating the need to be aware of the specific ISA. The differences between CPU and GPU dictate that it requires an independent extension surface:</p>"}
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
