# 功能特性

## 统一设备与标准 PyTorch API

所有已支持的加速器都通过 `flagos` 设备编程。模型代码、优化器和第三方库继续使用标准 PyTorch API；在不同加速器之间迁移不需要修改张量设备字符串、内核启动方式或模型代码。

设备模块在导入时通过 `torch.utils.rename_privateuse1_backend("flagos")` 与 `torch._register_device_module()` 安装，因此 `device="flagos"`、`torch.flagos.*` 方法、张量方法和存储的行为与 PyTorch 原生设备一致。

## 按算子路由后端

每个构建出的 wheel 只带一张路由表 `torch_fl/configs/backends_<platform>.conf`，其中是针对该平台编译的 `op = backend` 条目。路由以算子为粒度（而非设备或模型粒度），同一个模型内可以混用不同后端：

| 路由族 | 为算子提供服务的是 |
|---|---|
| `flagos_python` | 经 Python 调度器的 FlagGems Triton 内核 |
| FlagGems C++（`kFlagOs`） | 经 C++ 运行时 `liboperators.so` 的 FlagGems 内核 |
| `cuda` | 基于外部或厂商 `libtorch_cuda.so` 的 CUDA 兼容性 boxing 内核 |
| 厂商原生（`ascend`、`gcu`、`musa` 等） | 厂商算子库（ACLNN、topsaten、mudnn 等） |
| `tileops` | TileOps/TileLang 内核（NVIDIA SM90 芯片） |
| `cpu_fallback` | 以正确性优先的 CPU 实现，结果复制回设备 |

两个运行期变量可以在不重新构建的情况下改变路由：

- `FLAGOS_BACKEND_CONFIG` — 让进程改用另一张路由表。
- `FLAGOS_OP_<op>` — 覆盖单个算子，例如 `FLAGOS_OP_add__Tensor=cuda`。
- `FLAGOS_FORCE_BACKEND` — 将所有算子重新固定到某个后端族（`flaggems`、`vendor`、`tileops`），用于 A/B 测量。

当前路由始终可查询：`torch_fl.backend_config_path()` 返回正在使用的路由表。

## 执行路径

PyTorch-Plugin-FL 实现四类算子执行策略，同一平台可以组合多种。这些属于内部实现策略，而不是用户选择的产品等级。

- **厂商原生内核** — 直接调用厂商运行时和算子库（Ascend 的 ACLNN、燧原 GCU 的 topsaten、摩尔线程 MUSA 的 mudnn）。插件为各厂商 C/C++ API 生成绑定代码。
- **兼容性 boxing** — 当厂商栈提供可与 `PrivateUse1` 共存的独立 PyTorch dispatch key 时，以零拷贝方式转换张量元数据。CUDA boxing 通过外部 `libtorch_cuda.so` 复用 NVIDIA 内核；MetaX、PPU 和海光 DCU 以同样方式对各自的厂商 torch 构建进行 boxing。
- **可移植编译器内核** — 使用 Triton 或兼容编译器后端（FlagTree）生成的 FlagGems 内核，在多个加速器系列之间复用，无需逐平台重写。
- **显式 CPU 回退** — 在 PyTorch 语义允许时，没有设备内核的算子在 CPU 上执行。覆盖范围按平台记录，而不是被描述为完整原生支持。

## 设备运行时与管理 API

`torch.flagos` 模块提供完整的设备接口：

- 流（`Stream`、`current_stream`、`stream`）与事件（`Event`）
- 设备查询：`device_count`、`current_device`、`set_device`、`get_device_properties`
- 同步：`synchronize`
- 随机数：`manual_seed`、`manual_seed_all`、`get_rng_state`、`set_rng_state`、`initial_seed`
- 自动混合精度：`get_amp_supported_dtype`
- 内存：`memory_allocated`、`memory_reserved`、`memory_stats`、`reset_peak_memory_stats`、`empty_cache`

设备内存默认使用缓存分配器（`FLAGOS_USE_CACHING_ALLOCATOR`，默认开启）；设为 `0` 时每次分配都直接交给厂商运行时。

## 训练栈

- **Eager 执行与 autograd** — 前向与反向路径在设备上执行；原生扩展在加载时注册 `AutogradPrivateUse1` 回退。
- **`torch.autocast("flagos")` 与 `torch.amp.GradScaler("flagos")`** — 支持 FP16 与 BF16 目标精度，并使用 PyTorch 标准的 autocast 策略分组。
- **`torch.compile`** — Inductor 集成将 `flagos` 注册为一等 GPU 设备，详见 {doc}`torch.compile 集成 <../architecture/torch-compile>`。
- **分布式** — 支持 `ProcessGroupFlagOS`、DDP、DataParallel 与 FSDP2，详见 {doc}`分布式集合通信 <../architecture/distributed>`。

