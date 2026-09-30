# 线路与 FlagQuantum IR

## 线路构建

`fq.Circuit(n_qubits=...)` 是表述线路规模的首选写法。按位置构造、`n_wires=` 与旧的 `nqubits=` 写法仍然兼容；别名冲突会在构造时失败。运行时、编译器与 IR 内部依旧使用 *wire* 表示逻辑映射。

```{code-block} python
import flagquantum as fq

circuit = fq.Circuit(2).h(0).cx(0, 1).ry(1, theta=0.3)
```

生成的门的方​​法既保留简洁的位置写法，也接受语义化的量子比特关键字：`h(0)` 与 `h(qubit=0)` 等价，`cx(0, 1)` 与 `cx(control=0, target=1)` 等价，对称双比特门使用 `qubit1=` 与 `qubit2=`。重复、冲突或缺失的量子比特参数会在添加指令之前失败。

## 与目标无关的优化

编译器优化是面向专家的、与目标无关的变换，返回新的 IR 且不修改输入：

```{code-block} python
import flagquantum as fq
import flagquantum.compiler as compiler

circuit = fq.Circuit(2).h(0).h(0).cx(0, 1)
optimized_ir = compiler.optimize(circuit)
result = fq.run(optimized_ir)
```

## 面向目标的编译与路由

当具体拓扑很重要时，请提供显式耦合图：

```{code-block} python
import flagquantum.compiler as compiler

coupling = compiler.CouplingMap.line(circuit.n_qubits)
compiled_ir = compiler.compile(
    circuit,
    coupling_map=coupling,
    routing_strategy="auto",
)
```

编译器只输出符合拓扑的双比特操作，并把路由决策记录在 `compiled_ir.metadata["routing"]` 中。它不选择也不调用执行后端。

`fq.compile(circuit, compiler="qsteed", target="quafu:<backend>")` 是直接选择编译器的路径：产出的 IR 保留逻辑线号，并把有序的物理映射带入部署阶段。

## IR 序列化与校验

FlagQuantum IR 是版本化、可序列化并经过校验的。`fq.CircuitIR` 属于稳定接口面，`fq.IR_VERSION`、`fq.IRSerializationError` 与 `fq.IRValidationError` 描述了这一边界。不兼容的 schema 变更需要显式迁移。

## 错误

可以从 `flagquantum.errors` 捕获稳定的生命周期类别：

```{code-block} python
import flagquantum as fq
import flagquantum.errors as fqe

try:
    result = fq.run(fq.plan(circuit))
except fqe.ValidationError:
    ...  # 语义输入非法
except fqe.PlanningError:
    ...  # 规划过期、被篡改或不兼容
except fqe.CapabilityError:
    ...  # 请求的能力不可用
except fqe.ExecutionError:
    ...  # 执行或训练失败
```

所有类别都继承 `FlagQuantumError` 以及与之兼容的 Python 内置异常。类型错误与未知关键字参数仍然抛出 `TypeError`。
