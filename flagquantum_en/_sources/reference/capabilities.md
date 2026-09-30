# Capability reference

FlagQuantum publishes the maturity of every capability instead of implying it
from an example. This page is a summary; the repository's machine-validated
capability matrix is authoritative.

## How to read maturity

| Level | Meaning |
| --- | --- |
| Release certified | Release-gated with audited, reproducible evidence and no unresolved release blocker |
| Production supported | Supported path with compatibility, operational guidance and target-hardware evidence |
| Development evidence | Executable and tested development result; not a production or general scalability claim |
| Experimental | Research surface without compatibility or production guarantees |

Maturity applies only to the scope stated for each capability. A local,
replicated, sliced or planned execution path is not distributed scalability
evidence. A stable public API does not promote an experimental backend.

## Build, simulation and training

| Capability | Maturity | Boundary in short |
| --- | --- | --- |
| Unified circuit API and FlagQuantum IR | Release certified | IR v1; incompatible schema changes require an explicit migration |
| Local statevector simulation and training | Production supported | Capacity bounded by one device |
| Sharded statevector training | Production supported | Multi-node release certification depends on promoted audited hardware evidence |
| Differentiable and sharded MPS training | Development evidence | Single-node and dual-node evidence; layer-parallel contraction and capacity soak remain incomplete |
| Tensor-network execution and training | Experimental | General reverse contraction and production distributed transport are not certified |
| Constrained local MPS TEBD | Experimental | Static real one- and two-site Pauli terms, batch one, second-order imaginary time only |
| Exact and trajectory-based noisy simulation | Experimental | Pulse overlap, crosstalk, leakage, provider calibration adapters and noisy gradients are unsupported |
| Continuous-time Lindblad evolution | Production supported | Time-independent dense Hamiltonians on CPU, complex64/complex128 only |
| Double-Single FP32 numerical primitives | Experimental | Software-extended precision for FP32 hardware; not equivalent to FP64 |
| Split real/imag FP32 statevector (P0–P5) | Experimental | Explicit forward, expectation and Double-Single paths that the default runtime never selects |
| Quantum state preparation | Experimental | Demonstration scale; input is already exponential in size |
| Oracle building blocks and truth-table synthesis | Experimental | Reversible classical logic; ancillas must enter in the zero state |
| Grover search, amplitude estimation | Experimental | Advantage is in query complexity against a free oracle or state preparation |
| Quantum PCA, k-medians, kernel estimation | Experimental | The advantage premise is the data-access model, which these units do not supply |
| Feature selection and QUBO-to-Ising mapping | Experimental | Polynomial classical transformations; no solver and no advantage of their own |
| QUBO to Ising and singular values by phase estimation | Experimental | Demonstration scale; classical work is explicit |

## Distributed and FlagOS execution

| Capability | Maturity | Boundary in short |
| --- | --- | --- |
| FlagOS local statevector CUDA reference | Development evidence | A CUDA-backed reference that certifies no domestic accelerator |
| FlagOS distributed statevector workloads | Development evidence | One CUDA-backed A800 node at 2, 4 and 8 cards; multi-node behaviour is not established |
| FlagOS statevector capacity expansion | Development evidence | One exact 32-qubit complex128 forward workload on an eight-A800 node |
| FlagOS distributed transport observability | Development evidence | Collectives at 2, 4 and 8 ranks; device activity capture was incomplete |
| Domestic single-card certification harness | Development evidence | Collects a provisioner-attested candidate; it promotes no capability by itself |

## Deployment, interoperability and research surfaces

| Capability | Maturity | Boundary in short |
| --- | --- | --- |
| Circuit packaging and cloud deployment | Development evidence | Provider support and credential behaviour vary; no provider is release-certified |
| Evidence-qualified QPU digital twins | Development evidence | Agreement is total-variation agreement of measurement distributions, for declared circuits only |
| Interoperability adapter contract | Experimental | Candidate-stable protocol, not yet approved by the API owners |
| Qiskit, PennyLane, Cirq and CUDA-Q interoperability | Experimental | Static conversion at versioned boundaries; external objects never enter runtime or accelerator layers |
| PennyLane Lightning, Cirq Simulator and Qiskit Aer bridges | Experimental | One fully bound single-batch circuit, no gradients, noise, dynamic circuits, routing or fallback |
| Evidence-based simulator advisor | Experimental | Advice is bound to a checked-in circuit and environment; it never infers performance from size |
| Dynamic circuits and backend assessment | Experimental | Local dynamic noise is limited to one-wire bit-flip channels plus readout confusion |
| Extension SDK | Experimental | Protocol approved but not frozen; compiler plugins exchange `CircuitIR` only |
| Repetition-code memory experiment | Development evidence | One fixed three-data-qubit profile; no logical suppression or threshold claim |

## Validated public performance claims

Where FlagQuantum publishes a measured performance claim, it names the raw
artifact, its digest, the recorded environment and the exact scope, and it
inherits the maturity of the capability it belongs to. Claims without an
audited artifact are not made here.
