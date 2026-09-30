# 要求

## 软件要求

<!-- CHANGED: v0.2.0 separates generic plugin requirements from vendor-specific framework/image/package selections. -->
所需运行时栈取决于所选厂商、框架和镜像。平台专属 SDK、框架构建版本、镜像、验证状态和软件包版本请参阅厂商/框架/镜像选择集中页面：[厂商/框架/镜像选择集中页面](https://flagos.io/resourcedownload?lang=en)。

sglang-plugin-FL 的通用要求如下：

| 组件 | 要求 |
|---------|---------|
| SGLang | 支持通过插件入口点加载的兼容 SGLang 运行时 |
| sglang-plugin-FL | 已安装在目标运行时环境中 |
| FlagGems | 启用时，用于第 1 层 ATen 替换以及基于 FlagGems 的融合实现 |
| FlagCX | 使用 FlagCX 集合通信时需要 |
| 厂商运行时栈 | 厂商 torch、驱动、固件、设备运行时、通信库、注意力后端，以及未被插件覆盖的算子 |

<!-- NEW in v0.2.0 -->
## Empty mode 边界

Empty mode 不是无设备模式。它改变安装/运行时组装方式，使厂商专属环境能够提供自己的运行时栈，而不是继承以 CUDA 为导向的依赖集。目标平台仍需提供厂商 torch、驱动、固件、设备运行时、通信库、平台注意力后端，以及插件未覆盖的算子。
<!-- END NEW -->

## 硬件要求

- 支持 CUDA 的 NVIDIA GPU，或
- 配备 CANN 工具包的华为昇腾 NPU，或
- 其他配备相应厂商 SDK 的受支持硬件

## 已验证的模型

<!-- CHANGED: v0.2.0 moves detailed model/platform validation status to the centralized page. -->
详细的模型、量化、平台和验证状态请参阅集中页面：[厂商/框架/镜像选择集中页面](https://flagos.io/resourcedownload?lang=en)。请勿将本页面视为完整的厂商支持矩阵。
