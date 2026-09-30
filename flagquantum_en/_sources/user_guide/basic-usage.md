# Basic usage

Create a circuit, inspect its plan, execute it and read the result. This is the
shortest complete journey through the stable API.

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

## Plan, then execute the same plan

Planning explains what will run and why. Passing the plan to `fq.run` executes
that exact plan without replanning or recompiling, and `result.plan is plan`
holds in the same process. Plan identity covers the canonical IR, resolved
execution semantics, compiler pipeline, required environment and the selected
decision, and it survives a JSON round trip:

```{code-block} python
text = plan.to_json()
restored = fq.ExecutionPlan.from_json(text)
result = fq.run(restored)
assert result.plan.identity == plan.identity
```

An existing plan is closed to semantic overrides: passing `options`,
`measurements` or `noise_model` alongside it raises `TypeError`. Environment or
world-size incompatibility fails before kernel launch rather than silently
replanning or falling back.

## Inspect without executing

When you only need the decision, use the circuit-level planner:

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

A plan is an explanation of intended execution, not benchmark evidence.

## Local options and remote targets

`fq.ExecutionOptions` describes resources controlled by the current process,
such as `device="cuda:0"` or a simulation `mode`. The `target` argument is
reserved for external execution destinations such as a Jiuding workspace or a
Quafu backend. See [Hardware and remote targets](hardware-and-remote.md).
