# TLE 参考

本页面介绍编写 FlagFFT Triton 内核时使用的 FlagTree/TLE API。

## TLE-Lite

设计理念：一次编写，处处运行。使用高层语义提示（而非硬约束）引导编译器启发式。

### 内存管理

#### `tle.load`

`tl.load` 的扩展，支持异步提示：

```python
x = tle.load(..., is_async=True)
```

对于稍后在计算密集型区域中重用的全局内存读取，使用 `is_async=True`。在边界分块上保持 `mask` 和 `other` 显式。

示例：尾部块的受保护异步加载

```python
offs = base + tl.arange(0, BLOCK)
mask = offs < n_elements
x = tle.load(x_ptr + offs, mask=mask, other=0.0, is_async=True)
```

示例：异步加载 + 计算重叠模式

```python
for k in tl.range(0, K, BK, num_stages=2):
    a = tle.load(a_ptr + k * stride_a, is_async=True)
    b = tle.load(b_ptr + k * stride_b, is_async=True)
    acc = tl.dot(a, b, acc)
```

### 张量切片

#### `tle.extract_tile`

将输入张量分割为子块网格，并在指定坐标处提取块。

```python
z = x.extract_tile(index=[0, 0], shape=[2, 2])
```

#### `tle.insert_tile`

将输入张量分割为子块网格，并在指定坐标处更新块。

```python
z = x.insert_tile(y, index=[0, 0])
```

示例：寄存器中的逐块后处理

```python
sub = x.extract_tile(index=[1, 0], shape=[2, 2])
sub = tl.maximum(sub, 0.0)  # 对子块执行 ReLU
x = x.insert_tile(sub, index=[1, 0])
```

### 流水线

#### `tle.pipeline_group`

用于显式阶段控制的提示式扩展。

自动阶段划分：

```python
for yoff in tl.range(0, ynumel, YBLOCK, num_stages=2):
    Q = tl.load(...)
    K = tl.load(...)
    KT = tl.trans(K)
    V = tl.dot(Q, KT)
```

使用 warp 特化的手动阶段划分：

```python
for yoff in tle.range(
    0, ynumel, YBLOCK,
    num_stages=2,
    pipe_stages=[0, 0, 1] if LOAD_TRANS else [0, 1, 1],
    pipe_orders=[0, 1, 2],
    executors=[0, 0, 0] if ONE_CORE else [0, 0, range(1, 31)],
):
    with tle.pipeline_group(0):
        Q = tl.load(...)
        K = tl.load(...)
    with tle.pipeline_group(1):
        KT = tl.trans(K)
    with tle.pipeline_group(2):
        V = tl.dot(Q, KT)
```

### 分布式

#### `tle.device_mesh`

定义物理设备拓扑：

```python
topology = {
    "node": [("node_x", 2), ("node_y", 2)],
    "device": 4,
    "block_cluster": [("cluster_x", 2), ("cluster_y", 2)],
    "block": 4,
}
mesh = tle.device_mesh(topology=topology)
# mesh.shape -> (2, 2, 4, 2, 2, 4)，总大小 = 256
```

#### `tle.sharding`

在设备网格上声明张量分布：

```python
x_shard = tle.sharding(mesh, split=[["cluster_x", "cluster_y"], "device"], partial=["block"])
x = tle.make_sharded_tensor(x_ptr, sharding=x_shard, shape=[4, 4])
```

符号：`tle.S(axis)`（分割）、`tle.B`（广播）、`tle.P(axis)`（部分）。

#### `tle.reshard`

将张量转换为新的分布状态。编译器自动插入通信原语。

典型转换：Scatter、Gather、Reduce、All-gather、All-reduce。

```python
x_full = tle.reshard(x, spec=tle.sharding(mesh, split=[], partial=[]))
```

#### `tle.remote`

获取其他设备上张量数据的句柄（点对点或 RDMA/NVLink）：

```python
remote_x = tle.remote(x, shard_id=(node_rank, next_device), scope=mesh)
```

#### `tle.shard_id`

查询当前程序在网格轴上的坐标：

```python
node_rank = tle.shard_id(mesh, "node")
device_rank = tle.shard_id(mesh, "device")
```

#### `tle.distributed_dot`

线程块簇范围内的跨块矩阵乘法：

```python
def distributed_dot(a, b, c=None):
    """在当前 TBC 范围内执行分布式矩阵乘法。"""
```

## TLE-Struct

设计理念：架构感知，细粒度调优。按硬件拓扑族分类后端，暴露公共层次结构，让开发者显式定义结构化计算/数据映射。

### GPU

#### `tle.gpu.memory_space`

指定张量内存空间：

```python
x = tle.gpu.memory_space(x, "shared_memory")
```

#### `tle.gpu.alloc`

分配内存：

```python
a_smem = tle.gpu.alloc([XBLOCK, YBLOCK], dtype=tl.float32, scope=tle.gpu.storage_kind.smem)
```

#### `tle.gpu.local_ptr`

在共享内存缓冲区上构建指针视图，用于 `tl.load`/`tl.store`/`tl.atomic*`。

示例：一维切片

