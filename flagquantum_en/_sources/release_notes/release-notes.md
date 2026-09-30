# Release Notes

## v0.2.0

**Release date**: 2026-09-11

- **Added features**

  - Unified circuit API: `fq.Circuit` with the `n_qubits` spelling, semantic
    qubit keywords and compatible legacy aliases.

  - FlagQuantum IR: one versioned, serializable and validated representation
    shared by compilation, execution and deployment.

  - Runtime planning: `fq.plan` and `Circuit.runtime_plan` explain the selected
    representation, execution policy and blockers before anything runs.

  - A single execution entry point: `fq.run` returns `fq.ExecutionResult` with a
    stable value, state, samples, plan, accuracy, metrics, provenance, runtime
    and compatibility surface, plus fail-closed handling of unknown keywords.

  - PyTorch-native training: `fq.Module` returns autograd tensors, `fq.train`
    runs a caller-owned optimizer loop and returns `fq.TrainingResult`, and
    module checkpoints support save and restore.

  - Three simulation representations behind one program: statevector, matrix
    product state and tensor network, with optional JAX kernels behind the same
    PyTorch interface.

  - Compilation: target-independent optimization with `compiler.optimize`,
    target-aware compilation with explicit coupling maps and recorded routing,
    and compiler plugins discovered through the extension registry.

  - Measurement and noise: Pauli observables with `expectation`,
    `probabilities`, `samples` and `counts` outputs; one backend-neutral
    `NoiseModel` driving exact density-matrix evolution, batched statevector
    trajectories and MPS quantum trajectories.

  - Distributed execution: sharded statevector forward, backward, training and
    optimizer state, and rank-owned distributed MPS training.

  - Hardware execution paths: explicit `compiler` and `target` selection for
    remote submission, ordered logical-to-physical mapping, qubit-wise-commuting
    grouping for Hamiltonian measurement, and sealed deployment packages.

  - Ecosystem and research surfaces: interoperability adapters for Qiskit,
    PennyLane, Cirq, Braket and CUDA-Q; QPU digital twins; a repetition-code
    memory experiment; circuit drawers; and an algorithms package.

  - Stable error categories in `flagquantum.errors` with compatibility to the
    corresponding Python built-in exceptions.

- **Removed / replaced**

  - The pre-release device-oriented API — `DistributedQuantumDevice`,
    `GeneralEncoder`, the invertible unitary mode, DTensor interchange helpers,
    and device-oriented gates and measurement — is not part of the v0.2.0
    product and is removed without a compatibility layer.

## v0.1.0

**Release date**: 2026-06-24

- Initial release of FlagQuantum as a distributed quantum statevector simulator
  built on PyTorch.
- Distributed statevector simulation using `DTensor` for multi-GPU execution,
  with automatic resharding during gate operations.
- Pauli, Clifford, rotation and controlled gates with parameterized support, and
  custom gate registration.
- Angle, amplitude and basis encoding, plus a general user-defined encoder.
- Invertible backpropagation for memory-efficient gradient computation, and
  measurement post-selection with a depolarizing noise model.
- Text and Matplotlib circuit drawing, and an OpenQASM 2.0/3.0 exporter.

---

The repository development version additionally provides QPU digital-twin
studies, detached remote job submission with receipts, dynamic circuits and
further simulation representations. Install from source to use them.
