# Training with PyTorch

Execution and training are intentionally separate. A trainable program is an
`fq.Module` inside an ordinary PyTorch training loop.

```{code-block} python
import torch
import flagquantum as fq


def build_circuit(parameters, inputs=None):
    return (
        fq.Circuit(n_qubits=2)
        .ry(0, theta=parameters[0])
        .cx(0, 1)
        .ry(1, theta=parameters[1])
    )


module = fq.Module(
    build_circuit,
    n_parameters=2,
    policy=fq.RuntimePolicy(observable_wires=(1,)),
)
optimizer = torch.optim.Adam(module.parameters(), lr=0.01)

training = fq.train(
    module,
    optimizer=optimizer,
    objective=lambda value: value.mean(),
    steps=100,
)

print(training.losses[-1])
```

## Module behaviour

- `module(inputs)` and `module.forward(inputs)` return an autograd-compatible
  tensor, so gradients flow into quantum and classical parameters from the same
  backward call.
- `module.execute(inputs)` returns `fq.ExecutionResult` when the caller needs
  provenance, runtime diagnostics or explicit backend information.
- `fq.run` accepts a circuit, IR or execution plan — not a module — and never
  updates parameters.

`fq.train` is deliberately a minimal, caller-owned optimizer loop: it performs
`zero_grad`, `backward` and `step`, then returns `fq.TrainingResult`. Use an
ordinary PyTorch loop when the quantum module is part of a larger classical
model.

## Precision

`fq.Module` owns one end-to-end precision choice through `PrecisionPolicy`,
which determines the real parameter dtype and the complex circuit/execution
dtype. Circuit builders that omit `dtype` inherit that choice, and an explicit
`ExecutionOptions.precision` or circuit dtype must agree with it. The module
fails before execution instead of silently casting.

## Named parameter groups

Named groups remove positional-index bookkeeping for larger circuits:

```{code-block} python
def named_circuit(parameters):
    return (fq.Circuit(2)
            .ry(0, parameters["encoder"][0])
            .rx(1, parameters["readout"]))

model = fq.Module(
    named_circuit,
    parameters={"encoder": (4,), "readout": ()},
    init={"encoder": "uniform", "readout": 0.1},
    seed=42,
)
```

`init="uniform"` samples angles from `[0, 2π)`, while `init="normal"` samples
from a zero-mean normal distribution with standard deviation `0.01`. `seed`
uses a module-local generator and does not reset PyTorch's global random state.

## Checkpoints

Module parameters and policy participate in `state_dict()` save and load, and
checkpoint and resume stay on `Module.save_checkpoint()` and
`Module.load_checkpoint()` rather than becoming hidden options of `fq.train`.
The circuit builder remains application code and must be supplied when
reconstructing the module, matching normal PyTorch module construction.

## Distributed training

Under an initialized multi-rank process group, the same module and result
surface automatically use the native sharded statevector runtime. Owner-sharded
statevector and MPS training also expose separate distributed entry points,
which remain experimental. See [Distributed execution](distributed-execution.md).
