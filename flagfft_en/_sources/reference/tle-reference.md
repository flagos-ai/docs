# TLE Reference

This page covers FlagTree/TLE APIs useful when authoring FlagFFT Triton kernels.

## TLE-Lite

Design philosophy: write once, run anywhere. Use high-level semantic hints (instead of hard constraints) to guide compiler heuristics.

### Memory Management

#### `tle.load`

Extension of `tl.load` with async hint support:

```python
x = tle.load(..., is_async=True)
```

Use `is_async=True` for global-memory reads later reused in compute-heavy regions. Keep `mask` and `other` explicit on boundary tiles.

Example: guarded async load for tail tiles

```python
offs = base + tl.arange(0, BLOCK)
mask = offs < n_elements
x = tle.load(x_ptr + offs, mask=mask, other=0.0, is_async=True)
```

Example: async load + compute overlap pattern

```python
for k in tl.range(0, K, BK, num_stages=2):
    a = tle.load(a_ptr + k * stride_a, is_async=True)
    b = tle.load(b_ptr + k * stride_b, is_async=True)
    acc = tl.dot(a, b, acc)
```

### Tensor Slicing

#### `tle.extract_tile`

Split input tensor into a sub-tile grid and extract tile at specified coordinates.

```python
z = x.extract_tile(index=[0, 0], shape=[2, 2])
```

#### `tle.insert_tile`

Split input tensor into a sub-tile grid and update tile at specified coordinates.

```python
z = x.insert_tile(y, index=[0, 0])
```

Example: tilewise post-processing in registers

```python
sub = x.extract_tile(index=[1, 0], shape=[2, 2])
sub = tl.maximum(sub, 0.0)  # ReLU on the sub-tile
x = x.insert_tile(sub, index=[1, 0])
```

### Pipeline

#### `tle.pipeline_group`

Hint-style extension for explicit stage control.

Automatic stage partitioning:

```python
for yoff in tl.range(0, ynumel, YBLOCK, num_stages=2):
    Q = tl.load(...)
    K = tl.load(...)
    KT = tl.trans(K)
    V = tl.dot(Q, KT)
```

Manual stage partitioning with warp specialization:

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

### Distributed

#### `tle.device_mesh`

Define physical device topology:

```python
topology = {
    "node": [("node_x", 2), ("node_y", 2)],
    "device": 4,
    "block_cluster": [("cluster_x", 2), ("cluster_y", 2)],
    "block": 4,
}
mesh = tle.device_mesh(topology=topology)
# mesh.shape -> (2, 2, 4, 2, 2, 4), total size = 256
```

#### `tle.sharding`

Declare tensor distribution on the device mesh:

```python
x_shard = tle.sharding(mesh, split=[["cluster_x", "cluster_y"], "device"], partial=["block"])
x = tle.make_sharded_tensor(x_ptr, sharding=x_shard, shape=[4, 4])
```

Symbols: `tle.S(axis)` (split), `tle.B` (broadcast), `tle.P(axis)` (partial).

#### `tle.reshard`

Transform tensor to a new distribution state. Compiler inserts communication primitives automatically.

Typical transitions: Scatter, Gather, Reduce, All-gather, All-reduce.

```python
x_full = tle.reshard(x, spec=tle.sharding(mesh, split=[], partial=[]))
```

#### `tle.remote`

Obtain handle for tensor data on other devices (point-to-point or RDMA/NVLink):

```python
remote_x = tle.remote(x, shard_id=(node_rank, next_device), scope=mesh)
```

#### `tle.shard_id`

Query current program coordinates on a mesh axis:

```python
node_rank = tle.shard_id(mesh, "node")
device_rank = tle.shard_id(mesh, "device")
```

#### `tle.distributed_dot`

Cross-block matrix multiplication within Thread Block Cluster scope:

```python
def distributed_dot(a, b, c=None):
    """Execute distributed matmul within current TBC scope."""
```

## TLE-Struct

Design philosophy: architecture-aware, fine-grained tuning. Classify backends by hardware-topology families, expose common hierarchical structures, let developers explicitly define structured compute/data mappings.

### GPU

#### `tle.gpu.memory_space`

Specify tensor memory space:

```python
x = tle.gpu.memory_space(x, "shared_memory")
```

#### `tle.gpu.alloc`

Allocate memory:

```python
a_smem = tle.gpu.alloc([XBLOCK, YBLOCK], dtype=tl.float32, scope=tle.gpu.storage_kind.smem)
```

#### `tle.gpu.local_ptr`

Build pointer views over shared memory buffers for `tl.load`/`tl.store`/`tl.atomic*`.

Example: 1D slice

