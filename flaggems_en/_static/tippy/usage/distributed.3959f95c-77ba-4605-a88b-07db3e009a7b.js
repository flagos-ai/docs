selector_to_html = {"a[href=\"#single-node-vs-multi-node-usage\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. Single-node vs multi-node usage<a class=\"headerlink\" href=\"#single-node-vs-multi-node-usage\" title=\"Link to this heading\">#</a></h2><p>For <strong>single-node deployments</strong>, the <a class=\"reference internal\" href=\"basic.html\"><span class=\"doc std std-doc\">enablement of FlagGems</span></a>\nis straightforward. You can import <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems</span></code> and invoke <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems.enable()</span></code>\nat the beginning of your program or use the context manager when apprpriate.\nThe <em>FlagGems</em> acceleration is then enabled without requiring any additional changes\nto your code.</p><p>In <strong>multi-node deployments</strong>, however, the simple approach above is insufficient.\nDistributed inference frameworks (like vLLM) spawn multiple worker processes across nodes,\nwhere every process must initialize <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems</span></code> individually.\nIf the activation occurs only in the launch script on one node, worker processes\non other nodes will fall back to the default implementations which are not accelerated.</p>", "a[href=\"basic.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Enabling FlagGems<a class=\"headerlink\" href=\"#enabling-flaggems\" title=\"Link to this heading\">#</a></h1><p>To use the operators from the <em>FlagGems</em> operator library, import <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems</span></code> and enable acceleration\nbefore running your program. You can enable it globally or for a specific code block.\nBesides these, you can invoke operators from the <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems.ops</span></code> package directly.</p>", "a[href=\"#example-integration-with-vllm-and-deepseek\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. Example: integration with vLLM and DeepSeek<a class=\"headerlink\" href=\"#example-integration-with-vllm-and-deepseek\" title=\"Link to this heading\">#</a></h2><p>To enable <em>FlagGems</em> in a distributed vLLM + DeepSeek deployment:</p>", "a[href=\"#multi-gpu-deployment\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Multi-GPU Deployment<a class=\"headerlink\" href=\"#multi-gpu-deployment\" title=\"Link to this heading\">#</a></h1><p>In real-world LLM deployment scenarios, multi-GPU or multi-node setups are often required\nto support large model sizes and high-throughput inference.\n<em>FlagGems</em> supports these scenarios by accelerating operator execution across multiple GPUs.</p>"}
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
