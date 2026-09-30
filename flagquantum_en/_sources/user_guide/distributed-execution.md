# Distributed execution

Distributed execution extends the same programming model to genuinely sharded
workloads. One logical workload is split across ranks; replicated execution is
never presented as capacity scaling.

## Sharded statevector

Under an initialized multi-rank process group, the same statevector module and
result surface automatically use the native sharded statevector runtime.
Distribution topology comes from the execution environment, not from a second
mode vocabulary.

```{code-block} shell
torchrun --nproc_per_node=4 your_script.py
```

```{code-block} python
import flagquantum as fq

def circuit(parameters):
    return fq.Circuit(20).ry(0, parameters[0]).cx(0, 1)

module = fq.Module(circuit, n_parameters=1)
result = module.execute()
```

Sharded statevector training keeps optimizer state and checkpoints owned by the
declared distribution, so forward execution, gradients, optimizer updates and
restart all preserve the same semantics.

## Rank-owned MPS

Distributed MPS training keeps forward, backward and optimizer state
rank-owned. It is the path for large low-entanglement systems that do not fit
on one device, and it supports checkpoint and resume with matched restart
semantics. An experimental `adam_lbfgs` schedule with owner-local
limited-memory histories is available for bonded systems.

```{code-block} shell
python examples/distributed_mps/variable_bond_capacity_8gpu.py
python examples/distributed_statevector_topologies/run.sh
```

## What distributed evidence means here

- A distributed scalability claim requires one logical workload sharded across
  ranks.
- CPU distributed tiers prove semantics and fail-closed behaviour only; they are
  not capacity evidence.
- Runtime records report their `distribution_semantics`, so sharded capacity
  can be distinguished from replicated throughput.
- Distributed training remains explicitly experimental outside the supported
  sharded statevector and MPS profiles.

## FlagOS accelerators

On a FlagOS-supported accelerator, the same program runs on the logical
`flagos:0` device through Torch-FL, so distributed transports and collectives
follow the FlagOS route. See
[Hardware and remote targets](hardware-and-remote.md).
