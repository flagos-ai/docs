# Release Notes

FlagPrism is FlagTree's debugging and profiling tool suite for Triton programs. It ships as part of the FlagTree wheel through the `third_party/FlagPrism` submodule; standalone debugger/profiler wheels are not published.

- **Debugger** — inspect values, memory access, and op execution inside `@triton.jit` kernels via `flagtree.debugger` and in-kernel `ftl.debug_collect_start/end` markers. Exports statement-level reports, IR op-level reports, and NumPy tensor artifacts, with optional device timelines.
- **Profiler** — profile functions or code regions with `flagtree.profiler`, annotated scopes, and custom metrics. Supports NVIDIA, AMD, Ascend, Moore Threads, and Tianshu backends, provides `flagtree-profiler` and `flagtree-profiler-viewer` CLI tools, and writes Hatchet-compatible JSON (plus Chrome trace output).
- **Vendor adaptation** — documented interfaces and requirements for bringing the Debugger and Profiler to new chip vendors.
