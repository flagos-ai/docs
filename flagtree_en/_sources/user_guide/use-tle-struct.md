# Use TLE-Struct

This section introduces how to use TLE-Struct. TLE-Struct is available on trition_3.6.x branch.

## GPU memory management

You can use the following operations to manage the GPU's memory.

### tle.gpu.memory_space

Specify the memory_space for a given Tensor:

```{code-block} python
x = ...
x = tle.gpu.memory_space(x, "shared_memory")
```

### tle.gpu.alloc

The following example demonstrates how to reserve a block of memory in the GPU's high-speed on-chip  SMEM (Shared Memory) with dimensions `XBLOCK * YBLOCK` and data type `float32`.

```{code-block} python
a_smem = tle.gpu.alloc([XBLOCK, YBLOCK], dtype=tl.float32,
                      layout=None, scope=tle.gpu.storage_kind.smem)
```

- Signature: `tle.gpu.alloc(shape, dtype, layout=None, scope=tle.gpu.smem, init_value=None, alias=None, alias_offset_bytes=0, nv_mma_shared_layout=True) -> tle.gpu.buffered_tensor`
- `shape`: a non-empty tuple/list (or iterable); every dimension must be a positive compile-time integer.
- `dtype`: a `tl.dtype`. The semantic checker validates the type; dtypes outside the standard allocation type set produce a warning.
- `layout`: an optional shared-memory layout object; when passed it must be a `tle.gpu.shared_layout`.
- `scope`: the storage scope. The current allocation path supports `tle.gpu.smem`; `tle.gpu.tmem` is defined as a scope but is not yet supported by `alloc`.
- `init_value`: an optional register tensor used to initialize the newly allocated buffer; cannot be used together with `alias`.
- `alias`: an optional source `tle.gpu.buffered_tensor`. Alias mode does not allocate new storage but creates a typed view over an existing shared-memory buffer; both the requested scope and the source buffer must be SMEM.
- `alias_offset_bytes`: a non-negative compile-time byte offset from the base address of the source alias view.
- `nv_mma_shared_layout`: when `layout=None` and the scope is SMEM, `True` (the default) selects the default layout for MMA consumers and `False` selects the default swizzled shared layout. On MUSA, the automatic MMA layout is materialized by SQMMA lowering.

When `layout=None`, the backend derives the layout from the scope and `nv_mma_shared_layout`; an explicit layout is converted through its `to_ir()` method. Alias allocations do not create a new allocation.

```{code-block} python
# A plain SMEM allocation using the default swizzled layout
smem = tle.gpu.alloc(
    [2 * BLOCK], dtype=tl.float32, scope=tle.gpu.smem, nv_mma_shared_layout=False
)

# Initialize a new buffer with a register tensor
init = tl.zeros((BLOCK,), dtype=tl.float32)
initialized = tle.gpu.alloc(
    [BLOCK], dtype=tl.float32, init_value=init, nv_mma_shared_layout=False
)

# Create a typed view over an existing SMEM allocation
view = tle.gpu.alloc(
    [BLOCK], dtype=tl.float32, alias=smem, alias_offset_bytes=BLOCK * 4,
    nv_mma_shared_layout=False,
)
```

### tle.gpu.buffered_tensor.slot

Select one stage from a staged shared-memory buffer:

```{code-block} python
slot = buffer.slot(stage)
```

- Signature: `tle.gpu.buffered_tensor.slot(stage) -> tle.gpu.buffered_tensor`
- `buffer` must have rank >= 2. The leading dimension is the stage dimension; the returned view has shape `buffer.shape[1:]`.
- Only SMEM buffered tensors are supported.
- `stage` must be a scalar `tl.int32`; vector indexing and other integer dtypes are not supported.
- The return value is an alias subview selected by `ttg.memdesc_index`; it neither allocates nor copies storage.
- The slot layout is derived by dropping the leading dimension from the source layout; the current implementation supports `swizzled_shared_layout` and `nv_mma_shared_layout` source layouts.

```{code-block} python
staged = tle.gpu.alloc(
    [2, BM, BK], dtype=tl.float16, scope=tle.gpu.smem, nv_mma_shared_layout=False
)
stage = tl.program_id(0) % 2
tile = staged.slot(stage)
tile_ptrs = tle.gpu.local_ptr(tile)
tile_values = tl.load(tile_ptrs)
```

### tle.gpu.buffered_tensor.reshape

Create a shared-memory alias view with a different static shape:

