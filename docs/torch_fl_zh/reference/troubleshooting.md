# 常见故障排查

按症状给出跨平台反复出现的问题的解决办法。驱动正常但设备数为 0、导入时符号错误、或单个算子崩溃，通常都指向导入顺序、缺失的厂商库、或编译器不匹配这三类原因，下列各节逐一覆盖。

## 导入顺序

在所有 CUDA-ABI 平台（CUDA、MetaX、PPU、DCU）上，新进程里 `import torch_fl` 必须**先于** `import torch`。导入时 Torch-FL 会预加载厂商 `libtorch` 与 CUDA 资源；若先导入 `torch`，PyTorch 会缓存其 stub CUDA hooks，预加载就失去作用。

```python
import torch_fl   # 先
import torch
```

顺序写错的典型症状：

| 症状 | 平台 |
|---|---|
| `Cannot initialize CUDA without ATen_cuda library` | CUDA |
| `undefined symbol`（来自 `libtorch`） | MetaX |
| `c10` 符号未定义，或直接崩溃而非抛异常 | MUSA（wheel 未用 `--no-build-isolation` 构建时） |
| 解析到错误厂商的构建，或 `dlopen` 中止 | 任意 CUDA-ABI 平台 |

## `torch.flagos.device_count()` 返回 0

按顺序排查：

1. **驱动看得到设备吗？** CUDA 用 `nvidia-smi`，MetaX 用 `mx-smi`，DCU 用 `hy-smi`，其余用厂商工具。驱动都看不到设备时，软件层面无法补救。
2. **运行时是否初始化？** 驱动/运行时版本错配是最常见原因。CUDA 上重装匹配的 `nvidia-*-cu12` 运行期包。
3. **导入顺序** —— 见上节。
4. **设备节点/可见性。** Ascend 需要可访问的 `/dev/davinci*` 节点；CUDA 受 `CUDA_VISIBLE_DEVICES` 影响，越界的 `device="flagos:N"` 会报 `invalid device ordinal`。
5. **厂商库可达。** MetaX wheel 找不到 `/opt/maca`，或其 `LD_LIBRARY_PATH` 覆盖了 MACA 运行时路径时，`torch.cuda` 与 `torch.flagos` 的设备数会不一致。

## 缺失的厂商库

| 报错 | 平台 | 原因与处理 |
|---|---|---|
| `cannot open shared object file: libhydmi.so` | DCU | `hyhal` 不在 `LD_LIBRARY_PATH` 上；加入 `/usr/local/hyhal/lib`（或 `/opt/hyhal/lib`） |
| `MIOpen: librt.so not found` | DCU | DTK 的 MIOpen 配置引用了已移除的 `/usr/lib/.../librt.so`；`FLAGOS_ACCELERATOR=dcu` 构建分支会自动改写——确认选择器已设置且代码为最新 |
| `libtorch_cuda.so not found` | PPU | PPU 构建不打包 CUDA 资源：运行 Python 前导出 `FLAGOS_DISABLE_CUDA_ASSETS=1` |
| `CUDA_HOME not set` | PPU | 构建前导出 `CUDA_HOME=/usr/local/PPU_SDK/CUDA_SDK` |

## 编译器与 Triton

| 报错 | 原因与处理 |
|---|---|
| `No backend registered for 'hcu'` | 当前 `triton` 不是 FlagTree 构建：反复卸载直到干净，再从 FlagOS 索引安装对应平台的 FlagTree wheel |
| 同一环境里有两个 `triton` | 不带 `dist-info` 的副本 pip 删不掉；先按路径删除 `site-packages/triton` 再重装 |
| `Invalid cross-device link`（PPU） | pip 缓存与构建目录在不同文件系统；直接下载 wheel 后安装该文件 |
| `FLAGGEMS_DIR` 指向不兼容构建后 FlagGems 导入报错 | 从同一索引、同一平台安装 FlagGems 与 FlagTree |

FlagGems 路由在分发时按名称解析内核，因此缺少该包时 FlagGems 支撑的算子会**报错**而不会静默回退。要确认某次调用实际由谁服务，用 `FLAGOS_LOG=dispatch` 运行。

## 分布式

- `ProcessGroupGloo` **会直接拒绝 flagos 张量**。在 `FLAGOS_DIST_REDIRECT_GLOO`（默认开启）下，`init_process_group(backend="gloo")` 会被换成 flagos 后端来应答。
- 若没有可用的厂商通信库（FlagCX / NCCL / HCCL / MCCL），会落到宿主暂存 gloo 层，它把每个操作数做 device → host → device 拷贝。设 `FLAGOS_DIST_STAGED_GLOO=0` 可改为直接失败而非静默暂存。
- 为 PPU 构建 FlagCX 时出现 `extended_api creator not found`：用 `FLAGCX_ADAPTOR=nvidia` 重新构建。

## 性能分析与 torch.compile

- 某平台上 `torch.profiler` 找不到默认路径下的 tracer 库时，用 `FLAGOS_TRACER_LIBRARY` 指向实际安装的库。
- 安装的是纯 CPU 版 PyTorch wheel 时，PPU 与 MUSA 可能看不到设备事件：该构建不提供 `PrivateUse1` 的 Kineto 解析器，采集到的活动不会呈现为设备事件。这是环境限制，不是 tracer 缺陷。
- 平台上未安装厂商 Triton 栈时 `torch.compile` 不可用：Inductor 路径需要该平台的 FlagTree（或厂商 Triton）构建；`FLAGOS_COMPILE_FALLBACK_EAGER=1` 可让不支持的算子回退到 eager。
