# Reference

Stable interfaces, configuration and support boundaries.

## Stable API

FlagQuantum exposes one curated Python interface, `import flagquantum as fq`.
The stable names are bounded by a checked manifest, verified by executable
contract tests.

| API | Stability |
| --- | --- |
| `fq.Circuit`, `fq.CircuitIR`, `fq.Instruction` | Stable |
| `fq.ExecutionOptions`, `fq.ExecutionPlan`, `fq.ExecutionResult` | Stable |
| `fq.MeasurementResult`, `fq.Observable`, `fq.OutputRequest` | Stable |
| `fq.Parameter`, `fq.ParameterExpression`, `fq.RuntimePolicy` | Stable |
| `fq.Module`, `fq.TrainingResult` | Stable |
| `fq.I`, `fq.X`, `fq.Y`, `fq.Z` | Stable |
| `fq.IR_VERSION`, `fq.IRSerializationError`, `fq.IRValidationError` | Stable |
| `fq.compile`, `fq.plan`, `fq.run`, `fq.train` | Stable |
| `fq.counts`, `fq.expectation`, `fq.probabilities`, `fq.samples` | Stable |
| `fq.submit`, `fq.restore_job` | Stable |
| `fq.experimental`, `fq.twin`, `fq.__version__` | Stable |

## API map

| Task | Primary interface | Result |
| --- | --- | --- |
| Build a program | `fq.Circuit` | Circuit backed by FlagQuantum IR |
| Optimize a program | `flagquantum.compiler.optimize` | `fq.CircuitIR` |
| Compile for a selected tool and target | `fq.compile` | `fq.CircuitIR` |
| Inspect execution | `fq.plan`, `Circuit.runtime_plan` | Explainable runtime plan |
| Execute locally or remotely | `fq.run` | `fq.ExecutionResult` |
| Define a trainable quantum layer | `fq.Module` | PyTorch module |
| Train | `fq.train` | `fq.TrainingResult` |
| Package for a target | `flagquantum.deployment.create_deployment_package` | Sealed deployment package |

## Runtime configuration

`RuntimeConfig` is FlagQuantum's immutable execution policy: backend, device,
real and complex precision, JAX precision, matrix multiplication policy and
drawing style. A `Circuit` captures a configuration when constructed and embeds
a versioned manifest in IR and execution plans, so distributed workers rebuild
the same policy.

```{code-block} python
import flagquantum as fq
from flagquantum.runtime.configuration import RuntimeConfig, runtime_config

config = RuntimeConfig(device="cuda")
circuit = fq.Circuit(4, config=config)

with runtime_config(complex_dtype="complex128"):
    circuit = fq.Circuit(2)  # captures complex128
```

Each execution resolves complex precision once: `complex64` implies float32
parameters and real components, `complex128` implies float64. The resolved value
governs planning bytes, state allocation, parameter tensors, gate matrices and
distributed simulation, and the stages never consult process defaults
independently. Conflicting dtypes fail before gate application.

## Operators

Circuit operations and backend lowering availability derive from one typed
operator registry. A registered lowering means the operator can be lowered for
that backend — not that it is release evidence. The generated operator table in
the repository is authoritative for the registered set, which covers Pauli,
Clifford, rotation, controlled, symmetric two-qubit and phase gates, plus the
noise channels used by the stable noise model.

## Errors

| Category | Meaning |
| --- | --- |
| `ValidationError` | Invalid semantic input |
| `PlanningError` | Stale, tampered or incompatible plan |
| `CapabilityError` | The requested capability is unavailable |
| `ExecutionError` | Execution or training failure |

All categories inherit `FlagQuantumError` and a compatible Python built-in
exception. Wrong Python types and unknown keyword arguments raise `TypeError`.

## Stability boundaries

- `fq.experimental` has no compatibility guarantee.
- Compatibility imports are migration aids and are not implied stable.
- A planner result describes intent and estimates; it is never runtime or
  benchmark evidence.
- Runtime evidence must satisfy the typed, versioned runtime contracts.
- New public names must first be importable, snapshot-tested and added to the
  stable API manifest.

## Further reading

- [Capability reference](capabilities.md) — maturity and support boundaries per
  capability.
- [Architecture](../FlagQuantum_overview/architecture.md) — layers, dependency
  direction and contracts.
