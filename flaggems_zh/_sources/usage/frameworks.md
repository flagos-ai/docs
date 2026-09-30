# 与常用框架的集成

为了帮助用户将 *FlagGems* 集成到真实世界的使用场景中，我们提供一些示例，
展示如何与某些被广泛使用的深度学习框架集成。
这些集成需要极少的代码变更，能够保留原来的工作流结构。

如果你对完整的示例感兴趣，可以参阅源代码仓库中的
[`examples/`](https://github.com/flagos-ai/FlagGems/tree/master/examples)
目录。

## 1. Hugging Face Transformers

与 Hugging Face 的 [`transformers` 库](https://github.com/huggingface/transformers)
集成相对而言比较简单直接。
在推理阶段，你可以启用 *FlagGems* 加速而不必更改模型或者分词器的逻辑。

下面是一个高度简化的例子：

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import flag_gems

# 加载分词器和模型
tokenizer = AutoTokenizer.from_pretrained("sharpbai/Llama-2-7b-hf")
model = AutoModelForCausalLM.from_pretrained("sharpbai/Llama-2-7b-hf")

# 将模型放到正确的设备上并设置 eval 模式
device = flag_gems.device
model.to(device).eval()

# 准备输入并在启用了 flag_gems 的情况下执行推理任务
inputs = tokenizer(prompt, return_tensors="pt").to(device=device)
with flag_gems.use_gems():
    output = model.generate(**inputs, max_length=100, num_beams=5)
```

这种模式可以确保在生成输出的过程中使用到的所有兼容算子都会被自动加速。
你可以在项目源码树的如下路径中找到其他例子。

- `examples/model_llama_test.py`
- `examples/model_llava_test.py`

## 2. vLLM

[vLLM](https://github.com/vllm-project/vllm)是一个吞吐量很高的推理引擎，
其设计目标是高效地提供大语言模型服务。
vLLM 支持 Paged Attention（一种带缓存的注意力机制）、Continuous Batching
（一种提高算力和带宽利用率的任务队列优化机制）以及对内存管理的优化。

*FlagGems* 可以被集成到 vLLM 中用来替换标准的 PyTorch （`aten`）算子以及
vLLM 内部的定制内核。

### 2.1 替换 vLLM 中的标准 PyTorch 算子

为了加速 vLLM 中用到的标准的 PyTorch 算子（如 `add`、`masked_fill` 等），
你可以使用与其他框架相同的办法。
通过在模型初始化或者推理任务启动之前调用 `flag_gems.enable()`，
你可以替换掉所有兼容的 PyTorch `aten` 算子，包括那些在 vLLM 中被间接调用的算子。

### 2.2 替换特定于 vLLM 的定制算子

为了进一步优化 vLLM 内部的内核，*FlagGems* 提供了一个额外的 API：

```python
flag_gems.apply_gems_patches_to_vllm(verbose=True)
```

这一 API 能够对特定于 vLLM 的某些 C++ 或 Triton 算子进行打补丁操作，
注入 *FlagGems* 的实现逻辑。当 `verbose` 被设置为 `True` 时，
API 调用会记录哪些函数被替换，如下例所示：

```none
Patched RMSNorm.forward_cuda with FLAGGEMS custom_gems_rms_forward_cuda
Patched RotaryEmbedding.forward_cuda with FLAGGEMS custom_gems_rope_forward_cuda
Patched SiluAndMul.forward_cuda with FLAGGEMS custom_gems_silu_and_mul
```

当你希望更全面地使用 `flag_gems` 算子进行替换时，可以采取这种方式。

### 2.3 完整的示例

```python
from vllm import LLM, SamplingParams
import flag_gems

# 第一步：启用对 PyTorch（ATen）算子的加速
flag_gems.enable()

# 第二步（可选）： 对 vLLM 的定制算子进行打补丁操作
flag_gems.apply_gems_patches_to_vllm(verbose=True)

# 第三步：和平时一样使用 vLLM
llm = LLM(model="sharpbai/Llama-2-7b-hf")
sampling_params = SamplingParams(temperature=0.8, max_tokens=128)

output = llm.generate("Tell me a joke.", sampling_params)
print(output)
```

## 3. Megatron-LM

[Megatron-LM](https://github.com/NVIDIA/Megatron-LM) 是一个针对大规模语言模型的预训练、
调优作了高度优化的床架。由于框架内部紧耦合了一些定制的训练回路和内部工具，
将 *FlagGems* 集成到 Megatron-LM 需要一些更有针对性的操作。

由于 Megatron-LM 中的训练回路与其分布式数据加载、梯度累积、流水线并行紧密绑定，
我们建议仅对其前向和反向计算阶段应用 *FlagGems* 算子加速。

### 3.1 建议的集成点

在 Megatron-LM 中使用 FlagGems 的最可靠方式是修改位于
[`megatron/training.py`](https://github.com/NVIDIA/Megatron-LM/blob/v2.6/megatron/training.py#L347)
文件中的 `train_step` 函数。具体而言，用 `flag_gems.enable()` 生成一个上下文，
将对 `forward_backward_func()` 的调用封装在里面。如下面的代码段所示：

```python
def train_step(forward_step_func, data_iterator,
               model, optimizer, lr_scheduler):
    """Single training step."""
    args = get_args()
    timers = get_timers()

    # Set grad to zero.
    if args.DDP_impl == 'local' and args.use_contiguous_buffers_in_local_ddp:
        for partition in model:
            partition.zero_grad_buffer()
    optimizer.zero_grad()

    # 启用 flag_gems 执行前向计算
    import flag_gems
    with flag_gems.use_gems():
      forward_backward_func = get_forward_backward_func()
      losses_reduced = forward_backward_func(
          forward_step_func, data_iterator, model,
          optimizer, timers, forward_only=False)
      )

    # Empty unused memory
    if args.empty_unused_memory_level >= 1:
        torch.cuda.empty_cache()
    ...
```

这种注入方式可以确保只有在执行前向和反向计算逻辑时才会执行 *FlagGems* 加速的算子，
其他的诸如数据加载和优化等步骤都保留不变。

<!
### 3.2 Scope and Limitations
-->
### 3.2 范围与局限性

> [!WARNING]
> **警告**
>
> Megatron-LM 项目变更非常频繁，演化速度很快。在寻找集成点的时候要格外小心。

尽管在大多数框架中，调用 `flag_gems.enable()` 就足够了，我们还是发现如果在
Megatron-LM 流水线的早期阶段（尤其是数据加载阶段）启用加速算子的话，
可能会产生一些意外的行为。
为了确保系统稳定性不受影响，我们建议用上下文管理器（context manager）的方式来调用
`flag_gems.use_gems()`，并且仅应用到其计算阶段。

如果你希望针对更大范围的组件（例如优化器、预处理逻辑）进行加速，
你可以尝试使用 `flag_gems.enable()` 在全局作用域启用加速算子。
不过这种方式没有经过彻底的测试，可能需要基于你所使用的 Megatron-LM
版本开展一些额外的验证工作。

我们欢迎社区在这方面[贡献](../contribution/overview) 你的想法 -
请考虑通过登记问题或者提交 PR 的方式帮助我们，实现对 Megatron-LM
的更大范围的集成。
