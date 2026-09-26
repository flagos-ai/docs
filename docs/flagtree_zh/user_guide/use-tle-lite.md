# 使用 TLE-Lite

本节介绍如何使用 TLE-Lite。TLE-Lite 在 trition_3.6.x 分支上可用。

## 内存管理

您可以使用以下操作来管理内存。

### tle.load

`tle.load` 从 GMEM 异步加载张量。它支持异步提示。

```{code-block} python
x = tle.load(..., is_async=True)
```

## 张量切片

根据指定的子切片形状将输入张量分割为子切片网格，并提取给定坐标处的子切片。
GPU：支持提取到寄存器和共享内存中。

### tle.extract_tile

根据指定的子切片形状将输入张量分割为子切片网格，并提取给定坐标处的子切片。

支持提取到寄存器和共享内存中。

```{code-block} python
# x 是 [4, 4]
# z 是 [2, 2]
# 将 x 分割为 shape=[2, 2] 的子切片网格，并提取 [0, 0] 处的子切片
z = x.extract_tile(index=[0, 0], shape=[2, 2])
```

### tle.insert_tile

根据子切片形状将输入张量分割为子切片网格，并用新的切片更新指定坐标处的子切片。

支持从寄存器和共享内存进行更新。

```{code-block} python
# x 是 [4, 4]，y 是 [2, 2]，z 是 [4, 4]
# 将 x 分割为 shape=[2, 2] 的子切片，用 y 更新 [0, 0] 子切片，并返回完整的 [4, 4] 张量
z = x.insert_tile(y, index=[0, 0])
```

## 扫描和排序操作

扫描和排序操作提供了部分张量原语，如前缀、排名和选择，适用于基于直方图的 top-k、流压缩以及块级排序和分桶场景。

TLE-Lite 将这些操作保持为高级语义，而不是将其绑定到特定的硬件实现：用户描述扫描和排序意图，后端根据硬件选择寄存器或共享内存的下层策略。

### tle.cumsum

`tle.cumsum(input, axis=0, reverse=False, dtype=None)` 在一次操作中沿 `axis` 维度计算排他性累积和与总和。

- **签名**: `tle.cumsum(input, axis=0, reverse=False, dtype=None)`
- **用途**: 使用单个语义扫描操作同时计算块张量的排他性前缀/后缀和与总和。
- **返回值**: `(exclusive_sum, total_sum)`。
- **典型场景**: top-k、直方图前缀、流压缩以及需要部分排名/偏移的块级分区逻辑。
- `exclusive` 与 `input` 形状相同；`total` 是扫描块的标量和。
- `reverse=True` 表示反向排他性和，适用于降序基数/top-k 选择中的后缀计数。
- `dtype` 可以显式控制累加/结果类型。默认情况下，窄整数提升为 32 位整数，bfloat16 提升为 float32。
- 对于包含性累积和，使用 `exclusive_sum + input`。
- 对无效通道使用显式掩码加载，并将非活动通道设置为 0，确保 `total_sum` 仅计算有效元素。
- 支持的作用域是 `axis=0` 的静态秩-1 块张量；这涵盖了 TLE top-k 内核已使用的直方图和基数选择工作负载。

简单示例：

```{code-block} python
exclusive, total = tle.cumsum(x, axis=0)
inclusive = exclusive + x
```

## 流水线

### 管道与阶段

`tle.pipe` 描述了生产者与一个或多个消费者之间的显式数据流边。它同时记录持有逻辑块的共享内存阶段以及使该块对消费者可见所需的同步，使得 CTA 级别的加载/计算重叠和 warp 专用的生产者/消费者代码能够使用类型化描述符，而不是手动编写多个屏障。

- **签名**: `tle.pipe(*, capacity, scope="cta", name=None, readers=None, one_shot=False, **fields)`
- **用途**: 创建一个类型化管道，用于显式描述 CTA 级别的生产者/消费者数据流、环形缓冲区阶段重用和同步边。
- **参数**:
  - `capacity`: 编译时常量正整数，表示管道阶段的数量；每个负载字段的第一维必须等于 `capacity`。
  - `scope`: 支持的值为 `"cta"`。
  - `name`: 可选的管道名称，用于 IR/诊断；如果提供，必须是字符串。
  - `readers`: 可选的读取器名称列表；省略表示默认的 SPSC 读取器；对于 SPMC，传入 `("left", "right")`。
  - `one_shot`: 是否为单次就绪/完成边；适用于启动数据广播。`one_shot=True` 不支持 `close`。
  - `**fields`: 一个或多个负载缓冲区，必须是由 `tle.gpu.alloc(..., scope=tle.gpu.smem)` 返回的共享内存缓冲张量，秩 >= 2。
