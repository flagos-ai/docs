# 开始使用 FlagGems

## 1. 安装 FlagGems {#install-flaggems}

*FlagGems* 可以以纯 Python 包的形式安装，也可以附带 C++ 扩展特性来安装，
以实现更好的运行时性能。你可以参阅[安装指南](../getting-started/installation)
的说明，了解不同安装方式、选项的详细指令。

## 2. 检查安装状态

在安装了 `flag_gems` 包及其所依赖的其他软件包之后，
你可能希望检查这些软件包是否能够正常工作。

### 2.1 检查 PyTorch 环境

你要执行的第一项检查是确认能够在你的工作环境中导入 `torch` 软件包：

```shell
python -c "import torch; print(torch.__version__)"
```

如果你所使用的是一个[非 NVIDIA 的平台](../usage/non-nvidia)，
你可能需要安装一个由后端硬件厂商所提供的 PyTorch 插件。
你也可以针对这一插件执行类似的验证操作。
例如，在一个使用摩尔线程 GPU 的平台上，你可以使用下面的命令来检查
是否插件能够正常工作：

```shell
python -c "import torch_musa; print(torch_musa.__version__)"
```

### 2.2 检查 Triton 安装

接下来的一项检查是针对 `triton` 软件包的。
你可以使用下面的命令来检查 `triton` 包是否可以正常使用。

```shell
python -c "import torch, triton; print(triton.__version__)"
```

如果你所使用的是一个[非 NVIDIA 的平台](../usage/non-nvidia)，
你可能需要咨询的平台供应商，了解他们是否提供了一个定制版本。

> [!WARNING]
> **警告**
>
> 通常，厂商定制的 `triton` 软件包与上游社区获得的软件包同名。
> 在进入下一步之前，你需要**反复确认**自己所使用的包是正确的版本。

### 2.3 检查 FlagGems 的安装

针对 `flag_gems` 包，你也可以使用下面的命令执行类似的检查：

```shell
python -c "import flag_gems; print(flag_gems.__version__)"
```

## 3. 开始使用 FlagGems

你可以用多种不同方式来启用 `flag_gems` 所提供的加速算子。
下面的代码段在全局范围内启用 `flag_gems`：

```python
import flag_gems

flag_gems.enable()

# 你自己的代码 ...
```

你也可以针对自己代码中的某一部分，在特定的上下文中启用 `flag_gems`，
如下例所示：

```python
# 你的代码 ...

# 在特定上下文中启用 flag_gems
with flag_gems.use_gems():
    # 在上下文中使用加速的算子
    # ...
```

例如：

```python
import torch
import flag_gems

M, N, K = 1024, 1024, 1024
A = torch.randn((M, K), dtype=torch.float16, device=flag_gems.device)
B = torch.randn((K, N), dtype=torch.float16, device=flag_gems.device)
with flag_gems.use_gems():
    C = torch.mm(A, B)
```

也可以绕过 PyTorch，直接调用 `flag_gems.ops` & `flag_gems.fused` 中的算子。

```python
import flag_gems

a = torch.randn(1024, 1024, device=flag_gems.device, dtype=torch.float16)
b = torch.randn(1024, 1024, device=flag_gems.device, dtype=torch.float16)
c = flag_gems.ops.mm(a, b)

num_tokens = 4096; block_size = 64; topk = 2; num_experts = 128;
topk_ids = torch.randint(
    low=0,
    high=num_experts,
    size=(num_tokens, topk),
    device=flag_gems.device,
    dtype=torch.int32,
)
sorted_ids, expert_ids, num_tokens_post_pad = flag_gems.fused.moe_align_block_size.moe_align_block_size(topk_ids, block_size, num_experts)
```

你可以查阅[使用指南](./usage)一节中的详细文档，
了解 *FlagGems* 的多种使用模式。
