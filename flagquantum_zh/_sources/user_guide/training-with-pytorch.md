# 使用 PyTorch 训练

执行与训练是有意分开的。可训练程序就是放在常规 PyTorch 训练循环里的 `fq.Module`。

```{code-block} python
import torch
import flagquantum as fq


def build_circuit(parameters, inputs=None):
    return (
        fq.Circuit(n_qubits=2)
        .ry(0, theta=parameters[0])
        .cx(0, 1)
        .ry(1, theta=parameters[1])
    )


module = fq.Module(
    build_circuit,
    n_parameters=2,
    policy=fq.RuntimePolicy(observable_wires=(1,)),
)
optimizer = torch.optim.Adam(module.parameters(), lr=0.01)

training = fq.train(
    module,
    optimizer=optimizer,
    objective=lambda value: value.mean(),
    steps=100,
)

print(training.losses[-1])
```

## 模块行为

- `module(inputs)` 与 `module.forward(inputs)` 返回兼容自动微分的张量，因此同一次反向传播就能把梯度传给量子参数与经典参数。
- 当调用方需要溯源、运行时诊断或明确的后端信息时，使用 `module.execute(inputs)`，它返回 `fq.ExecutionResult`。
- `fq.run` 接受线路、IR 或执行规划——不接受模块——并且从不更新参数。

`fq.train` 刻意做成由调用方掌握的最小优化循环：它执行 `zero_grad`、`backward`、`step`，然后返回 `fq.TrainingResult`。当量子模块只是更大经典模型的一部分时，请使用常规 PyTorch 循环。

## 精度

`fq.Module` 通过 `PrecisionPolicy` 统一持有端到端的精度选择，它决定实数参数 dtype 与复数线路/执行 dtype。未指定 `dtype` 的线路构造函数会继承该选择，而显式的 `ExecutionOptions.precision` 或线路 dtype 必须与之一致。模块会在执行前失败，而不是悄悄做类型转换。

## 命名参数分组

命名分组免去了较大线路中按位置索引的记账工作：

```{code-block} python
def named_circuit(parameters):
    return (fq.Circuit(2)
            .ry(0, parameters["encoder"][0])
            .rx(1, parameters["readout"]))

model = fq.Module(
    named_circuit,
    parameters={"encoder": (4,), "readout": ()},
    init={"encoder": "uniform", "readout": 0.1},
    seed=42,
)
```

`init="uniform"` 从 `[0, 2π)` 采样角度，`init="normal"` 则从均值为零、标准差为 `0.01` 的正态分布采样。`seed` 使用模块内部的生成器，不会重置 PyTorch 的全局随机状态。

## 检查点

模块的参数与策略都参与 `state_dict()` 的保存与加载，检查点与恢复由 `Module.save_checkpoint()` 与 `Module.load_checkpoint()` 负责，而不是变成 `fq.train` 的隐藏选项。线路构造函数仍属于应用代码，重建模块时必须提供，这与常规 PyTorch 模块的构造方式一致。

## 分布式训练

在已初始化的多 rank 进程组下，同一模块与结果面会自动使用原生分片态向量运行时。按 rank 拥有的态向量与 MPS 训练也各有独立的分布式入口，目前仍属实验性。详见[分布式执行](distributed-execution.md)。