- **命名规则**:
  - 管道字段名称和读取器名称必须是有效的 Python 标识符。
  - 名称不能以 `_` 开头。
  - `fields` 和 `readers` 是保留名称。
- `tle.pipe(...)` 返回一个管道描述符。它拥有分阶段的负载字段，并通过 `writer()` 和 `reader(...)` 创建生产者/消费者端点。
- `capacity` 个阶段形成一个环形缓冲区。`iter` 映射到 `stage = iter % capacity`，使用相位位来区分重用轮次。

### 生产者

生产者持有 `pipe.writer()`。它获取一个可写阶段，为逻辑块填充所有必要的字段，然后提交该块，使数据对消费者可见。

- `pipe_value.writer()` → `pipe_writer`: 为当前管道创建单个写入器端点。
- 写入器始终可以看到所有负载字段。
- `writer.acquire(iter)` → `pipe_slot`: 获取一个生产者可写的阶段，返回一个移除了前导 `capacity` 维度的槽位。
- 用户应在 `writer.acquire(iter)` 和 `writer.commit(iter)` 之间生成字段数据。
- `writer.commit(iter)` → `None`: 将阶段标记为就绪，对订阅的消费者可见。同一逻辑块的所有字段写入必须在提交之前完成。
- `writer.close(iter)` → `None`: 发布一个关闭的阶段，供感知关闭的消费者循环退出或切换状态。`one_shot=True` 的管道不支持 `close`。
- 提交是生产者侧的可见性边界。

### 消费者

消费者持有 `pipe.reader(...)`。它等待已发布的块，读取返回的槽位，并在所有读取完成后释放阶段。

- `pipe_value.reader(name=None, fields=None)` → `pipe_reader`: 创建一个消费者端点。
- 对于 SPSC 管道（`readers=None`），必须省略 `name`。
- 对于 SPMC 管道（例如 `readers=("mma", "epilogue")`），必须传入 `name` 并匹配已声明的读取器。
- `fields` 可以是编译时常量的非空元组/列表，包含唯一的负载字段名称；省略表示订阅所有字段。
- 字段子集的消费者仅缩小端点视图和 `wait().slot`；它们不会创建新管道。
- `reader.wait(iter)` → `pipe_wait_result`: 等待阶段就绪或关闭，返回槽位和关闭标志。
- 标准消费路径读取 `wait_result.slot`；仅在处理关闭时检查 `wait_result.is_closed`。
- `reader.release(iter)` → `None`: 消费后释放阶段，允许生产者重用。应在所有 `wait(iter).slot` 读取完成后调用。
- 等待是消费者侧的可见性边界；释放是消费者侧的释放信号。

### 负载字段

- `**fields` 定义了每个阶段携带的数据。每个字段通过名称在 `pipe_slot` 上暴露，例如 `slot.q` 或 `slot.scale`。
- `pipe_slot` 还暴露 `fields: dict[str, tle.gpu.buffered_tensor]`。
- `pipe_wait_result` 包含 `slot: pipe_slot` 和 `is_closed: tl.tensor`。
- 一个管道可以携带一个或多个字段。拆分管道时，按逻辑生命周期和读取器协议拆分，而不是按底层传输拆分。
- 同一槽位中的不同字段可以通过不同的机制生成，例如 TMA 复制、cp.async 风格的复制或 `tle.gpu.local_ptr` + `tl.store`。用户仍然在为该逻辑块生成所有字段后调用一次 `writer.commit(iter)`。
- 每个字段的传输方式由编译器从生产者侧 IR 推断；它不是用户填写的管道属性，也不应编码到管道名称、字段名称或额外的用户属性中。
- 当读取器仅消费字段的子集时，使用 `pipe.reader(name, fields=(...))` 缩小读取器视图；这不会创建新的令牌。
- 保持管道字段来源可见。不透明的共享内存指针逃逸、未跟踪的共享存储或无法证明安全的重叠写入将直接报错，不会静默回退。
- NVIDIA 下层将 CTA 作用域的 SMEM 管道映射到 NVWS/mbarrier 同步。多字段负载需要在管道字段根粒度上证明负载窗口、字段所有权、参与者数量和源顺序安全性。

