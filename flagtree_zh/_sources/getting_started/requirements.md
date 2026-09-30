# 系统要求

本节包含使用 FlagTree 的要求，包括支持的平台和依赖项。只有在满足所有要求的情况下，FlagTree 才能成功安装和运行。

## 系统软件要求

您可能需要以下系统软件：

- Ubuntu
- Python 3.x

## 后端、Triton 版本和分支

每个后端基于不同版本的 Triton，因此位于不同的受保护分支中。所有这些受保护分支具有同等地位。表中列出的每个后端都配备了 CI/CD 运行器。

|分支|厂商|后端|Triton 版本|
|:-----|:-----|:------|:----------------|
|[main](https://github.com/flagos-ai/flagtree/tree/main)|NVIDIA<br>AMD<br>x86_64 cpu<br>天数智芯<br>摩尔线程<br>KLX<br>沐曦股份<br>海光信息|[nvidia](/third_party/nvidia/)<br>[amd](/third_party/amd/)<br>[triton-shared](https://github.com/microsoft/triton-shared)<br>[iluvatar](/third_party/iluvatar/)<br>[mthreads](/third_party/mthreads/)<br>[xpu](/third_party/xpu/)<br>[metax](/third_party/metax/)<br>[hcu](third_party/hcu/)|3.1<br>3.1<br>3.1<br>3.1<br>3.1<br>3.0<br>3.0<br>3.1|
|[triton_v3.2.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.2.x)|NVIDIA<br>AMD<br>华为昇腾<br>摩尔线程<br>寒武纪|[nvidia](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/third_party/nvidia/)<br>[amd](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/third_party/amd/)<br>[ascend](https://github.com/flagos-ai/FlagTree/blob/triton_v3.2.x/third_party/ascend/)<br>[mthreads](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/third_party/mthreads/)<br>[cambricon](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/third_party/cambricon/)|3.2|
|[triton_v3.3.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.3.x)|NVIDIA<br>AMD<br>x86_64 cpu<br>安谋科技<br>清微智能<br>燧原<br>ARM64 cpu|[nvidia](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/nvidia/)<br>[amd](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/amd/)<br>[triton-shared](https://github.com/microsoft/triton-shared)<br>[aipu](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/aipu/)<br>[tsingmicro](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/tsingmicro/)<br>[enflame](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/enflame/)<br>[cpu](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/cpu/)|3.3|
|[triton_v3.4.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.4.x)|NVIDIA<br>AMD<br>曦望芯科|[nvidia](https://github.com/flagos-ai/FlagTree/tree/triton_v3.4.x/third_party/nvidia/)<br>[amd](https://github.com/flagos-ai/FlagTree/tree/triton_v3.4.x/third_party/amd/)<br>[sunrise](https://github.com/flagos-ai/FlagTree/tree/triton_v3.4.x/third_party/sunrise/)|3.4|
|[triton_v3.5.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.5.x)|NVIDIA<br>AMD<br>燧原|[nvidia](https://github.com/flagos-ai/FlagTree/tree/triton_v3.5.x/third_party/nvidia/)<br>[amd](https://github.com/flagos-ai/FlagTree/tree/triton_v3.5.x/third_party/amd/)<br>[enflame](https://github.com/flagos-ai/FlagTree/tree/triton_v3.5.x/third_party/enflame/)|3.5|
|[triton_v3.6.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.6.x)|NVIDIA<br>AMD<br>燧原<br>海光信息<br>摩尔线程<br>Thrive|[nvidia](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/nvidia/)<br>[amd](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/amd/)<br>[enflame](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/enflame/)<br>[hcu](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/hcu/)<br>[mthreads](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/mthreads/)<br>[damoacademy](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/thrive/)|3.6|

## 不同分支上的功能特性

FlagTree 的扩展组件目前在某些后端上可用：

|分支|后端|Triton 版本|扩展组件|
|:-----|:------|:-------------|:-------------------|
|[triton_v3.6.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.6.x)|[nvidia](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/nvidia/)<br>[enflame](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/enflame/)|3.6|TLE-Lite<br>TLE-Struct GPU<br>TLE-Raw<br>HINTS|
|[triton_v3.6.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.6.x)|[mthreads](https://github.com/flagos-ai/FlagTree/tree/triton_v3.6.x/third_party/mthreads/)|3.6|TLE-Lite<br>TLE-Struct GPU|
|[triton_v3.2.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.2.x)|[ascend](https://github.com/flagos-ai/FlagTree/blob/triton_v3.2.x/third_party/ascend/)|3.2|TLE-Struct DSA<br>FLIR<br>HINTS|
|[triton_v3.3.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.3.x)|[tsingmicro](https://github.com/flagos-ai/FlagTree/blob/triton_v3.3.x/third_party/tsingmicro/)|3.3|TLE-Lite<br>TLE-Struct DSA<br>FLIR|
|[triton_v3.3.x](https://github.com/flagos-ai/flagtree/tree/triton_v3.3.x)|[aipu](https://github.com/flagos-ai/FlagTree/blob/triton_v3.3.x/third_party/aipu/)|3.3|FLIR<br>HINTS|

## 后端集成

以下后端已集成到 FlagTree 中。对于新厂商，您可以参考以下代码链接进行集成：

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
