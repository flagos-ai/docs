# 使用 TLE-Struct

本节介绍如何使用 TLE-Struct。TLE-Struct 在 trition_3.6.x 分支上可用。

## GPU 内存管理

您可以使用以下操作来管理 GPU 的内存。

### tle.gpu.memory_space

为给定张量指定 memory_space：

```{code-block} python
x = ...
x = tle.gpu.memory_space(x, "shared_memory")
```

### tle.gpu.alloc

以下示例演示如何在 GPU 的高速片上 SMEM（共享内存）中预留一块维度为 `XBLOCK * YBLOCK`、数据类型为 `float32` 的内存。

```{code-block} python
a_smem = tle.gpu.alloc([XBLOCK, YBLOCK], dtype=tl.float32,
                      layout=None, scope=tle.gpu.storage_kind.smem)
```

- 签名：`tle.gpu.alloc(shape, dtype, layout=None, scope=tle.gpu.smem, init_value=None, alias=None, alias_offset_bytes=0, nv_mma_shared_layout=True) -> tle.gpu.buffered_tensor`
- `shape`：非空 tuple/list（或可迭代对象），每个维度都必须是正的编译期整数。
- `dtype`：`tl.dtype`。语义检查器会校验类型；不在标准分配类型集合中的 dtype 会收到警告。
- `layout`：可选 shared-memory layout 对象；传入时必须是 `tle.gpu.shared_layout`。
- `scope`：存储作用域。当前分配路径支持 `tle.gpu.smem`；`tle.gpu.tmem` 虽然定义为作用域，但当前 `alloc` 尚不支持。
- `init_value`：可选的寄存器 tensor，用于初始化新分配的 buffer；不能与 `alias` 同时使用。
- `alias`：可选的源 `tle.gpu.buffered_tensor`。alias 模式不会分配新存储，而是为已有 shared-memory buffer 创建带类型的视图；请求的 scope 和源 buffer 都必须是 SMEM。
- `alias_offset_bytes`：从源 alias view 基址开始计算的非负编译期字节偏移。
- `nv_mma_shared_layout`：当 `layout=None` 且 scope 为 SMEM 时，`True`（默认值）选择面向 MMA consumer 的默认布局，`False` 选择默认 swizzled shared layout。在 MUSA 上，自动 MMA 布局由 SQMMA lowering 具体化。

当 `layout=None` 时，后端根据 scope 和 `nv_mma_shared_layout` 推导布局；显式 layout 通过其 `to_ir()` 方法转换。alias 分配不会创建新 allocation。

```{code-block} python
# 使用默认 swizzled layout 的普通 SMEM 分配
smem = tle.gpu.alloc(
    [2 * BLOCK], dtype=tl.float32, scope=tle.gpu.smem, nv_mma_shared_layout=False
)

# 使用寄存器 tensor 初始化新 buffer
init = tl.zeros((BLOCK,), dtype=tl.float32)
initialized = tle.gpu.alloc(
    [BLOCK], dtype=tl.float32, init_value=init, nv_mma_shared_layout=False
)

# 为已有 SMEM allocation 创建带类型的视图
view = tle.gpu.alloc(
    [BLOCK], dtype=tl.float32, alias=smem, alias_offset_bytes=BLOCK * 4,
    nv_mma_shared_layout=False,
)
```

### tle.gpu.buffered_tensor.slot

从 staged shared-memory buffer 中选择一个 stage：

```{code-block} python
slot = buffer.slot(stage)
```

- 签名：`tle.gpu.buffered_tensor.slot(stage) -> tle.gpu.buffered_tensor`
- `buffer` 的 rank 必须 >= 2。首维是 stage 维度；返回 view 的 shape 为 `buffer.shape[1:]`。
- 仅支持 SMEM buffered tensor。
- `stage` 必须是标量 `tl.int32`；不支持向量索引和其他整数 dtype。
- 返回值是通过 `ttg.memdesc_index` 选出的 alias subview，不会分配或拷贝存储。
- slot layout 通过从源 layout 中去掉首维派生；当前实现支持 `swizzled_shared_layout` 和 `nv_mma_shared_layout` 源 layout。

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

创建具有不同静态 shape 的 shared-memory alias view：

```{code-block} python
reshaped = buffer.reshape(shape)
```