### 生命周期

- SPSC 管道表示一个生产者向一个默认消费者发布数据。
- SPMC 管道表示一个生产者向多个命名消费者发布相同的逻辑块，例如 `("mma", "epilogue")`。
- `iter` 是逻辑块 ID。在同一块内，生产者和所有参与的消费者应使用相同的 `iter`。
- 标准循环生命周期为 `writer.acquire(iter)` → 生成字段 → `writer.commit(iter)` → `reader.wait(iter)` → 消费字段 → `reader.release(iter)`。
- `one_shot=True` 表示单次就绪/完成边，通常与 `capacity=1` 一起使用；在此模式下不要依赖环形重用或 `close`。

### 简单示例

自动软件流水线仍然可以通过 `tl.range(..., num_stages=...)` 触发。显式管道适用于需要在程序中可见生产者/消费者拆分的场景。

```{code-block} python
stage_buf = tle.gpu.alloc([2, BLOCK], dtype=tl.float32, scope=tle.gpu.smem)
pipe = tle.pipe(capacity=2, scope="cta", name="x_pipe", x=stage_buf)
writer = pipe.writer()
reader = pipe.reader()
offs = tl.arange(0, BLOCK)

slot = writer.acquire(k)
tl.store(tle.gpu.local_ptr(slot.x), tl.load(x_ptr + k * BLOCK + offs))
writer.commit(k)

ready = reader.wait(k)
x = tl.load(tle.gpu.local_ptr(ready.slot.x))
reader.release(k)
```

## 分布式

Triton 分布式 API 由四个核心部分组成：设备网格定义、分片规范描述、同步和远程访问（点对点通信）。

跨卡/跨节点的底层通信在不同层级上提供：TLE-Lite 和 TLE-Struct 的分布式原语通过 FlagCX 完成跨设备通信；TLE-Raw 则更底层，与 Raw 处于同一级别，通过 NVSHMEM 直接提供设备端通信接口（见[使用 TLE-Raw](use-tle-raw.md)），且 NVSHMEM 仅用于 NVIDIA 卡。


### 设备网格

#### tle.device_mesh

`tle.device_mesh` 定义物理设备的拓扑结构。它是所有分布式操作的基础上下文。

```{code-block} python
class device_mesh:
    def __init__(self, topology: dict):
        """
        初始化 DeviceMesh。

        Args:
            topology (dict): 描述硬件层次结构的字典。
                             键是层级名称；值可以是整数（用于 1D）
                             或元组列表（用于多维层级）。
        """
        self._physical_ids = ...  # 内部存储：扁平化的物理 ID 列表 (0..N-1)
        self._shape = ...         # 当前逻辑视图的形状，例如 (2, 2, 4, 2, 2, 4)
        self._dim_names = ...     # 当前维度的名称
        # 初始化和解析逻辑...

    @property
    def shape(self):
        """返回当前网格的逻辑形状。"""
        return self._shape

    @property
    def ndim(self):
        """返回维度数量。"""
        return len(self._shape)

    def flatten(self):
        """
        将网格展平为 1D。通常用于基于环的通信模式。
        """
        return self.reshape(prod(self._shape))

    def __getitem__(self, key):
        """
        支持切片操作并返回子网格。
        支持标准切片（slice 对象）和整数索引。
        """
        # 计算切片后的新形状和选定的物理 ID
        # ...
        return sub_mesh

    def __repr__(self):
        return f"DeviceMesh(shape={self._shape}, names={self._dim_names})"


# 定义复杂的硬件层次结构
topology = {
    # 节点间层级（2x2 = 4 个节点）
    "node": [("node_x", 2), ("node_y", 2)],
    # 节点内 GPU（4 个设备）
    "device": 4,
    # GPU 内集群（2x2）
    "block_cluster": [("cluster_x", 2), ("cluster_y", 2)],
    # 每个集群内的块（4 个块）
    "block": 4
}

# mesh.shape -> (2, 2, 4, 2, 2, 4)
# 总大小 = 256
mesh = tle.device_mesh(topology=topology)
```

