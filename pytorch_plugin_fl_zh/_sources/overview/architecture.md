# 架构

PyTorch-Plugin-FL 注册一个 PyTorch 设备，并对到达该设备的每个算子进行路由。

![PyTorch-Plugin-FL 架构](../assets/images/pytorch-plugin-fl.png)

```text
PyTorch API
    |
flagos 设备（PrivateUse1）
    |
设备运行时 + 按算子路由
    |
FlagGems/编译器内核 | 兼容性 boxing | 厂商原生内核 | CPU 回退
    |
加速器运行时
```

## 设备注册

导入时，PyTorch-Plugin-FL 接管 `PrivateUse1` dispatch key，并以 `flagos` 名称发布：

1. `torch.utils.rename_privateuse1_backend("flagos")` 为 dispatch key 命名。
2. `torch._register_device_module("flagos", flagos)` 安装设备模块，使 `torch.flagos.*` 可用。
3. `torch.utils.generate_methods_for_privateuse1_backend(for_storage=True)` 生成 `.to("flagos")` 等张量与存储方法。
4. 设备模块同时以 `torch_flagos` 名称发布到 `sys.modules`，以满足会触发惰性初始化的平台上 `torch::utils::device_lazy_init` 按模块名的查找。

原生扩展（`torch_fl._C`）在加载时注册 `AutogradPrivateUse1` 回退和算子实现。由于该注册发生在 `dlopen` 时，插件会在加载扩展**之前**检查 `PrivateUse1` 是否仍未被占用；若已被其他厂商插件接管，会给出可操作的错误信息，而不是无法捕获的中止。

## 导入期阶段

`import torch_fl` 会执行一串固定的副作用序列。这些步骤的顺序是关键的 —— 顺序错误会导致 `dlopen` 中止或选错厂商构建，而不是抛出 Python 异常 —— 因此集中在一处管理：

| 阶段 | 作用 |
|---|---|
| 1. conf | 为本构建选择算子路由表；在启用时准备 MetaX `libcudart` shim |
| 2. preload | 在 `import torch` 之前选择并预加载厂商 libtorch 与 CUDA 资源 |
| 3. claim | 导入 `torch`、校验厂商运行时、接管 `PrivateUse1`、加载 `_C`、安装设备模块 |
| 4. vendor_compat | 安装厂商运行时 shim，并解析 FlagGems 厂商标识（`GEMS_VENDOR`） |
| 5. ecosystem | FlagGems 注册准备、CUDA 别名、分布式/DDP/DataParallel、编译后端 |

调试导入问题时有两个约束值得注意：厂商 libtorch 必须在 `import torch` 之前就位；`PrivateUse1` 归属检查必须早于 `_C` 加载。

## 组件布局

| 路径 | 职责 |
|---|---|
| `torch_fl/__init__.py` | 导入期阶段流水线、设备模块安装、生态补丁 |
| `torch_fl/_env.py` | 所有 `FLAGOS_*` 变量的唯一注册表与读取入口 |
| `torch_fl/flagos/` | 设备模块：流、事件、随机数、AMP、内存、用于追踪的 meta 内核 |
| `torch_fl/configs/` | 分平台路由表 `backends_<platform>.conf` |
| `torch_fl/accelerator/` | 各厂商兼容 shim 与运行时适配 |
| `torch_fl/compile/` | Inductor 后端、FlagTree shim、平台 profile、Triton 守卫 |
| `torch_fl/comm/` | `ProcessGroupFlagOS` |
| `torch_fl/distributed.py` | `init_process_group`、`DistributedDataParallel`、缓冲区搬迁辅助函数 |
| `torch_fl/quantization/` | 低精度格式、转换与模块 |
| `torch_fl/tileops/` | TileOps 算子库的 Python 侧（惰性导入） |
| `torch_fl/compat/` | Apex 与 flex-attention 兼容层 |
| `csrc/aten/` | ATen 层：调度器、boxing、生成的绑定、厂商后端 |
| `csrc/runtime/` | 设备运行时：分配器、guard、generator、各加速器实现 |
| `csrc/profiler/` | 与厂商无关的设备追踪器接口及各厂商追踪器 |
| `csrc/include/flagos.h` | 统一运行时 ABI（内存、流、设备、当前流注册表） |
| `scripts/codegen/` | 算子绑定生成器（CUDA boxing、ACLNN、topsaten、mudnn、TileOps） |
| `scripts/tools/` | 预检与校验工具，包括 `torch-fl-preflight` |
| `tests/unit`、`tests/integration`、`tests/manual`、`tests/perf` | 单元、硬件集成、手动与基准测试套件 |

## 算子调度

算子实现通过同一个 dispatch key 与同一张路由表到达：

- `csrc/aten/generated/` 下的生成绑定提供 CUDA boxing 内核、FlagGems Python 与 C++ 调用方以及 TileOps stub，它们都注册到 `PrivateUse1`。
- `csrc/aten/common.cc` 在首次调度时读取路由表：优先使用本构建选择的路由表，其次使用 `FLAGOS_BACKEND_CONFIG` 指定的文件。
- 厂商原生内核位于 `csrc/aten/backends/<vendor>/` 下，按该厂商库实际导出的算子面生成；生成器无法匹配的算子在给出告警后被跳过，继续走路由或 CPU 回退。
- 未路由的算子进入 `cpu_fallback`：执行 CPU 参考实现并把结果复制回设备。

`FLAGOS_LOG=dispatch` 会逐算子打印路由结果，`torch_fl.backend_config_path()` 返回实际使用的路由表。
