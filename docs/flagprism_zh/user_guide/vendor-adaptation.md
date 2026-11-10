# FlagPrism Profiler 与 Debugger 芯片适配需求

## 1. 目标

环境准备使用 FlagTree 对应芯片的开发容器，具体步骤见该后端的使用手册。LLVM 和 SDK 环境沿用对应 FlagTree 容器的配置。

芯片适配完成后，需要支持：

- Profiler 启动和停止芯片性能采集，获取 kernel 执行信息和硬件指标；
- Debugger 分配设备调试内存，将调试指针传给 kernel，并在 kernel 执行后取回调试数据；
- 未开启 Profiler 或 Debugger 时，不改变 kernel 的编译和执行行为。

其中，芯片硬件性能信息依赖厂商提供的 Profiler 能力。厂商需要提供性能采集 API 或命令行工具，并提供可解析的结果。FlagPrism 负责调用厂商 Profiler、关联 Triton 算子，以及将结果转换为统一格式。

### 1.1 信息来源

当前设计中的信息分为三类：

| 类型 | 可以获得的信息 | 是否依赖厂商 Profiler |
| --- | --- | --- |
| 基础插桩信息 | kernel 和算子名称、源码位置、算子 ID、数据类型、shape、layout、访存类型 | 否 |
| 数值摘要 | 元素数量、NaN 数量、Inf 数量、零值数量、有限值均值、最小值、最大值、L2 Norm | 否 |
| 芯片性能信息 | kernel 设备执行时间、计算单元利用率、带宽、Cache、指令统计、硬件计数器 | 是 |

完成 Debugger 的插桩、编译和运行时接入后，FlagPrism 可以采集基础插桩信息和数值摘要，具体要求见第 3 节。

芯片性能指标由厂商决定支持范围。厂商未提供的指标会标记为不支持或不可用，不影响基础插桩信息和数值摘要的采集。

## 2. Profiler 适配接口

Profiler 适配分为三个步骤：

```text
1. 声明厂商支持哪些指标，并生成本次采集配置
                         ↓
2. 启动厂商 Profiler，在程序运行期间采集数据
                         ↓
3. 解析厂商输出，生成统一的 kernel 性能结果
```

三个步骤分别对应 2.1、2.2 和 2.3。运行时采集的主要流程为：

```text
makePlan → 配置采集器 → doStart → startOp/stopOp → doFlush → doStop → import
```

### 2.1 声明能力并生成采集配置

`VendorAdapter` 负责说明厂商支持哪些指标，并把用户请求转换成本次实际使用的采集配置。

实现以下 6 个接口：

```cpp
class VendorAdapter {
public:
  // 返回后端名称，例如 "cann"。
  virtual std::string getName() const = 0;

  // 返回设备类型。
  virtual DeviceType getDeviceType() const = 0;

  // 返回支持的硬件指标名称。
  virtual std::vector<std::string>
  getSupportedVendorMetrics() const = 0;

  // 根据用户请求生成实际采集方案。
  virtual VendorProfilePlan
  makePlan(const VendorProfileOptions &options) const = 0;

  // 返回芯片 Profiler 实例。
  virtual Profiler *getRuntimeProfiler() const = 0;

  // 创建性能数据导入器。
  virtual std::unique_ptr<VendorMetricsImporter>
  createImporter() const = 0;
};
```

其中，`getRuntimeProfiler()` 返回 2.2 中的采集对象，`createImporter()` 返回 2.3 中的解析对象。

需要把采集计划传给运行时采集器时，可重写 `configureRuntimeProfiler(profilerPath, plan)`；该接口默认已有实现。

#### 采集计划（VendorProfilePlan）

`makePlan()` 根据用户请求和厂商支持范围，生成本次采集配置 `VendorProfilePlan`。

用户请求 `VendorProfileOptions` 包含：

- 是否采集 kernel 基础运行信息；
- 希望采集的硬件指标；
- device ID、输出位置等厂商参数。

`makePlan()` 返回的 `VendorProfilePlan` 包含：

- 本次实际启用的指标；
- 本次无法启用的指标；
- 传给厂商 Profiler 的配置；
- 指标无法启用的原因。

例如，用户请求 `aicore`、`bandwidth` 和 `cache`，而昇腾当前只支持前两项，则生成的 plan 为：

```text
enabled  = [aicore, bandwidth]
disabled = [cache]
reason   = [当前 Profiler 不支持 cache 指标]
```

