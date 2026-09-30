# 兼容性与平台支持

## 状态定义

| 状态 | 含义 |
|---|---|
| 稳定 | 关键路径持续接受测试，并已记录受支持的版本组合。 |
| Beta | 主要路径已经验证，但覆盖范围、打包或发布流程尚未稳定。 |
| 实验性 | 已在特定配置、模型或硬件环境中完成验证；接口或构建流程仍可能变化。 |
| 仅运行时 | 已提供设备运行时支持，但该平台不是通用 eager 算子后端。 |

## 项目兼容性

| 组件 | 支持范围 | 说明 |
|---|---|---|
| Python | 3.8 或更高版本 | 平台 SDK 与可用 wheel 可能要求更窄的范围 |
| PyTorch | 2.10.x（`>=2.10,<2.11`） | 生成的 ATen 绑定与该次版本线绑定 |
| FlagGems | 取决于平台 | 仅在平台路由使用 FlagGems 时，从 PyPI 或厂商兼容构建安装 |
| Triton/编译器 | 取决于平台 | 使用所选加速器要求的编译器发行版；平台基于 FlagTree 时使用 FlagTree |

### ATen 次版本线固定

PyTorch-Plugin-FL 会为 PyTorch 内部的 ATen 算子注册表生成原生绑定。这些绑定对 C++ ABI 与算子 schema 变化敏感，因此项目固定在某个 PyTorch 次版本线上 —— 当前为 **2.10.x**。使用不同的次版本（例如 2.11.x）会导致构建或运行失败；同一次版本线内的补丁版本（2.10.0 → 2.10.1）互相兼容。

### wheel 兼容性记录

每个构建出的 wheel 都带有 `torch_fl/compatibility.json`，其中记录所选的平台与内核集合、打包的 libtorch 位置、构建期 PyTorch 版本与 C++ ABI 标记、构建时观测到的 FlagTree/FlagGems/FlagCX 版本、在由厂商提供设备库时显式声明的厂商 PyTorch 版本，以及 wheel 的 Python 依赖要求。只有当构建者把 `FLAGOS_SDK_VERSION` 设为已验证值时才记录 SDK 版本；缺失表示**未知**，而不是「兼容所有 SDK」。

```bash
python scripts/tools/torch-fl-preflight --wheel dist/torch_fl-*.whl --platform cuda \
  --sdk-version 13.3 --check-installed
```

`torch-fl-preflight` 运行时不会导入 `torch_fl`，因此检查不会触发后端导入副作用。`--check-installed` 对比声明的依赖范围与已安装环境，`--check-build-env` 要求精确的构建期版本，`--require-sdk` 拒绝未声明 SDK 的 wheel；使用 `--release --markdown-table` 可由最终 wheel 文件生成发布对照表。

## 平台矩阵