```{code-block} python
reshaped = buffer.reshape(shape)
```

- Signature: `tle.gpu.buffered_tensor.reshape(shape) -> tle.gpu.buffered_tensor`
- `shape` must be a non-empty sequence of static dimensions, each positive.
- The total number of elements of the new shape must equal that of `buffer`.
- The operation produces `ttg.memdesc_reshape`, preserving the underlying storage, dtype, and storage scope without copying data.
- The layout of the return value is re-derived from the reshaped memdesc; `shared_linear` and NVIDIA MMA encodings are currently supported, and unsupported encodings fail at compile time.
- For views carrying an allocation prefix (such as staged buffers), the resulting allocation metadata preserves that prefix.

```{code-block} python
buffer = tle.gpu.alloc(
    [32, 512], dtype=tl.float16, scope=tle.gpu.smem, nv_mma_shared_layout=True
)
reshaped = buffer.reshape([128, 128])
```

### tle.gpu.set_layout

Attach an explicit distributed layout to a block tensor value:

```{code-block} python
result = tle.gpu.set_layout(value, layout)
```

- Signature: `tle.gpu.set_layout(value, layout) -> tl.tensor`
- `value`: a block `tl.tensor`; non-tensor values are first converted to tensors.
- `layout`: a compile-time layout object with a `to_ir()` method.
- The return value preserves the shape and element type of the input and carries the requested encoding. This operation is a layout contract, not a data copy.
- The compiler must provide explicit TLE layout support (`ir.builder.ensure_ttg_layout_attrs`); otherwise compilation raises a `RuntimeError`.

The built-in NVIDIA layout objects are:

- `BlockEncoding(size_per_thread, threads_per_warp, warps_per_cta, order, cga_layout=None)`: produces a `#ttg.blocked` encoding. The per-dimension lists must have the same rank and `order` must be a permutation of that rank.
- `MmaEncoding(version, warps_per_cta, instr_shape, cga_layout=None)`: a `#ttg.nvidia_mma` encoding for dot results or accumulators.
- `DotOperandEncoding(operand_index, parent, k_width)`: derives a `#ttg.dot_op` encoding from a distributed parent; `operand_index` may only be `0` or `1` and `k_width` must be positive.
- `SlicedEncoding(dim, parent)`: produces a rank-reduced `#ttg.slice` encoding of a distributed parent along the given dimension; `dim` must be within the parent rank.

```{code-block} python
parent = tle.gpu.BlockEncoding([1, 1], [1, 32], [4, 1], [1, 0])
layout = tle.gpu.SlicedEncoding(0, parent)
offsets = tl.arange(0, BLOCK)

values = tle.gpu.set_layout(tl.load(x_ptr + offsets), layout)
out_ptrs = tle.gpu.set_layout(out_ptr + offsets, layout)
tl.store(out_ptrs, values)
```

The MUSA backend additionally provides `MusaWmmaEncoding`, `MusaSqmmaEncoding`, and `MusaDotOperandEncoding` from `tle.gpu.mthreads`; their instruction-shape and operand restrictions are defined by the specific backend.

### tle.gpu.local_ptr

Obtain the memory pointer.

```{code} python
# Get pointers to a_smem[0,:]: [(0, 0), (0, 1)...(0, YBLOCK-1)]
a_smem_ptrs = tle.gpu.local_ptr(a_smem,
    indices=(tl.broadcast(0, [YBLOCK]), tl.arrange(0, YBLOCK)))
```

- Signature: `tle.gpu.local_ptr(buffer, indices=None) -> tl.tensor | tl.ptr`
- Purpose: Build arbitrary-shaped pointer views over shared memory buffer for `tl.load`/`tl.store`.
- Parameters:
  - `buffer`: buffered_tensor returned by `tle.gpu.alloc` (SMEM / TMEM).
  - `indices`: An optional tuple of integer tensors, whose length must equal `rank(buffer)`, and each tensor must have the same shape. If omitted or passed as `None`, the backend will handle it according to full indices semantics.
- Semantics:
  - When `indices` are explicitly provided, the output pointer tensor has a shape equal to the common (broadcasted) shape of the indices.
  - For each logical index `(i0, i1, ...)` in the output shape, the corresponding pointer refers to `buffer[indices0(i0, ...), indices1(i0, ...), ...]`.
  - When `indices=None`, a full-view pointer covering the entire `buffer` is returned:
    - If rank > 0, a pointer tensor with shape equal to `shape(buffer)` is returned.
    - If rank = 0, a scalar pointer is returned.
  - The returned pointers reside in the shared memory address space (LLVM address space 3). Indices must be of integer type (e.g., i32, i64, etc.), and will be normalized to i32 during lowering.
  - Memory layout is linearized in row-major order (with the last dimension varying fastest). The shared memory layout and encoding follow the buffer's memdesc.

