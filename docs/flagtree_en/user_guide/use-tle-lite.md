# Use TLE-Lite

This section introduces how to use TLE-Lite. TLE-Lite is available on trition_3.6.x branch.

## Memory management

You can use the following operations to manage the memory.

### tle.load

`tle.load` loads a tensor asynchronously from GMEM. It supports asynchronously hint.

```{code-block} python
x = tle.load(..., is_async=True)
```

## Tensor slicing

Splits the input tensor into a grid of sub-tiles based on the specified sub-tile shape, and extracts the sub-tile at the given coordinates.
GPU: Supports extraction into registers and shared memory.

### tle.extract_tile

Splits the input tensor into a grid of sub-tiles based on the specified sub-tile shape, and extracts the sub-tile at the given coordinates.

Supports extraction into registers and shared memory.

```{code-block} python
# x is [4, 4]
# z is [2, 2]
# Split x into a sub-tile grid with shape=[2, 2], and extract the sub-tile at [0, 0]
z = x.extract_tile(index=[0, 0], shape=[2, 2])
```

### tle.insert_tile

Splits the input tensor into a grid of sub-tiles based on the sub-tile shape, and updates the sub-tile at the specified coordinates with a new tile.

Supports updates from registers and shared memory.

```{code-block} python
# x is [4, 4], y is [2, 2], z is [4, 4]
# Split x into sub-tiles of shape=[2, 2], update the [0, 0] sub-tile with y, and return the full [4, 4] tensor
z = x.insert_tile(y, index=[0, 0])
```

## Scan and sort Ops
Scan and sort Ops provide partial tensor primitives such as prefix, rank, and selection, suitable for histogram-based top-k, stream compaction, and block-level sorting and bucketing scenarios.

TLE-Lite keeps these operations as high-level semantics rather than binding them to a specific hardware implementation: users describe the scan and sort intent, and the backend selects register or shared memory lowering strategies based on the hardware.

### tle.cumsum

`tle.cumsum(input, axis=0, reverse=False, dtype=None)` computes exclusive cumulative sum and total sum along the `axis` dimension in one operation.

- **Signature**: `tle.cumsum(input, axis=0, reverse=False, dtype=None)`
- **Purpose**: Uses a single semantic scan op to compute both the exclusive prefix/suffix sum and total sum of a block tensor.
- **Returns**: `(exclusive_sum, total_sum)`.
- **Typical scenarios**: top-k, histogram prefix, stream compaction, and block-level partition logic requiring partial rank/offset.
- `exclusive` has the same shape as `input`; `total` is the scalar sum of the scanned block.
- `reverse=True` indicates a reversed exclusive sum, suitable for suffix count in descending radix/top-k selection.
- `dtype` can explicitly control the accumulation/result type. By default, narrow integers are promoted to 32-bit integers, and bfloat16 is promoted to float32.
- For inclusive cumulative sum, use `exclusive_sum + input`.
- Use explicit mask loads for invalid lanes and set inactive lanes to 0, ensuring `total_sum` only counts valid elements.
- Supported scope is static rank-1 block tensors with `axis=0`; this covers the histogram and radix-selection workloads already used by TLE top-k kernels.

Simple example:

```{code-block} python
exclusive, total = tle.cumsum(x, axis=0)
inclusive = exclusive + x
```

## Pipeline

### Pipe and stage

`tle.pipe` describes an explicit dataflow edge between a producer and one or more consumers. It simultaneously records the shared-memory stage holding the logical chunk and the synchronization required to make that chunk visible to consumers, enabling CTA-level load/compute overlap and warp-specialized producer/consumer code to use a typed descriptor instead of manually writing multiple barriers.