### 分片规范

`tle.sharding` 用于声明张量在设备网格上的当前分布状态。splits 列表描述了张量的每个维度如何在网格上分区，而 partials 列表指示张量是否处于部分和状态。任何未显式提及的网格轴被视为广播（复制）。

- tle.S(axis): 分割 — 表示张量维度沿指定的网格轴分区。
- tle.B: 广播/复制 — 表示张量维度沿任何未显式引用的网格轴完全复制（即不分割）。
- tle.P(axis): 部分 — 表示张量仅持有部分值（例如部分和），必须沿指定的网格轴归约以获得完整结果。

```{code-block} python
def sharding(tensor, splits, partials):
    """
    注解：仅用于标注张量的布局状态。
    它不生成任何运行时代码，但指导编译器进行后续优化或正确性检查。
    """
    return tensor


# 定义一个分片规范，其中：
# - 轴 0 沿 "cluster" 维度分割（具体为 ["cluster_x", "cluster_y"]），
# - 轴 1 沿 "device" 维度分割，
# - 张量沿 "block" 维度处于部分状态（需要归约来解析）。
x_shard = tle.sharding(
    mesh,
    split=[["cluster_x", "cluster_y"], "device"],
    partial=["block"]
)

# 使用上述分片规范创建分片张量
x = tle.make_sharded_tensor(x_ptr, sharding=x_shard, shape=[4, 4])
```

### 同步

在复杂的分布式算子中——例如 Ring-AllReduce 或具有独立行/列通信的流水线执行——我们通常只需要同步同一"行"或"列"内的线程块，而不是整个集群。全局同步会引入不必要的等待开销。
此 API 支持子网格同步，这意味着在大型物理集群中，我们可以定义多个逻辑"通信组"，并在每个组内独立执行同步。

```{code-block} python
def distributed_barrier(mesh):
    """
    如果传入子网格，则仅同步该子网格内的设备。
    子网格外的设备应将此指令视为空操作
    （或者编译器应确保其控制流永远不会到达此点）。
    """
    pass
```

#### tle.distributed_barrier

`tle.distributed_barrier` 仅同步与给定网格或子网格对应的设备集合。

从相邻分片读取（环式交换）。

```{code-block} python
node_rank = tle.shard_id(mesh, "node")
device_rank = tle.shard_id(mesh, "device")
next_device = (device_rank + 1) % mesh.shape[1]
remote_x = tle.remote(x, shard_id=(node_rank, next_device), scope=mesh)
tle.distributed_barrier(mesh)
neighbor_vals = tl.load(remote_x)
```

### 远程访问

`tle.remote` 用于获取位于另一设备上的张量的句柄。这对应于点对点通信或直接内存访问（例如 RDMA/NVLink Load）。它使内核能够显式地从特定分片访问数据。

```{code-block} python
def remote(tensor, shard_id, scope):
    """
    获取驻留在特定设备分片上的远程张量的句柄。

    :param tensor: 逻辑分布式张量（已用 tle.sharding 标注）。
    :param shard_id: tuple。目标设备在设备网格中的坐标。
                     例如，如果 mesh=(2,4) 且 shard_id=(0, 3)，则指节点 #0 上的 GPU #3。
    :return: RemoteTensor。支持 load、store 等操作。
    """
```

`tle.remote`: 显式读取或写入远程分片。

```{code-block} python
node_rank = tle.shard_id(mesh, "node")
device_rank = tle.shard_id(mesh, "device")
next_device = (device_rank + 1) % mesh.shape[1]
remote_x = tle.remote(x, shard_id=(node_rank, next_device), scope=mesh)
tle.distributed_barrier(mesh)
neighbor_vals = tl.load(remote_x)
```

### 设备网格坐标与重分片

#### tle.shard_id

- 签名：`tle.shard_id(mesh, axis)`
- 含义：返回当前 program 在指定 mesh 轴上的坐标。
- `axis` 可以是轴名称（如 `"node"`、`"device"`、`"cluster_x"`）或轴序号。
- 典型用途：构造 ring 交换、分阶段 all-reduce、cluster 协同计算中的对端 shard ID。

