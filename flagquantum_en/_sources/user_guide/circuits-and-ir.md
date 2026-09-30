# Circuits and FlagQuantum IR

## Circuit construction

`fq.Circuit(n_qubits=...)` is the preferred public spelling for circuit size.
Positional construction, `n_wires=` and the legacy `nqubits=` remain
compatible; conflicting aliases fail during construction. Runtime, compiler and
IR internals continue to use *wire* for logical mappings.

```{code-block} python
import flagquantum as fq

circuit = fq.Circuit(2).h(0).cx(0, 1).ry(1, theta=0.3)
```

Generated gate methods keep their concise positional form and also accept
semantic qubit keywords: `h(0)` and `h(qubit=0)` are equivalent, `cx(0, 1)` and
`cx(control=0, target=1)` are equivalent, and symmetric two-qubit gates use
`qubit1=` and `qubit2=`. Duplicate, conflicting or missing qubit arguments fail
before instructions are added.

## Target-independent optimization

Compiler optimization is an expert-facing, target-independent transformation
that returns new IR and leaves the input unchanged:

```{code-block} python
import flagquantum as fq
import flagquantum.compiler as compiler

circuit = fq.Circuit(2).h(0).h(0).cx(0, 1)
optimized_ir = compiler.optimize(circuit)
result = fq.run(optimized_ir)
```

## Target-aware compilation and routing

When a concrete topology matters, provide an explicit coupling map:

```{code-block} python
import flagquantum.compiler as compiler

coupling = compiler.CouplingMap.line(circuit.n_qubits)
compiled_ir = compiler.compile(
    circuit,
    coupling_map=coupling,
    routing_strategy="auto",
)
```

The compiler emits only topology-valid two-qubit operations and records its
routing decision in `compiled_ir.metadata["routing"]`. It does not select or
invoke an execution backend.

`fq.compile(circuit, compiler="qsteed", target="quafu:<backend>")` is the direct
compiler-selection journey: it produces IR that retains logical wire numbers
and carries an ordered physical mapping into deployment.

## IR serialization and validation

FlagQuantum IR is versioned, serializable and validated. `fq.CircuitIR` is part
of the stable surface, and `fq.IR_VERSION`, `fq.IRSerializationError` and
`fq.IRValidationError` describe the boundary. Incompatible schema changes
require an explicit migration.

## Errors

Catch stable lifecycle categories from `flagquantum.errors`:

```{code-block} python
import flagquantum as fq
import flagquantum.errors as fqe

try:
    result = fq.run(fq.plan(circuit))
except fqe.ValidationError:
    ...  # invalid semantic input
except fqe.PlanningError:
    ...  # stale, tampered or incompatible plan
except fqe.CapabilityError:
    ...  # requested capability is unavailable
except fqe.ExecutionError:
    ...  # execution or training failure
```

All categories inherit `FlagQuantumError` and their compatible Python built-in
exception. Wrong Python types and unknown keyword arguments continue to raise
`TypeError`.