- **Signature**: `tle.pipe(*, capacity, scope="cta", name=None, readers=None, one_shot=False, **fields)`
- **Purpose**: Creates a typed pipe for explicitly describing CTA-level producer/consumer dataflow, ring-buffer stage reuse, and synchronization edges.
- **Parameters**:
  - `capacity`: Compile-time positive integer indicating the number of pipe stages; each payload field's first dimension must equal `capacity`.
  - `scope`: Supported value is `"cta"`.
  - `name`: Optional pipe name for IR/diagnostics; must be a string if provided.
  - `readers`: Optional list of reader names; omitted means default SPSC reader; passed as `("left", "right")` for SPMC.
  - `one_shot`: Whether this is a single ready/full edge; suitable for startup data broadcast. `one_shot=True` does not support `close`.
  - `**fields`: One or more payload buffers, which must be shared-memory buffered tensors returned by `tle.gpu.alloc(..., scope=tle.gpu.smem)`, with rank >= 2.
- **Naming rules**:
  - Pipe field names and reader names must be valid Python identifiers.
  - Names must not start with `_`.
  - `fields` and `readers` are reserved names.
- `tle.pipe(...)` returns a pipe descriptor. It owns staged payload fields and creates producer/consumer endpoints via `writer()` and `reader(...)`.
- `capacity` stages form a ring buffer. `iter` maps to `stage = iter % capacity`, using a phase bit to distinguish reuse rounds.

### Producer

The producer holds `pipe.writer()`. It acquires a writable stage, fills all necessary fields for the logical chunk, and then commits the chunk, making the data observable to consumers.

- `pipe_value.writer()` → `pipe_writer`: Creates the single writer endpoint for the current pipe.
- The writer always sees all payload fields.
- `writer.acquire(iter)` → `pipe_slot`: Acquires a stage writable by the producer, returning a slot with the leading `capacity` dimension removed.
- Users should produce field data between `writer.acquire(iter)` and `writer.commit(iter)`.
- `writer.commit(iter)` → `None`: Marks the stage as ready, visible to subscribing consumers. All field writes for the same logical chunk must complete before commit.
- `writer.close(iter)` → `None`: Publishes a closed stage for close-aware consumer loops to exit or switch state. Pipes with `one_shot=True` do not support `close`.
- Commit is the producer-side visibility boundary.

### Consumer

The consumer holds `pipe.reader(...)`. It waits for published chunks, reads the returned slot, and releases the stage after all reads are complete.

- `pipe_value.reader(name=None, fields=None)` → `pipe_reader`: Creates a consumer endpoint.
- For SPSC pipes (`readers=None`), `name` must be omitted.
- For SPMC pipes (e.g., `readers=("mma", "epilogue")`), `name` must be passed and match a declared reader.
- `fields` can be a non-empty, compile-time tuple/list of unique payload field names; omitted means subscribing to all fields.
- Field-subset consumers only narrow the endpoint view and `wait().slot`; they do not create a new pipe.
- `reader.wait(iter)` → `pipe_wait_result`: Waits for a stage to be ready or closed, returning the slot and closed flag.
- Standard consumption paths read `wait_result.slot`; check `wait_result.is_closed` only when handling closure.
- `reader.release(iter)` → `None`: Releases the stage after consumption, allowing the producer to reuse it. Should be called after all `wait(iter).slot` reads are complete.
- Wait is the consumer-side visibility boundary; release is the consumer-side release signal.

### Payload fields

- `**fields` defines the data carried by each stage. Each field is exposed on the `pipe_slot` by name, e.g., `slot.q` or `slot.scale`.
- `pipe_slot` also exposes `fields: dict[str, tle.gpu.buffered_tensor]`.
- `pipe_wait_result` contains `slot: pipe_slot` and `is_closed: tl.tensor`.
- A pipe can carry one or multiple fields. When splitting pipes, split by logical lifecycle and reader protocol, not by underlying transport.
- Different fields in the same slot can be produced by different mechanisms, such as TMA copy, cp.async-style copy, or `tle.gpu.local_ptr` + `tl.store`. Users still call `writer.commit(iter)` once after producing all fields for that logical chunk.
- Each field's transport is inferred by the compiler from the producer-side IR; it is not a pipe attribute the user fills in, nor should it be encoded into pipe names, field names, or extra user attributes.
- When a reader only consumes a subset of fields, use `pipe.reader(name, fields=(...))` to narrow the reader view; this does not create a new token.
- Keep pipe-field provenance visible. Opaque shared-memory pointer escapes, untracked shared stores, or overlapping writes that cannot be proven safe will error directly, without silent fallback.
- NVIDIA lowering maps CTA-scoped SMEM pipes to NVWS/mbarrier synchronization. Multi-field payloads require proof of payload window, field ownership, participant count, and source-order safety at the pipe-field root granularity.

