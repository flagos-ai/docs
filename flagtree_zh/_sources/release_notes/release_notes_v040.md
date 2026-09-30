# FlagTree 0.4.0 发布

- **新增特性**
  - 新增底层 DSL-tle
      新的 DSL-tle（Triton Language Extension）分别为 GPU 和 DSA 扩展基础原语。其中，在 `add` 操作上相比标准 Triton 实现了 20% 的性能提升。
  - GPGPU 和 DSA/NPU 统一后端特化
      统一后端特化已应用于 ILUVATAR 和华为昇腾。
  - 新增后端接入
      新增 enflame。

- **变更特性**
  - 增强 DSA 架构芯片的统一中间表示层
      统一 IR 层已在昇腾和 AIPU 上得到验证。
  - C++ 运行时升级为多芯片架构
       支持 Nvidia、华为昇腾、摩尔线程和 ILUVATAR。
  - 开发者体验改进
      改进包括以下内容：
    - 提供预下载和离线安装模式
    - 提供通过 PyPI 安装的方式
    - 将相关依赖 SDK 迁移至金山云
