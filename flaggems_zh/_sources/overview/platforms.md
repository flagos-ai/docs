
# 支持的硬件平台

*FlagGems* 支持超过 10 种不同后端硬件平台。目前支持的平台及这些平台的能力列举如下：

| 厂商       | 符号名   | 状态 | float16 | float32 | bfloat16 |
| ---------- | ------------- | ------| ------- | ------- | -------- |
| AIPU       | `aipu`        | ☑️     | ✅      | ✅      | ✅       |
| AMD        | `amd`         | 🚧    | -       | -       | -        |
| ARM (CPU)  | `arm`         | ☑️     | -       | -       | -        |
| Ascend     | `ascend`      | ✅    | ✅      | ✅      | ✅       |
| Cambricon  | `cambricon`   | ✅    | ✅      | ✅      | ✅       |
| Hygon      | `hugon`       | ✅    | ✅      | ✅      | ✅       |
| Iluvatar   | `iluvatar`    | ✅    | ✅      | ✅      | ✅       |
| Kunlunxin  | `kunlunxin`   | ✅    | ✅      | ✅      | ✅       |
| MetaX      | `metax`       | ✅    | ✅      | ✅      | ✅       |
| Mthreads   | `mthreads`    | ✅    | ✅      | ✅      | ✅       |
| NVIDIA     | `nvidia`      | ✅    | ✅      | ✅      | ✅       |
| Sunrise    | `sunrise`     | ☑️     | ✅      | ✅      | ✅       |
| TsingMicro | `tsingmicro`  | 🚧    | -       | -       | -        |

**状态图例**：

- ✅ - 支持
- ☑️  - 部分支持
- 🚧 - 开发中
