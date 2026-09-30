# 环境要求

### 硬件

- 所使用运行时支持的加速器。attention 算子需要 GPU 或 AI 加速器；纯 CPU 环境可以读取包元数据，但无法运行 kernel。

### 软件

- Python 3.10 或更高版本
- 与目标加速器匹配的 PyTorch build
- Triton 2.2 或更高版本，或提供兼容 Triton API 的厂商运行时
- PyYAML 与 pytest（包初始化时会加载）

PyTorch 与加速器运行时未作为硬依赖声明，因为正确的软件包取决于设备和驱动栈。请先安装它们，再安装 FlagAttention。