- 签名：`tle.gpu.buffered_tensor.reshape(shape) -> tle.gpu.buffered_tensor`
- `shape` 必须是非空且每一维为正数的静态维度序列。
- 新 shape 的元素总数必须等于 `buffer` 的元素总数。
- 操作生成 `ttg.memdesc_reshape`，保留底层存储、dtype 和 storage scope，不拷贝数据。
- 返回值的 layout 会根据 reshape 后的 memdesc 重新推导；当前支持 `shared_linear` 和 NVIDIA MMA encoding，不支持的 encoding 会在编译时失败。
- 对带有 allocation prefix 的 view（例如 staged buffer），结果的 allocation metadata 会保留该 prefix。

```{code-block} python
buffer = tle.gpu.alloc(
    [32, 512], dtype=tl.float16, scope=tle.gpu.smem, nv_mma_shared_layout=True
)
reshaped = buffer.reshape([128, 128])
```

### tle.gpu.set_layout

为 block tensor value 附加显式 distributed layout：

```{code-block} python
result = tle.gpu.set_layout(value, layout)
```

- 签名：`tle.gpu.set_layout(value, layout) -> tl.tensor`
- `value`：block `tl.tensor`；非 tensor 值会先转换为 tensor。
- `layout`：带有 `to_ir()` 方法的编译期 layout 对象。
- 返回值保留输入的 shape 和 element type，并携带请求的 encoding。该操作是布局契约，不是数据拷贝。
- 编译器必须提供显式 TLE layout 支持（`ir.builder.ensure_ttg_layout_attrs`）；否则编译会抛出 `RuntimeError`。

内置 NVIDIA layout 对象包括：

- `BlockEncoding(size_per_thread, threads_per_warp, warps_per_cta, order, cga_layout=None)`：生成 `#ttg.blocked` encoding。各维度列表的 rank 必须一致，`order` 必须是该 rank 的排列。
- `MmaEncoding(version, warps_per_cta, instr_shape, cga_layout=None)`：用于 dot result 或 accumulator 的 `#ttg.nvidia_mma` encoding。
- `DotOperandEncoding(operand_index, parent, k_width)`：从 distributed parent 派生 `#ttg.dot_op` encoding；`operand_index` 只能为 `0` 或 `1`，`k_width` 必须为正数。
- `SlicedEncoding(dim, parent)`：对 distributed parent 沿指定维度生成降秩的 `#ttg.slice` encoding；`dim` 必须在 parent rank 范围内。

```{code-block} python
parent = tle.gpu.BlockEncoding([1, 1], [1, 32], [4, 1], [1, 0])
layout = tle.gpu.SlicedEncoding(0, parent)
offsets = tl.arange(0, BLOCK)

values = tle.gpu.set_layout(tl.load(x_ptr + offsets), layout)
out_ptrs = tle.gpu.set_layout(out_ptr + offsets, layout)
tl.store(out_ptrs, values)
```

MUSA backend 还会从 `tle.gpu.mthreads` 提供 `MusaWmmaEncoding`、`MusaSqmmaEncoding` 和 `MusaDotOperandEncoding`；它们对指令 shape 和 operand 的限制由具体 backend 定义。

### tle.gpu.local_ptr

获取内存指针。

```{code} python
# 获取 a_smem[0,:] 的指针: [(0, 0), (0, 1)...(0, YBLOCK-1)]
a_smem_ptrs = tle.gpu.local_ptr(a_smem,
    indices=(tl.broadcast(0, [YBLOCK]), tl.arrange(0, YBLOCK)))
```

- 签名: `tle.gpu.local_ptr(buffer, indices=None) -> tl.tensor | tl.ptr`
- 用途: 在共享内存缓冲区上构建任意形状的指针视图，用于 `tl.load`/`tl.store`。
- 参数:
  - `buffer`: 由 `tle.gpu.alloc` 返回的 buffered_tensor（SMEM / TMEM）。
  - `indices`: 可选的整数张量元组，其长度必须等于 `rank(buffer)`，且每个张量必须具有相同的形状。如果省略或传入 `None`，后端将按照完整索引语义处理。
