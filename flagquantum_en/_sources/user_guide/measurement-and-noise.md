# Measurement and noise

## Observables and outputs

Describe mathematical observables with `fq.X`, `fq.Y` and `fq.Z`, then request
named outputs from `fq.plan` or `fq.run`. Pauli products use `@`; Hamiltonian
sums and real coefficients use ordinary arithmetic.

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

The public output factories are `expectation`, `probabilities`, `samples` and
`counts`. Sampling and counts accept computational-basis wires or one
unweighted Pauli product and require a positive shot count. Use
`result.measurement(index_or_name)` for a specific request and
`result.statevector()` when a statevector is required. Backend-native
attributes are not implicitly forwarded: `result.native()` is the explicit
escape hatch.

Probabilities and expectations are exact by default; counts and samples require
an explicit shot count. Local execution preserves its batch dimension, so
`counts` returns one dictionary per batch item.

## Noise models

Stable noisy execution accepts a `flagquantum.noise.NoiseModel` during planning:

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

The versioned model payload and its SHA-256 identity are verified as part of
the plan, and the identity is available as `noise.identity`. Exact
density-matrix evolution is the small-system correctness oracle; batched
statevector trajectories and MPS quantum trajectories report sampling
statistics, and the MPS path additionally reports truncation data. When the
exact density matrix exceeds an explicit memory budget, the caller must opt in
to approximation — otherwise planning fails rather than silently changing
semantics.

## Hardware Pauli measurement planning

Use `create_pauli_measurement_plan` to measure a Hamiltonian containing X, Y
and Z terms on shot-based hardware. It greedily groups qubit-wise-commuting
terms, appends the required basis rotations and creates one sealed deployment
package per group:

```{code-block} python
import flagquantum.deployment as fqd

plan = fqd.create_pauli_measurement_plan(circuit, hamiltonian, backend=backend, shots=4096)
results = tuple(provider.run(package) for package in plan.packages)
energy = plan.expectation(tuple(result.counts for result in results))
```

Each package records its group index, term indices, basis, routing evidence and
sealed deployment identity.

## Dynamic circuits

The candidate-stable builder is isolated from experimental execution:

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

Local dynamic noise is limited to one-wire bit-flip channels after matching
executed gates plus independent readout confusion; other channels fail closed.
Backend compatibility can be checked before running with the read-only
preflight `fq.experimental.dynamic.assess_dynamic_backend(circuit, backend)`.