- Example 1: 1D slice

  ```{code-block} python
  smem = tle.alloc([BLOCK], dtype=tl.float32, scope=tle.smem)
  # Slice [offset, offset + SLICE)
  idx = offset + tl.arange(0, SLICE)
  slice_ptr = tle.local_ptr(smem, (idx,))
  vals = tl.load(slice_ptr)
  ```

- Example 2: K-dimension tiling (matrix slice)

  ```{code-block} python
  smem_a = tle.alloc([BM, BK], dtype=tl.float16, scope=tle.smem)
  # Slice (BM, KW), where KW is the K-dimension slice
  rows = tl.broadcast_to(tl.arange(0, BM)[:, None], (BM, KW))
  cols = tl.broadcast_to(tl.arange(0, KW)[None, :] + k_start, (BM, KW))
  a_slice = tle.local_ptr(smem_a, (rows, cols))
  a_vals = tl.load(a_slice)
  ```
  
- Example 3: arbitrary gather view
  
  ```{code-block} python
      smem = tle.alloc([H, W], dtype=tl.float32, scope=tle.smem)
      # Take an offset column per row
      rows = tl.broadcast_to(tl.arange(0, H)[:, None], (H, SLICE))
      cols = tl.broadcast_to(1 + tl.arange(0, SLICE)[None, :], (H, SLICE))
      gather_ptr = tle.local_ptr(smem, (rows, cols))
      out = tl.load(gather_ptr)
  ```

Supported downstream operations:

- `tl.load`
- `tl.store`
- `tl.atomic_add`, `atomic_and`, `atomic_cas`, `atomic_max`, `atomic_min`, `atomic_or`, `atomic_xchg`, `atomic_xor`

Practical notes:

- The availability of atomic operations depends on the element data type (dtype) and the capabilities of the backend hardware. It is recommended to prioritize integer or floating-point types that are explicitly verified as supported on the target hardware.

- For load-after-store hazards involving local_ptr, the TLE backend pass `TleInsertLocalPointerBarriers` automatically inserts necessary memory barriers. Manual barrier insertion is only required when using custom synchronization patterns that fall outside the scope of this pass.

- Example 4: Performing load, store, and atomic operations on the same local_ptr.

```{code-block} python
smem_i32 = tle.gpu.alloc([BLOCK], dtype=tl.int32, scope=tle.gpu.smem)
ptr = tle.gpu.local_ptr(smem_i32, (tl.arange(0, BLOCK),))

tl.store(ptr, tl.zeros([BLOCK], dtype=tl.int32))
tl.atomic_add(ptr, 1)
vals = tl.load(ptr)
```

### tle.gpu.local_ptr (for remote)

- Signature: `tle.gpu.local_ptr(remote_buffer, indices=None) -> tl.tensor | tl.ptr`
- Purpose: Constructs a pointer view into a remote shared/local buffer returned by `tle.remote(...)`.
- Inputs:
  - `remote_buffer`: Returned by `tle.remote(buffer, shard_id, scope)`, where `buffer` is typically allocated via `tle.gpu.alloc`.
  - `indices`: Consistent with the local pattern (`None` denotes a full-view, or a tuple of integer tensors with matching shapes may be provided).
- Semantics:
  - The pointer’s shape, indexing behavior, and linearization rules are identical to those of the local `tle.gpu.local_ptr`.
  - Address resolution is routed to the remote shard specified by `shard_id`.
  - For cross-shard reads/writes that require ordering guarantees, use `tle.distributed_barrier(...)` in conjunction.
  
Read the remote SMEM tile on the neighboring shard.

```{code-block} python
smem = tle.gpu.alloc([BM, BK], dtype=tl.float16, scope=tle.gpu.storage_kind.smem)
remote_smem = tle.remote(smem, shard_id=(node_rank, next_device), scope=mesh)

rows = tl.broadcast_to(tl.arange(0, BM)[:, None], (BM, BK))
cols = tl.broadcast_to(tl.arange(0, BK)[None, :], (BM, BK))
remote_ptr = tle.gpu.local_ptr(remote_smem, (rows, cols))

vals = tl.load(remote_ptr)
```

### tle.gpu.copy

