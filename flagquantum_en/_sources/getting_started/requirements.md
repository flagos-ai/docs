# Requirements

This section includes information about the hardware platforms and software
requirements for FlagQuantum.

## Software requirements

- Python 3.10, 3.11 or 3.12
- PyTorch 2.5 or higher, below 2.14

The released package depends on PyTorch only. Everything else is optional.

## Supported hardware platforms

| Platform | How it is reached |
| --- | --- |
| CPU | Default local statevector, MPS and tensor-network execution |
| NVIDIA GPU | CUDA device selected through `fq.ExecutionOptions(device="cuda:0")` |
| FlagOS-supported accelerators | The logical `flagos:0` device, reached through Torch-FL |

FlagQuantum does not detect or dispatch a specific domestic accelerator by
device name. Torch-FL owns vendor detection, runtime activation and the
compatibility route, and exposes it through the `flagos` contract.

## Optional dependency groups

| Group | Adds |
| --- | --- |
| `dev` | pytest, coverage, xdist, ruff, black, mypy, build, pre-commit |
| `jax` | JAX-backed kernels |
| `cuda` | Triton |
| `qiskit` | Qiskit and Aer interoperability |
| `pennylane` | PennyLane interoperability |
| `cirq` | Cirq interoperability |
| `braket` | Amazon Braket interoperability |
| `cudaq` | CUDA-Q kernel export |
| `quafu` | Quafu submission support |
| `azure` | Azure Quantum submission support |
| `viz` | Matplotlib circuit drawing |
| `examples` | `datasets` and `transformers` for the example workflows |
| `all` | Every optional dependency above |

Interoperability adapters are optional control-plane boundaries: importing
`flagquantum` never imports Qiskit, PennyLane, Cirq or another external
framework.

## Support boundaries to read before choosing a target

The maturity of every capability, and what each target has actually been
executed with, is published in the
[capability reference](../reference/capabilities.md). An implemented API is not
automatically production support.