- 语义:
  - 当显式提供 `indices` 时，输出指针张量的形状等于索引的公共（广播后）形状。
  - 对于输出形状中的每个逻辑索引 `(i0, i1, ...)`，相应的指针指向 `buffer[indices0(i0, ...), indices1(i0, ...), ...]`。
  - 当 `indices=None` 时，返回覆盖整个 `buffer` 的完整视图指针：
    - 如果秩 > 0，返回形状等于 `shape(buffer)` 的指针张量。
    - 如果秩 = 0，返回标量指针。
  - 返回的指针驻留在共享内存地址空间（LLVM 地址空间 3）。索引必须是整数类型（例如 i32、i64 等），并在下层时标准化为 i32。
  - 内存布局按行主序线性化（最后一维变化最快）。共享内存布局和编码遵循缓冲区的 memdesc。

- 示例 1: 1D 切片

  ```{code-block} python
  smem = tle.alloc([BLOCK], dtype=tl.float32, scope=tle.smem)
  # 切片 [offset, offset + SLICE)
  idx = offset + tl.arange(0, SLICE)
  slice_ptr = tle.local_ptr(smem, (idx,))
  vals = tl.load(slice_ptr)
  ```

- 示例 2: K 维分块（矩阵切片）

  ```{code-block} python
  smem_a = tle.alloc([BM, BK], dtype=tl.float16, scope=tle.smem)
  # 切片 (BM, KW)，其中 KW 是 K 维切片
  rows = tl.broadcast_to(tl.arange(0, BM)[:, None], (BM, KW))
  cols = tl.broadcast_to(tl.arange(0, KW)[None, :] + k_start, (BM, KW))
  a_slice = tle.local_ptr(smem_a, (rows, cols))
  a_vals = tl.load(a_slice)
  ```
  
- 示例 3: 任意 gather 视图
  
  ```{code-block} python
      smem = tle.alloc([H, W], dtype=tl.float32, scope=tle.smem)
      # 每行取一个偏移列
      rows = tl.broadcast_to(tl.arange(0, H)[:, None], (H, SLICE))
      cols = tl.broadcast_to(1 + tl.arange(0, SLICE)[None, :], (H, SLICE))
      gather_ptr = tle.local_ptr(smem, (rows, cols))
      out = tl.load(gather_ptr)
  ```

支持的下游操作：

- `tl.load`
- `tl.store`
- `tl.atomic_add`、`atomic_and`、`atomic_cas`、`atomic_max`、`atomic_min`、`atomic_or`、`atomic_xchg`、`atomic_xor`

实践注意事项：

- 原子操作的可用性取决于元素数据类型（dtype）和后端硬件的能力。建议优先使用在目标硬件上明确验证支持的整数或浮点类型。

- 对于涉及 local_ptr 的 load-after-store 冒险，TLE 后端 pass `TleInsertLocalPointerBarriers` 会自动插入必要的内存屏障。仅在使用超出此 pass 范围的自定义同步模式时才需要手动插入屏障。

- 示例 4: 在同一 local_ptr 上执行 load、store 和原子操作。

```{code-block} python
smem_i32 = tle.gpu.alloc([BLOCK], dtype=tl.int32, scope=tle.gpu.smem)
ptr = tle.gpu.local_ptr(smem_i32, (tl.arange(0, BLOCK),))

tl.store(ptr, tl.zeros([BLOCK], dtype=tl.int32))
tl.atomic_add(ptr, 1)
vals = tl.load(ptr)
```

### tle.gpu.local_ptr（用于远程）

- 签名: `tle.gpu.local_ptr(remote_buffer, indices=None) -> tl.tensor | tl.ptr`
- 用途: 在由 `tle.remote(...)` 返回的远程共享/本地缓冲区上构造指针视图。
- 输入:
  - `remote_buffer`: 由 `tle.remote(buffer, shard_id, scope)` 返回，其中 `buffer` 通常通过 `tle.gpu.alloc` 分配。
  - `indices`: 与本地模式一致（`None` 表示完整视图，或可提供形状匹配的整数张量元组）。
- 语义:
  - 指针的形状、索引行为和线性化规则与本地 `tle.gpu.local_ptr` 相同。
  - 地址解析路由到由 `shard_id` 指定的远程分片。
  - 对于需要排序保证的跨分片读/写，请结合使用 `tle.distributed_barrier(...)`。
  
读取相邻分片上的远程 SMEM 切片。

```{code-block} python
smem = tle.gpu.alloc([BM, BK], dtype=tl.float16, scope=tle.gpu.storage_kind.smem)
remote_smem = tle.remote(smem, shard_id=(node_rank, next_device), scope=mesh)

rows = tl.broadcast_to(tl.arange(0, BM)[:, None], (BM, BK))
cols = tl.broadcast_to(tl.arange(0, BK)[None, :], (BM, BK))
remote_ptr = tle.gpu.local_ptr(remote_smem, (rows, cols))

vals = tl.load(remote_ptr)
```

