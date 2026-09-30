# Requirements

This section includes requirements about using FlagTree, including supported platforms and dependencies. FlagTree can be successfully installed and run only when all requirements are met.

## System software requirements

You may need the following system softwares:

- Ubuntu
- Python 3.x

## Backends, Triton versions, and branches

Each backend is based on different versions of Triton, and therefore resides in different protected branches. All these protected branches have equal status. CI/CD runners are provisioned for every backend listed in the table.

|Branch|Vendor|Backend|Triton version|
|:-----|:-----|:------|:----------------|
|[main](https://github.com/flagos-ai/flagtree/tree/main)|NVIDIA<br>AMD<br>x86_64 cpu<br>ILUVATAR<br>Moore Threads<br>KLX<br>MetaX<br>HYGON|[nvidia](/third_party/nvidia/)<br>[amd](/third_party/amd/)<br>[triton-shared](https://github.com/microsoft/triton-shared)<br>[iluvatar](/third_party/iluvatar/)<br>[mthreads](/third_party/mthreads/)<br>[xpu](/third_party/xpu/)<br>[metax](/third_party/metax/)<br>[hcu](third_party/hcu/)|3.1<br>3.1<br>3.1<br>3.1<br>3.1<br>3.0<br>3.0<br>3.1|
|[triton_v3.2.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.2.x)|NVIDIA<br>AMD<br>Huawei Ascend<br>Moore Threads<br>Cambricon|[nvidia](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/third_party/nvidia/)<br>[amd](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/third_party/amd/)<br>[ascend](https://github.com/flagos-ai/FlagTree/blob/triton_v3.2.x/third_party/ascend/)<br>[mthreads](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/third_party/mthreads/)<br>[cambricon](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/third_party/cambricon/)|3.2|
|[triton_v3.3.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.3.x)|NVIDIA<br>AMD<br>x86_64 cpu<br>ARM China<br>Tsingmicro<br>Enflame<br>ARM64 cpu|[nvidia](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/nvidia/)<br>[amd](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/amd/)<br>[triton-shared](https://github.com/microsoft/triton-shared)<br>[aipu](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/aipu/)<br>[tsingmicro](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/tsingmicro/)<br>[enflame](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/enflame/)<br>[cpu](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/cpu/)|3.3|
|[triton_v3.4.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.4.x)|NVIDIA<br>AMD<br>Sunrise|[nvidia](https://github.com/flagos-ai/FlagTree/tree/triton_v3.4.x/third_party/nvidia/)<br>[amd](https://github.com/flagos-ai/FlagTree/tree/triton_v3.4.x/third_party/amd/)<br>[sunrise](https://github.com/flagos-ai/FlagTree/tree/triton_v3.4.x/third_party/sunrise/)|3.4|
|[triton_v3.5.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.5.x)|NVIDIA<br>AMD<br>Enflame|[nvidia](https://github.com/flagos-ai/FlagTree/tree/triton_v3.5.x/third_party/nvidia/)<br>[amd](https://github.com/flagos-ai/FlagTree/tree/triton_v3.5.x/third_party/amd/)<br>[enflame](https://github.com/flagos-ai/FlagTree/tree/triton_v3.5.x/third_party/enflame/)|3.5|
|[triton_v3.6.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.6.x)|NVIDIA<br>AMD<br>Enflame<br>HYGON<br>Moore Threads<br>Thrive|[nvidia](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/nvidia/)<br>[amd](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/amd/)<br>[enflame](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/enflame/)<br>[hcu](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/hcu/)<br>[mthreads](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/mthreads/)<br>[damoacademy](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/thrive/)|3.6|

## Features on different branches

FlagTree's extension components are currently available on some backends:

|Branch|Backend|Triton version|Extension components|
|:-----|:------|:-------------|:-------------------|
|[triton_v3.6.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.6.x)|[nvidia](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/nvidia/)<br>[enflame](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/enflame/)|3.6|TLE-Lite<br>TLE-Struct GPU<br>TLE-Raw<br>HINTS|
|[triton_v3.6.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.6.x)|[mthreads](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/mthreads/)|3.6|TLE-Lite<br>TLE-Struct GPU|
|[triton_v3.2.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.2.x)|[ascend](https://github.com/flagos-ai/FlagTree/blob/triton_v3.2.x/third_party/ascend/)|3.2|TLE-Struct DSA<br>FLIR<br>HINTS|
|[triton_v3.3.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.3.x)|[tsingmicro](https://github.com/flagos-ai/FlagTree/blob/triton_v3.3.x/third_party/tsingmicro/)|3.3|TLE-Lite<br>TLE-Struct DSA<br>FLIR|
|[triton_v3.3.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.3.x)|[aipu](https://github.com/flagos-ai/FlagTree/blob/triton_v3.3.x/third_party/aipu/)|3.3|FLIR<br>HINTS|

## Backend integrations

The following backends have been integrated into FlagTree. For new vendors, you can refer to the following code links for your integrations:

- [ARM64 cpu](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/cpu/)
- [iluvatar](https://github.com/flagos-ai/FlagTree/tree/main/third_party/iluvatar/)
- [mthreads](https://github.com/flagos-ai/FlagTree/tree/main/third_party/mthreads/)
- [xpu](https://github.com/flagos-ai/FlagTree/tree/main/third_party/xpu/)
- [aipu](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/aipu/)
- [metax](https://github.com/flagos-ai/FlagTree/tree/main/third_party/metax/)
- [ascend](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/third_party/ascend/)
- [tsingmicro](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/tsingmicro/)
- [hcu](https://github.com/flagos-ai/FlagTree/tree/main/third_party/hcu/)
- [enflame](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/enflame/) ([3.3](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/enflame/) / [3.5](https://github.com/flagos-ai/FlagTree/tree/triton_v3.5.x/third_party/enflame/) / [3.6](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/enflame/))
- [sunrise](https://github.com/flagos-ai/FlagTree/tree/triton_v3.4.x/third_party/sunrise/)
- [cambricon](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/third_party/cambricon/)
- [damoacademy](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/thrive/)
- [nvidia](https://github.com/flagos-ai/FlagTree/tree/main/third_party/nvidia)
- [amd](https://github.com/flagos-ai/FlagTree/tree/main/third_party/amd)