The following example demonstrates how to load a tile of data from the low-speed GMEM (Global Memory) into the high-speed on-chip SMEM.

- Copy from source:
  - `a_ptrs`: The base pointer(s) in GMEM
  - `ystride_a * yoffs[None, :]`: An offset vector added to the base pointer.
    - `yoffs[None, :]`: Represents a range of Y-axis offsets, broadcasted to a row vector.
    - `ystride_a`: The stride between rows in the source layout. This calculates the exact addresses of the 2D block that tends to load from GMEM.
- To destination:
  - `a_smem`: The previously allocated SMEM buffer. Data will be written here for fast access by the threads in this block.

```{code-block} python
tle.gpu.copy(a_ptrs + ystride_a * yoffs[None, :], a_smem, [XBLOCK, YBLOCK])
```

`tle.gpu.copy` moves data between global memory and GPU local/shared memory, covering both the ordinary tensor load/store path and the TMA descriptor path.

- Signature: `tle.gpu.copy(src, dst, shape, offsets=None, barrier=None, mask=None)`
- The copy direction is inferred from the operand types:
  - `tl.tensor` or TMA descriptor -> `tle.gpu.buffered_tensor`: global to local/shared.
  - `tle.gpu.buffered_tensor` -> `tl.tensor` or TMA descriptor: local/shared to global.
- `shape` is the shape of the tile to copy.
- `offsets` is used for TMA descriptor copies and gives the descriptor coordinate offsets.
- `barrier` is an optional explicit TMA completion barrier, supported only for NVIDIA global-to-shared TMA loads (`src` is a TMA descriptor and `dst` is a shared-memory `tle.gpu.buffered_tensor`). The barrier must be allocated with `expect_bytes`, i.e. one of the indexed slots returned by `tle.gpu.alloc_barrier(...)` or `tle.gpu.alloc_barriers(...)`.
- `mask` is an optional per-element mask for ordinary pointer tensor copies. For GM to local, elements whose mask is false are written to local memory as zero; for local to GM, elements whose mask is false are not written. TMA descriptor copies do not accept `mask`.

```{code-block} python
# TMA load with an explicit completion barrier
a_bar = tle.gpu.alloc_barrier(expect_bytes=BLOCK_M * BLOCK_K * 2)
tle.gpu.copy(
    a_desc,
    a_smem,
    [BLOCK_M, BLOCK_K],
    [pid_m * BLOCK_M, pid_k * BLOCK_K],
    barrier=a_bar,
)
tle.gpu.barrier_wait(a_bar, phaseIdx=0)

# An ordinary pointer tensor copy may pass a per-element mask
offsets = tl.arange(0, BLOCK)
mask = offsets < n
tle.gpu.copy(x_ptr + offsets, smem, [BLOCK], mask=mask)
```

`tle.gpu.copy(..., barrier=...)` does not support ordinary copies, shared-to-global TMA stores, named barriers, or barriers allocated without `expect_bytes`.

## tle.gpu barrier API

TLE GPU barriers express the synchronization needed by hand-written Hopper producer/consumer pipelines, including TMA completion barriers, empty/full mbarriers, and lightweight named barriers between warp groups.

API overview:

- `tle.gpu.alloc_barriers(num_barriers, arrive_count=1, init=tle.gpu.PENDING, expect_bytes=None) -> tle.gpu.barrier`
- `tle.gpu.alloc_barrier(arrive_count=1, init=tle.gpu.PENDING, expect_bytes=None) -> tle.gpu.barrier`
- `tle.gpu.barrier_wait(bar, phaseIdx=None) -> None`
- `tle.gpu.barrier_arrive(bar, arrive_count=1, phaseIdx=None) -> None`
- `tle.gpu.PENDING`: initially not passable.
- `tle.gpu.READY`: initially passable; only applies to the mbarrier path.
- `tle.gpu.barrier`: the value type returned by the allocation APIs; slots of an array are taken with `bars[i]`.
- `tle.gpu.barrier_type`: the type description of a barrier value.

Allocation parameters:

- `num_barriers`: the number of barrier slots; must be a compile-time positive integer.
- `arrive_count`: the pending arrival count. For an mbarrier it is the logical arrive count; for a named barrier it is the number of participating threads, usually `num_warps * 32`.
- `init`: `tle.gpu.PENDING` or `tle.gpu.READY`.
- `expect_bytes`: the number of bytes the TMA global-to-shared completion barrier is expected to complete; must be a compile-time positive integer, and is `None` when unused.

