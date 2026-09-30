# FlagQuantum Overview

FlagQuantum is a sharded, differentiable quantum simulation and training
framework built on PyTorch. It turns quantum circuits into trainable models,
offers several simulation representations behind one program, and reaches
domestic accelerators through FlagOS. It is part of the FlagOS ecosystem — a
unified, open-source AI system software stack that fosters an open technology
ecosystem by seamlessly integrating various models, systems, and chips.

## Why FlagQuantum?

As quantum circuits grow in qubit count and depth, exact simulation becomes
prohibitively expensive, and moving a working model onto real hardware usually
means rewriting it. FlagQuantum addresses both problems with one public model:

- build a circuit once and train it with ordinary PyTorch autograd and
  optimizers;
- choose the simulation representation that fits the workload instead of the
  framework;
- keep the circuit and the requested observable explicit when moving between
  local, distributed and hardware execution targets.

## One program, several execution targets

```text
fq.Circuit / fq.Module
          │
          ▼
   FlagQuantum IR
          │
          ├── compile and export
          ├── local statevector, MPS and tensor-network runtimes
          ├── optional JAX kernels behind the PyTorch interface
          ├── sharded statevector and MPS execution
          └── deployment packages for provider and hardware targets
```

The architectural invariant is simple: backend selection may change execution,
but it must not change the meaning of the program or the result contract.

## Who it is for

- **Quantum machine learning and VQE users** who want trainable circuits inside
  a normal PyTorch training loop.
- **Algorithm researchers** who need to move between representations and
  compare them on the same program.
- **Accelerator users** who need a domestic-accelerator path with explicit,
  auditable evidence instead of hidden fallbacks.

## Key concepts

| Concept | What it means |
| --- | --- |
| `fq.Circuit` | Circuit construction and circuit-facing convenience methods, backed by FlagQuantum IR |
| `fq.Module` | The PyTorch-native owner of trainable quantum parameters |
| `fq.plan` | An explainable runtime plan: intended representation, policy and blockers |
| `fq.run` | The single recommended execution entry point, returning `fq.ExecutionResult` |
| `fq.train` | A minimal, caller-owned PyTorch optimizer loop returning `fq.TrainingResult` |
| FlagQuantum IR | The versioned operator, measurement and metadata representation shared by compilation, execution and deployment |

Planning is not execution evidence. A plan describes intent and estimates;
runtime records describe what actually ran.

## Support boundaries

Implementing a feature is not the same as supporting it in production.
FlagQuantum publishes the maturity of every capability — release certified,
production supported, development evidence, or experimental — in the
[capability reference](../reference/capabilities.md), and the tested workflows
and remaining research goals are listed there rather than implied by an
example.