### Lifecycle

- SPSC pipe represents one producer publishing to one default consumer.
- SPMC pipe represents one producer publishing the same logical chunk to multiple named consumers, e.g., `("mma", "epilogue")`.
- `iter` is the logical chunk ID. Within the same chunk, the producer and all participating consumers should use the same `iter`.
- The standard loop lifecycle is `writer.acquire(iter)` → produce fields → `writer.commit(iter)` → `reader.wait(iter)` → consume fields → `reader.release(iter)`.
- `one_shot=True` indicates a single ready/full edge, typically used with `capacity=1`; do not rely on ring reuse or `close` in this mode.

### Simple example

Automatic software pipelining can still be triggered by `tl.range(..., num_stages=...)`. Explicit pipes are suited for scenarios where producer/consumer splitting needs to be visible in the program.

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

## Distribution

The Triton distributed API consists of four core parts: device mesh definition, sharding specification description, synchronization, and remote access (point-to-point communication).

Low-level inter-GPU and inter-node communication is provided at different levels: the distributed primitives of TLE-Lite and TLE-Struct perform cross-device communication through FlagCX, whereas TLE-Raw is lower level, sitting at the same level as Raw, and provides device-side communication interfaces directly through NVSHMEM (see [Use TLE-Raw](use-tle-raw.md)); NVSHMEM is used only for NVIDIA GPUs.


### device mesh

#### tle.device_mesh

`tle.device_mesh` defines the topological structure of physical devices. It is the fundamental context for all distributed operations.

```{code-block} python
class device_mesh:
    def __init__(self, topology: dict):
        """
        Initialize a DeviceMesh.

        Args:
            topology (dict): A dictionary describing the hardware hierarchy.
                             Keys are level names; values are either an integer (for 1D)
                             or a list of tuples (for multi-dimensional levels).
        """
        self._physical_ids = ...  # Internal storage: flattened list of physical IDs (0..N-1)
        self._shape = ...         # Shape of the current logical view, e.g., (2, 2, 4, 2, 2, 4)
        self._dim_names = ...     # Names of the current dimensions
        # Initialization and parsing logic...

    @property
    def shape(self):
        """Return the logical shape of the current mesh."""
        return self._shape

    @property
    def ndim(self):
        """Return the number of dimensions."""
        return len(self._shape)

    def flatten(self):
        """
        Flatten the mesh into 1D. Commonly used for ring-based communication patterns.
        """
        return self.reshape(prod(self._shape))

    def __getitem__(self, key):
        """
        Support slicing operations and return a sub-mesh.
        Supports standard slices (slice objects) and integer indexing.
        """
        # Compute new shape and selected physical IDs after slicing
        # ...
        return sub_mesh

    def __repr__(self):
        return f"DeviceMesh(shape={self._shape}, names={self._dim_names})"


# Define a complex hardware hierarchy
topology = {
    # Inter-node level (2x2 = 4 nodes)
    "node": [("node_x", 2), ("node_y", 2)],
    # Intra-node GPUs (4 devices)
    "device": 4,
    # Intra-GPU clusters (2x2)
    "block_cluster": [("cluster_x", 2), ("cluster_y", 2)],
    # Blocks within each cluster (4 blocks)
    "block": 4
}

# mesh.shape -> (2, 2, 4, 2, 2, 4)
# Total size = 256
mesh = tle.device_mesh(topology=topology)
```

### Sharding specification

`tle.sharding` is used to declare the current distribution state of a tensor across a Device Mesh. The splits list describes how each dimension of the tensor is partitioned over the mesh, while the partials list indicates whether the tensor is in a partial-sum state. Any mesh axes not explicitly mentioned are treated as broadcast (replicated).

