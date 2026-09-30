# PyTorch-Plugin-FL Overview

`torch_fl` is a custom PyTorch device plugin built on the `PrivateUse1` extension mechanism. It registers [FlagGems](https://github.com/flagos-ai/FlagGems) high-performance Triton operators, vendor-native operator libraries, and CUDA compatibility kernels behind one device name: `flagos`.

Accelerator vendors ship different runtimes, compiler stacks, and PyTorch integration strategies. PyTorch-Plugin-FL hides those differences behind a unified runtime and operator-routing layer, so users program against standard PyTorch APIs and a single device name, and the plugin selects a kernel implementation per operator based on platform capability and configuration.

## Design principles

PyTorch-Plugin-FL is built on five principles:

1. **PyTorch-native interface** — Standard PyTorch APIs work unchanged; users target the `flagos` device instead of vendor-specific extensions.
2. **One logical device** — A single device name (`flagos`) abstracts vendor differences. Platform-specific routing happens transparently at the operator level.
3. **Layered operator backends** — Each operation may dispatch to a different implementation. Routing decisions are per operator, not per device or per model.
4. **Reuse before reimplementation** — Established kernels and compiler stacks are integrated where their dispatch and ABI boundaries permit, rather than rewriting functionality that already exists.
5. **Explicit capability boundaries** — Unsupported operations and CPU fallback paths are documented rather than presented as complete native coverage. Status levels distinguish validated support from experimental integrations.

## Quick start

```python
import torch
import torch_fl

# Create a tensor on the flagos device
x = torch.randn(4, 4, device="flagos:0")

# Operations route to platform-appropriate kernels
y = torch.relu(x @ x)

# Move the result back to CPU
print(y.cpu())
```

Operator routing (FlagGems compiler kernels, vendor-native kernels, compatibility boxing, or CPU fallback) is determined by platform detection and runtime configuration. The code above works unchanged across all supported accelerators.

## Status levels

| Status | Meaning |
|---|---|
| Stable | Critical paths are continuously tested and the supported version combination is documented. |
| Beta | The primary path is validated, but coverage, packaging, or release procedures are not yet stable. |
| Experimental | Validation exists for a specific setup, model, or hardware environment; interfaces or build procedures may change. |
| Runtime only | Device runtime support exists, but the platform is not a general eager operator backend. |

A capability existing in the PyTorch-Plugin-FL codebase does not imply that every platform implements or validates it. See the {doc}`compatibility matrix <../reference/compatibility>` for per-platform detail.

```{toctree}
:maxdepth: 2

features.md
architecture.md
```