Backend path selection:

- Passing `phaseIdx` to `barrier_wait` or `barrier_arrive` selects the mbarrier path.
- Omitting `phaseIdx` selects the named barrier path.
- The same barrier slot must not mix mbarrier and named barrier usage.
- `expect_bytes` barriers and `init=tle.gpu.READY` barriers must use the mbarrier path.
- Named barriers require a static barrier slot index such as `sync[0]`; a dynamic slot index is an error.

When reusing a ring buffer, `phaseIdx` should be passed the logical use id of that slot; lowering maps it internally to the hardware phase.

```{code-block} python
bars = tle.gpu.alloc_barriers(
    num_barriers=NUM_SLOTS,
    arrive_count=1,
    init=tle.gpu.READY,
)

for k_iter in range(0, NUM_ITERS):
    slot = k_iter % NUM_SLOTS
    use_id = k_iter // NUM_SLOTS

    tle.gpu.barrier_wait(bars[slot], phaseIdx=use_id)
    # Use the shared-memory slot `slot`
    tle.gpu.barrier_arrive(bars[slot], phaseIdx=use_id)
```

Example: named-barrier synchronization between two 4-warp worker partitions.

```{code-block} python
@triton.jit
def consumer(sync, CID: tl.constexpr):
    if CID == 0:
        tle.gpu.barrier_arrive(sync[0])
    else:
        tle.gpu.barrier_wait(sync[0])


sync = tle.gpu.alloc_barriers(num_barriers=1, arrive_count=256)
tle.gpu.warp_specialize(
    [
        (producer, (...,)),
        (consumer, (sync, 0)),
        (consumer, (sync, 1)),
    ],
    [4, 4],
    [168, 168],
)
```

Example: empty/full synchronization around a TMA load.

```{code-block} python
@triton.jit
def producer(a_desc, a_smem, a_empty, a_full):
    phase: tl.constexpr = 0
    tle.gpu.barrier_wait(a_empty, phaseIdx=phase)
    tle.gpu.copy(a_desc, a_smem, [BLOCK_M, BLOCK_K], [0, 0], barrier=a_full)


@triton.jit
def consumer(a_smem, a_empty, a_full):
    phase: tl.constexpr = 0
    tle.gpu.barrier_wait(a_full, phaseIdx=phase)
    # Consume a_smem ...
    tle.gpu.barrier_arrive(a_empty, phaseIdx=phase)


a_empty = tle.gpu.alloc_barrier(init=tle.gpu.READY)
a_full = tle.gpu.alloc_barrier(expect_bytes=A_TILE_BYTES)
```

### tle.gpu.wgmma and tle.gpu.wgmma_wait

`tle.gpu.wgmma` issues an asynchronous Hopper WGMMA and returns an accumulator dependency value. Ordinary tensor ops, reductions, or stores must call `tle.gpu.wgmma_wait(...)` before consuming that accumulator.

```{code-block} python
tle.gpu.wgmma(
    a,
    b,
    acc=None,
    input_precision=None,
    max_num_imprecise_acc=None,
    out_dtype=tl.float32,
    trans_a: tl.constexpr = False,
    trans_b: tl.constexpr = False,
) -> tl.tensor

tle.gpu.wgmma_wait(pendings, acc=None) -> tl.tensor
```

Operand and result rules:

- `a` may be a shared-memory `tle.gpu.buffered_tensor` or a register `tl.tensor`.
- `b` must currently be a shared-memory `tle.gpu.buffered_tensor`.
- Shared-memory operands must use the default NVIDIA MMA shared layout and must be rank-2 tiles.
- `trans_a` and `trans_b` must be compile-time bools.
- Shape constraints: `M >= 64` and divisible by 64, `N >= 8` and divisible by 8, `K >= 16`, and `a.K == b.K`.
- Non-FP8 operands must have matching dtypes and must be one of `tl.int8`, `tl.float16`, `tl.bfloat16`, or `tl.float32`.
- `out_dtype` controls the accumulator dtype; `tl.bfloat16` output is not supported.
- `max_num_imprecise_acc` controls FP8 imprecise accumulation and does not change the returned tensor dtype.
- `wgmma_wait(pendings, acc)` waits until at most `pendings` WGMMA groups remain outstanding; `wgmma_wait(acc)` is equivalent to `wgmma_wait(0, acc)`.

