# 使用 Hints

`flagtree_hints` 允许用户通过 Triton Kernel 代码中的行尾注释向编译器提供优化提示。

你可以简单地在 `tl.load` 等操作所在的同一行添加格式为 `# @hint: <hint_name>` 的行尾注释来添加提示。

示例 1

```{code-block} python
# 提示以行尾注释的形式嵌入，使用 '@hint:' 前缀。
mat_a_block = tl.load(mat_a + mat_a_offset, mask=mat_a_mask, other=0.0)  # @hint: dot_pad_only_k
x = tl.load(x_ptr + offsets, mask=mask) 
for s in range(0, 2):  # @hint: bind_sub_block
    # ... 代码 ...
```

示例 2

```{code-block} python
import triton
import triton.language as tl

@triton.jit
def kernel(x_ptr, y_ptr, N):
    pid = tl.program_id(0)
    x = tl.load(x_ptr + pid)  #@hint: shared_memory
    y = x + 1
    tl.store(y_ptr + pid, y)
```


## 支持的提示

下表列出了在不同后端上编译时适用于 Triton 操作的优化提示。

### NVIDIA

| 提示名称 | Triton 操作 | 描述 | 分支 |
| :--- | :--- | :--- | :--- |
| shared_memory | tl.load | 将全局内存加载操作转换为异步拷贝到共享内存，然后从共享内存加载。加载至少需要 4 字节且可转换为异步加载。 | triton_v3.5.x 和 triton_v3.6.x |

### 华为昇腾

| 提示名称 | Triton 操作 | 描述 | 分支 |
| :--- | :--- | :--- | :--- |
| dot_pad_only_k | tl.load | 通过仅对 dot 操作的 K 维度进行填充来优化矩阵乘法性能。等效于 triton-ascend 中的 `tl.compile_hint(tensor, "dot_pad_only_k")`。 | triton_v3.2.x_ascend_hints |
| bind_sub_block | for 循环 | 通过将循环迭代绑定到子块来优化并行执行。等效于 triton-ascend 中的 `tl.parallel(..., bind_sub_block=True)`。 | triton_v3.2.x_ascend_hints |
| multibuffer | tl.load | 启用多缓冲优化以重叠数据传输和计算（固定为 2 个缓冲区副本）。等效于 triton-ascend 中的 `tl.multibuffer(tensor, 2)` 或 `tl.compile_hint(tensor, "multi_buffer", 2)`。 | triton_v3.2.x_ascend_hints |

### AIPU

| 提示名称 | Triton 操作 | 描述 | 分支 |
| :--- | :--- | :--- | :--- |
| dma | tl.load | 启用异步 DMA 传输以提高性能。将 `memref.copy` 操作 lowering 为 `memref.dma_start` 和 `memref.dma_wait` 操作。需要 stride-1 的内存访问模式。 | triton_v3.3.x |
| shared_memory | tl.load | 将数据加载到共享内存中以实现更快的访问。分配共享内存（内存空间 8），大小为原始张量形状的 4 倍（用于 AIPUcore 并行），并从全局内存拷贝数据。 | triton_v3.3.x |

有关 Hints 使用信息，请参见 [使用 Hints](/user_guide/use-hints.md)。