### tle.gpu.copy

以下示例演示如何将数据切片从低速 GMEM（全局内存）加载到高速片上 SMEM 中。

- 从源复制:
  - `a_ptrs`: GMEM 中的基指针
  - `ystride_a * yoffs[None, :]`: 添加到基指针的偏移向量。
    - `yoffs[None, :]`: 表示 Y 轴偏移的范围，广播为行向量。
    - `ystride_a`: 源布局中行之间的步长。这计算了倾向于从 GMEM 加载的 2D 块的确切地址。
- 到目标:
  - `a_smem`: 之前分配的 SMEM 缓冲区。数据将写入此处，供此块中的线程快速访问。

```{code-block} python
tle.gpu.copy(a_ptrs + ystride_a * yoffs[None, :], a_smem, [XBLOCK, YBLOCK])
```

`tle.gpu.copy` 在 global memory 和 GPU local/shared memory 之间搬运数据，同时覆盖普通 tensor load/store 路径和 TMA descriptor 路径。

- 签名：`tle.gpu.copy(src, dst, shape, offsets=None, barrier=None, mask=None)`
- 拷贝方向由操作数类型推导：
  - `tl.tensor` 或 TMA descriptor -> `tle.gpu.buffered_tensor`：global 到 local/shared。
  - `tle.gpu.buffered_tensor` -> `tl.tensor` 或 TMA descriptor：local/shared 到 global。
- `shape` 表示要拷贝的 tile 形状。
- `offsets` 用于 TMA descriptor copy，表示 descriptor 坐标偏移。
- `barrier` 是可选的显式 TMA completion barrier，只支持 NVIDIA global-to-shared TMA load（`src` 是 TMA descriptor、`dst` 是 shared-memory `tle.gpu.buffered_tensor`）。barrier 必须带 `expect_bytes` 分配，即来自 `tle.gpu.alloc_barrier(...)` 或 `tle.gpu.alloc_barriers(...)` 返回的某个 indexed slot。
- `mask` 是普通指针 tensor 拷贝的可选逐元素掩码。GM 到 local 时，mask 为 false 的元素会以零写入 local memory；local 到 GM 时，mask 为 false 的元素不会写入。TMA descriptor 拷贝不接受 `mask`。

```{code-block} python
# 带显式 completion barrier 的 TMA load
a_bar = tle.gpu.alloc_barrier(expect_bytes=BLOCK_M * BLOCK_K * 2)
tle.gpu.copy(
    a_desc,
    a_smem,
    [BLOCK_M, BLOCK_K],
    [pid_m * BLOCK_M, pid_k * BLOCK_K],
    barrier=a_bar,
)
tle.gpu.barrier_wait(a_bar, phaseIdx=0)

# 普通指针 tensor 拷贝可以传入逐元素 mask
offsets = tl.arange(0, BLOCK)
mask = offsets < n
tle.gpu.copy(x_ptr + offsets, smem, [BLOCK], mask=mask)
```

`tle.gpu.copy(..., barrier=...)` 不支持普通 copy、shared-to-global TMA store、named barrier，或未设置 `expect_bytes` 的 barrier。

## tle.gpu barrier API

TLE GPU barrier 用于表达手写 Hopper producer/consumer 流水所需的同步，包括 TMA completion barrier、empty/full mbarrier，以及 warp group 之间的轻量 named barrier。

API 总览：

- `tle.gpu.alloc_barriers(num_barriers, arrive_count=1, init=tle.gpu.PENDING, expect_bytes=None) -> tle.gpu.barrier`
- `tle.gpu.alloc_barrier(arrive_count=1, init=tle.gpu.PENDING, expect_bytes=None) -> tle.gpu.barrier`
- `tle.gpu.barrier_wait(bar, phaseIdx=None) -> None`
- `tle.gpu.barrier_arrive(bar, arrive_count=1, phaseIdx=None) -> None`
- `tle.gpu.PENDING`：初始不可通过。
- `tle.gpu.READY`：初始可通过；只适用于 mbarrier 路径。
- `tle.gpu.barrier`：allocation API 返回的 value 类型；数组通过 `bars[i]` 取 slot。
- `tle.gpu.barrier_type`：barrier value 的类型描述。