后续采集和结果解析都使用同一个 plan。

### 2.2 启动采集并标记算子

这一阶段负责调用厂商 Profiler，并在 Triton 算子开始和结束时添加标记。

实现以下接口：

```cpp
class Profiler {
protected:
  // 启动芯片性能采集。
  virtual void doStart() = 0;

  // 刷新当前采集数据。
  virtual void doFlush() = 0;

  // 停止采集并释放资源。
  virtual void doStop() = 0;

  // 设置设备、指标、输出目录等采集参数。
  virtual void doSetMode(
      const std::vector<std::string> &options);
};
```

为了将 Triton 算子与芯片侧性能事件对应，还需要实现：

```cpp
class OpInterface {
public:
  // 算子开始执行。
  virtual void startOp(const Scope &scope) = 0;

  // 算子执行结束。
  virtual void stopOp(const Scope &scope) = 0;
};
```

停止采集前应刷新数据，确保已采集的事件可供后续导入。

### 2.3 解析厂商性能数据

该接口的作用是把厂商 Profiler 的原始结果转换成 FlagPrism 可以读取的统一结果。

原始结果可以来自运行时采集的内存数据，也可以来自厂商工具导出的文件。使用外部工具时，需完成工具调用和结果导入，并在执行失败时报告错误。

实现以下接口：

```cpp
class VendorMetricsImporter {
public:
  virtual std::string getName() const = 0;

  virtual VendorProfileArtifact import(
      const SessionProfileMetadata &metadata,
      const VendorProfilePlan &plan) const = 0;
};
```

导入接口使用的三个结构体由 FlagPrism 定义。省略默认值后，结构如下：

```cpp
// 本次采集的基本信息，由 FlagPrism 传给厂商 Importer。
struct SessionProfileMetadata {
  uint32_t schemaVersion;                    // 数据格式版本
  std::string runId;                         // 本次运行 ID
  std::string sessionName;                   // session 名称
  std::string backend;                       // 芯片后端名称
  std::string profilerName;                  // Profiler 名称
  std::string context;                       // 上下文模式
  std::string data;                          // 输出数据类型
  std::string hook;                          // hook 类型
  std::string mode;                          // 用户传入的原始采集模式
  bool runtimeBaseEnabled;                   // 是否采集 kernel 基础运行信息
  std::vector<std::string> vendorMetricsRequested; // 用户请求的厂商指标
  std::vector<std::string> vendorMetricsEnabled;   // 本次实际启用的厂商指标
  std::vector<std::string> degradeReasons;   // 已知的降级原因
  std::map<std::string, std::string> config; // 厂商配置和原始结果位置
  RuntimeVersionInfo versions;               // 驱动和 Runtime 版本
  DeviceSnapshot device;                     // 设备 ID、名称和架构等信息
};

// 本次实际执行的采集配置，由 makePlan() 生成。
struct VendorProfilePlan {
  VendorProfileOptions requested;            // 用户原始请求和厂商参数
  bool runtimeBaseEnabled;                   // 是否采集 kernel 基础运行信息
  std::vector<std::string> enabledVendorMetrics;  // 实际启用的指标
  std::vector<std::string> disabledVendorMetrics; // 无法启用的指标
  std::vector<std::string> degradeReasons;   // 无法启用的原因
};

// 厂商 Importer 返回的统一结果。
struct VendorProfileArtifact {
  uint32_t schemaVersion;                    // 数据格式版本
  std::string backend;                       // 芯片后端名称
  std::string importer;                      // Importer 名称
  std::vector<VendorMetricRequest> requestedMetrics; // 用户请求的指标
  std::vector<std::string> enabledMetrics;   // 实际采集的指标
  std::vector<std::string> rawInputs;        // 读取的厂商原始文件
  std::vector<std::string> degradeReasons;   // 解析和关联失败原因
  std::vector<VendorMetricAssociation> associations; // kernel 事件及其指标
};
```

其中：

- `VendorProfileOptions` 包含用户原始模式、指标列表和厂商参数；
- `VendorMetricAssociation` 包含一个 kernel 事件、采集状态、指标列表和错误说明；
- kernel 事件包含 kernel 名称、device ID、stream ID、task/correlation ID，以及开始和结束时间。

`metrics` 保存厂商提供的性能数据，例如：

