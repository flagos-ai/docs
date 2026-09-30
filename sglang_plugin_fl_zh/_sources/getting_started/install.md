# 安装 sglang-plugin-FL

<!-- CHANGED: v0.2.0 centralizes vendor/framework/image selection and removes stale private image tags from this page. -->
## 运行时镜像与平台软件包

特定厂商的框架选择、运行时镜像、验证状态、安装命令和适配流程统一维护在集中页面：[厂商/框架/镜像选择集中页面](https://flagos.io/resourcedownload?lang=en)。安装或启动 sglang-plugin-FL 前，请使用该页面选择厂商、框架和镜像。

本页面有意不再维护完整镜像矩阵或平台专属软件包配方。

<!-- NEW in v0.2.0 -->
## Empty mode

Empty mode 是一种安装/运行时组装机制，适用于以 CUDA 为导向的 SGLang 依赖栈并非目标部署环境的平台。它避免将 CUDA 软件包视为通用依赖集，但它**不是**无设备模式。

目标平台仍需提供：

- 厂商 torch；
- 驱动和固件；
- 设备运行时；
- 通信库；
- 平台注意力后端；
- sglang-plugin-FL 未覆盖的算子。

请使用集中厂商/框架/镜像选择页面获取平台专属镜像和依赖集：[厂商/框架/镜像选择集中页面](https://flagos.io/resourcedownload?lang=en)。
<!-- END NEW -->
