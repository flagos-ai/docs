# 快速入门

本节介绍安装 FlagQuantum 的环境要求，并引导你完成安装过程。

```{toctree}
:maxdepth: 2
:hidden:

requirements.md
install.md
```

## 你的第一个量子模型

FlagQuantum 是 PyTorch 优先的框架，因此最短的上手路径就是一个可训练的小线路。下面的示例构建一个双比特线路，通过最小化测量得到的期望值来学习其旋转角，最后打印训练后的测量结果。它不需要 GPU、凭据或任何可选后端。

```python
import torch
import flagquantum as fq


def circuit(parameters):
    return fq.Circuit(2).ry(0, parameters[0]).cx(0, 1)


model = fq.Module(circuit, n_parameters=1, init=torch.tensor([0.25]))
training = fq.train(
    model,
    optimizer=torch.optim.Adam(model.parameters(), lr=0.05),
    objective=lambda z: z.mean(),
    steps=10,
)

trained_circuit = circuit(next(model.parameters()).detach())
measurement = fq.expectation(fq.Z(0))
result = fq.run(trained_circuit, outputs=measurement)
print(result.expectation())
```

接下来可以阅读：

- [环境要求](requirements.md)：受支持的 Python、PyTorch 与硬件平台，以及可选依赖分组；
- [安装 FlagQuantum](install.md)：安装正式版本或开发版并验证；
- [用户指南](../user_guide/user-guide.md)：线路、训练、模拟表示、分布式执行与硬件目标。
