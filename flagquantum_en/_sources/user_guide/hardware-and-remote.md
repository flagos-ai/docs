# Hardware and remote targets

FlagQuantum runs the same program on locally controlled resources and on
external execution destinations. The two are named differently on purpose:
`ExecutionOptions` describes the current process's devices, while `target`
names an external system.

## FlagOS accelerators through Torch-FL

`flagquantum` depends on PyTorch, not Torch-FL. Importing FlagQuantum, querying
backends or running CPU and CUDA never imports `torch_fl`; the optional provider
is activated only when `flagos` is explicitly selected, and an absent or
incompatible Torch-FL installation fails at activation with a diagnostic error
instead of disabling CPU or CUDA.

```{code-block} python
import flagquantum as fq

result = fq.run(
    circuit,
    options=fq.ExecutionOptions(device="flagos:0"),
)
```

All domestic accelerator ownership stays in Torch-FL: it identifies the vendor
and the runtime, and exposes the route through the `flagos` contract.
FlagQuantum records Torch-FL runtime identity and route evidence without
duplicating vendor branches. CUDA remains the only accelerator selected
automatically; `flagos` requires explicit selection.

The packaged operator profile is enforced before local statevector execution on
`flagos`: device names and environment hints are not accepted as verified
evidence. A single-card certification harness collects a provisioner-attested
execution candidate, and a successful run remains a review candidate rather
than automatic hardware certification.

## Remote jobs

Renderer-side submission is convenient for Notebooks: `fq.run()` waits for a
result, while `fq.submit()` returns as soon as preparation and the provider's
acknowledgement finish, so the kernel stays available while a task is queued.

```{code-block} python
import flagquantum as fq

job = fq.submit(fq.Circuit(2).x(0), target="quafu:Baihua", shots=1024)
job.save("quafu-job.json")
print(job.id)
```

```{code-block} python
state = job.status()
if state == "succeeded":
    result = job.result()
    print(result.counts)
```

`status()` queries once and never counts unknown or missing states as success.
`result()` does not poll: use `job.wait(timeout=...)` to block deliberately.
Receipts are credential-free JSON, and restoring one never resubmits the task.
A Jiuding workspace provides low-latency remote compute for the same observable
interface:

```{code-block} python
result = fq.run(
    circuit,
    target="jiuding:gpu",
    outputs=(fq.samples(wires=(0, 1)), fq.counts(wires=(0, 1))),
    shots=1024,
)
```

Sampling and count reduction execute without returning the full statevector;
inspect `result.runtime` and `result.provenance` for the selected device,
result transfer, counts aggregation and any CPU-fallback evidence.

## Real quantum hardware

Naming a compiler and a provider target explicitly keeps the journey
fail-closed — the path never selects or substitutes a compiler or provider
implicitly:

```{code-block} python
result = fq.run(
    circuit,
    compiler="qsteed",
    target="quafu:Baihua",
    shots=1024,
    name="bell calibration",
)
counts = result.measurement("counts").value[0]
```

The circuit is compiled, packaged, submitted and awaited without changing the
stable `fq.ExecutionResult` return type. `target_qubits` optionally maps logical
wires to physical qubits in order; when provided, compilation fails unless the
current target snapshot proves the selection is valid and connected. One Pauli
expectation can use the same remote entry point, with qubit-wise-commuting terms
measured in separate sealed jobs under one physical mapping.

## Deployment packages

`flagquantum.deployment.create_deployment_package` binds trained parameters,
compiles for a target and seals an auditable package that can be persisted,
signed or submitted later. Preflight validates the program against a target and
identity-checks the exact package without contacting a provider:

```{code-block} python
import flagquantum.deployment as deployment
from flagquantum.services import preflight_deployment

backend = deployment.CloudBackendProfile.simulator(2)
report = preflight_deployment(circuit, backend=backend, shots=1024)
if report.approved_for_submission:
    package = report.package
```

Provider support and credential behaviour vary, and no provider is
release-certified by the capability catalog. Live provider access is required
for remote paths and is not covered by local checks.

## Boundaries

- Keep credentials in the host environment; never put raw tokens, passwords or
  API keys into extension manifests, errors, measurements or serialized
  payloads.
- A receipt is local context, not cryptographic proof of what hardware
  executed.
- Experimental remote adapters have bounded scope: no automatic uploading,
  image builds, multi-GPU or multi-node jobs, log streaming, or automatic
  recovery of partially submitted work.