- tle.S(axis): Split — indicates that the tensor dimension is partitioned along the specified mesh axis.
- tle.B: Broadcast/Replicate — indicates that the tensor dimension is fully replicated (i.e., not split) along any mesh axes not explicitly referenced.
- tle.P(axis): Partial — indicates that the tensor holds only a partial value (e.g., a partial sum) and must be reduced along the specified mesh axis to obtain the complete result.

```{code-block} python
def sharding(tensor, splits, partials):
    """
    Annotation: Used only to annotate the tensor's layout state.
    It does not generate any runtime code but guides the compiler for subsequent optimizations or correctness checks.
    """
    return tensor


# Define a sharding spec where:
# - axis 0 is split across the "cluster" dimension (specifically over ["cluster_x", "cluster_y"]),
# - axis 1 is split across the "device" dimension,
# - and the tensor is in a partial state along the "block" dimension (requiring a reduce to resolve).
x_shard = tle.sharding(
    mesh,
    split=[["cluster_x", "cluster_y"], "device"],
    partial=["block"]
)

# Create a sharded tensor using the above sharding specification
x = tle.make_sharded_tensor(x_ptr, sharding=x_shard, shape=[4, 4])
```

### Synchronization

In complex distributed operators—such as Ring-AllReduce or pipelined execution with independent row/column communication—we often need to synchronize only thread blocks within the same "row" or "column," rather than across the entire cluster. A global synchronization would introduce unnecessary waiting overhead.
This API supports sub-mesh synchronization, meaning that within a large physical cluster, we can define multiple logical "communication groups" and perform synchronization independently within each group.

```{code-block} python
def distributed_barrier(mesh):
    """
    If a sub-mesh is passed, only devices within that sub-mesh are synchronized.
    Devices outside the sub-mesh should treat this instruction as a no-op 
    (or the compiler should ensure their control flow never reaches this point).
    """
    pass
```

#### tle.distributed_barrier

`tle.distributed_barrier` synchronize only the set of devices corresponding to the given mesh or sub-mesh.

Read from neighboring shards (ring-style exchange).

```{code-block} python
node_rank = tle.shard_id(mesh, "node")
device_rank = tle.shard_id(mesh, "device")
next_device = (device_rank + 1) % mesh.shape[1]
remote_x = tle.remote(x, shard_id=(node_rank, next_device), scope=mesh)
tle.distributed_barrier(mesh)
neighbor_vals = tl.load(remote_x)
```

### Remote access

`tle.remote` is used to obtain a handle to a tensor located on another device. This corresponds to point-to-point communication or direct memory access (e.g., RDMA/NVLink Load). It enables kernels to explicitly access data from a specific shard.

```{code-block} python
def remote(tensor, shard_id, scope):
    """
    Obtains a handle to a Remote Tensor residing on a specific device shard.

    :param tensor: A logically distributed tensor (already annotated with tle.sharding).
    :param shard_id: tuple. The coordinates of the target device within the Device Mesh.
                     For example, if mesh=(2,4) and shard_id=(0, 3), this refers to GPU #3 on node #0.
    :return: RemoteTensor. Supports operations such as load, store, etc.
    """
```

`tle.remote`: Explicitly read from or write to remote shards.

```{code-block} python
node_rank = tle.shard_id(mesh, "node")
device_rank = tle.shard_id(mesh, "device")
next_device = (device_rank + 1) % mesh.shape[1]
remote_x = tle.remote(x, shard_id=(node_rank, next_device), scope=mesh)
tle.distributed_barrier(mesh)
neighbor_vals = tl.load(remote_x)
```

### Mesh coordinates and resharding

#### tle.shard_id

- Signature: `tle.shard_id(mesh, axis)`
- Meaning: returns the coordinate of the current program along the given mesh axis.
- `axis` can be an axis name (such as `"node"`, `"device"`, `"cluster_x"`) or an axis index.
- Typical use: constructing peer shard IDs for ring exchange, staged all-reduce, and cluster cooperative computation.

```{code-block} python
mesh = tle.device_mesh({"node": 2, "device": 4})
node_rank = tle.shard_id(mesh, "node")      # 0..1
device_rank = tle.shard_id(mesh, "device")  # 0..3
```

