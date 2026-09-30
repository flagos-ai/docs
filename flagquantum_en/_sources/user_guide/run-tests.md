# Run tests

Install the development dependencies, then run the smallest meaningful tier
first and expand by blast radius.

```{code-block} shell
python -m pip install -e ".[dev]"

# Daily development baseline
python tools/ci_tier.py pr-default

# Local API, runtime, planner and compiler changes
python tools/ci_tier.py pr-runtime

# Distributed planner, audit and benchmark contracts on CPU
python tools/ci_tier.py pr-distributed

# Accelerator-backed and device-bound Triton tests
python tools/ci_tier.py gpu-scheduled
```

Plain pytest entry points work as well:

```{code-block} shell
python -m pytest tests/unit -q
python -m pytest tests/qec -q
python -m pytest -m qiskit
python -m pytest -m pennylane
```

## What each tier proves

| Tier | Proves | Does not prove |
| --- | --- | --- |
| Push gate | Imports, minimal circuits, autograd, pure planner and audit helpers | Runtime integration, distributed behaviour, performance, release readiness |
| Local runtime | Seeded integration coverage for local runtime and API behaviour | Multi-process transport, GPU execution, scalability |
| Distributed CPU | CPU distributed semantics, fail-closed gates, benchmark contracts, release-gate validation | Real multi-GPU or multi-node capacity expansion |
| GPU scheduled | Accelerator-backed and device-bound kernel tests | Multi-node transport or release scalability by itself |

An empty marker selection is not verification. CPU distributed tests prove
semantics only and are never used as scalability release evidence.