分配参数：

- `num_barriers`：barrier slot 数量，必须是编译期正整数。
- `arrive_count`：pending arrival count。对 mbarrier 表示逻辑 arrive 数；对 named barrier 表示参与线程数，通常为 `num_warps * 32`。
- `init`：`tle.gpu.PENDING` 或 `tle.gpu.READY`。
- `expect_bytes`：TMA global-to-shared completion barrier 期望完成的字节数，必须为编译期正整数；不使用时为 `None`。

后端路径选择：

- `barrier_wait` 或 `barrier_arrive` 传入 `phaseIdx` 时选择 mbarrier 路径。
- 不传 `phaseIdx` 时选择 named barrier 路径。
- 同一个 barrier slot 不能混用 mbarrier 和 named barrier。
- `expect_bytes` barrier 和 `init=tle.gpu.READY` barrier 必须走 mbarrier 路径。
- named barrier 要求静态 barrier slot index，例如 `sync[0]`；动态 slot index 会报错。

在 ring buffer 复用场景中，`phaseIdx` 建议传该 slot 的 logical use id，lowering 会在内部映射到硬件 phase。

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
    # 使用 shared-memory slot `slot`
    tle.gpu.barrier_arrive(bars[slot], phaseIdx=use_id)
```

示例：两个 4-warp worker partition 之间使用 named barrier 同步。

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

示例：围绕 TMA load 的 empty/full 同步。

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
    # 消费 a_smem ...
    tle.gpu.barrier_arrive(a_empty, phaseIdx=phase)


a_empty = tle.gpu.alloc_barrier(init=tle.gpu.READY)
a_full = tle.gpu.alloc_barrier(expect_bytes=A_TILE_BYTES)
```

### tle.gpu.wgmma 与 tle.gpu.wgmma_wait

`tle.gpu.wgmma` 发起一次异步 Hopper WGMMA，并返回 accumulator dependency value。普通 tensor op、reduce 或 store 消费该 accumulator 前，必须先调用 `tle.gpu.wgmma_wait(...)`。

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

操作数与结果规则：

- `a` 可以是 shared-memory `tle.gpu.buffered_tensor` 或 register `tl.tensor`。
- `b` 当前必须是 shared-memory `tle.gpu.buffered_tensor`。
- shared-memory 操作数必须使用默认 NVIDIA MMA shared layout，且是 rank-2 tile。
- `trans_a` 和 `trans_b` 必须是编译期 bool。
- shape 约束：`M >= 64` 且能被 64 整除，`N >= 8` 且能被 8 整除，`K >= 16`，且 `a.K == b.K`。
- 非 FP8 操作数必须 dtype 一致，且属于 `tl.int8`、`tl.float16`、`tl.bfloat16` 或 `tl.float32`。
- `out_dtype` 控制 accumulator dtype；不支持 `tl.bfloat16` 输出。
- `max_num_imprecise_acc` 控制 FP8 imprecise accumulation，不改变返回 tensor dtype。
- `wgmma_wait(pendings, acc)` 等待直到最多只剩 `pendings` 个 WGMMA group outstanding；`wgmma_wait(acc)` 等价于 `wgmma_wait(0, acc)`。

```{code-block} python
a_smem = tle.gpu.alloc([64, 16], dtype=tl.float16, layout=None, scope=tle.gpu.smem)
b_smem = tle.gpu.alloc([16, 16], dtype=tl.float16, layout=None, scope=tle.gpu.smem)

acc = tle.gpu.wgmma(a_smem, b_smem, out_dtype=tl.float32)
acc = tle.gpu.wgmma_wait(0, acc)
```

手写流水中保留一个 pending WGMMA group：

```{code-block} python
acc = tle.gpu.wgmma(a0_smem, b0_smem, acc)
acc = tle.gpu.wgmma(a1_smem, b1_smem, acc)
acc = tle.gpu.wgmma_wait(1, acc)
# 此时可在一个 WGMMA group 保持 pending 的同时执行独立工作
acc = tle.gpu.wgmma_wait(0, acc)
```

## 执行编排

### tle.gpu.warp_specialize

`tle.gpu.warp_specialize` 用于在同一 CTA 内显式创建 warp 专用区域，将不同的 JIT 函数放入不同的 warp 分区。典型用例是将 TMA/cp.async 生产者、WGMMA 消费者和 epilogue/reduction 等任务分离，并通过 `tle.pipe` 或其他显式同步原语在它们之间传递共享内存数据。

