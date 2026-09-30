# 分布式集合通信

PyTorch-Plugin-FL 通过 `ProcessGroupFlagOS` 为 `flagos` 设备提供分布式支持。它是原生的 `torch.distributed.ProcessGroup` 子类，在导入时完成注册，因此 `torch.distributed.init_process_group("flagos")` 可直接使用，无需对 `torch.distributed.*` 做任何 monkeypatch。

## 工作原理

`flagos` 张量与厂商张量共享同一块物理设备内存，因此集合通信只需要元数据转换，而不需要数据拷贝：

1. 某个集合虚函数被调用，传入 `privateuseone` 张量。
2. 在内部后端需要时，把张量转换为其期望的设备视图（基于同一 `data_ptr` 的零拷贝视图）。
3. 调用被委派给包装的内部后端。
4. 原样返回内部后端的 `Work` 对象，调用方（包括 DDP 的 reducer）因此拿到类型正确的 future。

`ProcessGroupFlagOS` 覆盖了所有集合虚函数 —— allreduce、allgather（列表形式与 into-tensor 形式）、reduce-scatter、all-to-all（普通与 single）、broadcast、reduce、gather、scatter、send/recv 及其立即版本，以及 barrier —— 而不是只覆盖少数 API，这样集合调用不会悄悄绕过转换。

## 后端选择

内部通信后端在创建通信组时按以下优先级解析：

1. **FlagCX** — 异构集合通信库，可导入时优先使用。FlagCX 会为其自身设备注册后端（`flagcx`）；`ProcessGroupFlagOS` 通过 `extended_api=True` 的创建接口构造其 `ProcessGroupFlagCX`。
2. **厂商原生后端** — NVIDIA 与 MetaX 使用 `NCCL`，Ascend 使用 `HCCL`，摩尔线程 MUSA 使用 `MCCL`。
3. **Host-staged gloo** — 最后一级回退，也是唯一不依赖任何厂商库的一级；它在每次集合通信时把操作数按 设备 → 主机 → 设备 拷贝。设置 `FLAGOS_DIST_STAGED_GLOO=0` 可拒绝该级别并直接失败。首次在该级别建立通信组时会输出一次告警。

没有点名 `flagos` 后端的请求也会被处理：`torch.distributed` 会把任何它不认识的设备类型路由到 gloo，而 `ProcessGroupGloo` 会直接拒绝 flagos 张量。在 `FLAGOS_DIST_REDIRECT_GLOO`（默认开启）下，当进程加速器是 flagos 设备时，普通的 `init_process_group(backend="gloo")` 或 `new_group` 请求会由 `flagos` 后端响应。

## 使用方式

```python
import torch
import torch_fl
import torch_fl.distributed as flagos_dist

# "auto"（默认）：优先 FlagCX，回退到厂商原生后端
# "flagcx"：强制使用 flagos / FlagCX，不可用时回退厂商后端
# "nccl"：强制 NCCL（NVIDIA、MetaX）
# "hccl"：强制 HCCL（Ascend）
flagos_dist.init_process_group(backend="auto")

model = MyModel().to("flagos:0")
model = flagos_dist.DistributedDataParallel(model)
flagos_dist.move_buffers_to_device(model, "flagos:0")
```

`torch_fl.distributed` 对外提供 `init_process_group`、`DistributedDataParallel` 与 `move_buffers_to_device`。在后端已注册的前提下，也可以直接调用 `torch.distributed.init_process_group("flagos")`，或由 `device_id=torch.device("privateuseone:0")` 自动选择。

### DDP

导入时，PyTorch-Plugin-FL 会补丁 `torch.nn.parallel.DistributedDataParallel.__init__`。当模型位于 `flagos` 设备上时，该补丁会：

- 强制使用 Python reducer，绕过 C++ reducer 的 CUDA 断言；
- 替换默认的梯度累积钩子（其使用在 `privateuseone` 上没有分发的函数式集合通信），改为通过 `dist.all_reduce` 走 `ProcessGroupFlagOS`。

`torch.nn.DataParallel` 与函数式 `torch.nn.parallel.data_parallel` 也做了同样的补丁，使其副本放置到 flagos 设备上，而不是在设备类型探测处失败。

## 各厂商状态

| 厂商 | FlagCX 路径 | 原生回退 | 视图转换 | 说明 |
|---|---|---|---|---|
| NVIDIA | 可用 | NCCL | flagos → cuda 视图 | 集合通信与 DDP 梯度同步已在 2×/8× A100 上实测验证 |
| MetaX | 可复用 | 经 MACA libtorch 的 NCCL 形态 MCCL | flagos → cuda 视图 | 未纳入 CI |
| Ascend | 推荐的优先路径 | HCCL（自定义后端类型） | flagos → npu 视图 | Ascend 上没有 CUDA 兼容层。仅为架构层面路由，无集合级 CI 覆盖 |
| 海光 DCU | 可复用 | 经 DTK 的 RCCL | flagos → cuda 视图 | `all_reduce`/DDP 已在 2 卡上实测，未纳入 CI |
| 摩尔线程 MUSA | 可复用 | MCCL | flagos → cuda 视图 | host-staged gloo 已在 MTT S5000 上实测 |
| 燧原 GCU | 优先路径 | 无（仅 FlagCX） | 无需转换 | 已在两块 S60 上实测：集合通信、barrier、DDP 前反向与梯度同步、FSDP2 `fully_shard` 训练与分片 state-dict 存取 |

## 限制

- 集合通信覆盖范围按厂商验证，缺口如实记录而非默认成立。在燧原 GCU 上，点对点通信、`gather`/`scatter` 的 root 参数、all-to-all、多机建联、进程故障恢复以及超过两台设备的部署尚未验证。
- Ascend 的分布式支持属于架构层面：路由与视图逻辑已经存在，但没有集合级 CI 覆盖。
- host-staged gloo 级别以正确性优先，每次集合通信都要付出一次设备 → 主机 → 设备的拷贝。