```python
smem = tle.gpu.alloc([BLOCK], dtype=tl.float32, scope=tle.gpu.smem)
idx = offset + tl.arange(0, SLICE)
slice_ptr = tle.gpu.local_ptr(smem, (idx,))
vals = tl.load(slice_ptr)
```

Example: K-dimension tiling

```python
smem_a = tle.gpu.alloc([BM, BK], dtype=tl.float16, scope=tle.gpu.smem)
rows = tl.broadcast_to(tl.arange(0, BM)[:, None], (BM, BK))
cols = tl.broadcast_to(tl.arange(0, BK)[None, :] + k_start, (BM, BK))
a_slice = tle.gpu.local_ptr(smem_a, (rows, cols))
a_vals = tl.load(a_slice)
```

Example: atomics on local_ptr

```python
smem_i32 = tle.gpu.alloc([BLOCK], dtype=tl.int32, scope=tle.gpu.smem)
ptr = tle.gpu.local_ptr(smem_i32, (tl.arange(0, BLOCK),))
tl.store(ptr, tl.zeros([BLOCK], dtype=tl.int32))
tl.atomic_add(ptr, 1)
vals = tl.load(ptr)
```

#### `tle.gpu.local_ptr` (remote)

Materialize pointer views for remote shared/local buffers:

```python
smem = tle.gpu.alloc([BM, BK], dtype=tl.float16, scope=tle.gpu.storage_kind.smem)
remote_smem = tle.remote(smem, shard_id=(node_rank, next_device), scope=mesh)
remote_ptr = tle.gpu.local_ptr(remote_smem, (rows, cols))
vals = tl.load(remote_ptr)
```

#### `tle.gpu.copy`

Memory copy:

```python
tle.gpu.copy(a_ptrs + ystride_a * yoffs[None, :], a_smem, [XBLOCK, YBLOCK])
```

### DSA

#### `tle.dsa.alloc`

Allocate DSA local buffers:

```python
a_ub = tle.dsa.alloc([XBLOCK, YBLOCK], dtype=tl.float32, mem_addr_space=tle.dsa.ascend.UB)
b_l1 = tle.dsa.alloc([XBLOCK, YBLOCK], dtype=tl.float32, mem_addr_space=tle.dsa.ascend.L1)
```

Ascend memory spaces: `UB`, `L1`, `L0A`, `L0B`, `L0C`.

#### `tle.dsa.copy`

Explicit movement between GMEM pointers and DSA local buffers:

```python
tle.dsa.copy(x_ptrs, a_ub, [tail_m, tail_n])       # GMEM -> local
tle.dsa.copy(a_ub, out_ptrs, [tail_m, tail_n])      # local -> GMEM
```

#### `tle.dsa.to_tensor` / `tle.dsa.to_buffer`

Convert between buffer and tensor views:

```python
c_val = tle.dsa.to_tensor(c_ub, writable=True)
result = c_val * 0.5
d_ub = tle.dsa.to_buffer(result, tle.dsa.ascend.UB)
```

#### Elementwise Compute Ops

`tle.dsa.add`, `tle.dsa.sub`, `tle.dsa.mul`, `tle.dsa.div`, `tle.dsa.max`, `tle.dsa.min` — elementwise binary ops over DSA local buffers.

Example: arithmetic chain

```python
tle.dsa.sub(a_ub, b_ub, tmp_ub)      # tmp = a - b
tle.dsa.mul(tmp_ub, b_ub, tmp_ub)    # tmp = tmp * b
tle.dsa.div(tmp_ub, scale_ub, out_ub)  # out = tmp / scale
```

Example: clamp by max + min

```python
tle.dsa.max(x_ub, floor_ub, tmp_ub)  # tmp = max(x, floor)
tle.dsa.min(tmp_ub, ceil_ub, y_ub)   # y = min(tmp, ceil)
```

### Cookbook

#### Shared-memory staging

```python
a_smem = tle.gpu.alloc([BM, BK], dtype=tl.float16, scope=tle.gpu.storage_kind.smem)
tle.gpu.copy(a_ptrs, a_smem, [BM, BK])
rows = tl.broadcast_to(tl.arange(0, BM)[:, None], (BM, BK))
cols = tl.broadcast_to(tl.arange(0, BK)[None, :], (BM, BK))
a_ptr_local = tle.gpu.local_ptr(a_smem, (rows, cols))
a_tile = tl.load(a_ptr_local)
```

#### Shared-memory atomics

```python
bins = 256
counts = tle.gpu.alloc([bins], dtype=tl.int32, scope=tle.gpu.storage_kind.smem)
idx = tl.arange(0, BLOCK) % bins
count_ptr = tle.gpu.local_ptr(counts, (idx,))
tl.atomic_add(count_ptr, 1)
```

#### DSA local-buffer flow

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