```{code-block} python
a_smem = tle.gpu.alloc([64, 16], dtype=tl.float16, layout=None, scope=tle.gpu.smem)
b_smem = tle.gpu.alloc([16, 16], dtype=tl.float16, layout=None, scope=tle.gpu.smem)

acc = tle.gpu.wgmma(a_smem, b_smem, out_dtype=tl.float32)
acc = tle.gpu.wgmma_wait(0, acc)
```

Keeping one WGMMA group pending in a hand-written pipeline:

```{code-block} python
acc = tle.gpu.wgmma(a0_smem, b0_smem, acc)
acc = tle.gpu.wgmma(a1_smem, b1_smem, acc)
acc = tle.gpu.wgmma_wait(1, acc)
# Independent work can now proceed while one WGMMA group stays pending
acc = tle.gpu.wgmma_wait(0, acc)
```

## Execution orchestration

### tle.gpu.warp_specialize

`tle.gpu.warp_specialize` is used to explicitly create a warp-specialized region within the same CTA, placing different JIT functions into different warp partitions. A typical use case is to separate tasks such as TMA/cp.async producers, WGMMA consumers, and epilogue/reduction, and pass shared-memory data between them via `tle.pipe` or other explicit synchronization primitives.

- **Signature**: `tle.gpu.warp_specialize(functions_and_args, worker_num_warps, worker_num_regs)`
- **Parameters**:
  - `functions_and_args`: `[(fn0, args0), (fn1, args1), ...]`. The 0th item goes into the default partition; subsequent items go into worker partitions.
  - `worker_num_warps`: List of warp counts for worker partitions; length must equal `len(functions_and_args) - 1`.
  - `worker_num_regs`: List of requested register counts for worker partitions; length must equal `len(functions_and_args) - 1`.
- **Semantics**:
  - Each `args` must be a tuple; plain Python `int`/`float`/`bool`/`tl.dtype` are passed as constexpr.
  - The default partition can return values; the return value of `tle.gpu.warp_specialize(...)` comes from the default partition; worker partitions only perform side effects and end with warp return.
  - The callee of a worker partition will carry the corresponding `"ttg.num-warps"` attribute, and the region will record `requestedRegisters`.
  - Captured worker arguments are deduplicated in IR; multiple workers can share the same pipe endpoint or buffer handle.
  - `warp_specialize` itself does not provide data visibility guarantees; producer/consumer ordering should be expressed via `tle.pipe`'s commit/wait/release, barriers, or other synchronization primitives.

Example: A producer partition loads shared memory, and a consumer worker computes.

```{code-block} python
@triton.jit
def producer(writer, x_ptr, n_tiles: tl.constexpr, BLOCK: tl.constexpr):
    offs = tl.arange(0, BLOCK)
    for i in tl.range(0, n_tiles):
        slot = writer.acquire(i)
        vals = tl.load(x_ptr + i * BLOCK + offs)
        tl.store(tle.gpu.local_ptr(slot.tile), vals)
        writer.commit(i)


@triton.jit
def consumer(reader, out_ptr, n_tiles: tl.constexpr, BLOCK: tl.constexpr):
    offs = tl.arange(0, BLOCK)
    acc = tl.zeros([BLOCK], dtype=tl.float32)
    for i in tl.range(0, n_tiles):
        ready = reader.wait(i)
        tile = tl.load(tle.gpu.local_ptr(ready.slot.tile))
        acc += tile
        reader.release(i)
    tl.store(out_ptr + offs, acc)


@triton.jit
def kernel(x_ptr, out_ptr, n_tiles: tl.constexpr, BLOCK: tl.constexpr):
    smem = tle.gpu.alloc([2, BLOCK], dtype=tl.float32, scope=tle.gpu.smem)
    pipe = tle.pipe(capacity=2, scope="cta", name="x_pipe", tile=smem)

    tle.gpu.warp_specialize(
        [
            (producer, (pipe.writer(), x_ptr, n_tiles, BLOCK)),
            (consumer, (pipe.reader(), out_ptr, n_tiles, BLOCK)),
        ],
        [4],      # consumer worker uses 4 warps
        [168],    # consumer worker requested registers
    )
```

Example: Multiple workers paired with an SPMC pipe.

```{code-block} python
tile = tle.gpu.alloc([2, BM, BK], dtype=tl.float16, scope=tle.gpu.smem)
pipe = tle.pipe(
    capacity=2,
    scope="cta",
    name="spmc_tile",
    readers=("qk", "value"),
    tile=tile,
)

tle.gpu.warp_specialize(
    [
        (load_tile_producer, (pipe.writer(), a_desc, b_desc)),
        (qk_consumer, (pipe.reader("qk"), acc_qk)),
        (value_consumer, (pipe.reader("value", fields=("tile",)), acc_v)),
    ],
    [4, 4],
    [240, 168],
)
```