```text
ai_core_utilization = 85.2
memory_bandwidth_gbps = 720.5
cache_hit_rate = 0.91
```

`import()` 内需要完成：

- 读取运行时采集数据或厂商工具导出的文件；
- 将时间统一转换为纳秒；
- 将指标与 kernel 或算子关联；
- 标记指标是否采集成功；
- 对不支持、未采集到或无法关联的数据给出原因。

每项指标应说明来源、单位和统计范围，区分 Host 耗时与设备耗时、理论 occupancy 与实测利用率，以及单个 kernel 与整个采集范围的统计值。

### 2.4 昇腾实现思路

昇腾上的实现方式如下：

1. 后端名称为 `cann`，设备类型为 `ASCEND`；
2. 通过 `aclprofInit`、`aclprofCreateConfig` 和 `aclprofStart` 启动性能采集；
3. 通过 MSTX Range 标记算子的开始和结束，并保存算子 ID 与 Range ID 的关系；
4. 通过 `aclprofStop`、`aclprofDestroyConfig` 和 `aclprofFinalize` 停止采集；
5. 通过 `msprof` 导出性能数据；
6. 解析导出的数据，将 AI Core、带宽、执行时间等指标关联到对应算子；
7. CANN 或 MSTX 接口不可用时，在结果中说明相应指标未采集成功。

## 3. Debugger 适配接口

### 3.1 设备运行时接口

实现以下 11 个接口：

```cpp
class RuntimeBackendAdapter {
public:
  // 返回驱动类型、后端名称和当前可用状态。
  virtual TransferDriverKind driverKind() const = 0;
  virtual const char *name() const = 0;
  virtual bool isAvailable() const = 0;

  // 分配和释放设备内存。
  virtual void *allocateDevice(size_t bytes) = 0;
  virtual void freeDevice(void *ptr) = 0;

  // 分配和释放 Host 内存。
  virtual void *allocateHost(size_t bytes) = 0;
  virtual void freeHost(void *ptr) = 0;

  // 初始化设备内存。
  virtual void memsetDevice(
      void *ptr,
      int value,
      size_t bytes,
      uint64_t streamHandle) = 0;

  // Host 到设备的数据传输。
  virtual void copyHostToDevice(
      void *deviceDst,
      const void *hostSrc,
      size_t bytes,
      uint64_t streamHandle) = 0;

  // 设备到 Host 的数据传输。
  virtual void copyDeviceToHost(
      void *hostDst,
      const void *deviceSrc,
      size_t bytes,
      uint64_t streamHandle) = 0;

  // 等待指定 stream 完成。
  virtual void synchronize(uint64_t streamHandle) = 0;
};
```

多设备场景下，如运行时需要显式切换设备，还应重写 `setDevice(uint32_t deviceId)`，确保内存分配和传输使用 kernel 所在的设备。

接口需要满足：

- 设备内存可以被 kernel 直接读写；
- Host 内存支持设备与 Host 之间的数据传输；
- 传入有效 stream 时，数据传输和 kernel 在同一 stream 上保持正确顺序；
- 同步完成后，Host 才开始读取调试数据；
- 所有内存和运行时资源在调试结束后释放。

### 3.2 Kernel 编译和启动要求

除上述 C++ 接口外，芯片编译器和 launcher 还需要支持：

1. 为开启 Debugger 的 kernel 增加一个设备指针参数 `__debug_ctrl_ptr`；
2. launcher 在 kernel 启动前分配并初始化调试缓冲区；
3. launcher 将调试缓冲区的设备地址作为最后一个参数传给 kernel；
4. kernel 将调试记录写入该缓冲区；
5. kernel 执行完成后，将缓冲区复制回 Host；
6. 未开启 Debugger 时，不增加该参数；
7. 调试缓冲区满时记录溢出状态，不能越界写入。

接入初期可先实现 L1 数值摘要，包括 NaN、Inf、最大值、最小值、均值等统计信息；L2 还需支持完整张量的采集和回传。

如果需要支持访存地址采集，还需要将 kernel 中的指针转换为实际设备地址，并输出有效线程的地址摘要或完整地址列表。

### 3.3 昇腾实现思路

昇腾上的 Debugger Runtime 使用以下 CANN 接口：

