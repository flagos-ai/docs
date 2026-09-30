# torch.compile 集成

`flagos` 设备支持 `torch.compile`，可实现自动内核融合并降低调度开销。计算图始终留在 `flagos` 设备上：不存在设备往返，也没有图边界处的拷贝。

## 快速开始

```python
import torch_fl  # MetaX 与 Ascend 上必须先导入
import torch

model = torch.nn.Sequential(
    torch.nn.Linear(512, 512),
    torch.nn.ReLU(),
    torch.nn.Linear(512, 512),
).to("flagos:0")

model = torch.compile(model, backend="flagos")

x = torch.randn(64, 512, device="flagos:0")
y = model(x)  # 自动使用融合后的内核
```

编译模式：

```python
model = torch.compile(model, backend="flagos")                       # 默认
model = torch.compile(model, backend="flagos", mode="max-autotune")   # 编译更久，运行更快
model = torch.compile(model, backend="flagos", options={"max_autotune": True})
```

`mode` 与 `options` 会展开为仅作用于该次编译的 Inductor 配置补丁。该后端始终关闭 CUDA graphs，因此以 CUDA graphs 为主要手段的 `mode="reduce-overhead"` 在这里效果有限。

## FlagTree 编译

[FlagTree](https://github.com/flagos-ai/FlagTree) 是 Triton 的分支，其编译器面向多种厂商后端。它的集成方式是在**安装期替换**，这是理解它的关键：

- 它的 wheel 名为 `flagtree`，但安装的模块是 `triton`。
- 安装它会卸载官方 `triton` 并取而代之。
- 因此 Inductor 自身的 `import triton` 在安装后就已经指向 FlagTree，PyTorch-Plugin-FL 不需要对 `sys.modules` 做任何补丁。

后端编译器在 FlagTree 构建期通过 `FLAGTREE_BACKEND` 选择（NVIDIA 与 AMD 不设置），而不是运行期：同一份 Triton 内核代码为不同厂商后端编译。`is_flagtree_active()` 用于检测 FlagTree 构建，`FLAGOS_USE_FLAGTREE=1` 断言当前 Triton 必须是 FlagTree —— 不满足时直接报错，而不是静默使用官方 Triton 编译。

由于安装 FlagTree 会移除既有 `triton`，在 `triton` 已被 FlagGems 使用的机器上应将其构建到独立的虚拟环境中。FlagTree 0.6.2 及之后的 wheel 还会安装真实的 `flagtree` 包（FlagPrism 调试器/profiler 的宿主）；访问 FlagTree 仍然通过 `triton`。

## 后端内部组成

| 组件 | 职责 |
|---|---|
| `torch_fl/compile/inductor_backend.py` | 向 `torch._dynamo` 注册 `flagos` 后端，并接入 Inductor 的设备接口 |
| `torch_fl/compile/device_interface.py` | `flagos` 设备的 Inductor GPU 设备注册 |
| `torch_fl/flagos/meta.py` | meta 内核，使追踪阶段能为缺少默认 meta 实现的算子推断输出形状 |
| `torch_fl/compile/flagtree_shim.py` | FlagTree 检测（`is_flagtree_active`、`require_flagtree`），不做导入补丁 |
| `torch_fl/compile/platform_profile.py` | 各平台代码生成 profile 与厂商绕过措施 |
| `torch_fl/compile/triton_*.py` | Triton 集成守卫：64 位索引、字节 load、libdevice、资源上限 |
| `torch_fl/compile/flagtree_ascend_policy.py` | FlagTree 策略注册表上的 Ascend 后端策略，从 `torch.flagos` 而非 `torch_npu` 取答案 |

## 平台差异

- **Ascend** — 通过 FlagTree 的 Ascend 后端编译；插件自有的 `flagos` 策略从自身运行时回答 FlagTree 的策略名称，并强制 `TRITON_ENABLE_TASKQUEUE=false`（任务队列仅 `torch_npu` 支持）。未纳入 CI。
- **PPU** — FlagTree 在异步 Inductor worker 中选取编译提示时会初始化 CUDA，可能在父进程已初始化 PPU context 后失败，因此 PPU 的 FlagTree 默认串行编译。仅在验证上游修复或刻意选择其他 worker 配置时才显式设置 `TORCHINDUCTOR_COMPILE_THREADS`。
- **MetaX** — `torch.compile` 已在 CUDA boxing 模式下使用厂商 Triton 与 FlagTree main 验证。
- **燧原 GCU** — 64 位代码生成守卫把「不支持 64 位」的失败转换为指名算子的可操作错误，见故障排查。
- **地平线 BPU** — 编译是唯一的加速路径：`torch.compile(backend="bpu")` 追踪计算图，经 hbdk4 编译为 `.hbm` 产物并在 BPU 上执行，默认插入 int8 量化。
- **CUDA** — `flagos` 已注册为一等 Inductor GPU 设备。CUDA 的 CI 任务中没有 `torch.compile` 步骤，该路径由集成测试而非 CI 覆盖。

## 性能

融合收益已做正确性验证（`tests/integration/test_compile.py`）；与 CUDA 上官方 Inductor 的收益对比基准测试仍待开展。从结构上看两者应当接近 —— 相同的融合 pass、相同的 Triton 代码生成、因为计算图留在 flagos 而不存在每次调用的拷贝 —— 但这是预期而非实测结论。

```bash
python tests/perf/bench_compile.py --model=mlp --batch-size=64
python tests/perf/bench_compile.py --model=transformer --compare-cuda
FLAGOS_USE_FLAGTREE=1 python tests/perf/bench_compile.py
```

## 环境变量

| 变量 | 默认值 | 作用 |
|---|---|---|
| `FLAGOS_USE_FLAGTREE` | `0` | 要求当前 Triton 为 FlagTree（断言，不切换） |
| `FLAGOS_COMPILE_FALLBACK_EAGER` | `0` | 编译出错时回退到 eager |
| `FLAGOS_TILEOPS_*` | 见参考 | TileOps/TileLang 的 L2 层级、实例缓存容量与缓存开关 |

路由相关变量（`FLAGOS_BACKEND_CONFIG`、`FLAGOS_OP_<op>`、`FLAGOS_FORCE_BACKEND`）同样作用于编译后的内核，因为编译出的计算图走同一张路由表。

## 故障排查

| 现象 | 原因与处理 |
|---|---|
| 图捕获或代码生成阶段报错 | 设置 `FLAGOS_COMPILE_FALLBACK_EAGER=1` 回退到 eager；检查是否存在不支持的算子（动态形状、自定义算子）以及缺失的 meta 实现 |
| GCU 上出现 `InductorError: ... has no 64-bit support` | 64 位代码生成守卫拒绝了在不支持 64 位索引的后端上需要 64 位索引的内核形状；缩小张量/索引规模，或让该算子留在原有路由上 |
| 相比 eager 没有加速 | 确认计算图确实编译成功（`TORCH_LOGS=inductor`），检查 Triton 自动调优是否仍在进行，并确认工作负载不是启动开销受限 |
| FlagTree 未生效 | `FLAGOS_USE_FLAGTREE=1` 在官方 Triton 下会报错；检查 `is_flagtree_active()` 并重新安装 FlagTree，它必须替换 `triton` 模块 |
| `torch.compile` 不可用 | 后端在 `torch._dynamo` 可导入时注册；检查 PyTorch 版本，并确认编译前已执行 `import torch_fl` |

```bash
pytest tests/integration/test_compile.py -v --tb=short
```
