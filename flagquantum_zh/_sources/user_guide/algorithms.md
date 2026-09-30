# 算法、纠错与数字孪生

## 算法单元

`flagquantum.algorithms` 在稳定的线路与运行时 API 之上组合面向用户的算法单元。它们从子包接口导出，而不是通过 `fq` 别名导出。

| 单元 | 作用 |
| --- | --- |
| Grover 搜索 | 由真值表合成 oracle 并执行搜索 |
| 振幅估计 | 在寄存器自身的网格上估计振幅 |
| 量子 PCA | 构建数据集的密度矩阵并读出其主要特征值 |
| 量子 k-medians | 通过 Grover 搜索采样质心归属 |
| 量子核估计 | 估计核矩阵元素并训练核岭分类器 |
| 以 QUBO 形式表述的特征选择 | 构建特征选择实例的目标函数 |
| QUBO 到 Ising 映射 | 在 QUBO 与 Ising 哈密顿量之间双向转换 |
| 哈密顿量辅助工具 | 泡利项、精确基态参考与 VQE 辅助 |

这些单元都是演示规模。每个单元都会显式记录其优势前提：其中若干需要 qRAM 或免费的 oracle，而单元本身并不提供，构建问题的经典代价是实际付出的，而不是被假定消失。引用某个单元的加速比之前，请先阅读它的优势前提。VQE 与 ADAPT-VQE 单元的优化器选择使用 `optimizer_factory` 协议，默认是 Adam。

## 本地哈密顿量梯度

对于批大小为 1、系数为实常数的 Z 与 ZZ 项态向量线路，`Hamiltonian.expectation` 提供了一条内存受限的伴随路径：

```{code-block} python
import torch
import flagquantum as fq
from flagquantum import algorithms as fqa

theta = torch.tensor(0.2, dtype=torch.float64, requires_grad=True)
circuit = fq.Circuit(3, dtype=torch.complex128).ry(0, theta).cx(0, 1)
hamiltonian = fqa.Hamiltonian((
    fqa.pauli_term(0.7, "ZZ", (0, 1)),
    fqa.pauli_term(0.2, "Z", (2,)),
))

energy = hamiltonian.expectation(circuit, differentiation="adjoint")
energy.backward()
```

默认仍是 `differentiation="autograd"`。伴随模式会拒绝 X/Y 项、可训练或复数系数以及批量线路，而不是悄悄切换算法。

## 量子纠错

`flagquantum.qec` 连接症状提取、译码、纠正与逻辑结果分析。参考实验是一个注入错误的三数据比特重复码存储实验：

```{code-block} python
from flagquantum.qec import ErrorEvent, ErrorSchedule, run_repetition_memory_experiment

result = run_repetition_memory_experiment(
    error_schedule=ErrorSchedule((ErrorEvent(round_index=0, wire=1),)),
    rounds=3,
    shots=16,
    seed=0,
)
print(result.logical_error_rate)
```

扫描只报告有限采样下的观测结果，不给出逻辑抑制或阈值结论，其时序规则也不是最大似然译码。通用码、相关噪声与硬实时硬件反馈仍属研究目标。

## QPU 数字孪生

数字孪生是一台设备的标定条件模型，由携带设备配置的 `NoiseModel` 构建。执行目标与有序物理映射会成为孪生不可变身份的一部分：

```{code-block} python
import flagquantum as fq

twin = fq.twin.from_noise_model(
    device_noise_model,
    target="your-provider:your-qpu",
    qubits=(12, 13),
)
prediction = twin.predict(fq.Circuit(2).h(0).cx(0, 1))
```

孪生的预测是经典测量分布之间的全变差一致性，不是量子态保真度。证据只对所声明的线路、操作、映射、物理耦合器、深度、标定快照与置信边界成立：`TwinCircuitSupport` 把证据包络收窄到真正验证过的有向耦合器与深度，组合也不会推断跨单元相关噪声，更不会把局部边界合并成区域级精度主张。模型、验证历史与提交记录都可以在不含凭据的情况下持久化与恢复，且加载永不提交或轮询任务。
