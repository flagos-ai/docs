# 安装

## 选择平台

每个平台由一个构建变量 `FLAGOS_ACCELERATOR` 选择，并且各自有独立的执行路径：

| 平台 | `FLAGOS_ACCELERATOR` | 执行路径 | 状态 |
|---|---|---|---|
| NVIDIA CUDA | `cuda`（默认） | 基于外部 `libtorch_cuda.so` 的 CUDA boxing | 稳定 |
| MetaX | `metax` | 通过 `cu-bridge` 对厂商 libtorch 进行 CUDA boxing | 稳定 |
| Ascend | `ascend` | 原生 ACLNN 算子后端，通过 FlagTree（Triton 3.5）使用 FlagGems | Beta |
| PPU | `ppu` | 与 NVIDIA CUDA 相同的 CUDA boxing 路径，针对 PPU CUDA 13 兼容 SDK，自带 libtorch | 实验性 |
| 海光 DCU | `dcu` | 基于 hipify 的 DTK torch 构建的 CUDA boxing | Beta |
| 燧原 GCU | `gcu` | 原生 `libtopsaten.so` 算子后端，未路由及 int64/float64 算子使用 CPU 回退 | Beta |
| 摩尔线程 MUSA | `musa` | FlagGems 优先的 Triton 内核，原生 `mudnn` 回退，未路由算子使用 CPU 回退 | 实验性 |
| 地平线 BPU | `bpu` | 不构建 eager 内核集合；eager 算子在 CPU 上执行，加速来自图编译路径 | 仅运行时 |
| 清微智能 | `tsingmicro` | 已提供运行时/构建选择器，尚无逐算子内核集合 | 仅运行时 |

## 通用要求

所有平台都需要：

- **Python**：3.8 或更高版本（平台 SDK 与可用 wheel 可能要求更窄的范围）
- **PyTorch**：2.10.x（`>=2.10,<2.11`）— 生成的 ATen 绑定与该次版本线绑定
- **CMake**：3.18 或更高版本
- **C++ 工具链**：可用的 C++17 编译器（GCC 7+、Clang 5+ 或 MSVC 2017+）
- **平台 SDK/运行时**：对应加速器的厂商 SDK、编译器与运行时库

同一 PyTorch 次版本线内的补丁版本（例如 2.10.0 → 2.10.1）互相兼容；跨次版本（例如 2.11.x）会在构建或运行时失败，因为生成的绑定对 C++ ABI 与算子 schema 变化敏感。

## 源码安装约定

各平台的安装遵循同一模式：

```bash
FLAGOS_ACCELERATOR=<platform> pip install --no-build-isolation -e .
```

`--no-build-isolation` 是必需的：否则 pip 会创建隔离的构建环境，看不到当前环境中的 PyTorch 与平台 SDK，生成的本地绑定就会链接到错误的 torch，或找不到厂商 SDK。

上游仓库中每个平台目录（`docs/vendors/<platform>/installation.md`）给出该平台的 SDK 环境变量与额外构建开关。各平台要点如下：

### NVIDIA CUDA

```bash
git clone https://github.com/flagos-ai/Torch-FL.git && cd Torch-FL

pip install torch==2.10.0+cpu --index-url https://download.pytorch.org/whl/cpu

FLAGOS_ACCELERATOR=cuda pip install --no-build-isolation -vvv -e .
```

该构建根据 PyTorch 的 ATen schema 生成 CUDA boxing 内核，把 `libtorch_cuda.so` 及相关 CUDA 调度库打包到 `torch_fl/lib/`，并固定与之匹配的 `nvidia-*-cu12` 运行期依赖。要求：计算能力 7.0 及以上的 NVIDIA GPU、470 及以上的驱动、用于构建的 CUDA 12.x 工具包，以及 `cmake`、`ninja`、`patchelf`。

可选的 FlagGems C++ 调度路径（开销最低的 FlagGems 路由）：

```bash
FLAGOS_ACCELERATOR=cuda \
  FLAGOS_BUILD_FLAGGEMS_CPP=1 \
  FLAGGEMS_DIR=<path-to-FlagGems>/lib/cmake/FlagGems \
  pip install --no-build-isolation -vvv -e .
```

### MetaX

MetaX 使用自包含的 boxing wheel：CUDA boxing 内核用宿主 `g++` 编译，MetaX 分支版 libtorch C++ 运行时直接打包进 wheel。目标机器只需要官方 `torch==2.10.0+cpu` wheel、`torch_fl` wheel 以及 `/opt/maca` 驱动运行时。

wheel 在具备完整 MACA SDK 与 `torch+metax` wheel（两者均来自 MetaX 开发者门户）的机器上构建：先生成 boxing 产物，再用 `scripts/vendor/bundle_maca_libtorch.sh` 打包分支版 libtorch，最后重新打包 wheel。产物体积较大（打包的 libtorch 使其超过 PyPI 的体积限制），通过私有源或直接传输分发。

目标主机上：

