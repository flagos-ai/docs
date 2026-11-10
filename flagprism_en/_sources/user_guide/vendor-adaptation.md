# FlagPrism Profiler and Debugger Chip Vendor Adaptation Requirements

## 1. Goal

The environment preparation uses the FlagTree development container corresponding to the chip; the detailed steps are given in the user manual of that backend. The LLVM and SDK environment follows the configuration of the corresponding FlagTree container.

After the chip adaptation is complete, the following must be supported:

- Profiler starts and stops chip performance collection, and obtains kernel execution information and hardware metrics;
- Debugger allocates device debug memory, passes the debug pointer to the kernel, and retrieves the debug data after the kernel executes;
- when Profiler or Debugger is not enabled, the compilation and execution behavior of the kernel is not changed.

Among them, the chip hardware performance information depends on the Profiler capability provided by the vendor. The vendor must provide a performance collection API or command-line tool, and provide parseable results. FlagPrism is responsible for invoking the vendor Profiler, correlating Triton operators, and converting the results into a unified format.

### 1.1 Information sources

The information in the current design is divided into three categories:

| Category | Information that can be obtained | Depends on vendor Profiler |
| --- | --- | --- |
| Basic instrumentation information | kernel and operator name, source location, operator ID, data type, shape, layout, access type | No |
| Numerical summary | element count, NaN count, Inf count, zero count, mean of finite values, minimum, maximum, L2 Norm | No |
| Chip performance information | kernel device execution time, compute unit utilization, bandwidth, cache, instruction statistics, hardware counters | Yes |

After the instrumentation, compilation, and runtime integration of Debugger are completed, FlagPrism can collect basic instrumentation information and numerical summaries; see Section 3 for specific requirements.

The scope of chip performance metrics is determined by the vendor. Metrics not provided by the vendor are marked as unsupported or unavailable, and do not affect the collection of basic instrumentation information and numerical summaries.

## 2. Profiler adaptation interfaces

Profiler adaptation is divided into three steps:

```text
1. Declare which metrics the vendor supports, and generate the collection configuration for this run
                         ↓
2. Start the vendor Profiler, and collect data while the program is running
                         ↓
3. Parse the vendor output, and generate unified kernel performance results
```

The three steps correspond to 2.1, 2.2, and 2.3 respectively. The main flow of runtime collection is:

```text
makePlan → configure the collector → doStart → startOp/stopOp → doFlush → doStop → import
```

### 2.1 Declare capabilities and generate the collection configuration

`VendorAdapter` is responsible for stating which metrics the vendor supports, and converting the user request into the collection configuration actually used in this run.

Implement the following 6 interfaces:

```cpp
class VendorAdapter {
public:
  // Return the backend name, for example "cann".
  virtual std::string getName() const = 0;

  // Return the device type.
  virtual DeviceType getDeviceType() const = 0;

  // Return the names of the supported hardware metrics.
  virtual std::vector<std::string>
  getSupportedVendorMetrics() const = 0;

  // Generate the actual collection plan according to the user request.
  virtual VendorProfilePlan
  makePlan(const VendorProfileOptions &options) const = 0;

  // Return the chip Profiler instance.
  virtual Profiler *getRuntimeProfiler() const = 0;

  // Create the performance data importer.
  virtual std::unique_ptr<VendorMetricsImporter>
  createImporter() const = 0;
};
```

Among them, `getRuntimeProfiler()` returns the collection object in 2.2, and `createImporter()` returns the parsing object in 2.3.

When the collection plan needs to be passed to the runtime collector, `configureRuntimeProfiler(profilerPath, plan)` can be overridden; this interface already has a default implementation.

#### Collection plan (VendorProfilePlan)

`makePlan()` generates the collection configuration `VendorProfilePlan` for this run according to the user request and the scope supported by the vendor.

The user request `VendorProfileOptions` contains:

- whether to collect basic kernel runtime information;
- the hardware metrics to be collected;
- vendor parameters such as device ID and output location.

The `VendorProfilePlan` returned by `makePlan()` contains:

- the metrics actually enabled in this run;
- the metrics that cannot be enabled in this run;
- the configuration passed to the vendor Profiler;
- the reasons why the metrics cannot be enabled.

