# 使用算子

安装 FlagGems-vLLM 后，您可以直接在 Python 代码中使用其优化算子。

例如，导入库并在 CUDA 张量上调用算子：

```python
import torch
import flaggems_vllm

# 为 MoE 路由准备一个简单的 topk_ids 张量
num_tokens = 128
topk = 2
num_experts = 16
block_size = 32

topk_ids = torch.randint(
    low=0,
    high=num_experts,
    size=(num_tokens, topk),
    device='cuda',
    dtype=torch.int32,
)

# 按专家和块大小对齐 token
sorted_ids, expert_ids, num_tokens_post_pad = flaggems_vllm.ops.moe_align_block_size(
    topk_ids=topk_ids,
    block_size=block_size,
    num_experts=num_experts,
)

print(sorted_ids.shape, expert_ids.shape, num_tokens_post_pad)
```

完整的算子列表请参见 [算子列表](../reference/operator_list.md)。
