# 特性

- **统一多芯片后端**

利用 FlagGems（统一算子库）和 FlagCX（统一通信库）提供芯片无关的推理能力。同一模型可在不同硬件上运行，无需修改代码。

- **灵活的算子调度**

实现了基于优先级的调度系统，在 FlagGems、厂商特定实现和 PyTorch 参考实现之间进行选择。算子可按后端配置，并在失败时自动回退。

- **平台自动检测**

自动检测硬件并加载平台特定配置。支持 NVIDIA GPU、Ascend NPU、T-Head、Iluvatar、MetaX、Moore Threads、Tsingmicro、Hygon DCU、Sunrise、燧原、昆仑芯和阿里 PPU 芯片，以及 ARM64 主机上的纯 CPU 推理。

- **可扩展的厂商后端**

支持内置厂商后端、通过 setuptools 入口点的外部插件包，以及基于环境变量的插件模块。

- **可选的原生扩展**

使用 `VLLM_VENDOR=cuda` 构建时会安装 `vllm_fl._C` C++ 扩展，部分 graph 与自定义算子路径需要它，包括使用 PyTorch CUDA dispatch key 的 CUDA 类设备（CUDA 与 HIP/ROCm）。不设置时插件以纯 Python 形式安装。

端到端安装流程参见[安装运行推理任务所需的软件](../getting_started/install.md)。后端与算子选择参见[算子调度用户指南](../dispatch_user_guide/dispatch-user-guide.md)。