| 功能 | 昇腾实现 |
| --- | --- |
| 分配设备内存 | `aclrtMalloc` |
| 释放设备内存 | `aclrtFree` |
| 分配 Host 内存 | `aclrtMallocHost` |
| 释放 Host 内存 | `aclrtFreeHost` |
| 初始化设备内存 | `aclrtMemset` 或 `aclrtMemsetAsync` |
| Host 复制到设备 | `aclrtMemcpy` 或 `aclrtMemcpyAsync` |
| 设备复制到 Host | `aclrtMemcpy` 或 `aclrtMemcpyAsync` |
| 等待 stream 完成 | `aclrtSynchronizeStream` |

整体流程如下：

1. 使用 `aclrtMalloc` 分配调试缓冲区；
2. 初始化缓冲区头部和记录区域；
3. 将缓冲区设备地址作为 `__debug_ctrl_ptr` 传给 kernel；
4. kernel 将数值摘要、地址信息等调试记录写入缓冲区；
5. kernel 结束后，在同一 CANN stream 上将缓冲区复制到 Host；
6. 调用 `aclrtSynchronizeStream` 等待复制完成；
7. Host 解析调试记录并释放设备和 Host 内存。

## 4. 错误处理要求

- 每个芯片 Runtime 或 Profiler API 调用都要检查返回值；
- 错误信息需要包含失败的接口名称和错误码；
- 不支持的性能指标需要明确标记为不支持；
- 无法关联到 kernel 的指标需要明确标记为未关联；
- 不得用占位零值伪装采集成功；
- 内存分配、数据传输或 kernel 参数不一致时，应停止本次调试并返回错误。

## 5. 接口与代码文件对应关系

