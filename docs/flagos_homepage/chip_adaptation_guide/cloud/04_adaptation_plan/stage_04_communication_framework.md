# Stage 4: Communication and Training/Inference Framework Adaptation (Intermediate Core)

## Sub-stage 4a: Communication Adaptation - FlagCX

**Prerequisites**

Operator coverage reaches the intermediate standard.

**Hardware investment**

At least two servers, each with at least four cards, connected through high-speed interconnect such as IB or RoCE to form a homogeneous cluster.

**Activities**

1. Wrap the vendor native communication library as a unified FlagCX adapter.
2. Implement core collective communication operations: allreduce, reducescatter, allgather, send, and recv.
3. Validate homogeneous cluster communication performance, targeting at least 99% of the native library.
4. Validate heterogeneous cluster mixed communication efficiency, targeting at least 81%.

**Deliverables**

FlagCX communication adapter and communication performance test report.

**FlagOS contacts**

FlagOS framework R&D team.

**Chip company contacts**

Communication library and network engineers.

**Acceptance criteria**

1. Collective communication executes correctly in single-node multi-card environments.
2. Linearity reaches at least 90% on clusters with eight or more nodes.
3. Homogeneous cluster throughput reaches at least 99% of the native library.
4. Heterogeneous mixed communication efficiency reaches at least 81%.

**Estimated duration**

3-5 weeks

**Related documents**

[FlagCX vendor adaptation guide](https://jwolpxeehx.feishu.cn/docx/Vl1NdA8jiohjl6xZV2GcfV6un4d)

## Sub-stage 4b: Training and Inference Adaptation - FlagScale

**Prerequisites**

FlagCX communication validation has passed.

**Hardware investment**

Reuse the two Stage 4a devices, with persistent storage mounted.

**Activities**

1. Adapt the Megatron-LM plugin for the training backend.
2. Adapt the vLLM/SGLang plugins for the inference backend.
3. Support TP, PP, DP, EP, and other parallel strategies.
4. Support FP16, BF16, and FP8 mixed-precision training.
5. Adapt vllm-plugin-FL and provide multi-chip inference services.

**Deliverables**

FlagScale integration report and training/inference validation results.

**FlagOS contacts**

FlagOS framework R&D team.

**Chip company contacts**

Framework engineers.

**Acceptance criteria**

1. A representative model can complete one iteration.
2. The inference service responds normally end to end, with accuracy deviation below 2%.
3. The distributed training convergence curve matches the NVIDIA baseline.

**Estimated duration**

3-5 weeks

**Related documents**

[FlagOS reference material](https://jwolpxeehx.feishu.cn/docx/IiAXdz9ZWouEi0xqMMCcUUU7nJe)<br>[TransformerEngine-FL plugin mechanism user guide](https://jwolpxeehx.feishu.cn/docx/HC0mdLIOFoGv0sxyo8XcFloinOd)<br>[vLLM-plugin-FL plugin mechanism user guide](https://jwolpxeehx.feishu.cn/docx/Oxeyd2WpMo3XTCxqRNMcSCKHngd)<br>[sglang-plugin-FL vendor adaptation development guide](https://jwolpxeehx.feishu.cn/wiki/ReW9w8Kguihzm3kAu8GcSIjsn34)<br>[veRL-FL adaptation documentation](https://jwolpxeehx.feishu.cn/docx/WF7Kdd8ploywmlxBETfc0CWonne)
