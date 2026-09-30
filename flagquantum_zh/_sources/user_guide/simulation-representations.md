# 模拟表示

FlagQuantum 在同一份程序之后提供多套模拟表示，因此负载变化时无需重写模型。

| 表示 | 适用场景 | 边界 |
| --- | --- | --- |
| 态向量 | 小到中等规模线路的精确本地模拟与训练 | 容量受单设备限制；分布式容量主张使用分片路径 |
| 矩阵乘积态（MPS） | 比特数很大的低纠缠系统，包含受限 TEBD | 近似质量取决于键维 |
| 张量网络 | 稠密态向量与 MPS 都不合适的线路结构 | 通用反向收缩与生产级分布式传输尚未认证 |
| JAX 内核 | 位于 PyTorch 接口之后的加速内核 | 仅一阶梯度，二阶反向会直接报错 |

## 不改代码切换表示

```{code-block} shell
python examples/quick_start.py --mode sv --steps 40
python examples/quick_start.py --mode mps --steps 40
python examples/quick_start.py --mode tn --steps 40
```

同一个混合模型——`torch.nn.Linear` 编码器接到 `fq.Module` 量子层——在每种表示上都用同一个 PyTorch 优化循环训练。

## 显式请求某种表示

```{code-block} python
import flagquantum as fq

circuit = fq.Circuit(4).h(0).cx(0, 1).rzz(1, 2, theta=0.2)
result = fq.run(
    circuit,
    options=fq.ExecutionOptions(mode="mps"),
)
```

本地态向量执行是默认路径。需要时可显式选择当前进程可控的一张 GPU：

```{code-block} python
result = fq.run(circuit, options=fq.ExecutionOptions(device="cuda:0"))
```

## 交给规划器判断

如果不确定哪种表示合适，先做规划：运行时规划器会报告所选的表示、梯度支持与任何阻塞项，而不是在执行时才失败。

```{code-block} python
plan = circuit.runtime_plan(require_gradients=True)
print(plan.summary())
```

## MPS 与张量网络工作流

```{code-block} shell
python examples/single_machine_quantum_ai/03_mps_training.py --steps 100 --n-qubits 8
python examples/vqe_switch_sv_mps_tn.py
```

1000 比特的 dimer 示例是面向 PyTorch 侧 JAX/MPS 路径的结构化 MPS 基准，并不是对任意 1000 比特线路的主张。每种表示的准确适用范围见[能力参考](../reference/capabilities.md)。
