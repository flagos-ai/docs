# Supporting Skills and Automation Tools

FlagOS packages multiple adaptation workflow steps as reusable Agent Skills. Chip companies and their development teams can use them according to the adaptation stage.

|**Skill name**|**Applicable stage**|**Function**|
|---|---|---|
|gpu-container-setup-flagos|Stage 1|Automatically detect the GPU vendor, launch a PyTorch container, and validate the GPU/accelerator card.|
|install-stack-flagos|Stages 1-2|Install the full stack: FlagTree, FlagGems, FlagCX, and FlagScale.|
|kernelgen-flagos|Stage 3|Automatically generate and iteratively optimize operators.|
|model-migrate-flagos|Stage 4b|Backport models from upstream vLLM to vllm-plugin-FL.|
|model-verify-flagos|Stage 5|Verify the serving stack step by step.|
|perf-test-flagos|Stages 4-5|Run performance benchmarks.|
|flagrelease-entrance-flagos|Stage 6|Orchestrate the complete release pipeline.|