- **签名**: `tle.gpu.warp_specialize(functions_and_args, worker_num_warps, worker_num_regs)`
- **参数**:
  - `functions_and_args`: `[(fn0, args0), (fn1, args1), ...]`。第 0 项进入默认分区；后续项进入工作分区。
  - `worker_num_warps`: 工作分区的 warp 数量列表；长度必须等于 `len(functions_and_args) - 1`。
  - `worker_num_regs`: 工作分区请求的寄存器数量列表；长度必须等于 `len(functions_and_args) - 1`。
- **语义**:
  - 每个 `args` 必须是元组；普通的 Python `int`/`float`/`bool`/`tl.dtype` 作为 constexpr 传递。
  - 默认分区可以返回值；`tle.gpu.warp_specialize(...)` 的返回值来自默认分区；工作分区仅执行副作用并以 warp return 结束。
  - 工作分区的被调用者将携带相应的 `"ttg.num-warps"` 属性，区域将记录 `requestedRegisters`。
  - 捕获的工作参数在 IR 中会去重；多个工作线程可以共享同一个管道端点或缓冲区句柄。
  - `warp_specialize` 本身不提供数据可见性保证；生产者/消费者排序应通过 `tle.pipe` 的 commit/wait/release、屏障或其他同步原语来表达。

示例: 生产者分区加载共享内存，消费者工作线程进行计算。

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
        [4],      # consumer worker 使用 4 个 warp
        [168],    # consumer worker 请求的寄存器数
    )
```

示例: 多个 worker 与 SPMC 管道配对。

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

## DSA 内存管理和数据移动

### tle.dsa.alloc

签名: `tle.dsa.alloc(shape, dtype, mem_addr_space)`
用途: 在指定的内存地址空间中分配 DSA 本地缓冲区。
华为 Ascend 暴露的地址空间:

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

签名: `tle.dsa.copy(src, dst, shape, inter_no_alias=False)`
用途: 在 GMEM 指针和 DSA 本地缓冲区之间执行显式数据移动（双向）。

```{code-block} python
tle.dsa.copy(x_ptrs, a_ub, [tail_m, tail_n])    # GMEM → 本地缓冲区  
tle.dsa.copy(a_ub, out_ptrs, [tail_m, tail_n])  # 本地缓冲区 → GMEM
```

### tle.dsa.local_ptr  

- 签名: `tle.dsa.local_ptr(buffer, indices=None) -> tl.tensor | tl.ptr`  
- 用途: 在 DSA 本地缓冲区（例如 UB 或 L1）上构造指针视图，以启用显式本地内存访问模式。  

- 参数:  
  - `buffer`: DSA 缓冲张量，通常通过 `tle.dsa.alloc` 分配。  
  - `indices`: 可选的整数张量元组；如果省略或设置为 `None`，则使用完整索引空间（完整视图语义）。  

语义:  
  指针视图模型与 `tle.gpu.local_ptr` 相同（相同的形状和索引规则）。  
  适用于需要显式指针物化的 DSA 本地访问模式。  

```{code-block} python
a_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
rows = tl.broadcast_to(tl.arange(0, BM)[:, None], (BM, BK))
cols = tl.broadcast_to(tl.arange(0, BK)[None, :], (BM, BK))
a_ptr = tle.dsa.local_ptr(a_ub, (rows, cols))
a_val = tl.load(a_ptr)
```

### tle.dsa.local_ptr（用于远程）  

- 签名: `tle.dsa.local_ptr(remote_buffer, indices=None) -> tl.tensor | tl.ptr`  
- 用途: 在由 `tle.remote(...)` 返回的远程 DSA 本地缓冲区上构造指针视图。  

- 输入:  
  - `remote_buffer`: 由 `tle.remote(dsa_buffer, shard_id, scope)` 返回。  
  - `indices`: 与本地 DSA 情况相同的语义。  

- 语义:  
  - 保持与本地 DSA 变体相同的指针视图规则。  
  - 解引用指针将内存访问路由到由 `shard_id` 标识的远程分片。  
  - 当需要跨分片排序时，请结合使用 `tle.distributed_barrier(...)`。  

```{code-block} python
a_ub = tle.dsa.alloc([BM, BK], dtype=tl.float16, mem_addr_space=tle.dsa.ascend.UB)
remote_a_ub = tle.remote(a_ub, shard_id=peer_rank, scope=mesh)