```{code-block} python
mesh = tle.device_mesh({"node": 2, "device": 4})
node_rank = tle.shard_id(mesh, "node")      # 0..1
device_rank = tle.shard_id(mesh, "device")  # 0..3
```

#### tle.reshard

分布状态转换。该接口在当前版本中仍为预留入口，尚未实现（调用会抛出 `NotImplementedError`）。推荐流程：用 `tle.device_mesh` 定义拓扑，用 `tle.sharding` 标注分布状态，用 `tle.reshard` 做分布状态转换，计算 kernel 始终保持逻辑 tensor 视角。

```{code-block} python
x_full = tle.reshard(x, spec=tle.sharding(mesh, split=[], partial=[]))
```

### 远程访问的目标域

`tle.remote` 获取其他设备上数据分片的访问句柄，对应点对点通信或直接内存访问（RDMA/NVLink Load）。当前实现按 `space` 区分三种目标域：

```{code-block} python
def remote(tensor, shard_id, scope=None, space="cluster", dtype=None,
           offset=None, coopkind=None, netidx=0):
    ...
```

- `tensor`：必填。cluster 路径为 shared-memory 指针或 buffered_tensor；device / node 路径为 `tle.create_dist_tensor` 返回的 `DistributedRtContext`。
- `shard_id`：必填。编译期 int 或运行时 int32 标量；cluster 路径为目标 Block id，device 路径为节点内 peer rank，node 路径为 world rank。编译期 mesh 坐标必须配合 `scope`。
- `scope`：`device_mesh`；使用 mesh 坐标形式的 `shard_id` 时必填。
- `space`：`"cluster"`（缺省）、`"device"` 或 `"node"`。
- `dtype`：cluster 路径可选，省略时从输入推导；device / node 路径必填。
- `offset`：device 路径必填；cluster / node 路径不支持。
- `coopkind` / `netidx`：仅 node 路径可用。

#### Cluster 路径（Cluster 内通信，DSMEM）

面向同一线程块 cluster（CTA cluster）内跨 Block 的共享内存访问（Hopper 及以上架构的 DSMEM），`space` 缺省时即此路径。输入支持两种：

- shared-memory 指针（标量或 tensor）：直接返回 cluster 地址空间的远端指针，可参与 `tl.load` / `tl.store`，输入为 block tensor 时保留 shape；
- tle buffered_tensor：返回 remote-marked buffer，再用 `tle.gpu.local_ptr(...)` 物化远端指针视图。

`shard_id` 是 cluster 内目标 Block 的 id；传 `scope` 时由 mesh 线性化坐标，并会按 mesh 推断 launch cluster 维度（要求 `num_ctas=1`，一个 program 映射一个 Block）。对已是 cluster-shared 空间的指针，`shard_id=0` 时直接返回本地访问。cluster / device 路径不支持 node 专用参数 `coopkind` / `netidx`。

```{code-block} python
# 此处 smem 是 buffered_tensor，例如由 tle.gpu.alloc 返回
remote_smem = tle.remote(smem, shard_id=(node_rank, next_device), scope=mesh)
remote_ptr = tle.gpu.local_ptr(remote_smem, (rows, cols))
vals = tl.load(remote_ptr)
```

#### Device 路径（节点内跨 GPU 通信，NVLink P2P）

面向同一节点内 GPU 之间、经 FlagCX 注册窗口（对称内存）的直接内存访问（NVLink P2P）。与 node 路径类似，`tensor` 传 `create_dist_tensor` 返回的 `DistributedRtContext`，但返回的是普通全局地址空间的远端指针，`offset` 参数必填——指定远端窗口内的元素偏移（Python int 或标量整数 tensor，内部归一为 i64）。

与 node 路径的关键区别：device 路径的远端指针就是普通全局指针，后续 `tl.load` / `tl.store` 支持任意的 tiled / 多维访存，没有"仅连续传输"的限制；偏移基准由 `offset` 一次固定，之后的指针运算按普通全局指针处理。