#### tle.reshard

Distribution-state conversion. This interface is still a reserved entry point in the current version and is not implemented yet (calling it raises `NotImplementedError`). The recommended flow is: define the topology with `tle.device_mesh`, annotate the distribution state with `tle.sharding`, perform distribution-state conversion with `tle.reshard`, and keep computation kernels on the logical tensor view.

```{code-block} python
x_full = tle.reshard(x, spec=tle.sharding(mesh, split=[], partial=[]))
```

### Target domains of remote access

`tle.remote` obtains an access handle to a data shard on another device, corresponding to point-to-point communication or direct memory access (RDMA/NVLink Load). The current implementation distinguishes three target domains by `space`:

```{code-block} python
def remote(tensor, shard_id, scope=None, space="cluster", dtype=None,
           offset=None, coopkind=None, netidx=0):
    ...
```

- `tensor`: required. For the cluster path, a shared-memory pointer or a buffered_tensor; for the device / node paths, the `DistributedRtContext` returned by `tle.create_dist_tensor`.
- `shard_id`: required. A compile-time int or a runtime int32 scalar; for the cluster path it is the target Block id, for the device path the intra-node peer rank, and for the node path the world rank. Compile-time mesh coordinates must be paired with `scope`.
- `scope`: a `device_mesh`; required when `shard_id` is given in mesh-coordinate form.
- `space`: `"cluster"` (default), `"device"`, or `"node"`.
- `dtype`: optional for the cluster path, inferred from the input when omitted; required for the device / node paths.
- `offset`: required for the device path; unsupported for the cluster / node paths.
- `coopkind` / `netidx`: available on the node path only.

#### Cluster path (intra-cluster communication, DSMEM)

Targets shared-memory access across Blocks within the same thread-block cluster (CTA cluster) on Hopper and later architectures; this is the path taken when `space` is omitted. Two kinds of input are supported:

- a shared-memory pointer (scalar or tensor): returns the remote pointer in the cluster address space directly, usable with `tl.load` / `tl.store`, preserving the shape when the input is a block tensor;
- a TLE buffered_tensor: returns a remote-marked buffer, whose remote pointer view is then materialized with `tle.gpu.local_ptr(...)`.

`shard_id` is the id of the target Block inside the cluster; when `scope` is passed, coordinates are linearized from the mesh and the launch cluster dimensions are inferred from the mesh (this requires `num_ctas=1`, one program mapping to one Block). For pointers already in the cluster-shared space, `shard_id=0` returns local access directly. The cluster / device paths do not support the node-specific parameters `coopkind` / `netidx`.

```{code-block} python
# smem here is a buffered_tensor, for example returned by tle.gpu.alloc
remote_smem = tle.remote(smem, shard_id=(node_rank, next_device), scope=mesh)
remote_ptr = tle.gpu.local_ptr(remote_smem, (rows, cols))
vals = tl.load(remote_ptr)
```

#### Device path (intra-node inter-GPU communication, NVLink P2P)

Targets direct memory access between GPUs within the same node over a FlagCX-registered window (symmetric memory) (NVLink P2P). As with the node path, `tensor` takes the `DistributedRtContext` returned by `create_dist_tensor`, but the returned pointer is a remote pointer in the ordinary global address space and `offset` is required — it specifies the element offset within the remote window (a Python int or a scalar integer tensor, normalized to i64 internally).

The key difference from the node path: the device-path remote pointer is an ordinary global pointer, so subsequent `tl.load` / `tl.store` support arbitrary tiled / multi-dimensional accesses, with no "contiguous transfers only" restriction; the offset base is fixed once by `offset`, after which pointer arithmetic behaves like ordinary global pointers.

```{code-block} python
remote_base = tle.remote(scatter_ctx, space="device",
                         dtype=input_ptr.dtype.element_ty,
                         shard_id=target_rank,
                         offset=SCATTER_NODE_SLICE_OFFSET_ELEMS + source_slot_offset_elems)
scatter_ptrs = (remote_base +
                (scatter_row + row_offs[:, None]) * N + input_col + col_offs[None, :])
tl.store(scatter_ptrs, values, mask=scatter_row_mask & col_mask)
```

