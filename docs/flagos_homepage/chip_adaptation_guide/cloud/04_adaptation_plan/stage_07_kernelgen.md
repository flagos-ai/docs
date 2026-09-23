# Stage 7: KernelGen Adaptation, Automatic Operator Generation, and Operator Competition

**Prerequisites**

Mainline merge is complete, FlagOS certification has passed, the FlagRelease image has been released, and the chip compiler, runtime, profiler, and base operator library are available.

**Hardware investment**

At least one dedicated KernelGen machine. Multi-card test environments are required for multi-card or multi-node optimization. Operator competitions require a separate evaluation machine or isolated queue.

**Activities**

1. Connect to the KernelGen automatic operator generation platform.
2. Configure compilation, runtime, validation, and benchmark environments for the chip.
3. Connect the chip profiler for automatic performance bottleneck analysis.
4. Establish performance baselines for PyTorch, Triton, TLE, and native libraries.
5. Prioritize high-frequency LLM operators, including Attention, MoE, RMSNorm, RoPE, TopK, KV Cache, communication fusion, and others.
6. Automatically generate operators and submit PRs to FlagGems and FlagOS.
7. Build the chip's KernelGen Skills and optimization knowledge base.
8. Connect to the KernelGenBench multi-chip evaluation leaderboard.
9. Co-host an operator optimization competition or KernelGen Hackathon.
10. Include outstanding operators in the FlagRelease image and large-model T+0 release process.

**Deliverables**

KernelGen chip adaptation report, operator generation environment, profiler integration documentation, performance baseline report, generated-operator PR list, merged-operator list, KernelGen Skills, KernelGenBench results, operator competition plan, and leaderboard.

**Acceptance criteria**

1. Complete the automatic generation, compilation, correctness validation, benchmark, and PR loop.
2. Cover at least 30 high-frequency operators in the first batch.
3. Produce at least 10 mergeable PRs.
4. Merge at least 5 FlagGems or FlagOS operators.
5. Achieve at least 1.1x average speedup for key operators with no performance regression.
6. Document at least 20 chip optimization Skills.
7. Cover at least one official KernelGenBench track.
8. Deliver at least one joint technical case study.

**Estimated duration**

6-10 weeks

**Related documents**

KernelGen chip integration specification, operator generation specification, FlagGems PR specification, KernelGenBench evaluation specification, profiler integration guide, and operator competition rules.
