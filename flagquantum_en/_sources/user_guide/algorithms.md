# Algorithms, error correction and digital twins

## Algorithm units

`flagquantum.algorithms` composes user-facing algorithm units on top of the
stable circuit and runtime API. They are exported from the subpackage surface
rather than the `fq` alias.

| Unit | What it does |
| --- | --- |
| Grover search | Synthesizes an oracle from a truth table and runs the search |
| Amplitude estimation | Estimates an amplitude on the register's own grid |
| Quantum PCA | Builds the density matrix of a data set and reads out its dominant eigenvalues |
| Quantum k-medians | Samples centroid assignments through Grover search |
| Quantum kernel estimation | Estimates kernel entries and trains a kernel ridge classifier |
| Feature selection as a QUBO | Builds the objective of a feature-selection instance |
| QUBO to Ising mapping | Converts a QUBO into an Ising Hamiltonian and back |
| Hamiltonian helpers | Pauli terms, exact ground-state references and VQE helpers |

These units are demonstration scale. Each one records its advantage premise
explicitly: several require a qRAM or a free oracle that the unit does not
supply, and the classical cost of building the problem is paid rather than
assumed away. Read the advantage premise before quoting a unit's speedup.
Optimizer selection for the VQE and ADAPT-VQE units uses the
`optimizer_factory` protocol, with Adam as the default.

## Local Hamiltonian gradients

For batch-size-one statevector circuits with real, constant-coefficient Z and
ZZ terms, `Hamiltonian.expectation` exposes a memory-bounded adjoint path:

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

The default remains `differentiation="autograd"`. Adjoint mode rejects X/Y
terms, trainable or complex coefficients and batched circuits instead of
silently switching algorithm.

## Quantum error correction

`flagquantum.qec` connects syndrome extraction, decoding, correction and
logical-result analysis. The reference experiment is a three-data-qubit
repetition-code memory experiment with an injected error:

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

Sweeps report finite-shot observations only, not logical suppression or
thresholds, and the temporal rule is not maximum-likelihood decoding. General
codes, correlated noise and hard-real-time hardware feedback remain research
goals.

## QPU digital twins

A digital twin is a calibration-conditioned model of one device, built from a
`NoiseModel` carrying a device profile. The execution target and ordered
physical mapping become part of the immutable twin identity:

```{code-block} python
import flagquantum as fq

twin = fq.twin.from_noise_model(
    device_noise_model,
    target="your-provider:your-qpu",
    qubits=(12, 13),
)
prediction = twin.predict(fq.Circuit(2).h(0).cx(0, 1))
```

Twin predictions are total-variation agreement over classical measurement
distributions, not quantum-state fidelity. Evidence stays specific to declared
circuits, operations, mappings, physical couplers, depth, calibration snapshots
and confidence bounds: `TwinCircuitSupport` narrows an envelope to the directed
couplers and depth actually validated, and composition never infers cross-cell
correlated noise or combines local bounds into a regional accuracy claim.
Models, validation histories and submissions can be persisted and restored
without credentials, and loading never submits or polls a task.
