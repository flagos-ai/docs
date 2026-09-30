# Profiler Integration

`torch.profiler` supports the `flagos` device through a device tracer compiled into the wheel. A trace from `torch.profiler.profile(activities=[CPU, PrivateUse1])` is structurally equivalent to the trace of the same workload on `torch.cuda`:

- **Flow arrows** connect each CPU operator to the device kernel it launched.
- **Device time attribution**: `prof.key_averages()` reports a per-operator `self_device_time_total`.
- **Complete kernel metadata** (grid/block, occupancy, shared memory, register count) and demangled kernel names.
- **Runtime events** carry real API names decoded from the callback id rather than a placeholder.
- **memcpy and memset** activities are collected alongside kernels.

## Three-layer architecture

Adding a vendor means writing one file: a tracer that satisfies the vendor-agnostic interface.

| Layer | Files | Responsibility |
|---|---|---|
| Vendor-agnostic interface | `csrc/profiler/device_tracer.h` | `DeviceTracer`, `DeviceEvent`, `EventKind` — the complete contract a vendor implements |
| Vendor tracers | `cupti_device_tracer.cc`, `cann_device_tracer.cc`, `musa_mupti_device_tracer.cc`, `roctracer_device_tracer.cc`, `gcu_topspti_device_tracer.cc`, `unavailable_device_tracer.cc` | One implementation per accelerator, plus an explicit no-device-activity fallback |
| Generic adaptor | `flagos_kineto_profiler.{h,cc}` | Kineto/PyTorch profiler adaptor with zero vendor coupling; `dlopen` shims (`cupti_shim.h`, `mupti_shim.h`, `topspti_shim.h`, `roctracer`) bind the vendor activity library |

| Accelerator | Activity API | Status |
|---|---|---|
| NVIDIA CUDA | CUPTI | Stable, parity suite in CI |
| MetaX | MCPTI (CUDA-compatible activity API in MACA) | Experimental: all seven parity assertions passed on C550 + MACA 3.8.0 (local validation, no vendor runner in CI) |
| Ascend | MSPTI | Beta: kernel/runtime/flow/memcpy events plus device-time linkage, CI-covered by the shared contract; the parity suite itself is not in CI |
| Hygon DCU | ROCtracer | Beta: parity suite runs in CI |
| Moore Threads MUSA | MUPTI | Experimental: device timeline measured on MTT S5000; CPU-Kineto linkage is environment-dependent |
| Enflame GCU | TOPSPTI | Runtime only: TOPSPTI collects activities, but a CPU-only Kineto build supplies no PrivateUse1 resolver, so activities do not surface as device events |
| Other | `unavailable_device_tracer.cc` | Explicit no-device-activity fallback |

## Correlation ids

A trace carries two independent numbering schemes, both called "correlation". They look alike and mean different things:

| | `correlation_id` | `external_correlation_id` |
|---|---|---|
| Whose id | The activity API's | PyTorch's |
| Pairs what | A runtime call with the device kernel it produced | A device/runtime activity with the CPU operator that issued it |
| Used for | Drawing flow arrows | Device time attribution |
| Trace field | `args["correlation"]` | `args["External id"]` |

Passing the wrong one fails silently: the trace still renders, flow arrows disappear, and `self_device_time_total` reads 0. The device-time value must be resolved through the `getLinkedActivity` callback (external id), while flow arrows are keyed on the activity correlation id.

## Debugging

| Variable | Default | Purpose |
|---|---|---|
| `FLAGOS_TRACE` | `0` | Verbose logging in the device profiler shim: event draining, capture window, tracer binding and registration |
| `FLAGOS_TRACER_LIBRARY` | auto-discovered | Override the tracer library the profiler shim `dlopen`s when the default path does not match the installed driver |

Two warnings are deliberately not gated by `FLAGOS_TRACE` — an empty linked-activity callback and an activity-record layout mismatch — because both silently zero device time.

## Parity test and baseline

`tests/integration/test_profiler_parity.py` compares a `flagos` trace against a baseline captured on native `torch+cuda`. All seven assertions check structure, never counts or durations:

| # | Assertion | What it checks |
|---|---|---|
| 1 | `test_category_coverage` | The `flagos` trace emits every category the `torch.cuda` baseline does |
| 2 | `test_flow_arrows_are_paired` | Every flow-arrow start half has a matching finish half |
| 3 | `test_arg_key_supersets` | Each category's argument keys are a superset of the baseline's |
| 4 | `test_device_time_attribution` | An operator's `self_device_time_total` reconciles with the duration of the device events it owns |
| 5 | `test_kernel_names_are_demangled` | No bare mangled C++ symbols |
| 6 | `test_runtime_names_come_from_cbid` | Runtime event names are decoded from the callback id |
| 7 | `test_capture_window_containment` | No device or runtime event escapes the capture window |

The baseline lives in `tests/data/profiler_cuda_baseline.json`. Assertion 2 is deliberately stricter than upstream `torch.cuda`: it is a PyTorch-Plugin-FL invariant, kept because a regression into dangling flow halves is exactly the bug it guards against.

## Known gaps

- The `overhead` activity category is not collected: it measures the cost of profiling itself rather than the user's workload. It is recorded as a known gap in the baseline rather than omitted silently.
- MetaX MCPTI runtime callback ids are not NVIDIA CUPTI ids; the tracer uses the MetaX callback namespace and defers API-name resolution until after activity flushing, because calling the resolver from the buffer callback can deadlock the profiler. The scanner has not been validated across multiple MetaX SDK versions, devices, or non-default streams.
- Enflame GCU profiler support is runtime-only — see the table above.
