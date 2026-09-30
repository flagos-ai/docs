# Tutorials

The tutorial series teaches the concepts behind the runnable examples. Read the
notebooks in order as a new user, but each one also stands alone.

| # | Notebook | Learning goal |
| --- | --- | --- |
| 00 | Understanding states | State tensors, amplitudes, probabilities and qubit order |
| 01 | Basic operations | Single-qubit and two-qubit operations |
| 02 | Measurement | Measuring states and interpreting expectation values |
| 03 | Parameterized gates | Trainable gates and gradients |
| 04 | Quantum circuit builder | Building and inspecting reusable circuits |
| 05 | Quantum machine learning | Training a small QML model end to end |
| 06 | VQE on statevector | Training a small VQE model with local statevector simulation |
| 07 | Runtime selection | Comparing statevector, MPS and tensor-network summaries |
| 08 | PyTorch and JAX layer | Training an `fq.Module` backed by a JAX quantum kernel |
| 09 | Gradient precision and speed | Comparing gradient precision and value-plus-gradient speed across runtimes |

Notebooks are stored with empty outputs; run them in a fresh kernel. The JAX
tutorial requires the optional `jax` dependency.

## Examples beyond the tutorials

| Goal | Where to start |
| --- | --- |
| Learn circuits, measurements, gradients and QML | Tutorials 00–05 |
| Verify the local CPU or one-GPU path | `examples/single_machine_quantum_ai/` |
| Train a local statevector VQE | `examples/single_machine_quantum_ai/01_vqe_statevector.py` |
| Train with MPS | `examples/single_machine_quantum_ai/03_mps_training.py` |
| Use a JAX kernel through PyTorch | `examples/single_machine_quantum_ai/04_jax_kernel_torch_layer.py` |
| Inspect sharded statevector ownership | `examples/distributed_statevector_topologies/` |
| Inspect rank-owned MPS execution | `examples/distributed_mps/` |
| Train and package a circuit | `examples/train_parameterized_circuit_then_deploy.py` |
| Build an extension | `examples/extensions/` (experimental API) |
| Run one algorithm unit end to end | `examples/algorithms/` |

## Recommended smoke runs

```{code-block} shell
python examples/single_machine_quantum_ai/00_local_fast_path_check.py
python examples/single_machine_quantum_ai/01_vqe_statevector.py --backend torch --steps 2 --n-qubits 3
python examples/single_machine_quantum_ai/02_quantum_classifier.py --steps 2
python examples/single_machine_quantum_ai/03_mps_training.py --steps 2 --n-qubits 4 --max-bond 8
```

Examples report a correctness reference before speed: the VQE and MPS examples
print an exact dense ground-state energy for the small Hamiltonian plus the
final energy gap, and the classifier compares against teacher-generated data.