For example, if the user requests `aicore`, `bandwidth`, and `cache`, while Ascend currently supports only the first two, the generated plan is:

```text
enabled  = [aicore, bandwidth]
disabled = [cache]
reason   = [the current Profiler does not support the cache metric]
```

Subsequent collection and result parsing both use the same plan.

### 2.2 Start collection and mark operators

This stage is responsible for invoking the vendor Profiler, and adding markers at the start and end of Triton operators.

Implement the following interfaces:

```cpp
class Profiler {
protected:
  // Start chip performance collection.
  virtual void doStart() = 0;

  // Flush the currently collected data.
  virtual void doFlush() = 0;

  // Stop collection and release resources.
  virtual void doStop() = 0;

  // Set collection parameters such as device, metrics, and output directory.
  virtual void doSetMode(
      const std::vector<std::string> &options);
};
```

In order to correlate Triton operators with chip-side performance events, the following must also be implemented:

```cpp
class OpInterface {
public:
  // The operator starts executing.
  virtual void startOp(const Scope &scope) = 0;

  // The operator finishes executing.
  virtual void stopOp(const Scope &scope) = 0;
};
```

Data should be flushed before collection is stopped, so that the collected events can be imported later.

### 2.3 Parse vendor performance data

The purpose of this interface is to convert the raw results of the vendor Profiler into unified results that FlagPrism can read.

The raw results may come from memory data collected at runtime, or from files exported by vendor tools. When an external tool is used, the tool invocation and the result import must both be completed, and errors must be reported when execution fails.

Implement the following interface:

```cpp
class VendorMetricsImporter {
public:
  virtual std::string getName() const = 0;

  virtual VendorProfileArtifact import(
      const SessionProfileMetadata &metadata,
      const VendorProfilePlan &plan) const = 0;
};
```

The three structures used by the import interface are defined by FlagPrism. With default values omitted, the structures are as follows:

```cpp
// Basic information of this collection, passed by FlagPrism to the vendor Importer.
struct SessionProfileMetadata {
  uint32_t schemaVersion;                    // data format version
  std::string runId;                         // run ID of this run
  std::string sessionName;                   // session name
  std::string backend;                       // chip backend name
  std::string profilerName;                  // Profiler name
  std::string context;                       // context mode
  std::string data;                          // output data type
  std::string hook;                          // hook type
  std::string mode;                          // raw collection mode passed in by the user
  bool runtimeBaseEnabled;                   // whether to collect basic kernel runtime information
  std::vector<std::string> vendorMetricsRequested; // vendor metrics requested by the user
  std::vector<std::string> vendorMetricsEnabled;   // vendor metrics actually enabled in this run
  std::vector<std::string> degradeReasons;   // known degradation reasons
  std::map<std::string, std::string> config; // vendor configuration and raw result location
  RuntimeVersionInfo versions;               // driver and Runtime versions
  DeviceSnapshot device;                     // device ID, name, architecture, and other information
};

// The collection configuration actually executed in this run, generated by makePlan().
struct VendorProfilePlan {
  VendorProfileOptions requested;            // original user request and vendor parameters
  bool runtimeBaseEnabled;                   // whether to collect basic kernel runtime information
  std::vector<std::string> enabledVendorMetrics;  // metrics actually enabled
  std::vector<std::string> disabledVendorMetrics; // metrics that cannot be enabled
  std::vector<std::string> degradeReasons;   // reasons why the metrics cannot be enabled
};

// The unified result returned by the vendor Importer.
struct VendorProfileArtifact {
  uint32_t schemaVersion;                    // data format version
  std::string backend;                       // chip backend name
  std::string importer;                      // Importer name
  std::vector<VendorMetricRequest> requestedMetrics; // metrics requested by the user
  std::vector<std::string> enabledMetrics;   // metrics actually collected
  std::vector<std::string> rawInputs;        // vendor raw files that were read
  std::vector<std::string> degradeReasons;   // parsing and correlation failure reasons
  std::vector<VendorMetricAssociation> associations; // kernel events and their metrics
};
```

Among them:

- `VendorProfileOptions` contains the raw user mode, the metric list, and vendor parameters;
- `VendorMetricAssociation` contains a kernel event, the collection status, the metric list, and an error description;
- a kernel event contains the kernel name, device ID, stream ID, task/correlation ID, and the start and end times.