## 低精度与量化

`torch_fl.quantization` 提供低精度转换工具与模块：

- `convert`、`FormatSpec`、`LowPrecisionFormat`、`get_format_spec`、`normalize_format`、`supported_formats`
- `SoftLowpLinear` — 在矩阵乘之前解码低精度权重的线性层

在 DCU 与 MetaX 共用的 CUDA boxing 路径上，软件低精度矩阵路径（`soft_lowp`）为 `mm`、`bmm`、`addmm` 提供标量 FP8 格式（`float8_e4m3fn`、`float8_e5m2`、`float8_e4m3fnuz`、`float8_e5m2fnuz`、`float8_e8m0fnu`）与 packed FP4（`float4_e2m1fn_x2`）支持。数值以 BF16 解码并累加：未指定输出 dtype 时默认 BF16，显式指定时遵循指定值。块缩放元数据格式（MXFP4、NVFP4、block FP4）与 `_scaled_mm` 系列不在该路径范围内。

## 框架与生态兼容

导入时会安装若干兼容层，用于适配其他项目对设备的既有假设；它们都是可选的，并可通过各自开关进行测量：

- **Apex** — 补丁作用于常见的 `MultiTensorApply` 入口，使 Apex 的 `amp_C` 内核接收到 flagos 张量的零拷贝 CUDA 视图。
- **`torch.nn.attention.flex_attention`** — 放宽其硬编码的 `{cuda, cpu, xpu, hpu}` 设备白名单以接受 `flagos` 设备；融合模板可通过 `flagos` 编译后端使用。
- **`diffusers` 的 Qwen-Image 旋转位置编码** — 在逐设备 RoPE 表的两处都注册 `flagos` 设备，使旋转不再走 GCU 与 Ascend 上原本会退化的复数指数路径。
- **CUDA 别名** — `FLAGOS_ALIAS_CUDA` 默认开启，`cuda` 设备字符串会被接受为 `flagos`，未修改的 CUDA 脚本可直接运行在 `flagos` 设备上。

## 可观测性

- **调度与回退日志** — `FLAGOS_LOG=dispatch,fallback` 打印每个算子选中的后端，以及每次 CPU 回退调度。
- **Profiler** — `torch.profiler` 可采集设备时间线，包含流向箭头、逐算子设备时间、内核元数据与运行期事件名称，详见 {doc}`Profiler 集成 <../architecture/profiler>`。
- **wheel 兼容性清单** — 每个 wheel 都带有 `torch_fl/compatibility.json`，记录平台、内核集合、打包的 libtorch、构建期 PyTorch 与 ABI、以及构建时观测到的 FlagTree/FlagGems/FlagCX 版本；`torch-fl-preflight` 命令可在导入原生扩展前进行检查。
- **未知变量告警** — `import torch_fl` 会扫描一次环境，对拼写错误的 `FLAGOS_*` 名称给出告警，而不是静默忽略。

## 硬件支持

| 平台 | 执行路径 | 已验证能力 | 状态 |
|---|---|---|---|
| NVIDIA CUDA | 基于外部 `libtorch_cuda.so` 的 CUDA boxing | Eager、autograd、分布式（FlagCX/NCCL）、profiler（CUPTI）、FlagGems（Python + C++） | 稳定 |
| MetaX | 通过 cu-bridge 对厂商 libtorch 进行 CUDA boxing | Eager、autograd、AMP、低精度矩阵运算 | 稳定 |
| Ascend | 原生 ACLNN 后端，通过 FlagTree（Triton 3.5）使用 FlagGems | Eager、autograd、RNG 套件、profiler（MSPTI） | Beta |
| PPU | 针对 PPU CUDA 13 兼容 SDK 的 CUDA boxing | Eager、autograd、AMP | 实验性 |
| 海光 DCU | 基于 hipify 的 DTK torch 的 CUDA boxing | Eager、autograd、FP16/BF16 AMP、profiler | Beta |
| 燧原 GCU | 原生 topsaten 后端，未路由及 int64/float64 算子使用 CPU 回退 | Eager、AMP | Beta |
| 摩尔线程 MUSA | FlagGems 优先的 Triton 内核，原生 mudnn 回退，未路由算子使用 CPU 回退 | Eager、FP16/BF16 AMP | 实验性 |
| 地平线 BPU | 无 eager 内核；通过 hbdk4 使用 `torch.compile` 图执行路径 | 仅图编译 | 仅运行时 |
| 清微智能 | 已提供运行时构建选择器 | 尚无逐算子内核集合 | 仅运行时 |

包括 `torch.compile`、分布式与 profiler 在内的逐项能力状态，请参阅 {doc}`兼容性矩阵 <../reference/compatibility>`。
