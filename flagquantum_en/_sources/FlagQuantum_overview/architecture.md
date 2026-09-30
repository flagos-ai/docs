# Architecture

FlagQuantum gives quantum AI programs one public model across local
development, accelerated kernels, distributed simulation and deployment. It is
organized so that a backend change never changes the meaning of a program.

## Core layers

| Layer | Responsibility | Entry point |
| --- | --- | --- |
| User API | Circuit construction, PyTorch modules, planning, execution, training and deployment | `import flagquantum as fq` |
| Compilation | Transform circuits and legalize target output without executing them | `fq.compile`, `flagquantum.compiler` |
| FlagQuantum IR | Versioned operators, measurements, metadata, serialization and validation | `fq.CircuitIR` |
| Planning | Select a representation and execution policy; explain blockers and fallbacks | `fq.plan`, `Circuit.runtime_plan` |
| Runtime | Execute locally or across ranks and return typed evidence | `fq.run`, `fq.ExecutionResult` |
| Training | Preserve PyTorch autograd and optimizer semantics across supported runtimes | `fq.Module`, `fq.train` |
| Deployment | Bind trained parameters, compile for a target and seal an auditable package | `flagquantum.deployment.create_deployment_package` |

## Source map

```text
flagquantum/
├── _api.py                 # root compile, plan and run composition
├── circuit.py              # circuit construction
├── core/                   # backend-neutral IR and shared semantics
├── compiler/               # validation, optimization, lowering, code generation
├── runtime/                # planning, execution lifecycle, results, coordination
├── simulation/             # numerical methods and kernels
├── noise/                  # backend-neutral noise models and channels
├── observables/            # user-facing measurement construction
├── qec/                    # error-correction workflows and domain models
├── twin/                   # hardware digital-twin models
├── compute/                # resources controlled by the current process
├── remote/                 # external task systems and result retrieval
├── ecosystem/              # framework and format adapters
├── deployment/             # sealed target-neutral execution packages
├── services/               # reusable multi-step application workflows
├── algorithms/             # user-facing algorithm composition
├── benchmarking/           # reproducible measurement and evidence generation
├── drawer/                 # circuit visualization
└── experimental/           # explicitly unstable APIs
```

## Dependency direction

Dependencies point inward, so optional integrations stay outside the mandatory
local PyTorch path:

```text
User facade → Compiler / Runtime / application workflows → Core
                         │
                         ├── Simulation numerical methods
                         ├── Compute adapters for local resources
                         └── Remote adapters for external task systems
```

Core imports neither orchestration, nor numerical engines, nor vendor
integrations. The compiler transforms programs but does not execute them.
Runtime organizes execution but does not implement numerical kernels.
Simulation consumes core semantics but does not select resources. Compute and
Remote isolate hardware and external-system details from the other domains.

## Execution and training contracts

`fq.run` is the canonical execution entry point and returns
`fq.ExecutionResult` for supported local and distributed modes. Specialized
native functions are advanced interfaces and may expose backend-specific
objects.

`fq.train` owns the ordinary PyTorch optimization loop. Owner-sharded
statevector and MPS training have separate experimental distributed entry
points; they are not implied by calling `fq.train`. Distributed training is
complete only when forward execution, gradients, optimizer updates and
checkpoint ownership preserve the declared distribution semantics.

For a claim of distributed scalability, one logical workload must be sharded
across ranks. Replicated data parallelism, rank-local kernels and manual tensor
slicing are reported under their own semantics and are never relabeled as
capacity expansion.

## Public versus internal interfaces

- Public examples use `import flagquantum as fq`.
- Stable names are bounded by a checked manifest that tests verify.
- `fq.experimental` carries no compatibility guarantee.
- Compatibility modules support migration; they do not define new stable API.
- Benchmark and research utilities never become runtime dependencies.