#### Node path (inter-node communication, FlagCX/RDMA)

Targets point-to-point transfers across nodes, with the data plane based on FlagCX-registered memory (symmetric window). The current version supports contiguous data transfers only; note the following before use:

- The host side must first register the communication buffer into the FlagCX symmetric-memory window with `tle.create_dist_tensor(comm_buf)`, and pass the returned `DistributedRtContext` into the kernel as a kernel argument; inter-device scatter and inter-node P2P can share the same registered window. The buffer used on the local side must be the same buffer registered by that context, passed to the kernel directly as a global pointer argument.
- `dtype` is required; the `offset` parameter is not supported — offsets must be added to the returned pointer.
- Transfer shapes are restricted: a scalar copy transfers one element at a time; a tensor copy must reuse the same contiguous range `tl.arange(0, N)` on both sides, and the mask may only be omitted or reuse the same shared-prefix mask `offsets < valid_n` (`1 <= valid_n <= N`).
- The amount of data in a single transfer is limited by the compiler tensor size: the element count N of one transfer must be a power of two and must not exceed `33554432` (2^25); exceeding it is a compile-time error. To transfer more data, split it into chunks and call load/store repeatedly in a loop, one chunk per iteration.
- The load result must be consumed directly and only by the paired store; the two must be in the same basic block, with the load before the store, and no memory access, atomic operation, barrier, or other communication operation in between; exactly one side must use a node remote pointer.
- Sparse access, multi-dimensional tiled load/store, strided access, ranges with a non-zero start, and mismatched ranges on the two sides are unsupported — these are rejected at compile time, and dynamic violations trigger a device assert.
- `coopkind` supports `thread` / `warp` / `block`, defaulting to `block` (the whole CTA convergently issues a single transfer); `netidx` is the index of an existing network context and must be a compile-time integer in the range `[0, INT32_MAX]`.
- The device side has no `rank()` / `num_ranks()`, so the topology is passed into the kernel by the host as constexpr; `shard_id` is best passed directly as a host-precomputed world rank int, but a mesh-coordinate tuple + `scope` also works (resolved to a world rank through `physical_ids`). On the node path `scope` does not affect the launch configuration.

Usage: first obtain a remote pointer to the peer node with `tle.remote`, then complete the transfer with a pair of load/store; the transfer direction is determined by the positions of the load and store:

- **PUT (local → remote)**: load from the local buffer first, then store to the remote pointer; the data is written from this node to the remote node.
- **GET (remote → local)**: written exactly symmetrically to PUT with the direction reversed — load from the remote pointer, then store into the local buffer; the data is read back from the remote node.

```{code-block} python
# PUT: local load + remote store
remote_dst = tle.remote(ctx, space="node", dtype=DTYPE,
                        shard_id=remote_rank, coopkind=tle.GroupKind.BLOCK)
offsets = tl.arange(0, BLOCK_SIZE)
mask = offsets < nelems
vals = tl.load(comm_buf + src_offset + offsets, mask=mask)
tl.store(remote_dst + dst_offset + offsets, vals, mask=mask)

# GET: remote load + local store
remote_src = tle.remote(ctx, space="node", dtype=DTYPE,
                        shard_id=remote_rank, coopkind=tle.GroupKind.BLOCK)
vals = tl.load(remote_src + src_offset + offsets, mask=mask)
tl.store(comm_buf + dst_offset + offsets, vals, mask=mask)
```

Common incorrect forms:

