# Debugger

FlagPrism Debugger observes values, memory access, and operation execution inside a Triton kernel. It associates compile-time static metadata with device-runtime records, then exports Triton statement-level reports, IR op-level reports, and level-2 NumPy artifacts. It is used to locate numerical anomalies, abnormal memory access, and in-kernel data-flow issues.

The dynamic collection and hidden-argument launch path is validated on Ascend/CANN9, Tianshu/CoreX 4.4 (LLVM 22), MUSA/mthreads 4.3.5, and NVIDIA CUDA.

## Public API

The only public Python import path is:

```python
import flagtree.debugger as debugger
```

The legacy `triton.debugger` namespace is not provided. Collection boundaries inside a Triton JIT kernel are expressed with FlagTree language extensions:

```python
ftl.debug_collect_start(level=1, addr_level=1)
# Triton operations to collect
ftl.debug_collect_end()
```

`flagtree.debugger` handles Python configuration, compile mode, and export; `ftl.debug_collect_start/end` only marks the IR region to collect inside an `@triton.jit` kernel. Passing `level` to `debug_collect_start` overrides the collection level for that region; `addr_level=None` inherits the level from `activate()`.

## Quick start

```python
from pathlib import Path
import torch
import torch_npu
import triton
import flagtree.debugger as debugger
import flagtree.language as ftl
import triton.language as tl

debugger.configure(
    output_dir=Path("/tmp/flagtree_debugger_example"),
    record_capacity=4096,
    export_raw_records=False,
)
debugger.activate(level=1, addr_level=1)

@triton.jit
def debug_abs_kernel(x_ptr, y_ptr, n: tl.constexpr, BLOCK_SIZE: tl.constexpr):
    offsets = tl.program_id(0) * BLOCK_SIZE + tl.arange(0, BLOCK_SIZE)
    mask = offsets < n
    ftl.debug_collect_start(level=1, addr_level=1)
    x = tl.load(x_ptr + offsets, mask=mask, other=0.0)
    y = tl.abs(x)
    z = y + 1.0
    tl.store(y_ptr + offsets, z, mask=mask)
    ftl.debug_collect_end()

n = 16
x = torch.linspace(-8, 7, n, dtype=torch.float32, device="npu")
y = torch.empty_like(x)
debug_abs_kernel[(1,)](x, y, n, BLOCK_SIZE=16)
torch_npu.npu.synchronize()

for run in debugger.take_exported_runs():
    print("report_path=", run.get("report_path"))
```

Call `debugger.activate()` before compiling the kernel you want to debug. It enables a process-level Debugger pipeline but does not record Python, PyTorch, or `torch_npu` operations; only Triton operations between the collect markers are captured.

## Configuration

`debugger.configure()` changes the defaults used by subsequent `activate()` calls; unspecified fields keep their current values.

```python
debugger.configure(
    output_dir="/tmp/flagtree_debugger_manual",
    record_capacity=4096,
    export_mode="POST_KERNEL_EXPORT",
    export_on_error=False,
    export_raw_records=False,
    timeline=False,
)
```

| Option | Default | Meaning |
| --- | --- | --- |
| `output_dir` | `/tmp/flagtree_debugger_manual` | Report output directory; `None` disables automatic file export. |
| `record_capacity` | `1024` | Device record slot capacity; must be a positive integer. |
| `export_mode` | `POST_KERNEL_EXPORT` | Export after the kernel completes; `STREAMING_EXPORT` is also accepted. |
| `export_on_error` | `False` | Whether to still attempt export after a kernel error. |
| `export_raw_records` | `False` | Whether to additionally write a decoded raw-record sidecar. |
| `timeline` | `False` | Insert device timestamp timeline records on supporting backends. |

Inspect and restore the configuration:

```python
print(debugger.get_config())
debugger.reset_config()
```

## Collection levels

`level` and `addr_level` are collection strategies configured through `activate()`:

```python
debugger.activate(level=1, addr_level=1, timeline=True)
```

- `level=1`: collect numerical summaries.
- `level=2`: collect summaries and export the supported full tensor values.
- `addr_level=0`: do not insert dynamic address collection.
- `addr_level=1`: collect address summaries for load/store.
- `addr_level=2`: when `level=2` and the backend supports the current pointer/mask pattern, additionally export full lane addresses.
- `timeline=True`: collect device-wide nanosecond timestamps (PTX `%globaltimer` on NVIDIA CUDA; `SYS_CNT` on Ascend). Disabled by default to avoid extra device-side record overhead.

For long-running processes, notebooks, or test suites, the pipeline can be turned off when no more debug kernels will be compiled:

```python
debugger.deactivate()
```

## Availability

After a successful import, `debugger.is_available()` reports whether both the compiler and runtime native bindings are present. A core-only wheel (`TRITON_BUILD_FLAGPRISM=OFF`) does not include `flagtree.debugger`.