`metrics` stores the performance data provided by the vendor, for example:

```text
ai_core_utilization = 85.2
memory_bandwidth_gbps = 720.5
cache_hit_rate = 0.91
```

The following must be completed inside `import()`:

- read the data collected at runtime or the files exported by the vendor tool;
- convert the times uniformly to nanoseconds;
- correlate the metrics with the kernel or operator;
- mark whether each metric was collected successfully;
- give reasons for data that is unsupported, not collected, or unable to be correlated.

Each metric should state its source, unit, and statistical scope, and should distinguish host time from device time, theoretical occupancy from measured utilization, and the statistics of a single kernel from those of the entire collection scope.

### 2.4 Ascend implementation approach

The implementation approach on Ascend is as follows:

1. the backend name is `cann`, and the device type is `ASCEND`;
2. start performance collection through `aclprofInit`, `aclprofCreateConfig`, and `aclprofStart`;
3. mark the start and end of operators through MSTX Range, and save the relationship between operator IDs and Range IDs;
4. stop collection through `aclprofStop`, `aclprofDestroyConfig`, and `aclprofFinalize`;
5. export the performance data through `msprof`;
6. parse the exported data, and correlate metrics such as AI Core, bandwidth, and execution time with the corresponding operators;
7. when the CANN or MSTX interfaces are unavailable, state in the results that the corresponding metrics were not collected successfully.

## 3. Debugger adaptation interfaces

### 3.1 Device runtime interfaces

Implement the following 11 interfaces:

```cpp
class RuntimeBackendAdapter {
public:
  // Return the driver kind, the backend name, and the current availability.
  virtual TransferDriverKind driverKind() const = 0;
  virtual const char *name() const = 0;
  virtual bool isAvailable() const = 0;

  // Allocate and free device memory.
  virtual void *allocateDevice(size_t bytes) = 0;
  virtual void freeDevice(void *ptr) = 0;

  // Allocate and free host memory.
  virtual void *allocateHost(size_t bytes) = 0;
  virtual void freeHost(void *ptr) = 0;

  // Initialize device memory.
  virtual void memsetDevice(
      void *ptr,
      int value,
      size_t bytes,
      uint64_t streamHandle) = 0;

  // Host-to-device data transfer.
  virtual void copyHostToDevice(
      void *deviceDst,
      const void *hostSrc,
      size_t bytes,
      uint64_t streamHandle) = 0;

  // Device-to-host data transfer.
  virtual void copyDeviceToHost(
      void *hostDst,
      const void *deviceSrc,
      size_t bytes,
      uint64_t streamHandle) = 0;

  // Wait for the specified stream to complete.
  virtual void synchronize(uint64_t streamHandle) = 0;
};
```

In multi-device scenarios, if the runtime needs to switch devices explicitly, `setDevice(uint32_t deviceId)` should also be overridden, to ensure that memory allocation and transfers use the device on which the kernel resides.

The interfaces must satisfy:

- device memory can be read and written directly by the kernel;
- host memory supports data transfer between the device and the host;
- when a valid stream is passed in, data transfers and the kernel keep the correct order on the same stream;
- the host starts reading the debug data only after synchronization is complete;
- all memory and runtime resources are released after debugging ends.

### 3.2 Kernel compilation and launch requirements

In addition to the C++ interfaces above, the chip compiler and launcher must also support:

1. adding one device pointer parameter `__debug_ctrl_ptr` for kernels with Debugger enabled;
2. the launcher allocating and initializing the debug buffer before the kernel is launched;
3. the launcher passing the device address of the debug buffer to the kernel as the last parameter;
4. the kernel writing debug records into that buffer;
5. copying the buffer back to the host after the kernel finishes executing;
6. not adding this parameter when Debugger is not enabled;
7. recording the overflow status when the debug buffer is full, without writing out of bounds.

In the initial stage of integration, the L1 numerical summary can be implemented first, including statistics such as NaN, Inf, maximum, minimum, and mean; L2 additionally needs to support the collection and transfer back of complete tensors.

If memory access address collection needs to be supported, the pointers in the kernel also need to be converted to actual device addresses, and an address summary of the valid threads or a complete address list must be output.

### 3.3 Ascend implementation approach