```{code-block} python
remote_base = tle.remote(scatter_ctx, space="device",
                         dtype=input_ptr.dtype.element_ty,
                         shard_id=target_rank,
                         offset=SCATTER_NODE_SLICE_OFFSET_ELEMS + source_slot_offset_elems)
scatter_ptrs = (remote_base +
                (scatter_row + row_offs[:, None]) * N + input_col + col_offs[None, :])
tl.store(scatter_ptrs, values, mask=scatter_row_mask & col_mask)
```

#### Node 路径（节点间通信，FlagCX/RDMA）

面向跨节点点对点传输，数据面基于 FlagCX 注册内存（对称窗口）。当前版本仅支持连续数据传输，使用前请注意：

- Host 侧必须先用 `tle.create_dist_tensor(comm_buf)` 把通信 buffer 注册到 FlagCX 对称内存窗口，返回的 `DistributedRtContext` 作为 kernel 参数传入；device 间 scatter 与 node 间 P2P 可共用同一注册窗口。本地侧使用的 buffer 必须是该 context 所注册的同一个 buffer，并作为全局指针参数直接传给 kernel。
- `dtype` 必填；不支持 `offset` 参数——偏移要加在返回的指针上。
- 传输形状受限：标量拷贝一次传一个元素；tensor 拷贝两侧必须复用同一个连续区间 `tl.arange(0, N)`，mask 只支持无 mask 或复用同一个共享前缀 mask `offsets < valid_n`（`1 <= valid_n <= N`）。
- 单次传输的数据量受编译器 tensor 大小限制：一次传输的元素个数 N 必须是 2 的幂且不超过 `33554432`（2^25），超出会在编译期直接报错。要传输更多数据，需要把数据拆成多块，用循环多次调用 load/store，每次传输一块。
- load 的结果必须直接且仅供配对的 store 使用；二者必须位于同一 basic block，load 在前、store 在后，期间不能插入访存、原子操作、barrier 或其他通信操作；并且恰好一侧使用 node remote pointer。
- 不支持稀疏访问、多维 tiled load/store、strided 访问、非零起点区间、两侧范围不一致——编译期直接拒绝，动态违规则触发 device assert。
- `coopkind` 支持 `thread` / `warp` / `block`，默认 `block`（整个 CTA 收敛地发出一次传输）；`netidx` 为已有网络 context 的索引，必须是 `[0, INT32_MAX]` 范围内的编译期整数。
- device 侧没有 `rank()` / `num_ranks()`，拓扑由 host 以 constexpr 传入 kernel；`shard_id` 推荐直接传 host 预计算的 world rank int，也可以传 mesh 坐标 tuple + `scope`（经 `physical_ids` 解析为 world rank）。node 路径下 `scope` 不影响 launch 配置。

使用方式：先用 `tle.remote` 拿到指向对端节点的远端指针，再用一对 load/store 完成传输，传输方向由 load/store 的位置决定：

- **PUT（本地 → 远程）**：先从本地 buffer load，再 store 到远端指针，数据即从本节点写入远程节点。
- **GET（远程 → 本地）**：写法与 PUT 完全对称，方向相反——从远端指针 load，再 store 进本地 buffer，数据即从远程节点读回本地。

```{code-block} python
# PUT：本地 load + 远端 store
remote_dst = tle.remote(ctx, space="node", dtype=DTYPE,
                        shard_id=remote_rank, coopkind=tle.GroupKind.BLOCK)
offsets = tl.arange(0, BLOCK_SIZE)
mask = offsets < nelems
vals = tl.load(comm_buf + src_offset + offsets, mask=mask)
tl.store(remote_dst + dst_offset + offsets, vals, mask=mask)

# GET：远端 load + 本地 store
remote_src = tle.remote(ctx, space="node", dtype=DTYPE,
                        shard_id=remote_rank, coopkind=tle.GroupKind.BLOCK)
vals = tl.load(remote_src + src_offset + offsets, mask=mask)
tl.store(comm_buf + dst_offset + offsets, vals, mask=mask)
```

常见错误写法：

