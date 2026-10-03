# Quick start

This page shows platform-independent usage. After installing for your platform (see {doc}`Installation <installation>`), the same code runs on every supported accelerator.

## Basic usage

```python
import torch
import torch_fl

x = torch.randn(4, 4, device="flagos:0")
y = torch.relu(x @ x)
print(y.cpu())
```

The tensors are created on the first `flagos` device, the matrix multiply and activation are routed to platform-appropriate kernels, and the result is copied back to the CPU for printing.

## Moving tensors between devices

```python
import torch
import torch_fl

x = torch.randn(4, 4)            # CPU tensor
x_flagos = x.to("flagos")        # device 0
x_flagos_1 = x.to("flagos:1")    # device 1

y = torch.randn(4, 4, device="flagos")
y_cpu = y.cpu()                  # back to CPU
```

## Selecting a device

`torch.flagos.device()` sets the current-device context, so a later `device="flagos"` tensor lands on it:

```python
import torch
import torch_fl

with torch.flagos.device(0):
    x = torch.randn(4, 4, device="flagos")

with torch.flagos.device(1):
    y = torch.randn(4, 4, device="flagos")
```

## Synchronization

Kernel launches are asynchronous, as on any other PyTorch device:

```python
import torch
import torch_fl

x = torch.randn(1000, 1000, device="flagos")
y = x @ x                 # enqueued, not necessarily finished
torch.flagos.synchronize()  # wait for the device to drain
```

## Device queries

```python
import torch
import torch_fl

if torch.flagos.is_available():
    print(f"Found {torch.flagos.device_count()} device(s)")
    print(f"Current device: {torch.flagos.current_device()}")

    props = torch.flagos.get_device_properties(0)
    print(f"Device name: {props.name}")
    print(f"Total memory: {props.total_memory / 1024**3:.2f} GB")
else:
    print("No flagos devices available")
```

If `device_count()` reports 0 on a machine with a working driver, see {doc}`Troubleshooting <../reference/troubleshooting>`.

## Operator routing

Operations on `flagos` tensors are dispatched per operator, not per device or per model:

- **Portable compiler kernels** — FlagGems Triton kernels, where the platform's route enables them
- **Native vendor kernels** — the vendor operator library (ACLNN, topsaten, mudnn, …)
- **Compatibility boxing** — generated kernels delegating to an external vendor `libtorch` (CUDA, MetaX, PPU, DCU)
- **CPU fallback** — a correctness-first CPU implementation for operators with no device kernel, copied back to the device

Routing is transparent: no code change is needed when moving between platforms or kernel sources. To see which backend served a given call, set `FLAGOS_LOG=dispatch` (see the {doc}`environment variable reference <../reference/environment-variables>`).

## Next steps

- {doc}`Installation <installation>` — per-platform build and verification
- {doc}`Platform capability matrix <../reference/platform-capability>` — what each accelerator supports
- {doc}`Dtype support <../reference/dtype-support>` — storage, AMP targets and fallback boundaries
- {doc}`Distributed collectives <../architecture/distributed>` — `ProcessGroupFlagOS`, DDP and FSDP2
- {doc}`Profiler <../architecture/profiler>` — `torch.profiler` integration