```{code-block} python
# Wrong: multi-dimensional / tiled access
vals = tl.load(remote_dst + rows[:, None] * N + cols[None, :])  # rejected at compile time
# Reason: the node path lowers the load/store pair into a single RDMA put/get,
# and the interface only supports contiguous data (1D linear ranges), so it
# cannot express the discrete addresses of a 2D tile.

# Wrong: passing the offset to remote
remote_dst = tle.remote(ctx, space="node", dtype=DTYPE, shard_id=r, offset=1024)  # error
# Reason: on the node path tle.remote only resolves the target peer and returns a
# pointer to the peer window base; source/destination offsets are expressed by the
# src_offset / dst_offset of the subsequent load/store.

# Wrong: mismatched ranges on the two sides, or a mask that is not a shared prefix
vals = tl.load(local + tl.arange(0, N), mask=mask)
tl.store(remote + tl.arange(0, M), vals, mask=mask2)  # rejected
# Reason: the transfer length and both offsets are derived jointly from the pointer
# expressions of the load and store; when the ranges / masks on the two sides differ,
# how much is transferred and from where to where cannot be determined, so the
# compiler rejects it.
```

#### tle.signal

`tle.signal` atomically updates the synchronization slot of a remote peer. This primitive only sends a signal; it transfers no data and does not wait for completion on the receiving side.

```{code-block} python
def signal(device_dptr, peer, slot_id, value=None, op="inc",
          space="intra_node", group_kind="block", context_idx=0,
          scope="system"):
    ...
```

`op="inc"` increments the target signal slot by one; `op="add"` adds `value` to the target signal slot, in which case `value` must be provided and must be omitted for the former. `space` selects the communication scope (`intra_node`, `inter_node`, or `world`) and `peer` is the rank within that scope. `context_idx` selects a pre-allocated network context. `scope` controls the visibility of the signal operation to threads on the node: `"system"` means visible to all threads on all devices, `"device"` means visible only to threads on the current device; `"device"` is only meaningful in single-node scenarios, and `"system"` is the right choice in most cases. With `group_kind="block"` (the default), all threads in the CTA must execute the operation convergently; the whole group issues a single remote update.

#### tle.signal_wait

`tle.signal_wait` waits for a local synchronization slot to reach a target value.

```{code-block} python
def signal_wait(device_dptr, slot_id, wait_kind, target=None,
               group_kind="block", context_idx=0, order="acquire"):
    ...
```

`wait_kind` selects the wait mode: `"signal"` waits for the slot value to reach `target`; `"counter"` waits for the counter in the slot to reach `target`; `"shadow"` reads the target value from the shadow buffer maintained locally at runtime and therefore requires `target` to be omitted. `slot_id` shares the same signal-slot namespace as `tle.signal`. The semantics of `group_kind` and `context_idx` match `tle.signal`. `order` constrains the memory order of the wait operation; since `tle.signal_wait` is a read operation, only `"relaxed"` and `"acquire"` are allowed, and the default `"acquire"` is the right choice in most cases.

### Combined examples

#### Asynchronous filtering and compaction

Combines `tle.load` and `tle.cumsum`: a tile is read in with a masked asynchronous load, active flags are derived from a predicate, and `tle.cumsum` finally produces the compact write-back offsets and the active total for the current block.

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

#### Pipelined tile post-processing

Combines `tle.pipe`, shared-memory pointer views, and tensor slicing. The producer writes global tiles into shared memory in stages; the consumer reads a ready stage, applies a local transformation to one sub-tile, and writes the updated full tile back to the output.

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

#### Multi-field pipe with selective readers

Combines a multi-field pipe payload with reader field subsets. A single pipe slot carries both the tile produced by TMA and a locally written scale vector; the MMA reader subscribes only to the tile, while the epilogue reader consumes both the tile and the scale.

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

#### Distributed exchange and resharding

Combines `tle.device_mesh`, `tle.sharding`, `tle.shard_id`, `tle.remote`, `tle.distributed_barrier`, and `tle.reshard`. The current shard reads the tile of a neighboring device to complete a ring-style exchange, then constructs a replicated view for local computation.

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

## Primitives interactive with local_ptr

The following APIs are used together with `tle.gpu.local_ptr`. For more information, see [Use TLE-Struct](use-tle-struct.md).

- `tl.load`（for local_ptr）
- `tl.store`（for local_ptr）
- `tl.atomic_add`/`and`/`cas`/`max`/`min`/`or`/`xchg`/`xor`（for local_ptr）