```{code-block} python
# 错：多维 / tiled 访问
vals = tl.load(remote_dst + rows[:, None] * N + cols[None, :])  # 编译期拒绝
# 原因：node 路径把 load/store 对整体 lowering 为一次 RDMA put/get，
# 接口只支持连续数据（1D 线性区间），无法表达 2D tile 的离散地址。

# 错：把偏移传给 remote
remote_dst = tle.remote(ctx, space="node", dtype=DTYPE, shard_id=r, offset=1024)  # 报错
# 原因：node 路径下 tle.remote 只负责解析目标 peer，返回的是指向对端
# 窗口基址的指针；源/目的偏移由后续 load/store 时的 src_offset / dst_offset 表达。

# 错：两侧区间不一致，或 mask 不是共享前缀
vals = tl.load(local + tl.arange(0, N), mask=mask)
tl.store(remote + tl.arange(0, M), vals, mask=mask2)  # 拒绝
# 原因：传输长度和两侧偏移是从 load/store 的指针表达式共同推导的，
# 两侧 range / mask 不一致时，传多少、从哪传到哪无法确定，编译期拒绝。
```

#### tle.signal

`tle.signal` 原子更新远端 peer 的同步 slot。该原语仅发送信号，不传输数据，也不在接收端等待完成。

```{code-block} python
def signal(device_dptr, peer, slot_id, value=None, op="inc",
          space="intra_node", group_kind="block", context_idx=0,
          scope="system"):
    ...
```

`op="inc"` 将目标信号 slot 加一；`op="add"` 将 `value` 加到目标信号 slot，此时必须提供 `value`，前者必须省略。`space` 选择通信范围（`intra_node`、`inter_node` 或 `world`），`peer` 是该范围内的 rank。`context_idx` 选择预分配的网络上下文。`scope` 控制信号操作对节点上线程的可见性：`"system"` 表示对所有设备上的所有线程可见，`"device"` 表示仅对当前设备上的线程可见；`"device"` 仅在单节点场景下有意义，大多数情况下 `"system"` 是正确选择。`group_kind="block"`（默认）时，CTA 内所有线程必须收敛执行该操作；整个 group 集合发出一次远端更新。

#### tle.signal_wait

`tle.signal_wait` 等待本地同步 slot 达到目标值。

```{code-block} python
def signal_wait(device_dptr, slot_id, wait_kind, target=None,
               group_kind="block", context_idx=0, order="acquire"):
    ...
```

`wait_kind` 选择等待模式：`"signal"` 等待 slot 值达到 `target`；`"counter"` 等待 slot 中的计数器达到 `target`；`"shadow"` 从运行时本地维护的 shadow buffer 读取目标值，因此必须省略 `target`。`slot_id` 与 `tle.signal` 共享同一信号 slot 命名空间。`group_kind` 和 `context_idx` 的语义与 `tle.signal` 一致。`order` 约束等待操作的内存序，由于 `tle.signal_wait` 是读取操作，仅允许 `"relaxed"` 和 `"acquire"`，大多数情况下默认值 `"acquire"` 是正确的选择。

### 组合示例

#### 异步过滤与压缩

组合 `tle.load` 和 `tle.cumsum`：先用带 mask 的异步加载读入一个 tile，再根据 predicate 生成 active flags，最后用 `tle.cumsum` 生成紧凑写回 offset 和当前 block 的 active 总数。

```{code-block} python
pid = tl.program_id(0)
offs = pid * BLOCK + tl.arange(0, BLOCK)
mask = offs < n_elements

x = tle.load(x_ptr + offs, mask=mask, other=0.0, is_async=True)
keep = (x > threshold) & mask
active = keep.to(tl.int32)

write_offsets, active_total = tle.cumsum(active, axis=0)
block_base = tl.load(block_offsets_ptr + pid)

tl.store(out_ptr + block_base + write_offsets, x, mask=keep)
tl.store(block_counts_ptr + pid, active_total)
```

#### 流水化 tile 后处理

组合 `tle.pipe`、shared-memory pointer view 和 tensor slicing。producer 把 global tile 分阶段写入 shared memory；consumer 读取 ready stage，对其中一个子 tile 做局部变换，再把更新后的完整 tile 写回输出。

