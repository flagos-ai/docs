# 发布说明

本节包含 PyTorch-Plugin-FL 的发布信息。

## v0.1.0

PyTorch-Plugin-FL 作为 FlagOS 一部分的初始版本。

- **统一的 `flagos` 设备** — 基于 `PrivateUse1` 的 PyTorch 设备插件；标准 PyTorch API、张量方法与存储无需修改即可使用。
- **按算子路由后端** — 在同一设备名称下整合 FlagGems Triton 内核、厂商原生算子库、CUDA 兼容性 boxing 与显式 CPU 回退，并提供分平台路由表与逐算子覆盖。
- **多平台支持** — NVIDIA CUDA、MetaX、华为 Ascend、PPU、海光 DCU、燧原 GCU、摩尔线程 MUSA 与地平线 BPU，各自拥有独立的构建选择器。
- **训练栈** — eager 执行与 autograd、`torch.autocast("flagos")` 与 `torch.amp.GradScaler("flagos")`、`torch.compile` 集成，以及通过 `ProcessGroupFlagOS` 的 DDP/FSDP 支持。
- **可观测性** — 带设备时间线与流向箭头的 `torch.profiler` 集成、逐算子调度与回退日志，以及带 `torch-fl-preflight` 检查工具的 wheel 兼容性清单。
- **平台兼容性** — CUDA boxing、原生 ACLNN 与 topsaten 后端，以及 FlagGems Python 与 C++ 调度路径，并按平台记录状态等级。
