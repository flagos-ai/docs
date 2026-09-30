# 环境变量

PyTorch-Plugin-FL 有自己的一套命名空间 `FLAGOS_*`，另外还会读取属于其他项目（torch、FlagGems、FlagCX、TileLang、厂商 SDK）的一组变量，但不拥有它们。本页记录用户需要配置的变量；完整且权威的清单是 `torch_fl/_env.py` 中的 `VARIABLES` 注册表，上游仓库的 `docs/reference/environment-variables.md` 与它逐项对齐，并由单元测试校验。

这里没有任何一项是运行 wheel 所必需的：wheel 在空环境下即可完成路由、编译与运行。这些变量用于选择不同的构建、为测量而覆盖某项设置，或打开诊断。

## 取值规则

- **布尔值**：`1`/`true`/`on`/`yes`（不区分大小写）为开；`0`/`false`/`off`/`no` 为关。其他取值不是布尔值 —— 会输出一次告警并使用该变量的默认值，而不会把该值当作真值。
- **空值等于未设置**：`FLAGOS_LOG=${EXTRA_LOG}` 在 `EXTRA_LOG` 未设置时等同于从未导出 `FLAGOS_LOG`，因此默认开启的开关会保持开启。
- **枚举**：命名模式的开关（而非布尔开关）在收到范围外的取值时会列出可选值并使用默认值。
- **未知名称**：`import torch_fl` 会扫描一次环境，对既未声明、也不属于动态 `FLAGOS_OP_<op>` 族的任何 `FLAGOS_*` 名称给出告警 —— 否则拼写错误的开关会无人读取、静默失效。

## 构建选择

这些变量是 `setup.py` 与 CMake 构建的输入，运行期没有任何代码读取它们。wheel 会记录构建时的取值，运行期读取方以该记录为准。

| 变量 | 默认值 | 作用 |
|---|---|---|
| `FLAGOS_ACCELERATOR` | `cuda` | wheel 面向的平台：`cuda`、`ppu`、`metax`、`ascend`、`tsingmicro`、`dcu`、`gcu`、`musa`、`bpu` |
| `FLAGOS_BUILD_VENDOR` | `ON`，`metax` 上为 `OFF` | 编译厂商原生内核（厂商未提供时为空操作） |
| `FLAGOS_BUILD_FLAGGEMS` | `ON`，`bpu` 上为 `OFF` | 编译 FlagGems Python 内核包装 |
| `FLAGOS_BUILD_FLAGGEMS_CPP` | `cuda`、`tsingmicro` 上为 `ON` | 编译 FlagGems C++ 包装（`liboperators.so`） |
| `FLAGOS_BUILD_BOXING` | `ON`，`ascend`、`gcu`、`musa` 上为 `OFF` | 编译生成的 CUDA boxing 内核 |
| `FLAGOS_BUILD_TILEOPS` | `cuda` 上为 `ON` | 编译 TileOps 内核包装（TileLang，NVIDIA SM90） |
| `FLAGOS_BUILD_JOBS` | CPU 核数 | CMake 构建并行任务数 |
| `FLAGOS_WHEEL_LOCAL` | 由 SDK 推导 | 本地版本标记，例如 `metax3.8.1` |
| `FLAGOS_SKIP_CUDA_ASSETS` | `0` | 不打包外部 `libtorch_cuda.so` |
| `FLAGOS_CUDA_ASSETS_DIR` | `.libtorch_cuda_assets` | 外部 `libtorch_cuda.so` 的拷贝来源目录 |
| `FLAGOS_DCU_VENDOR_CORE` | `0` | 使用 DTK 分支版核心库替代官方 PyTorch 核心库（构建与导入期必须一致） |

与平台强制取值相矛盾的环境变量显式取值会被拒绝，并在错误信息中同时点名两者，而不是让 CMake 最后看到的那个生效。

## 算子路由

决定每个算子分发到哪个后端实现。路由在生成的 `torch_fl/configs/backends_<platform>.conf` 中逐算子声明，下列变量用于覆盖或扩展该表。

| 变量 | 默认值 | 作用 |
|---|---|---|
| `FLAGOS_BACKEND_CONFIG` | 无 | 指向某个 `backends_*.conf` 的绝对路径，覆盖由构建记录选择的路由表。用于测试与调试 |
| `FLAGOS_OP_<name>` | 无 | 逐算子覆盖，例如 `FLAGOS_OP_add__Tensor=cuda`（算子名中的 `.` 替换为 `__`） |
| `FLAGOS_FORCE_BACKEND` | 无 | 把所有算子重新固定到某个后端族（`flaggems`、`vendor`、`tileops`），用于 A/B 测量 |
| `FLAGOS_DISABLE_FLAGGEMS_PY` | `0` | 不注册 FlagGems Python 层（仅 C++ 桩模式） |

`torch_fl.backend_config_path()` 返回实际使用的路由表；`FLAGOS_BACKEND_CONFIG` 中只保留用户导出的值，因此读取它即可回答「我是否覆盖了路由表」。

## 运行期诊断