| 平台 | 构建选择器 | 执行路径 | Eager 与 autograd | torch.compile | 分布式 | Profiler | FlagGems | 状态 |
|---|---|---|---|---|---|---|---|---|
| NVIDIA CUDA | `FLAGOS_ACCELERATOR=cuda`（默认） | 基于外部 `libtorch_cuda.so` 的 CUDA boxing | 稳定 | 实验性（已注册 Inductor GPU 设备，CI 无该步骤） | Beta（FlagCX + NCCL 回退，DDP 已实测） | 稳定（CUPTI 对等性） | Beta（Python + C++ 调度路径） | 稳定 |
| MetaX | `FLAGOS_ACCELERATOR=metax` | 通过 `cu-bridge` 对厂商 libtorch 进行 CUDA boxing | 稳定（boxing 模式下实测 FP16/BF16 autocast 与 GradScaler） | 实验性（厂商 Triton 与 FlagTree 已在 C550 上实测） | 实验性（NCCL 形态的 `mccl` 回退，未纳入 CI） | 实验性（MCPTI 对等性已在 C550 上实测，未纳入 CI） | 实验性（Python 调度，MetaX 上未做 CI 测试） | 稳定 |
| Ascend | `FLAGOS_ACCELERATOR=ascend` | 原生 ACLNN 后端，通过 FlagTree（Triton 3.5）使用 FlagGems | 稳定（CI 覆盖的算子与 RNG 套件） | 实验性（仅在 910 + triton-ascend 上测过 Inductor，未在 FlagTree 上复验；CI 无该步骤） | 实验性（HCCL 回退；仅架构层面路由） | Beta（MSPTI 事件与设备时间关联由共享契约覆盖 CI，对等性套件未纳入） | Beta（Python 调度；float64 与 bool 的 `neg` 路由回退 ACLNN） | Beta |
| PPU | `FLAGOS_ACCELERATOR=ppu` | 针对 PPU CUDA 13 兼容 SDK 的 CUDA boxing，自带 libtorch | 实验性（FP16/BF16 autocast 与 GradScaler 已在 PPU 硬件上实测，未纳入 CI） | 未验证 | 实验性（经厂商适配的 `libnccl.so.2` 实现 NCCL 回退，未纳入 CI） | 未在该厂商追踪器上验证 | 实验性（需要厂商源 Triton） | 实验性 |
| 海光 DCU | `FLAGOS_ACCELERATOR=dcu` | 基于 hipify 的 DTK torch 构建的 CUDA boxing | Beta（含 FP16/BF16 autocast 与 GradScaler） | 实验性（FlagTree HCU 已在 `gfx936` 上验证，未纳入 CI） | 实验性（经 DTK 的 RCCL；`all_reduce`/DDP 已在 2 卡上实测） | Beta（对等性套件在 CI 中运行） | Beta（仅 Python 调度） | Beta |
| 燧原 GCU | `FLAGOS_ACCELERATOR=gcu` | 原生 `libtopsaten.so` 后端，未路由及 int64/float64 算子使用 CPU 回退 | Beta（算子、RNG、工厂与 AMP 套件在 S60 上由 CI 守卫） | 未验证 | 未验证 | 仅运行时（TOPSPTI 采集活动，但仅有 CPU 的 Kineto 构建不产生设备事件） | 实验性（Python 调度，需要厂商 Triton） | Beta |
| 摩尔线程 MUSA | `FLAGOS_ACCELERATOR=musa` | 原生 `mudnn` 后端，未路由算子使用 CPU 回退 | 实验性（FP16/BF16 autocast 与 GradScaler 已在 MTT S5000 上实测） | 实验性（FlagTree 前反向已在 MTT S5000 上实测，需要厂商运行时） | 未验证 | 实验性（MUPTI 设备时间线已在 MTT S5000 上实测） | 实验性（Python 调度，需要厂商 Triton） | 实验性 |
| 地平线 BPU | `FLAGOS_ACCELERATOR=bpu` | 不构建 eager 内核集合，eager 算子在 CPU 上执行 | 仅运行时（eager 走 CPU 回退） | 实验性（经 hbdk4 的 `torch.compile(backend="bpu")` 图路径） | 不适用 | 未验证 | 不适用（无逐算子内核构建） | 仅运行时 |
| 清微智能 | `FLAGOS_ACCELERATOR=tsingmicro` | 已提供运行时/构建选择器，无逐算子内核集合 | 仅运行时 | 未验证 | 未验证 | 未验证 | 不适用 | 仅运行时 |

## 如何阅读本矩阵

- **Eager 与 autograd** 是主要算子路径；“稳定”表示该平台的关键路径持续接受测试。
- **torch.compile** 在多数平台上仍属实验性：仅在特定硬件上验证，多个平台尚无对应 CI 步骤。详见 {doc}`torch.compile 集成 <../architecture/torch-compile>`。
- **分布式**评级反映的是已实测的集合通信与 DDP 覆盖范围，而不是代码是否存在。详见 {doc}`分布式集合通信 <../architecture/distributed>`。
- **Profiler** 评级描述平台满足 `torch.profiler` 契约的哪些部分。详见 {doc}`Profiler 集成 <../architecture/profiler>`。
- **FlagGems** 表示该平台可用可移植的 Triton 内核路由；其可用性与正确性分别测量。

这里的评级描述的是平台，而不是某次构建。仅编译了部分内核集合（`FLAGOS_BUILD_*`）的 wheel 只支持该平台能力的一个子集 —— 对该 wheel 而言，其自身的构建记录才是权威依据。
