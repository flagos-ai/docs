# Simulation representations

FlagQuantum exposes several simulation representations behind one program, so a
model does not have to be rewritten when the workload changes.

| Representation | Best for | Boundary |
| --- | --- | --- |
| Statevector | Exact local simulation and training on small and medium circuits | Capacity is bounded by one device; distributed capacity claims use the sharded path |
| Matrix product state (MPS) | Low-entanglement systems at large wire counts, including constrained TEBD | Approximation quality depends on the bond dimension |
| Tensor network | Circuit structures where neither dense statevector nor MPS fits | General reverse contraction and production distributed transport are not certified |
| JAX kernels | Accelerator-backed kernels behind the PyTorch interface | First-order gradients only; double backward raises |

## Switch representation without editing code

```{code-block} shell
python examples/quick_start.py --mode sv --steps 40
python examples/quick_start.py --mode mps --steps 40
python examples/quick_start.py --mode tn --steps 40
```

The same hybrid model — a `torch.nn.Linear` encoder feeding an `fq.Module`
quantum layer — trains on each representation in one PyTorch optimizer loop.

## Request a representation explicitly

```{code-block} python
import flagquantum as fq

circuit = fq.Circuit(4).h(0).cx(0, 1).rzz(1, 2, theta=0.2)
result = fq.run(
    circuit,
    options=fq.ExecutionOptions(mode="mps"),
)
```

Local statevector execution is the default. Select one locally controlled GPU
explicitly when you need it:

```{code-block} python
result = fq.run(circuit, options=fq.ExecutionOptions(device="cuda:0"))
```

## Ask the planner

When you are unsure which representation fits, plan first: the runtime planner
reports the selected representation, gradient support and any blockers instead
of failing at execution time.

```{code-block} python
plan = circuit.runtime_plan(require_gradients=True)
print(plan.summary())
```

## MPS and tensor-network workflows

```{code-block} shell
python examples/single_machine_quantum_ai/03_mps_training.py --steps 100 --n-qubits 8
python examples/vqe_switch_sv_mps_tn.py
```

The 1000-qubit dimer example is a structure-aware MPS benchmark for the
PyTorch-facing JAX/MPS path; it is not a claim about arbitrary 1000-qubit
circuits. See the [capability reference](../reference/capabilities.md) for the
exact scope of every representation.
