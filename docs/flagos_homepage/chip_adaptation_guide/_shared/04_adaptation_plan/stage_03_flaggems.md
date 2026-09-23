# Stage 3: Operator Adaptation - FlagGems Coverage (Entry-to-Intermediate Progression)

**Prerequisites**

The FlagTree branch is available, and the chip Triton backend is stable.

**Hardware investment**

1 CI machine reused from Stage 2 and 1 optional development/debug machine.

**Activities**

1. Confirm that the CI machine is connected to the FlagOS CI/CD resource pool.
2. Run the FlagGems test suite and identify failed or incompatible operators.
3. Fix operator compatibility issues, targeting coverage of at least 80% of core operators.
4. Use KernelGen to automatically generate missing operators and validate them on the chip.
5. Tune operator performance, targeting at least 80% of the vendor native operator performance.
6. Establish an SBOM scanning mechanism.

**Deliverables**

FlagGems operator compatibility report, test coverage data, and SBOM scanning baseline.

**FlagOS contacts**

FlagGems operator team and KernelGen platform team.

**Chip company contacts**

Operator development engineers.

**Acceptance criteria**

1. FlagGems operator test pass rate is at least 80%.
2. Core LLM operators pass at 100%.
3. Operator performance reaches at least 80% of vendor native performance.
4. The CI test pipeline runs stably for at least two weeks.

**Estimated duration**

4-8 weeks

**Related documents**

[FlagGems operator library specification (trial)](https://jwolpxeehx.feishu.cn/docx/GawHdXsuRomaQNxpISec30lxnFg)<br>[KernelGen Wiki](https://docs.flagos.io/projects/kernelgen/en/latest/)
