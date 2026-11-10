# Profiler

FlagTree Profiler is a lightweight profiler for Triton. It provides program context, metadata, and hardware performance metrics for the GPU kernels invoked from Python code, and aggregates records into tree, timeline, Hatchet, metadata, and vendor-specific outputs.

## Basic usage

Profile a function:

```python
import flagtree.profiler as profiler

# name: path to the profile data
# context: how each GPU kernel's context is annotated; "shadow" and "python" are supported
session_id = profiler.profile(func, name="profile_name", context="python")(args)
```

Profile a region:

```python
session_id = profiler.start(name="profile_name", context="python")
# ... code to profile ...
profiler.deactivate(session_id)   # skip a region
profiler.activate(session_id)     # restart profiling
# ...
profiler.finalize()               # write profile data and finalize
```

## Scope and metrics

The `python` context reports the file, function, and line where each GPU kernel is invoked. The `shadow` context reports user-annotated regions:

```python
import flagtree.profiler as profiler

session_id = profiler.start(name="profile_name", context="shadow")
with profiler.scope("test0"):
    with profiler.scope("test1"):
        foo[1,](x, y)
with profiler.scope("test2"):
    foo[1,](x, y)
profiler.finalize()
```

`scope` accepts a dictionary of custom metrics (metric name -> int/float), which are aggregated per scope and written to the profile data:

```python
with profiler.scope("test0", {"bytes": 1000}):
    ...
```

`cpu_timed_scope` works like `scope` but additionally records the CPU time of the scope as the `cpu_time` metric:

```python
with profiler.cpu_timed_scope("test"):
    foo[1,](x, y)
```

You can also annotate call paths with `state`. Unlike `scope`, a state is not recursive and the innermost state overwrites the outer one; it is appended as a suffix above each kernel name and works with both contexts:

```python
with profiler.scope("test"):
    with profiler.state("state0"):
        with profiler.scope("test0"):
            foo0[1,](x, y)
        with profiler.scope("test1"):
            foo1[1,](x, y)
```

## Backends and modes

FlagTree Profiler supports seven backends:

| Backend | Target | Notes |
| --- | --- | --- |
| `nvidia` | NVIDIA GPUs | Default NVIDIA backend; in-process CUPTI activity stream with launch geometry, kernel duration, memory transfer, and hardware-counter metrics. |
| `cupti` | NVIDIA GPUs | Legacy NVIDIA collector; supports `pcsampling` (instruction sampling). |
| `roctracer` | AMD GPUs | Default profiling mode only. |
| `instrumentation` | NVIDIA and AMD | Custom metrics and detailed intra-kernel tracing. |
| `cann` | Ascend | Uses the Ascend vendor adapter and CANN runtime/import path. |
| `mthreads` | Moore Threads | Uses the native MUPTI interface; reports launch geometry, occupancy, resource usage, and peak memory bandwidth. |
| `tianshu` | Tianshu/CoreX | Reuses Debugger instrumentation through the CoreX-compatible driver; imports ixKN CSV output. |

By default the profiler auto-selects `nvidia`, `roctracer`, `cann`, `mthreads`, or `tianshu` based on the active target backend. Select a backend explicitly:

```python
profiler.start(name="profile_name", context="shadow", backend="cupti_pcsampling")
```

### Instruction sampling

Instruction sampling is supported on NVIDIA GPUs via `cupti_pcsampling`; expect roughly 20x end-to-end overhead (mostly from CPU-side transfer and processing), while the overhead on each individual kernel is negligible. The `flagtree-profiler-viewer` options `-i <regex> -d <depth> -t <threshold>` help filter operators of interest.

### Instrumentation

The `instrumentation` backend provides fine-grained, intra-kernel profiling and generates trace or tree views. By default it profiles kernel cycles, which may require shared memory. For DSL-level instrumentation, only Gluon kernels are enabled by default; advanced users can instrument the `ttir` or `ttgir` IR instead.

### Merging profiles

Multiple concurrent sessions using different backends can profile the same region and be merged with Hatchet for postmortem analysis:

```python
profiler.start(name="profile_name0", context="shadow", backend="cupti")
profiler.start(name="profile_name1", context="shadow", backend="instrumentation")
# ...
profiler.finalize()
```

## Launch metadata hook

With `hook="triton"`, the profiler calls a `launch_metadata` function before each kernel launch so you can supply per-kernel metadata:

```python
profiler.start("profile_name", hook="triton")

def metadata_fn(grid, metadata, args):
    return {"name": "<kernel_name>", "flops16": 1.0, "bytes": 0}

@triton.jit(launch_metadata=metadata_fn)
def foo(x, y):
    tl.store(y, tl.load(x))
```

Supported keys are `name`, `flops8`, `flops16`, `flops32`, `flops64`, and `bytes`.

## Command line

```bash
flagtree-profiler [options] script.py [script_args] [script_options]
flagtree-profiler [options] pytest [pytest_args] [script_options]
python -m flagtree.profiler.cli [options] script.py [script_args] [script_options]
```

In command-line mode, `profiler.start` and `profiler.finalize` are called automatically, and only a single session is supported. For the Tianshu/ixKN workflow, use the `flagtree-profiler --ixkn` wrapper because ixKN profiles the target process from startup.

## Visualizing results

By default profiles are written in JSON and can be read by [Hatchet](https://github.com/hatchet/hatchet) (install `llnl-hatchet`; the `hatchet` package is a different API):

```bash
flagtree-profiler-viewer -m time/s <profile.hatchet>
flagtree-profiler-viewer -m time/ns,time/% <profile.hatchet> --print-sorted
flagtree-profiler-viewer -m time/ns,cpu_time/ns <profile.hatchet>
```

To dump the full trace instead of aggregated data, start the profiler with `data="trace"`. The output is in Chrome trace format and can be viewed with `chrome://tracing` or [Perfetto](https://perfetto.dev).

Run `flagtree-profiler-viewer -h` for all options.

## Environment

Runtime environment variables use the `FLAGTREE_PROFILER_*` prefix. The public Python entry point is `flagtree.profiler`, with the native module `flagtree.profiler._native`; CLI tools are `flagtree-profiler` and `flagtree-profiler-viewer`.