```{code-block} python
tile_buf = tle.gpu.alloc([2, BM, BN], dtype=tl.float32, scope=tle.gpu.smem)
pipe = tle.pipe(capacity=2, scope="cta", name="post_pipe", tile=tile_buf)
writer = pipe.writer()
reader = pipe.reader()

rows = tl.arange(0, BM)[:, None]
cols = tl.arange(0, BN)[None, :]

for t in tl.range(0, n_tiles):
    slot = writer.acquire(t)
    vals = tle.load(x_ptr + tile_offset(t, rows, cols), mask=tile_mask(t, rows, cols), other=0.0, is_async=True)
    tl.store(tle.gpu.local_ptr(slot.tile, (rows, cols)), vals)
    writer.commit(t)

for t in tl.range(0, n_tiles):
    ready = reader.wait(t)
    tile = tl.load(tle.gpu.local_ptr(ready.slot.tile, (rows, cols)))
    sub = tile.extract_tile(index=[0, 0], shape=[BM // 2, BN // 2])
    sub = tl.maximum(sub, 0.0)
    tile = tile.insert_tile(sub, index=[0, 0])
    tl.store(out_ptr + tile_offset(t, rows, cols), tile, mask=tile_mask(t, rows, cols))
    reader.release(t)
```

#### 多字段 Pipe 与选择性 Reader

组合多字段 pipe payload 和 reader field subset。一条 pipe slot 同时承载 TMA 产生的 tile 和本地写入的 scale vector；MMA reader 只订阅 tile，epilogue reader 同时消费 tile 和 scale。

```{code-block} python
q = tle.gpu.alloc([PIPE_CAPACITY, BM, BK], dtype=tl.float16, scope=tle.gpu.smem)
scale = tle.gpu.alloc(
    [PIPE_CAPACITY, BM],
    dtype=tl.float32,
    scope=tle.gpu.smem,
    nv_mma_shared_layout=False,
)

pipe = tle.pipe(
    capacity=PIPE_CAPACITY,
    scope="cta",
    name="multi_field_inputs",
    readers=("mma", "epilogue"),
    q=q,
    scale=scale,
)

writer = pipe.writer()
mma_reader = pipe.reader("mma", fields=("q",))
epilogue_reader = pipe.reader("epilogue", fields=("q", "scale"))

slot = writer.acquire(k)
tle.gpu.copy(q_desc, slot.q, [BM, BK], [q_block, k_block])
tl.store(tle.gpu.local_ptr(slot.scale, (tl.arange(0, BM),)), scale_values)
writer.commit(k)

q_ready = mma_reader.wait(k).slot
q_tile = tl.load(tle.gpu.local_ptr(q_ready.q))
mma_reader.release(k)

epilogue_ready = epilogue_reader.wait(k).slot
q_for_epilogue = tl.load(tle.gpu.local_ptr(epilogue_ready.q))
scale_tile = tl.load(tle.gpu.local_ptr(epilogue_ready.scale, (tl.arange(0, BM),)))
epilogue_reader.release(k)
```

#### 分布式交换与重分片

组合 `tle.device_mesh`、`tle.sharding`、`tle.shard_id`、`tle.remote`、`tle.distributed_barrier` 和 `tle.reshard`。当前 shard 读取相邻设备的 tile 完成 ring 风格交换，然后构造 replicated view 进入本地计算。

```{code-block} python
mesh = tle.device_mesh({"node": 2, "device": 4})
x_spec = tle.sharding(mesh, split=["device"], partial=[])
x = tle.make_sharded_tensor(x_ptr, sharding=x_spec, shape=[M, K])

node_rank = tle.shard_id(mesh, "node")
device_rank = tle.shard_id(mesh, "device")
next_device = (device_rank + 1) % mesh.shape[1]

neighbor_x = tle.remote(x, shard_id=(node_rank, next_device), scope=mesh)
tle.distributed_barrier(mesh)
neighbor_vals = tl.load(neighbor_x)

x_full = tle.reshard(x, spec=tle.sharding(mesh, split=[], partial=[]))
acc = local_compute(x_full, neighbor_vals)
```

## 与 local_ptr 交互的原语

以下 API 与 `tle.gpu.local_ptr` 一起使用。更多信息请参见 [使用 TLE-Struct](use-tle-struct.md)。

- `tl.load`（用于 local_ptr）
- `tl.store`（用于 local_ptr）
- `tl.atomic_add`/`and`/`cas`/`max`/`min`/`or`/`xchg`/`xor`（用于 local_ptr）