## DSA memory management and data movement

### tle.dsa.alloc

Signature: `tle.dsa.alloc(shape, dtype, mem_addr_space)`
Purpose: Allocates a DSA local buffer in the specified memory address space.
Address spaces exposed by Huawei Ascend:

- `tle.dsa.ascend.UB`
- `tle.dsa.ascend.L1`
- `tle.dsa.ascend.L0A`
- `tle.dsa.ascend.L0B`
- `tle.dsa.ascend.L0C`

```{code-block} python
a_ub = tle.dsa.alloc([XBLOCK, YBLOCK], dtype=tl.float32, mem_addr_space=tle.dsa.ascend.UB)
b_l1 = tle.dsa.alloc([XBLOCK, YBLOCK], dtype=tl.float32, mem_addr_space=tle.dsa.ascend.L1)
```

### tle.dsa.copy

Signature: `tle.dsa.copy(src, dst, shape, inter_no_alias=False)`
Purpose: Performs explicit data movement (bidirectional) between GMEM pointers and DSA local buffers.

```{code-block} python
tle.dsa.copy(x_ptrs, a_ub, [tail_m, tail_n])    # GMEM → local buffer  
tle.dsa.copy(a_ub, out_ptrs, [tail_m, tail_n])  # local buffer → GMEM
```

### tle.dsa.local_ptr  

- Signature: `tle.dsa.local_ptr(buffer, indices=None) -> tl.tensor | tl.ptr`  
- Purpose: Constructs a pointer view over a DSA local buffer (e.g., UB or L1) to enable explicit local memory access patterns.  

- Parameters:  
  - `buffer`: A DSA-buffered tensor, typically allocated via `tle.dsa.alloc`.  
  - `indices`: Optional tuple of integer tensors; if omitted or set to `None`, the full index space is used (full-view semantics).  

Semantics:  
  The pointer view model is identical to that of `tle.gpu.local_ptr` (same shape and indexing rules).  
  Intended for DSA-local access patterns where explicit pointer materialization is required.  

```{code-block} python
a_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
rows = tl.broadcast_to(tl.arange(0, BM)[:, None], (BM, BK))
cols = tl.broadcast_to(tl.arange(0, BK)[None, :], (BM, BK))
a_ptr = tle.dsa.local_ptr(a_ub, (rows, cols))
a_val = tl.load(a_ptr)
```

### tle.dsa.local_ptr (for remote)  

- Signature: `tle.dsa.local_ptr(remote_buffer, indices=None) -> tl.tensor | tl.ptr`  
- Purpose: Constructs a pointer view into a remote DSA local buffer returned by `tle.remote(...)`.  

- Inputs:  
  - `remote_buffer`: Returned by `tle.remote(dsa_buffer, shard_id, scope)`.  
  - `indices`: Same semantics as in the local DSA case.  `

- Semantics:  
  - Maintains the same pointer view rules as the local DSA variant.  
  - Dereferencing the pointer routes memory accesses to the remote shard identified by `shard_id`.  
  - When ordering across shards is required, use in conjunction with `tle.distributed_barrier(...)`.  

```{code-block} python
a_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
remote_a_ub = tle.remote(a_ub, shard_id=peer_rank, scope=mesh)

