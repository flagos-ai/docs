# Stage 4: End-to-End Validation and Legal Compliance (Intermediate Closing Gate)

For edge chip adaptation, this page corresponds to Stage 4. Edge adaptation has no independent communication framework stage, so it enters End-to-End Validation and Legal Compliance directly after Stage 3. This page reuses the same validation topic but displays Stage 4 for the edge process.

**Stage ID**

Stage 4

**Prerequisites**

Technical adaptation is complete for Stages 2-3, and the CI/CD resource pool is ready.

**Hardware investment**

2 CI machines and 2 SVT (system validation testing) machines. SVT machines must be physically isolated from CI machines.

**Activities**

1. Validate SIG repository functionality.
2. Run DevSecOps automated build, deployment, and validation.
3. Validate SBOM scanning.
4. Run FlagOS CTS compatibility certification tests.
5. Perform legal compliance review.

**Deliverables**

Functional validation report, SBOM report, CTS test report, and legal compliance review opinion.

**Acceptance criteria**

1. SIG repository test cases pass at 100%.
2. All CTS test items pass or have an explicit waiver list.
3. SBOM scanning reports no critical vulnerabilities.
4. Legal review has no unresolved items.
5. CI/CD and SVT end-to-end automation runs for at least seven days without interruption.

**Estimated duration**

3-4 weeks

**Related documents**

SIG repository test specification, CTS specification, SBOM standard, compliance review checklist, and DevSecOps practice guide.
