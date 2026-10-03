# 快速开始

本页给出与平台无关的用法。按你的平台完成安装后（见 {doc}`安装 <installation>`），同样的代码可在所有受支持的加速器上运行。

## 基本用法

```python
import torch
import torch_fl

x = torch.randn(4, 4, device="flagos:0")
y = torch.relu(x @ x)
print(y.cpu())
```

张量创建在第 0 个 `flagos` 设备上，矩阵乘与激活按平台路由到相应内核，结果再拷贝回 CPU 打印。

## 在设备之间搬运张量

```python
import torch
import torch_fl

x = torch.randn(4, 4)            # CPU 张量
x_flagos = x.to("flagos")        # 第 0 个设备
x_flagos_1 = x.to("flagos:1")    # 第 1 个设备

y = torch.randn(4, 4, device="flagos")
y_cpu = y.cpu()                  # 拷贝回 CPU
```

## 选择设备

`torch.flagos.device()` 设置当前设备上下文，之后 `device="flagos"` 的张量会落在该设备上：

```python
import torch
import torch_fl

with torch.flagos.device(0):
    x = torch.randn(4, 4, device="flagos")

with torch.flagos.device(1):
    y = torch.randn(4, 4, device="flagos")
```

## 同步

与其他 PyTorch 设备一样，内核启动是异步的：

```python
import torch
import torch_fl

x = torch.randn(1000, 1000, device="flagos")
y = x @ x                   # 入队，未必已执行完
torch.flagos.synchronize()  # 等待设备排空
```

## 设备查询

```python
import torch
import torch_fl

if torch.flagos.is_available():
    print(f"Found {torch.flagos.device_count()} device(s)")
    print(f"Current device: {torch.flagos.current_device()}")

    props = torch.flagos.get_device_properties(0)
    print(f"Device name: {props.name}")
    print(f"Total memory: {props.total_memory / 1024**3:.2f} GB")
else:
    print("No flagos devices available")
```

若驱动正常但 `device_count()` 返回 0，见 {doc}`常见故障排查 <../reference/troubleshooting>`。

## 算子路由

`flagos` 张量上的运算按**算子**分发，而不是按设备或模型：

- **可移植编译内核** — 平台路由启用时的 FlagGems Triton 内核
- **厂商原生内核** — 厂商算子库（ACLNN、topsaten、mudnn 等）
- **兼容性 boxing** — 生成的内核，转发到外部厂商 `libtorch`（CUDA、MetaX、PPU、DCU）
- **CPU 回退** — 对没有设备内核的算子使用以实现正确性为先的 CPU 实现，再拷回设备

路由对代码透明：切换平台或内核来源时无需改动代码。要查看某次调用实际由哪个后端服务，设置 `FLAGOS_LOG=dispatch`（见{doc}`环境变量参考 <../reference/environment-variables>`）。

## 下一步

- {doc}`安装 <installation>` — 分平台构建与验证
- {doc}`平台能力矩阵 <../reference/platform-capability>` — 各加速器支持范围
- {doc}`数据类型支持 <../reference/dtype-support>` — 存储、AMP 目标与回退边界
- {doc}`分布式集合通信 <../architecture/distributed>` — `ProcessGroupFlagOS`、DDP 与 FSDP2
- {doc}`性能分析 <../architecture/profiler>` — `torch.profiler` 集成