rows = tl.broadcast_to(tl.arange(0, BM)[:, None], (BM, BK))
cols = tl.broadcast_to(tl.arange(0, BK)[None, :], (BM, BK))
remote_ptr = tle.dsa.local_ptr(remote_a_ub, (rows, cols))
remote_val = tl.load(remote_ptr)
```

### tle.dsa.to_tensor and tle.dsa.to_buffer

- `tle.dsa.to_tensor(buffer, writable=True)`: Converts a DSA buffer into a tensor view to participate in tensor expressions.
- `tle.dsa.to_buffer(tensor, space)`: Converts tensor values back into a DSA buffer in the specified address space.

```{code-block} python
c_val = tle.dsa.to_tensor(c_ub, writable=True)
result = c_val * 0.5
d_ub = tle.dsa.to_buffer(result, tle.dsa.ascend.UB)
tle.dsa.copy(d_ub, out_ptrs, [tail_m, tail_n])
```

## Vector operators (Buffer form)

### tle.dsa.add, tle.dsa.sub, tle.dsa.mul, tle.dsa.div，tle.dsa.max，and tle.dsa.min

Built-in operators:
`tle.dsa.add`
`tle.dsa.sub`
`tle.dsa.mul`
`tle.dsa.div`
`tle.dsa.max`
`tle.dsa.min`

General signature:  
`tle.dsa.(lhs, rhs, out)`

Computation model:  
Performs element-wise binary operations on DSA-local buffers.

Shape rules:

- The rank and shape of `lhs`, `rhs`, and `out` must be identical.
- Implicit broadcasting is not performed by default at this API layer.

- Type rules:
  - In practice, it is recommended that all three operands use the same data type (`dtype`).
  - Integer types are typically used in indexing/counting paths, while floating-point types are commonly used in activation/numerical computation paths.

- Address space rules:
  - Buffers must be allocated in a DSA-local address space supported by the backend (e.g., UB/L1 combination).
  - Hot data should remain in local memory as much as possible to avoid unnecessary round trips to global memory (GMEM).

Operator semantics:
`tle.dsa.add(lhs, rhs, out)`: `out = lhs + rhs`
`tle.dsa.sub(lhs, rhs, out)`: `out = lhs - rhs`
`tle.dsa.mul(lhs, rhs, out)`: `out = lhs * rhs`
`tle.dsa.div(lhs, rhs, out)`: `out = lhs / rhs` (precision and rounding behavior depend on backend implementation)
`tle.dsa.max(lhs, rhs, out)`: `out = max(lhs, rhs)`
`tle.dsa.min(lhs, rhs, out)`: `out = min(lhs, rhs)`

In-place/reuse recommendations:

- Output buffers can be reused across multiple computation steps, e.g., `tle.dsa.mul(tmp, b, tmp)`.
- Unless the backend explicitly guarantees alias safety, input and output buffers should not share memory arbitrarily.

Example 1: Arithmetic chain `((a - b) * b) / scale`

```{code-block} python
a_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
b_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
scale_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
tmp_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
out_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)

tle.dsa.copy(a_ptrs, a_ub, [BM, BK])
tle.dsa.copy(b_ptrs, b_ub, [BM, BK])
tle.dsa.copy(scale_ptrs, scale_ub, [BM, BK])

tle.dsa.sub(a_ub, b_ub, tmp_ub)        # tmp = a - b
tle.dsa.mul(tmp_ub, b_ub, tmp_ub)      # tmp = tmp * b
tle.dsa.div(tmp_ub, scale_ub, out_ub)  # out = tmp / scale

tle.dsa.copy(out_ub, out_ptrs, [BM, BK])
```

Example 2: Clamp using `max` + `min`

```{code-block} python
x_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
floor_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
ceil_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
tmp_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
y_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)

tle.dsa.copy(x_ptrs, x_ub, [BM, BK])
tle.dsa.copy(floor_ptrs, floor_ub, [BM, BK])
tle.dsa.copy(ceil_ptrs, ceil_ub, [BM, BK])

tle.dsa.max(x_ub, floor_ub, tmp_ub)    # tmp = max(x, floor)
tle.dsa.min(tmp_ub, ceil_ub, y_ub)     # y = min(tmp, ceil)

tle.dsa.copy(y_ub, y_ptrs, [BM, BK])
```

## Loops and Hints

### tle.dsa.pipeline，tle.dsa.parallel，and tle.dsa.hint

Loops and Hints API include:

- `tle.dsa.pipeline(...)`
- `tle.dsa.parallel(...)`
- `tle.dsa.hint(...)` — provides compile-time hints in the form of a context manager `with tle.dsa.hint(...)`.

```{code-block} python
with tle.dsa.hint(inter_no_alias=True):
    tle.dsa.copy(x_ptr + offs, a_ub, [tail_size], inter_no_alias=True)
```

## Slicing and view

### tle.dsa.extract_slice, tle.dsa.insert_slice, tle.dsa.extract_element, and tle.dsa.subview

Slicing and view API include:

- `tle.dsa.extract_slice`
- `tle.dsa.insert_slice`
- `tle.dsa.extract_element`
- `tle.dsa.subview`

```{code-block} python
sub = tle.dsa.extract_slice(full, offsets=(0, k0), sizes=(BM, BK), strides=(1, 1))
full = tle.dsa.insert_slice(full, sub, offsets=(0, k0), sizes=(BM, BK), strides=(1, 1))
elem = tle.dsa.extract_element(sub, indice=(i, j))
```
