# 基本用法

构建线路、查看规划、执行并读取结果。这是贯穿稳定 API 的最短完整路径。

```{code-block} python
import flagquantum as fq

circuit = fq.Circuit(n_qubits=2).h(0).cx(0, 1)
options = fq.ExecutionOptions(mode="auto", precision="complex64")
plan = fq.plan(circuit, options=options)
result = fq.run(plan)

print(plan.identity)
print(plan.summary()["recommended_mode"])
print(result.plan.identity)
print(result.state)
```

## 先规划，再执行同一个规划

规划解释将要执行什么以及为什么。把规划交给 `fq.run` 会执行这份确切的规划，不重新规划、不重新编译，在同一进程内满足 `result.plan is plan`。规划身份覆盖规范化 IR、解析后的执行语义、编译流水线、所需环境与所选决策，并且可以经受 JSON 往返：

```{code-block} python
text = plan.to_json()
restored = fq.ExecutionPlan.from_json(text)
result = fq.run(restored)
assert result.plan.identity == plan.identity
```

已有规划对语义覆盖是封闭的：同时传入 `options`、`measurements` 或 `noise_model` 会抛出 `TypeError`。环境或 world size 不兼容会在内核启动前失败，而不是悄悄重新规划或回退。

## 只查看决策而不执行

如果只需要决策，可以使用线路级规划器：

```{code-block} python
circuit = (
    fq.Circuit(n_qubits=4)
    .h(0)
    .cx(0, 1)
    .rzz(1, 2, theta=0.2)
)

plan = circuit.runtime_plan(prefer_jax=True, require_gradients=True)
print(plan.summary())
```

规划是对预期执行的解释，不是基准证据。

## 本地选项与远程目标

`fq.ExecutionOptions` 描述当前进程所控制的资源，例如 `device="cuda:0"` 或模拟 `mode`。`target` 参数则保留给外部执行目标，例如九鼎工作区或 Quafu 后端。详见[硬件与远程目标](hardware-and-remote.md)。
