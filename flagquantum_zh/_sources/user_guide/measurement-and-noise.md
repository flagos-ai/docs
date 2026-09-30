# 测量与噪声

## 可观测量与输出

用 `fq.X`、`fq.Y`、`fq.Z` 描述数学上的可观测量，再从 `fq.plan` 或 `fq.run` 请求具名输出。泡利乘积使用 `@`；哈密顿量求和与实数系数使用普通算术。

```{code-block} python
import flagquantum as fq

circuit = fq.Circuit(2).h(0).cx(0, 1)
outputs = (
    fq.expectation(fq.Z(0) + fq.Z(1), name="magnetization"),
    fq.expectation(fq.X(0) @ fq.Z(1), name="correlation"),
    fq.samples(wires=(0, 1)),
)
plan = fq.plan(circuit, outputs=outputs, options=fq.ExecutionOptions(shots=1024, seed=7))
result = fq.run(plan)

print(result.expectation("magnetization"))
print(result.expectation("correlation"))
print(result.require_samples())
```

公开的输出工厂是 `expectation`、`probabilities`、`samples` 与 `counts`。采样与计数接受计算基下的线号或一个未加权的泡利乘积，并要求正的采样次数。用 `result.measurement(index_or_name)` 获取指定请求，需要态向量时用 `result.statevector()`。后端原生属性不会隐式透传：`result.native()` 是显式的应急出口。

概率与期望值默认精确；计数与采样需要显式给出采样次数。本地执行保留批维度，因此 `counts` 会为每个批次元素返回一个字典。

## 噪声模型

稳定的含噪执行在规划阶段接受 `flagquantum.noise.NoiseModel`：

```{code-block} python
import flagquantum as fq
import flagquantum.noise as fqn

circuit = fq.Circuit(2).h(0).cx(0, 1)
noise = (
    fqn.NoiseModel()
    .add("h", fqn.thermal_relaxation_channel(t1=50_000, t2=70_000, duration=35))
    .add("cx", fqn.depolarizing_channel(0.01))
    .add_readout(0, fqn.ReadoutError(((0.98, 0.02), (0.07, 0.93))))
)

result = fq.run(
    circuit,
    noise_model=noise,
    options=fq.ExecutionOptions(mode="density_matrix"),
    outputs=fq.expectation(fq.Z(0) + fq.Z(1)),
)
print(result.expectation())
```

版本化的模型载荷及其 SHA-256 身份会作为规划的一部分被校验，身份可以通过 `noise.identity` 获取。精确密度矩阵演化是小规模系统的正确性基准；批态向量轨迹与 MPS 量子轨迹会报告采样统计量，MPS 路径还会额外报告截断数据。当精确密度矩阵超出显式的内存预算时，调用方必须明确选择近似路径——否则规划会失败，而不是悄悄改变语义。

## 硬件泡利测量规划

在基于采样的硬件上测量含 X、Y、Z 项的哈密顿量时，可使用 `create_pauli_measurement_plan`。它会贪心地对量子位逐位对易的项分组、追加所需的基变换旋转，并为每组生成一个已封装的部署包：

```{code-block} python
import flagquantum.deployment as fqd

plan = fqd.create_pauli_measurement_plan(circuit, hamiltonian, backend=backend, shots=4096)
results = tuple(provider.run(package) for package in plan.packages)
energy = plan.expectation(tuple(result.counts for result in results))
```

每个包都会记录自己的分组序号、项索引、基、路由证据与封装后的部署身份。

## 动态线路

候选稳定级的构造函数与实验性执行是隔离的：

```{code-block} python
import flagquantum as fq
from flagquantum.dynamic import DynamicCircuit

circuit = DynamicCircuit(2)
circuit.h(0)
circuit.measure(0, classical_bit=0)
circuit.conditional("x", 1, classical_bit=0)

result = fq.experimental.dynamic.run_dynamic(circuit, shots=128, seed=7)
stable_result = result.to_execution_result()
```

本地动态噪声仅限匹配已执行门之后的一比特比特翻转信道，外加独立的读出混淆；其他信道会直接失败。执行前可用只读预检 `fq.experimental.dynamic.assess_dynamic_backend(circuit, backend)` 检查后端兼容性。