以下代码可作为参考。Profiler 文件展示各厂商的采集实现；四个 Debugger Runtime Adapter 均位于 [TransferEngine.cpp](https://github.com/flagos-ai/FlagPrism/blob/main/Debugger/lib/Runtime/TransferEngine.cpp)，可按表中的类名查找。

| 芯片 | Profiler 参考代码 | Debugger Runtime 类名 |
| --- | --- | --- |
| 燧原 | [EnflameProfiler.cpp](https://github.com/flagos-ai/FlagPrism/blob/main/Profiler/csrc/lib/Profiler/Vendor/EnflameProfiler.cpp)：TOPSPTI 采集 | `EnflameRuntimeBackendAdapter` |
| 摩尔线程 | [MthreadsProfiler.cpp](https://github.com/flagos-ai/FlagPrism/blob/main/Profiler/csrc/lib/Profiler/Vendor/MthreadsProfiler.cpp)：运行时采集 | `MusaRuntimeBackendAdapter` |
| 昇腾 | [CannProfiler.cpp](https://github.com/flagos-ai/FlagPrism/blob/main/Profiler/csrc/lib/Profiler/Vendor/CannProfiler.cpp)：CANN/MSTX 采集与 msprof 导出 | `CannRuntimeBackendAdapter` |
| 英伟达 | [CuptiProfiler.cpp](https://github.com/flagos-ai/FlagPrism/blob/main/Profiler/csrc/lib/Profiler/Cupti/CuptiProfiler.cpp)：CUPTI 采集；[NvidiaHardwareCounters.cpp](https://github.com/flagos-ai/FlagPrism/blob/main/Profiler/csrc/lib/Profiler/Cupti/NvidiaHardwareCounters.cpp)：硬件计数器 | `CudaRuntimeBackendAdapter` |

### 5.1 Profiler

| 内容 | 接口定义或公共结构 | 厂商实现及接线位置 |
| --- | --- | --- |
| 厂商能力与采集计划 | `Profiler/csrc/include/Profiler/Vendor/Adapter.h`、`Profiler/csrc/include/Profiler/Vendor/Mode.h` | 新增 `<Vendor>Adapter.h/.cpp`；昇腾对应 `CannAdapter.h/.cpp` |
| 启动、刷新和停止采集 | `Profiler/csrc/include/Profiler/Profiler.h` | 新增 `<Vendor>Profiler.h/.cpp`；昇腾对应 `CannProfiler.h/.cpp` |
| 算子开始和结束标记 | `Profiler/csrc/include/Context/Context.h` 中的 `OpInterface` | 在 `<Vendor>Profiler.cpp` 中实现 `startOp()` 和 `stopOp()` |
| 厂商数据导入 | `Profiler/csrc/include/Profiler/Vendor/Adapter.h` 中的 `VendorMetricsImporter` | 在 `<Vendor>Adapter.cpp` 或独立 Importer 文件中实现；昇腾实现在 `CannAdapter.cpp` 和 `CannProfiler.cpp` |
| 统一结果结构 | `Profiler/csrc/include/Data/Artifacts.h` | Importer 填充 `VendorProfileArtifact` |
| 设备类型 | `Profiler/common/include/Device.h` | 增加厂商设备类型，并在设备查询实现中接入 |
| Adapter 注册 | `Profiler/csrc/include/Profiler/Vendor/Adapter.h` 中的 `VendorAdapterRegistry` | 修改 `Profiler/csrc/lib/Profiler/Vendor/Adapter.cpp` |
| 自动选择 Profiler 后端 | Python `backend` 选择逻辑 | 修改 `Profiler/python/flagtree_profiler/profile.py` |
| 编译接入 | `cmake/FlagPrism.cmake` 中的后端注册、CMake 源文件列表 | 注册新后端，并按源文件归属修改 `Profiler/csrc/CMakeLists.txt` 或 `Profiler/csrc/lib/Profiler/CMakeLists.txt` |

### 5.2 Debugger

| 内容 | 接口定义或公共结构 | 厂商实现及接线位置 |
| --- | --- | --- |
| 后端类型和调试记录格式 | `Debugger/include/Debugger/Common/Protocol.h` | 增加厂商 `BackendKind` |
| 传输驱动类型 | `Debugger/include/Debugger/Runtime/TransferEngine.h` | 增加厂商 `TransferDriverKind` |
| 设备内存与数据传输接口 | `Debugger/lib/Runtime/BackendAdapter.h` | 实现 `<Vendor>RuntimeBackendAdapter`；昇腾实现位于 `Debugger/lib/Runtime/TransferEngine.cpp` |
| Runtime Adapter 创建 | `createRuntimeBackendAdapter()` | 在 `Debugger/lib/Runtime/TransferEngine.cpp` 中增加厂商分支 |
| 隐藏参数和调试记录 lowering | Debugger instrumentation passes | 修改 `Debugger/lib/Instrumentation/Passes.cpp` |
| 编译阶段接入 | Debugger compiler callback | 修改 `Debugger/python/flagtree_debugger/compiler.py`；需要新增 C++ binding 时修改 `Debugger/python/CompilerBindings.cpp` |
| 调试缓冲区准备和导出 | Debugger Python Runtime | 修改 `Debugger/python/flagtree_debugger/api.py` |
| FlagTree 通用 launch 接口 | FlagTree Host gateway | `FlagTree/python/triton/_flagprism.py` |
| 芯片 launcher 接线 | 各芯片 backend driver | 在芯片 backend 的 `driver.py` 中调用 Debugger launch context；昇腾对应 `FlagTree/third_party/ascend/backend/driver.py` |
| 厂商 SDK 探测和链接 | Debugger Runtime CMake | 新增厂商 CMake 文件，并修改 `Debugger/lib/Runtime/CMakeLists.txt` 和 `Debugger/lib/CMakeLists.txt`；昇腾对应 `Debugger/lib/Runtime/CANN.cmake` |

已有的 FlagTree 编译回调和 launch 接口应优先复用；新后端尚未接入时，在 FlagTree 侧补齐相应的编译和启动接入，采集和解析逻辑放在 FlagPrism。

## 6. 验证

适配后，在目标芯片上进入 FlagPrism 仓库根目录，运行统一算子验收：

```bash
python3 test.py
```

测试依次运行 Debugger L1、Debugger L2 和 Profiler，每个阶段都将算子输出与 CPU 参考结果比较，并检查对应的采集结果。Profiler 验收要求真实的 kernel 设备耗时。

多卡测试可使用 `python3 test.py --devices 0,1 --jobs 2`。

默认至少覆盖 100 个算子族。采集失败时，测试会补跑未开启工具的同一算子：普通执行也失败记为 WARNING，普通执行成功则记为 ERROR；环境初始化或设备异常等错误直接记为 ERROR。达到覆盖要求且没有 ERROR 时，统一验收通过，但 WARNING 不代表采集成功。

结果默认保存在 `test-results/<运行时间>/`，查看 `summary.json` 中的 PASS、WARNING 和 ERROR 数量，以及对应测试日志。为新增能力补充专项测试，检查实际采集的数值和关联结果；提交适配时说明实际通过的范围和已知限制。
