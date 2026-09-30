# Distributed Collectives

PyTorch-Plugin-FL provides distributed support for the `flagos` device through `ProcessGroupFlagOS`, a native `torch.distributed.ProcessGroup` subclass. It is registered at import, so `torch.distributed.init_process_group("flagos")` works with no `torch.distributed.*` monkeypatching.

## How it works

`flagos` tensors and the vendor's tensors share the same physical device memory, so a collective only needs a metadata conversion, not a copy:

1. A collective virtual method is called with `privateuseone` tensors.
2. The tensors are converted into the device view the inner backend expects (a zero-copy view over the same `data_ptr`), where the inner backend requires one.
3. The call is delegated to the wrapped inner backend.
4. The inner backend's `Work` object is returned unchanged, so callers and the DDP reducer receive properly typed futures.

`ProcessGroupFlagOS` overrides every collective virtual function — allreduce, allgather (list and into-tensor forms), reduce-scatter, all-to-all (plain and single), broadcast, reduce, gather, scatter, send/recv and their immediate variants, and barrier — rather than a handful of APIs, so a collective cannot silently miss the conversion.

## Backend selection

The inner communication backend is resolved at group-construction time, in priority order:

1. **FlagCX** — the heterogeneous collective library, used when it is importable. FlagCX registers its own backend (`flagcx`) for its own device; `ProcessGroupFlagOS` builds its `ProcessGroupFlagCX` through the `extended_api=True` creator form.
2. **Vendor native** — `NCCL` for NVIDIA and MetaX, `HCCL` for Ascend, `MCCL` for Moore Threads MUSA.
3. **Host-staged gloo** — the last tier and the only one that needs no vendor library; it copies every operand device → host → device per collective. Set `FLAGOS_DIST_STAGED_GLOO=0` to decline this tier and fail loudly instead. One warning is emitted the first time a group is built on it.

Requests that never name the `flagos` backend are handled as well: `torch.distributed` routes any device type it does not recognize to gloo, and a `ProcessGroupGloo` rejects flagos tensors outright. With `FLAGOS_DIST_REDIRECT_GLOO` (on by default) a plain `init_process_group(backend="gloo")` or `new_group` request is answered with the `flagos` backend when the process accelerator is the flagos device.

## Usage

```python
import torch
import torch_fl
import torch_fl.distributed as flagos_dist

# "auto" (default): FlagCX first, vendor-native backend as fallback
# "flagcx": force flagos / FlagCX, falling back to the vendor backend
# "nccl":   force NCCL (NVIDIA, MetaX)
# "hccl":   force HCCL (Ascend)
flagos_dist.init_process_group(backend="auto")

model = MyModel().to("flagos:0")
model = flagos_dist.DistributedDataParallel(model)
flagos_dist.move_buffers_to_device(model, "flagos:0")
```

`torch_fl.distributed` exposes `init_process_group`, `DistributedDataParallel` and `move_buffers_to_device`. With the native backend registered you can equally call `torch.distributed.init_process_group("flagos")` directly, or let it be selected automatically from `device_id=torch.device("privateuseone:0")`.

### DDP

At import, PyTorch-Plugin-FL patches `torch.nn.parallel.DistributedDataParallel.__init__`. When the model lives on a `flagos` device, the patch:

- forces the Python reducer, bypassing the C++ reducer's CUDA assertion, and
- replaces the default gradient-accumulation hook (which uses functional collectives that have no `privateuseone` dispatch) with a version that goes through `dist.all_reduce` and therefore through `ProcessGroupFlagOS`.

`torch.nn.DataParallel` and the functional `torch.nn.parallel.data_parallel` are patched the same way, so their replicas are placed on flagos devices instead of failing on device-type detection.

## Vendor status

| Vendor | FlagCX path | Native fallback | View conversion | Notes |
|---|---|---|---|---|
| NVIDIA | Yes | NCCL | flagos → cuda view | Collectives and DDP gradient sync live-verified on 2x/8x A100 |
| MetaX | Reused | NCCL-shaped MCCL via MACA's libtorch | flagos → cuda view | Not covered by CI |
| Ascend | Recommended primary path | HCCL (custom backend type) | flagos → npu view | No CUDA compatibility layer exists on Ascend. Architectural routing only; no collective-level CI coverage |
| Hygon DCU | Reused | RCCL via DTK | flagos → cuda view | `all_reduce`/DDP measured on 2 cards; not in CI |
| Moore Threads MUSA | Reused | MCCL | flagos → cuda view | Host-staged gloo measured on MTT S5000 |
| Enflame GCU | Primary path | None (FlagCX only) | None needed | Measured on two S60 devices: collectives, barrier, DDP forward/backward and gradient sync, FSDP2 `fully_shard` training and sharded state-dict save/load |

## Limitations

- Collective coverage is validated per vendor; gaps are recorded rather than implied. On Enflame GCU, point-to-point operations, `gather`/`scatter` roots, all-to-all, multi-node rendezvous, process-failure recovery and deployments larger than two devices remain unvalidated.
- Ascend distributed support is architectural: the routing and view logic exist, but there is no collective-level CI coverage.
- The host-staged gloo tier is correctness-first and pays a device-to-host-to-device copy per collective.
