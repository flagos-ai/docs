# Features

## PyTorch-native quantum training

- **Trainable circuits as PyTorch modules**: `fq.Module` exposes the quantum
  model to PyTorch, so `loss.backward()` and ordinary optimizers train quantum
  and classical layers in one loop.
- **Flat or named parameter groups**: positional parameters and named groups
  such as `{"encoder": (4,), "readout": ()}` are both supported, with
  reproducible initialization and a module-local seed.
- **Stable training results**: `fq.train` returns `fq.TrainingResult` with
  versioned summaries, and checkpoint and resume stay on `fq.Module`.

## Several simulation representations, one program

- **Statevector**: the exact local path, on CPU or one GPU, with automatic
  dense reference reporting for small systems.
- **Matrix product state (MPS)**: low-entanglement systems at far larger wire
  counts than a dense statevector allows, including constrained TEBD.
- **Tensor networks**: slicing and contraction for circuit structures where
  neither dense statevector nor MPS fits.
- **Optional JAX kernels** behind the same PyTorch interface, with first-order
  gradient support across the bridge.
- **One command to switch**: `python examples/quick_start.py --mode sv|mps|tn`
  runs the same hybrid model on three representations without editing code.

## Compilation and export

- **Target-independent optimization**: `flagquantum.compiler.optimize` applies
  canonical rewrites to a fixed point and returns new IR.
- **Target-aware compilation**: `fq.compile(..., coupling_map=..., routing_strategy=...)`
  emits only topology-valid two-qubit operations and records the routing
  decision.
- **Compiler plugins**: independently installed packages may register a
  compiler through the extension registry, for example the QSteed plugin used
  for Quafu submission.
- **OpenQASM and framework export**: circuit export to OpenQASM 3.0 and
  adapters for Qiskit, PennyLane, Cirq, Braket and CUDA-Q.

## Measurement, noise and error correction

- **Observables and outputs**: `fq.X`, `fq.Y`, `fq.Z` with `@` products and
  ordinary arithmetic build Hamiltonians; `fq.expectation`,
  `fq.probabilities`, `fq.samples` and `fq.counts` request results.
- **Backend-neutral noise**: one `NoiseModel` drives exact density-matrix
  evolution, batched statevector trajectories and MPS quantum trajectories,
  with thermal relaxation, depolarizing, bit/phase flip and readout errors.
- **Hardware Pauli measurement planning**: qubit-wise-commuting grouping with
  one sealed deployment package per group.
- **Dynamic circuits**: mid-circuit measurement and classical feedback, with a
  read-only backend preflight.
- **Quantum error correction**: a repetition-code memory experiment connecting
  syndrome extraction, decoding and correction.

## Distributed and accelerator execution

- **Sharded statevector training**: one logical statevector across ranks, with
  distributed forward, backward and optimizer state.
- **Rank-owned MPS**: distributed MPS forward, backward and optimizer state for
  workloads that do not fit one device.
- **PyTorch-native under a process group**: the same module and result surface
  uses the sharded runtime once a multi-rank process group is initialized.
- **FlagOS accelerators through Torch-FL**: the logical `flagos:0` device is
  reached through Torch-FL, which owns vendor detection and dispatch.

## Deployment, interop and ecosystem

- **Sealed deployment packages**: bind trained parameters, compile for a
  target and produce an auditable package before submission.
- **QPU digital twins**: calibration-conditioned models that predict a device's
  measurement distribution and carry explicit evidence boundaries.
- **Algorithm units**: Grover search, amplitude estimation, quantum PCA,
  quantum k-medians, quantum kernel estimation and kernel ridge
  classification, feature selection as a QUBO, and QUBO-to-Ising mapping.
- **Circuit visualization**: a text drawer for terminals and a Matplotlib
  drawer for publication figures.