The Debugger Runtime on Ascend uses the following CANN interfaces:

| Function | Ascend implementation |
| --- | --- |
| Allocate device memory | `aclrtMalloc` |
| Free device memory | `aclrtFree` |
| Allocate host memory | `aclrtMallocHost` |
| Free host memory | `aclrtFreeHost` |
| Initialize device memory | `aclrtMemset` or `aclrtMemsetAsync` |
| Copy from host to device | `aclrtMemcpy` or `aclrtMemcpyAsync` |
| Copy from device to host | `aclrtMemcpy` or `aclrtMemcpyAsync` |
| Wait for stream completion | `aclrtSynchronizeStream` |

The overall flow is as follows:

1. allocate the debug buffer with `aclrtMalloc`;
2. initialize the buffer header and record area;
3. pass the device address of the buffer to the kernel as `__debug_ctrl_ptr`;
4. the kernel writes debug records such as numerical summaries and address information into the buffer;
5. after the kernel ends, copy the buffer to the host on the same CANN stream;
6. call `aclrtSynchronizeStream` to wait for the copy to complete;
7. the host parses the debug records and frees the device and host memory.

## 4. Error handling requirements

- the return value of every chip Runtime or Profiler API call must be checked;
- error messages must include the name of the failing interface and the error code;
- unsupported performance metrics must be clearly marked as unsupported;
- metrics that cannot be correlated with a kernel must be clearly marked as uncorrelated;
- placeholder zero values must not be used to disguise a successful collection;
- when memory allocation, data transfer, or kernel parameters are inconsistent, this debug session must be stopped and an error returned.

## 5. Correspondence between interfaces and code files