```bash
pip install torch==2.10.0+cpu --index-url https://download.pytorch.org/whl/cpu
pip install torch_fl-<version>+<sdk>.whl
```

`FLAGOS_WHEEL_LOCAL` 会把目标 SDK 写入 wheel 的本地版本号（例如 `0.1.0+metax3.8.1`），避免两个 SDK 不兼容的 wheel 仅凭文件名无法区分。

**MetaX 上导入顺序很重要**：必须先导入 `torch_fl` 再 `import torch`。PyTorch 自带的 CUDA 12.x 运行时与 MACA 的 `cu-bridge` ABI 不兼容，`torch_fl` 会预加载一个提供所需符号版本的 shim。

### Ascend

```bash
pip install torch==2.10.0 --index-url https://download.pytorch.org/whl/cpu
source /usr/local/Ascend/ascend-toolkit/set_env.sh

FLAGOS_ACCELERATOR=ascend pip install --no-build-isolation -v -e .
```

要求：Ascend 910 与 CANN 9.0.0 或兼容版本、可访问的 `/dev/davinci*` 设备节点；若使用 FlagTree Ascend 3.5 wheel（仅提供 cp311），需要 Python 3.11，纯 ACLNN 构建则 Python 3.8+ 即可。

默认配置为已验证算子启用 FlagGems Python 路由，并以原生 ACLNN 内核作为回退。`scripts/codegen/codegen_ascend.py` 生成 ACLNN 内核；没有 ACLNN 映射的算子回退到 CPU。

Ascend 上的 FlagGems 运行在 **FlagTree**（FlagOS 的 Triton 分支）的 Ascend 3.5 线上。FlagTree 安装的模块名是 `triton`，因此需先移除官方或厂商 Triton，再从 FlagOS 源安装 FlagTree 与 FlagGems。该路径不会导入或链接 `torch_npu`：后端会安装轻量的 `torch_npu` stub，并在 FlagTree 的策略注册表上注册自己的 `flagos` 策略。

**Ascend 上导入顺序同样重要**：在可能注册设备后端的其他包之前导入 `torch_fl`。

### PPU

PPU 表现为 CUDA 兼容设备：其 torch wheel 是完整的 CUDA 13 构建，并在 `CUDA` dispatch key 下注册算子，因此不需要官方 `+cpu` wheel，也不需要外部 `libtorch_cuda.so`。

```bash
FLAGOS_ACCELERATOR=ppu \
  CUDA_HOME=/usr/local/PPU_SDK/CUDA_SDK \
  FLAGOS_BUILD_FLAGGEMS_CPP=OFF \
  FLAGOS_BUILD_FLAGGEMS=OFF \
  FLAGOS_SKIP_CUDA_ASSETS=1 \
  pip install --no-build-isolation -vvv -e .
```

运行期需导出 `FLAGOS_DISABLE_CUDA_ASSETS=1`，使导入期对打包 `libtorch_cuda.so` 的预加载成为空操作（PPU torch 自带该运行时）。

### 海光 DCU

```bash
source /opt/dtk/env.sh

FLAGOS_ACCELERATOR=dcu pip install --no-build-isolation -vvv -e .
```

该构建为纯 boxing：DTK torch wheel 把 HIP 内核注册在 `CUDA` dispatch key 下，生成的 boxing 内核原样分发到 `libtorch_hip.so`，运行时源码用宿主 `g++` 直接编译 —— 不需要 `nvcc`、`hipcc` 或 hipify。FlagGems Python 路径默认开启；FlagGems C++ 路径保持关闭，因为 DTK 未提供 `liboperators.so`。

### 燧原 GCU

```bash
pip install torch==2.10.0 --index-url https://download.pytorch.org/whl/cpu

FLAGOS_ACCELERATOR=gcu pip install --no-build-isolation -v -e .
```

需要 TopsRider SDK（`libtopsrt.so` 运行时与 `libtopsaten.so` 算子库）。构建会运行 `scripts/codegen/codegen_gcu.py`，按已安装 `libtopsaten.so` 中实际存在的 `topsaten` 符号校验每个算子；SDK 中缺失的算子会给出告警并跳过。`torch-gcu` wheel 不能与 PyTorch-Plugin-FL 同时使用，因为它会自行占用 `PrivateUse1`。

### 摩尔线程 MUSA

```bash
pip install torch==2.10.0 --index-url https://download.pytorch.org/whl/cpu

FLAGOS_ACCELERATOR=musa pip install --no-build-isolation -v -e .
```

需要 `/usr/local/musa` 下的 MUSA 工具包：`musart`（运行时）、`mudnn`（算子库）与 `murand`（设备随机数）。构建会运行 `scripts/codegen/codegen_mudnn.py`；覆盖范围为生成的算子集合加手写卷积内核，另有原生 RNG 内核，其余算子走 CPU 回退。此处 `--no-build-isolation` 是强制要求：否则 pip 的构建叠加层会解析出自己的 torch，导致 `import torch_fl` 因未定义的 `c10` 符号而失败。