rows = tl.broadcast_to(tl.arange(0, BM)[:, None], (BM, BK))
cols = tl.broadcast_to(tl.arange(0, BK)[None, :], (BM, BK))
remote_ptr = tle.dsa.local_ptr(remote_a_ub, (rows, cols))
remote_val = tl.load(remote_ptr)
```

### tle.dsa.to_tensor 和 tle.dsa.to_buffer

- `tle.dsa.to_tensor(buffer, writable=True)`: 将 DSA 缓冲区转换为张量视图以参与张量表达式。
- `tle.dsa.to_buffer(tensor, space)`: 将张量值转换回指定地址空间中的 DSA 缓冲区。

```{code-block} python
c_val = tle.dsa.to_tensor(c_ub, writable=True)
result = c_val * 0.5
d_ub = tle.dsa.to_buffer(result, tle.dsa.ascend.UB)
tle.dsa.copy(d_ub, out_ptrs, [tail_m, tail_n])
```

## 向量运算符（缓冲区形式）

### tle.dsa.add、tle.dsa.sub、tle.dsa.mul、tle.dsa.div、tle.dsa.max 和 tle.dsa.min

内置运算符:
`tle.dsa.add`
`tle.dsa.sub`
`tle.dsa.mul`
`tle.dsa.div`
`tle.dsa.max`
`tle.dsa.min`

通用签名:  
`tle.dsa.(lhs, rhs, out)`

计算模型:  
对 DSA 本地缓冲区执行逐元素二元运算。

形状规则:

- `lhs`、`rhs` 和 `out` 的秩和形状必须相同。
- 此 API 层默认不执行隐式广播。

- 类型规则:
  - 实践中，建议所有三个操作数使用相同的数据类型（`dtype`）。
  - 整数类型通常用于索引/计数路径，而浮点类型通常用于激活/数值计算路径。

- 地址空间规则:
  - 缓冲区必须分配在后端支持的 DSA 本地地址空间中（例如 UB/L1 组合）。
  - 热数据应尽可能保留在本地内存中，以避免不必要的全局内存（GMEM）往返。

运算符语义:
`tle.dsa.add(lhs, rhs, out)`: `out = lhs + rhs`
`tle.dsa.sub(lhs, rhs, out)`: `out = lhs - rhs`
`tle.dsa.mul(lhs, rhs, out)`: `out = lhs * rhs`
`tle.dsa.div(lhs, rhs, out)`: `out = lhs / rhs`（精度和舍入行为取决于后端实现）
`tle.dsa.max(lhs, rhs, out)`: `out = max(lhs, rhs)`
`tle.dsa.min(lhs, rhs, out)`: `out = min(lhs, rhs)`

就地/重用建议:

- 输出缓冲区可以在多个计算步骤中重用，例如 `tle.dsa.mul(tmp, b, tmp)`。
- 除非后端明确保证别名安全，否则输入和输出缓冲区不应任意共享内存。

示例 1: 算术链 `((a - b) * b) / scale`

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

示例 2: 使用 `max` + `min` 进行 Clamp

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

## 循环和提示

### tle.dsa.pipeline、tle.dsa.parallel 和 tle.dsa.hint

循环和提示 API 包括:

- `tle.dsa.pipeline(...)`
- `tle.dsa.parallel(...)`
- `tle.dsa.hint(...)` — 以上下文管理器 `with tle.dsa.hint(...)` 的形式提供编译时提示。

```{code-block} python
with tle.dsa.hint(inter_no_alias=True):
    tle.dsa.copy(x_ptr + offs, a_ub, [tail_size], inter_no_alias=True)
```

## 切片和视图

### tle.dsa.extract_slice、tle.dsa.insert_slice、tle.dsa.extract_element 和 tle.dsa.subview

切片和视图 API 包括:

- `tle.dsa.extract_slice`
- `tle.dsa.insert_slice`
- `tle.dsa.extract_element`
- `tle.dsa.subview`

```{code-block} python
sub = tle.dsa.extract_slice(full, offsets=(0, k0), sizes=(BM, BK), strides=(1, 1))
full = tle.dsa.insert_slice(full, sub, offsets=(0, k0), sizes=(BM, BK), strides=(1, 1))
elem = tle.dsa.extract_element(sub, indice=(i, j))
```