The following code can be used as a reference. The Profiler files show the collection implementations of each vendor; the four Debugger Runtime Adapters are all located in [TransferEngine.cpp](https://github.com/flagos-ai/FlagPrism/blob/main/Debugger/lib/Runtime/TransferEngine.cpp), and can be found by the class names in the table.

| Chip | Profiler reference code | Debugger Runtime class name |
| --- | --- | --- |
| Enflame | [EnflameProfiler.cpp](https://github.com/flagos-ai/FlagPrism/blob/main/Profiler/csrc/lib/Profiler/Vendor/EnflameProfiler.cpp): TOPSPTI collection | `EnflameRuntimeBackendAdapter` |
| Moore Threads | [MthreadsProfiler.cpp](https://github.com/flagos-ai/FlagPrism/blob/main/Profiler/csrc/lib/Profiler/Vendor/MthreadsProfiler.cpp): runtime collection | `MusaRuntimeBackendAdapter` |
| Ascend | [CannProfiler.cpp](https://github.com/flagos-ai/FlagPrism/blob/main/Profiler/csrc/lib/Profiler/Vendor/CannProfiler.cpp): CANN/MSTX collection and msprof export | `CannRuntimeBackendAdapter` |
| NVIDIA | [CuptiProfiler.cpp](https://github.com/flagos-ai/FlagPrism/blob/main/Profiler/csrc/lib/Profiler/Cupti/CuptiProfiler.cpp): CUPTI collection; [NvidiaHardwareCounters.cpp](https://github.com/flagos-ai/FlagPrism/blob/main/Profiler/csrc/lib/Profiler/Cupti/NvidiaHardwareCounters.cpp): hardware counters | `CudaRuntimeBackendAdapter` |

### 5.1 Profiler

| Item | Interface definition or common structure | Vendor implementation and wiring location |
| --- | --- | --- |
| Vendor capabilities and collection plan | `Profiler/csrc/include/Profiler/Vendor/Adapter.h`, `Profiler/csrc/include/Profiler/Vendor/Mode.h` | add `<Vendor>Adapter.h/.cpp`; for Ascend, `CannAdapter.h/.cpp` |
| Start, flush, and stop collection | `Profiler/csrc/include/Profiler/Profiler.h` | add `<Vendor>Profiler.h/.cpp`; for Ascend, `CannProfiler.h/.cpp` |
| Operator start and end markers | `OpInterface` in `Profiler/csrc/include/Context/Context.h` | implement `startOp()` and `stopOp()` in `<Vendor>Profiler.cpp` |
| Vendor data import | `VendorMetricsImporter` in `Profiler/csrc/include/Profiler/Vendor/Adapter.h` | implement in `<Vendor>Adapter.cpp` or in a separate Importer file; the Ascend implementation is in `CannAdapter.cpp` and `CannProfiler.cpp` |
| Unified result structure | `Profiler/csrc/include/Data/Artifacts.h` | the Importer fills in `VendorProfileArtifact` |
| Device type | `Profiler/common/include/Device.h` | add the vendor device type, and wire it into the device query implementation |
| Adapter registration | `VendorAdapterRegistry` in `Profiler/csrc/include/Profiler/Vendor/Adapter.h` | modify `Profiler/csrc/lib/Profiler/Vendor/Adapter.cpp` |
| Automatic Profiler backend selection | Python `backend` selection logic | modify `Profiler/python/flagtree_profiler/profile.py` |
| Compilation integration | backend registration and CMake source file lists in `cmake/FlagPrism.cmake` | register the new backend, and modify `Profiler/csrc/CMakeLists.txt` or `Profiler/csrc/lib/Profiler/CMakeLists.txt` according to where the source files belong |

### 5.2 Debugger

| Item | Interface definition or common structure | Vendor implementation and wiring location |
| --- | --- | --- |
| Backend kind and debug record format | `Debugger/include/Debugger/Common/Protocol.h` | add the vendor `BackendKind` |
| Transfer driver kind | `Debugger/include/Debugger/Runtime/TransferEngine.h` | add the vendor `TransferDriverKind` |
| Device memory and data transfer interfaces | `Debugger/lib/Runtime/BackendAdapter.h` | implement `<Vendor>RuntimeBackendAdapter`; the Ascend implementation is located in `Debugger/lib/Runtime/TransferEngine.cpp` |
| Runtime Adapter creation | `createRuntimeBackendAdapter()` | add the vendor branch in `Debugger/lib/Runtime/TransferEngine.cpp` |
| Hidden parameter and debug record lowering | Debugger instrumentation passes | modify `Debugger/lib/Instrumentation/Passes.cpp` |
| Compilation stage integration | Debugger compiler callback | modify `Debugger/python/flagtree_debugger/compiler.py`; modify `Debugger/python/CompilerBindings.cpp` when new C++ bindings need to be added |
| Debug buffer preparation and export | Debugger Python Runtime | modify `Debugger/python/flagtree_debugger/api.py` |
| FlagTree common launch interface | FlagTree Host gateway | `FlagTree/python/triton/_flagprism.py` |
| Chip launcher wiring | each chip backend driver | call the Debugger launch context in the chip backend `driver.py`; for Ascend, `FlagTree/third_party/ascend/backend/driver.py` |
| Vendor SDK detection and linking | Debugger Runtime CMake | add a vendor CMake file, and modify `Debugger/lib/Runtime/CMakeLists.txt` and `Debugger/lib/CMakeLists.txt`; for Ascend, `Debugger/lib/Runtime/CANN.cmake` |

Existing FlagTree compiler callbacks and launch interfaces should be reused with priority; when a new backend has not yet been integrated, the corresponding compilation and launch integration should be completed on the FlagTree side, and the collection and parsing logic should be placed in FlagPrism.

## 6. Validation

After adaptation, on the target chip, enter the FlagPrism repository root and run the unified operator acceptance test:

```bash
python3 test.py
```

The test runs Debugger L1, Debugger L2, and Profiler in sequence; each stage compares the operator output with the CPU reference result, and checks the corresponding collection results. Profiler acceptance requires a real kernel device execution time.

Multi-card testing can use `python3 test.py --devices 0,1 --jobs 2`.

At least 100 operator families are covered by default. When collection fails, the test re-runs the same operator with the tool not enabled: if plain execution also fails, it is recorded as WARNING; if plain execution succeeds, it is recorded as ERROR; errors such as environment initialization or device exceptions are recorded directly as ERROR. The unified acceptance passes when the coverage requirement is met and there is no ERROR, but a WARNING does not mean the collection succeeded.

Results are saved by default under `test-results/<run time>/`; check the PASS, WARNING, and ERROR counts in `summary.json`, as well as the corresponding test logs. Add dedicated tests for new capabilities, checking the values actually collected and the correlation results; when submitting the adaptation, state the scope that actually passes and the known limitations.