```python
smem = tle.gpu.alloc([BLOCK], dtype=tl.float32, scope=tle.gpu.smem)
idx = offset + tl.arange(0, SLICE)
slice_ptr = tle.gpu.local_ptr(smem, (idx,))
vals = tl.load(slice_ptr)
```

示例：K 维分块

```python
smem_a = tle.gpu.alloc([BM, BK], dtype=tl.float16, scope=tle.gpu.smem)
rows = tl.broadcast_to(tl.arange(0, BM)[:, None], (BM, BK))
cols = tl.broadcast_to(tl.arange(0, BK)[None, :] + k_start, (BM, BK))
a_slice = tle.gpu.local_ptr(smem_a, (rows, cols))
a_vals = tl.load(a_slice)
```

示例：对 local_ptr 执行原子操作

```python
smem_i32 = tle.gpu.alloc([BLOCK], dtype=tl.int32, scope=tle.gpu.smem)
ptr = tle.gpu.local_ptr(smem_i32, (tl.arange(0, BLOCK),))
tl.store(ptr, tl.zeros([BLOCK], dtype=tl.int32))
tl.atomic_add(ptr, 1)
vals = tl.load(ptr)
```

#### `tle.gpu.local_ptr`（远程）

为远程共享/本地缓冲区具现化指针视图：

```python
smem = tle.gpu.alloc([BM, BK], dtype=tl.float16, scope=tle.gpu.storage_kind.smem)
remote_smem = tle.remote(smem, shard_id=(node_rank, next_device), scope=mesh)
remote_ptr = tle.gpu.local_ptr(remote_smem, (rows, cols))
vals = tl.load(remote_ptr)
```

#### `tle.gpu.copy`

内存复制：

```python
tle.gpu.copy(a_ptrs + ystride_a * yoffs[None, :], a_smem, [XBLOCK, YBLOCK])
```

### DSA

#### `tle.dsa.alloc`

分配 DSA 本地缓冲区：

```python
a_ub = tle.dsa.alloc([XBLOCK, YBLOCK], dtype=tl.float32, mem_addr_space=tle.dsa.ascend.UB)
b_l1 = tle.dsa.alloc([XBLOCK, YBLOCK], dtype=tl.float32, mem_addr_space=tle.dsa.ascend.L1)
```

Ascend 内存空间：`UB`、`L1`、`L0A`、`L0B`、`L0C`。

#### `tle.dsa.copy`

GMEM 指针与 DSA 本地缓冲区之间的显式移动：

```python
tle.dsa.copy(x_ptrs, a_ub, [tail_m, tail_n])       # GMEM -> 本地
tle.dsa.copy(a_ub, out_ptrs, [tail_m, tail_n])      # 本地 -> GMEM
```

#### `tle.dsa.to_tensor` / `tle.dsa.to_buffer`

在缓冲区和张量视图之间转换：

```python
c_val = tle.dsa.to_tensor(c_ub, writable=True)
result = c_val * 0.5
d_ub = tle.dsa.to_buffer(result, tle.dsa.ascend.UB)
```

#### 逐元素计算操作

`tle.dsa.add`、`tle.dsa.sub`、`tle.dsa.mul`、`tle.dsa.div`、`tle.dsa.max`、`tle.dsa.min` —— 对 DSA 本地缓冲区的逐元素二元操作。

示例：算术链

```python
tle.dsa.sub(a_ub, b_ub, tmp_ub)      # tmp = a - b
tle.dsa.mul(tmp_ub, b_ub, tmp_ub)    # tmp = tmp * b
tle.dsa.div(tmp_ub, scale_ub, out_ub)  # out = tmp / scale
```

示例：通过 max + min 进行钳位

```python
tle.dsa.max(x_ub, floor_ub, tmp_ub)  # tmp = max(x, floor)
tle.dsa.min(tmp_ub, ceil_ub, y_ub)   # y = min(tmp, ceil)
```

### 示例集

#### 共享内存暂存

```python
a_smem = tle.gpu.alloc([BM, BK], dtype=tl.float16, scope=tle.gpu.storage_kind.smem)
tle.gpu.copy(a_ptrs, a_smem, [BM, BK])
rows = tl.broadcast_to(tl.arange(0, BM)[:, None], (BM, BK))
cols = tl.broadcast_to(tl.arange(0, BK)[None, :], (BM, BK))
a_ptr_local = tle.gpu.local_ptr(a_smem, (rows, cols))
a_tile = tl.load(a_ptr_local)
```

#### 共享内存原子操作

```python
bins = 256
counts = tle.gpu.alloc([bins], dtype=tl.int32, scope=tle.gpu.storage_kind.smem)
idx = tl.arange(0, BLOCK) % bins
count_ptr = tle.gpu.local_ptr(counts, (idx,))
tl.atomic_add(count_ptr, 1)
```

#### DSA 本地缓冲区流程

```python
a_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
b_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
c_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)

tle.dsa.copy(a_ptrs, a_ub, [BM, BK])
tle.dsa.copy(b_ptrs, b_ub, [BM, BK])
tle.dsa.add(a_ub, b_ub, c_ub)

c_val = tle.dsa.to_tensor(c_ub, writable=True)
out_ub = tle.dsa.to_buffer(c_val, tle.dsa.ascend.UB)
tle.dsa.copy(out_ub, out_ptrs, [BM, BK])
```
