# Getting Started

This section covers the requirements for installing FlagQuantum and guides you
through the installation process.

```{toctree}
:maxdepth: 2
:hidden:

requirements.md
install.md
```

## Your first quantum model

FlagQuantum is a PyTorch-first framework, so the shortest path to a working
program is a small trainable circuit. The example below builds a two-qubit
circuit, learns its rotation angle by minimizing the measured expectation
value, and prints the trained measurement. It needs no GPU, no credentials and
no optional backend.

```python
import torch
import flagquantum as fq


def circuit(parameters):
    return fq.Circuit(2).ry(0, parameters[0]).cx(0, 1)


model = fq.Module(circuit, n_parameters=1, init=torch.tensor([0.25]))
training = fq.train(
    model,
    optimizer=torch.optim.Adam(model.parameters(), lr=0.05),
    objective=lambda z: z.mean(),
    steps=10,
)

trained_circuit = circuit(next(model.parameters()).detach())
measurement = fq.expectation(fq.Z(0))
result = fq.run(trained_circuit, outputs=measurement)
print(result.expectation())
```

Continue with:

- [Requirements](requirements.md) for the supported Python, PyTorch and
  hardware platforms (including the optional dependency groups);
- [Install FlagQuantum](install.md) to install the released package or a
  development checkout and verify it;
- the [User Guide](../user_guide/user-guide.md) for circuits, training,
  representations, distributed execution and hardware targets.
