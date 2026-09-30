# Use operators

After installing FlagGems-vLLM, you can use its optimized operators directly in your Python code.

For example, import the library and call the operators on CUDA tensors:

```python
import torch
import flaggems_vllm

# Prepare a simple topk_ids tensor for MoE routing
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

# Align tokens by expert and block size
sorted_ids, expert_ids, num_tokens_post_pad = flaggems_vllm.ops.moe_align_block_size(
    topk_ids=topk_ids,
    block_size=block_size,
    num_experts=num_experts,
)

print(sorted_ids.shape, expert_ids.shape, num_tokens_post_pad)
```

For a full operator list, see [Operator List](../reference/operator_list.md).