### 地平线 BPU

```bash
pip install torch==2.10.0+cpu --index-url https://download.pytorch.org/whl/cpu
FLAGOS_ACCELERATOR=bpu pip install --no-build-isolation -e .
```

BPU 平台只提供运行时加速：不存在逐算子 BPU 内核，eager 算子通过回退在 CPU 上执行，加速来自整图编译（`torch.compile(backend="bpu")`）或预构建 HBM 的 LLM 运行时。图编译需要 `hbdk4`，其 wheel 仅提供 x86_64 版本。

## 构建期开关

`setup.py` 会为内核集合开关强制指定各平台取值，并拒绝与之矛盾的环境变量显式取值：

| 变量 | 默认值 | 作用 |
|---|---|---|
| `FLAGOS_ACCELERATOR` | `cuda` | wheel 面向的硬件平台 |
| `FLAGOS_BUILD_VENDOR` | `ON`，`metax` 上为 `OFF` | 编译厂商原生内核（厂商未提供时为空操作） |
| `FLAGOS_BUILD_FLAGGEMS` | `ON`，`bpu` 上为 `OFF` | 编译 FlagGems Python 内核包装 |
| `FLAGOS_BUILD_FLAGGEMS_CPP` | `cuda`/`tsingmicro` 上为 `ON` | 编译 FlagGems C++ 包装（`liboperators.so`） |
| `FLAGOS_BUILD_BOXING` | `ON`，`ascend`/`gcu`/`musa` 上为 `OFF` | 编译生成的 CUDA boxing 内核 |
| `FLAGOS_BUILD_TILEOPS` | `cuda` 上为 `ON` | 编译 TileOps 内核包装（NVIDIA SM90 芯片） |
| `FLAGOS_BUILD_JOBS` | CPU 核数 | CMake 构建并行任务数 |
| `FLAGOS_SKIP_CUDA_ASSETS` | `0` | 不打包外部 `libtorch_cuda.so` |
| `FLAGOS_WHEEL_LOCAL` | 由 SDK 推导 | wheel 的本地版本标记 |

wheel 会把构建时使用的加速器与内核集合记录在 `torch_fl/_build_config.py` 中，运行期所有读取方都以该记录为准 —— 环境中残留的旧变量不会让 wheel 错误地描述自身。完整变量说明见 {doc}`环境变量参考 <../reference/environment-variables>`。

## 安装校验

```bash
python -c "
import torch_fl
import torch

print(f'PyTorch version: {torch.__version__}')
print(f'flagos devices: {torch.flagos.device_count()}')
print(f'flagos available: {torch.flagos.is_available()}')

x = torch.randn(4, 4, device='flagos:0')
y = (x @ x).sum()
print(f'Sample result: {y.cpu().item():.4f}')
"
```

安装正常时会输出当前机器的设备数量与一个浮点结果。若设备数量为 0，请检查厂商 SDK 安装、驱动、设备节点以及上文的导入顺序规则。

## 测试

```bash
# 单元测试：不依赖硬件
pytest tests/unit -q

# 当前后端上的算子正确性
pytest tests/integration/ops/ -m main_ops -v --tb=short

# 工厂算子是否遵循设备放置
pytest tests/integration/test_factory_ops.py -v --tb=short
```

算子测试通过 `tests/integration/ops/conftest.py` 中注册的标记筛选：

| 标记 | 含义 |
|---|---|
| `main_ops` | CI 冒烟子集中的代表性算子 |
| `anyplatform` | 可在任意加速器后端运行 |
| `cuda`、`metax`、`ascend`、`musa` | 需要对应后端的内核或硬件 |
| `flaggems` | 校验 `backends_<platform>.conf` 中的 FlagGems 路由 |
| `flaggems_python` | 需要 FlagGems Python 包装后端 |
| `flaggems_cpp` | 需要以 `FLAGOS_BUILD_FLAGGEMS_CPP=ON` 构建的 wheel |

跨后端契约测试（profiler、AMP）通过 `tests/integration/conftest.py` 中的 `profiler*` 与 `amp*` 标记筛选；当当前平台不提供某项能力时，测试会带平台名的原因跳过，而不是伪造通过。

测试筛选是自动的：conftest 从 wheel 的构建记录、已安装平台标记或路由表名称探测平台，并跳过为不可用后端标记的测试。单元测试、模型测试与手动套件详见上游 `docs/development/testing.md`。

## 下一步

- {doc}`兼容性矩阵 <../reference/compatibility>` — 分平台能力验证
- {doc}`环境变量 <../reference/environment-variables>` — 构建与运行期配置
- {doc}`分布式集合通信 <../architecture/distributed>` — `ProcessGroupFlagOS` 与 FlagCX
- {doc}`Profiler <../architecture/profiler>` — `torch.profiler` 集成
- {doc}`torch.compile <../architecture/torch-compile>` — Inductor 与 FlagTree 集成