| 变量 | 默认值 | 作用 |
|---|---|---|
| `FLAGOS_LOG` | 无 | 逗号分隔的 stderr 诊断：`dispatch`（每个算子选中的后端）、`fallback`（每次 CPU 回退调度）、`op_cache`（Ascend 算子缓存统计） |
| `FLAGOS_TRACE` | `0` | 设备 profiler shim 的详细日志 |
| `FLAGOS_TRACER_LIBRARY` | 自动探测 | 覆盖 profiler shim 加载的追踪器库 |

## 分布式

| 变量 | 默认值 | 作用 |
|---|---|---|
| `FLAGOS_DIST_REDIRECT_GLOO` | `1` | 当进程加速器是 flagos 设备时，用 flagos 后端响应普通的 `init_process_group(backend="gloo")` 或 `new_group` 请求 |
| `FLAGOS_DIST_STAGED_GLOO` | `1` | 允许 host-staged gloo 内部后端，即无厂商通信库时的最后一级回退。设为 `0` 时直接失败而不做 staged 拷贝 |
| `FLAGOS_DIST_FORCE_NCCL` | `0` | 在 MetaX 手动分布式测试中跳过 FlagCX 而使用 NCCL |

## 厂商与框架兼容

导入期安装的兼容层，用于适配厂商运行时或其他框架对设备的假设。标准 CUDA 机器上无需任何一项。

| 变量 | 默认值 | 作用 |
|---|---|---|
| `FLAGOS_ALIAS_CUDA` | `1` | 为兼容性把 `cuda` 设备字符串别名到 `flagos`；设为 `0` 可关闭 |
| `FLAGOS_DISABLE_CUDA_SHIM` | `0` | 不注册面向通用 GPU 操作的 `torch.cuda` 兼容 shim |
| `FLAGOS_METAX_CUDART_SHIM` | `0` | 在 `import torch` 之前预加载 `libcudart` 版本标记 shim；MetaX 搭配通用 PyTorch wheel 时必需 |
| `FLAGOS_METAX_COMPAT` | `0` | 为 MetaX 兼容性补丁 FlagGems 的 `torch.cuda` 设备查询 |
| `FLAGOS_DCU_HIP_VERSION` | 无 | 覆盖 DCU 运行时的 HIP 版本探测 |
| `FLAGOS_DCU_SKIP_RUNTIME_CHECK` | `0` | 跳过 DCU 导入后检查，用于刻意测试不匹配的 wheel 组合 |
| `FLAGOS_DCU_SDPA_FLASH` | `1` | 在 DCU 上让 DTK 的 SDPA 选择器使用其 CUTLASS flash 适配器，而非强制数学分解 |
| `FLAGOS_DISABLE_APEX_COMPAT` | `0` | 关闭可选的 Apex 多张量兼容层 |
| `FLAGOS_DISABLE_QWENIMAGE_ROPE` | `0` | 保留 `diffusers` 的 Qwen-Image 旋转位置编码表原样，以便测量差异 |
| `FLAGOS_DISABLE_FLEX_ATTENTION_COMPAT` | `0` | 保留 flex-attention 硬编码的 `{cuda, cpu, xpu, hpu}` 设备白名单 |

## 资源、库与编译

| 变量 | 默认值 | 作用 |
|---|---|---|
| `FLAGOS_DISABLE_CUDA_ASSETS` | `0` | 跳过对打包 `libtorch_cuda.so` 与 CUDA 库的预加载（用于树内构建与 PPU） |
| `FLAGOS_VENDOR_TORCH_LIB` | 自动探测 | 未打包厂商 libtorch 时，指向厂商 torch 的 `lib` 目录 |
| `FLAGOS_USE_CACHING_ALLOCATOR` | `1` | 缓存设备分配器；设为 `0` 时每次分配都交给厂商运行时 |
| `FLAGOS_USE_FLAGTREE` | `0` | 断言当前 Triton 是 FlagTree 构建（Ascend 上使用 FlagTree 编译器时必需） |
| `FLAGOS_COMPILE_FALLBACK_EAGER` | `0` | `torch.compile` 遇到不支持的算子时回退 eager |
| `FLAGOS_TILEOPS_USE_L2` | `0` | 使用 TileOps 的 L2 缓存层级 |
| `FLAGOS_TILEOPS_CACHE_MAX` | `512` | TileOps 实例缓存容量 |
| `FLAGOS_TILEOPS_DISABLE_ALL_CACHE` | `0` | 关闭所有 TileLang 缓存（正确但慢；须在导入 `tileops` 之前设置） |

## BPU 编译器

BPU 的图路径在 x86 主机上经 `hbdk4` 编译。`FLAGOS_BPU_MARCH` 选择微架构（`nash-p`、`nash-e`、`nash-m`）；`FLAGOS_BPU_QUANTIZE`（默认开启）通过插入 int8 量化让卷积留在设备上执行；`FLAGOS_BPU_CACHE` 设置编译器缓存目录；`FLAGOS_BPU_X86_PYTHON`、`FLAGOS_BPU_X86_EMULATOR`、`FLAGOS_BPU_X86_STUBS` 描述板上编译所用的 x86 主机与模拟器。

完整的变量清单 —— 包括由其他项目拥有、此处仅作互操作读取的名称，仅供代码生成使用的输入，以及保留但不再生效的历史名称 —— 维护在上游仓库的 `docs/reference/environment-variables.md`，并与 `torch_fl/_env.py` 中的注册表一一对应。
