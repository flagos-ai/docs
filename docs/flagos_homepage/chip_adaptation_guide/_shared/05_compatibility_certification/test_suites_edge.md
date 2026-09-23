# Test Suites

## CTS (Compatibility Test Suite) - Compatibility Test Suite

|**Test domain**|**Coverage**|**Pass standard**|
|---|---|---|
|Compiler compatibility|FlagTree compilation and FLIR IR mapping correctness|100%|
|Operator compatibility|FlagGems core operator correctness|>=95%|
|Communication compatibility (not required for edge chips)|FlagCX collective communication correctness|100%|
|Framework compatibility (not required for edge chips)|Basic FlagScale training and inference workflow|100%|
|PyTorch API compatibility|Correctness of common aten API return values|>=90%|
|Triton API compatibility|Triton language feature support|>=95%|
|Accuracy consistency|Comparison with the NVIDIA baseline|Deviation <2%|

```{include} ../../_shared/05_compatibility_certification/test_suites_common.md
```

## STS (Security Test Suite) - Security Test Suite

|**Test domain**|**Coverage**|**Pass standard**|
|---|---|---|
|SBOM scanning|Dependency vulnerability scanning|No high-risk vulnerabilities or CVEs|
|Driver security|Driver file permission and signature validation|Passed|
|Container security|Container image scanning|No high-risk vulnerabilities|
|Communication encryption (not required for edge chips)|FlagCX communication-link encryption validation|Passed|

## ITS (Interoperability Test Suite) - Interoperability Test Suite

|**Test domain**|**Coverage**|**Pass standard**|
|---|---|---|
|Heterogeneous mixed training|Chip and NVIDIA mixed training|Efficiency >=81%|
|Heterogeneous mixed inference|Chip and NVIDIA mixed inference|Accuracy deviation <2%|
|Cross-vendor communication (not required for edge chips)|FlagCX cross-vendor testing|Correctness 100%|
|Multi-framework compatibility|FlagScale, vLLM, and SGLang|All passed|
