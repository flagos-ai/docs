# 平台能力矩阵

每个 `FLAGOS_ACCELERATOR` 取值实际提供什么：其 wheel 构建哪条算子路径、设备运行时来自哪里、默认做哪些路由决策。这是在{ref}`兼容性矩阵 <compatibility>`（按能力给出验证状态）之下一层的、按平台的「我的加速器到底支不支持某项能力」的答案。

## 算子路径

| 平台 | `FLAGOS_ACCELERATOR` | 算子路径 | 设备运行时来源 | 厂商原生内核树 | 状态 |
|---|---|---|---|---|---|
| NVIDIA CUDA | `cuda`（默认） | 原生 CUDA、FlagGems、生成的 CUDA boxing | `cuda` | —（走 CUDA/FlagGems 路径） | Stable |
| PPU | `ppu` | 针对打包的 PPU libtorch 做 CUDA-ABI boxing | `cuda` + 打包的 `lib_ppu/` | —（仅 boxing） | Experimental |
| MetaX | `metax` | 针对打包的 MACA libtorch 做 CUDA-ABI boxing | `metax` | —（手写 MetaX 内核已退役） | Stable |
| 海光 DCU | `dcu` | 基于 hipify 后的 DTK torch 做 CUDA-ABI boxing | `cuda` + DCU DTK-core ABI shim | —（仅 boxing） | Beta |
| Ascend | `ascend` | 厂商原生（ACLNN），FlagGems 经 FlagTree | `ascend` | `ascend` | Beta |
| 燧原 GCU | `gcu` | 厂商原生（topsaten） | `gcu` | `gcu` | Beta |
| 摩尔线程 MUSA | `musa` | 厂商原生（mudnn） | `musa` | `musa` | Experimental |
| TsingMicro | `tsingmicro` | CUDA-ABI boxing（Kuiper SDK） | `tsingmicro` | — | Runtime only |
| 地平线 BPU | `bpu` | 无逐算子内核；整图编译 | `bpu` | — | Runtime only |

## 内核集合

`FLAGOS_BUILD_*` 开关决定 wheel 编译哪些内核集合。默认开启哪些是平台属性，而非每次构建的选择：

| 内核集合 | 提供内容 |
|---|---|
| `vendor` | 平台的原生算子树（若存在） |
| `flaggems` | FlagGems Python（Triton）调度路径 |
| `flaggems_cpp` | FlagGems C++ 路径（`liboperators.so`） |
| `boxing` | 面向 CUDA-ABI 平台生成的 CUDA boxing 内核 |
| `tileops` | 面向 SM90 NVIDIA 型号的 TileOps/TileLang 内核 |

wheel 会记录自身构建时启用的集合；运行期读取的是该记录而非环境变量，因此显式导出的 `FLAGOS_BUILD_*` 不会让 wheel 错误地描述自己。各平台默认值见{doc}`环境变量参考 <environment-variables>`。

## 有意为之的不对称

以下是设计决策，不是待补齐的缺口：

- **BPU** 完全没有逐算子内核：eager 算子走 CPU 回退，加速来自 `torch.compile(backend="bpu")` 的整图编译。
- **TsingMicro** 是构建目标，有运行时选择器，但没有成文的逐算子内核集合，也没有安装指南。
- **MUSA** 的加速器目录只提供 stream/event 包装 —— 没有 `torch.cuda` 风格的兼容模块，因此在 MUSA 上访问 `torch.cuda.*` 设备查询不会得到转换层。
- **PPU** 通过 CUPTI 做性能分析，但不产生 `gpu_memset` 活动，因此与 memset 相关的对等性用例属于范围外，而非失败。
- **CUDA boxing 是共享的**：一套生成内核，四个厂商运行时来源（CUDA、MetaX、PPU、DCU）。

## 设备运行时与 Python 层

| 层 | 位置 | 说明 |
|---|---|---|
| 生成的 ATen 绑定 | `csrc/aten/generated/` | 注册在 `PrivateUse1` 下；CUDA/boxing 与 FlagGems 调用方 |
| 厂商原生内核 | `csrc/aten/backends/<vendor>/` | 按厂商库实际导出的算子面生成 |
| 设备运行时 | `csrc/runtime/accelerator/<dir>/` | DCU 与 PPU 复用 CUDA 运行时树并追加自身部分 |
| Python 设备模块 | `torch_fl/flagos/` | stream、event、RNG、AMP、显存、meta 内核 |
| 路由表 | `torch_fl/configs/backends_<platform>.conf` | 每个算子一条 `op = backend` |
