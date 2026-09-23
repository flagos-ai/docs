# Stage 2: Compiler Adaptation - FlagTree Branch Integration (Entry-Level Threshold)

**Prerequisites**

The development board environment is ready, and the chip Triton backend or compatibility layer is available.

**Hardware investment**

Add the Stage 1 device to the FlagOS CI resource pool and keep it online 24/7.

**Activities**

1. Create a protected chip branch in the FlagTree repository.
2. The chip company provides adaptation code or a compatibility layer for the Triton backend.
3. Integrate a C++ Wrapper if a bridge from Triton IR to the vendor SDK is required.
4. Complete instruction mapping through the unified FLIR IR layer.
5. Configure a basic CI pipeline for automatic builds and compilation tests.

**Deliverables**

Available FlagTree chip branch and running basic CI pipeline.

**FlagOS contacts**

FlagTree compiler team.

**Chip company contacts**

Compiler and toolchain engineers.

**Acceptance criteria**

1. Triton kernels can be compiled successfully to the chip backend.
2. At least 10 basic operators can be compiled and executed correctly.
3. CI build pass rate is at least 95%, and machine availability is at least 99%.

**Estimated duration**

2-4 weeks

**Related documents**

[FlagTree integration guide](https://jwolpxeehx.feishu.cn/docx/VIridPa16odD9hxViDLcsD2vnXb): integration plans for GPGPU and DSA/NPU devices.<br>Triton-TLE: [GitHub documentation](https://github.com/flagos-ai/FlagTree/wiki/TLE), [reference NV implementation](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x), [TLE vendor PR template](https://jwolpxeehx.feishu.cn/file/VIOsbkSYZoI3I5xhxdLcuz8snVg?from=from_copylink), [TLE raw CUDA integration vendor example](https://jwolpxeehx.feishu.cn/wiki/Ipvbwa1WYintOwkmNzUchJJun0c).<br>C++ Wrapper: [libtriton_jit documentation](https://github.com/flagos-ai/libtriton_jit), [sample PR](https://github.com/flagos-ai/libtriton_jit/pull/12/changes), [C++ Runtime multi-backend and Triton operator development sharing](https://jwolpxeehx.feishu.cn/slides/RPkms0jYol2TA7dvbfScjVJWnlu?from=from_copylink).
