# Profiler 集成

`torch.profiler` 通过编译进 wheel 的设备追踪器支持 `flagos` 设备。`torch.profiler.profile(activities=[CPU, PrivateUse1])` 产出的 trace 与同一工作负载在 `torch.cuda` 上的 trace 结构等价：

- **流向箭头**把每个 CPU 算子连接到它启动的设备内核。
- **设备时间归因**：`prof.key_averages()` 报告逐算子的 `self_device_time_total`。
- **完整的内核元数据**（grid/block、occupancy、共享内存、寄存器数量）以及已反修饰的内核名。
- **运行期事件**携带由 callback id 解码出的真实 API 名称，而非占位符。
- **memcpy 与 memset** 活动与内核一起采集。

## 三层架构

新增一个厂商意味着只写一个文件：满足与厂商无关接口的追踪器。

| 层次 | 文件 | 职责 |
|---|---|---|
| 与厂商无关的接口 | `csrc/profiler/device_tracer.h` | `DeviceTracer`、`DeviceEvent`、`EventKind` —— 厂商需要实现的完整契约 |
| 厂商追踪器 | `cupti_device_tracer.cc`、`cann_device_tracer.cc`、`musa_mupti_device_tracer.cc`、`roctracer_device_tracer.cc`、`gcu_topspti_device_tracer.cc`、`unavailable_device_tracer.cc` | 每个加速器一份实现，另有显式的「无设备活动」回退 |
| 通用适配层 | `flagos_kineto_profiler.{h,cc}` | 与厂商完全解耦的 Kineto/PyTorch profiler 适配器；由 `cupti_shim.h`、`mupti_shim.h`、`topspti_shim.h` 等 `dlopen` shim 绑定厂商活动库 |

| 加速器 | 活动 API | 状态 |
|---|---|---|
| NVIDIA CUDA | CUPTI | 稳定，对等性套件纳入 CI |
| MetaX | MCPTI（MACA 中 CUDA 兼容的活动 API） | 实验性：C550 + MACA 3.8.0 上七项对等性断言全部通过（本地硬件验证，CI 无厂商 runner） |
| Ascend | MSPTI | Beta：内核/运行期/flow/memcpy 事件及设备时间关联由共享契约覆盖 CI；对等性套件本身不在 CI 中 |
| 海光 DCU | ROCtracer | Beta：对等性套件在 CI 中运行 |
| 摩尔线程 MUSA | MUPTI | 实验性：设备时间线已在 MTT S5000 上实测；CPU-Kineto 关联依赖具体环境 |
| 燧原 GCU | TOPSPTI | 仅运行时：TOPSPTI 能采集活动，但仅有 CPU 的 Kineto 构建不提供 PrivateUse1 resolver，活动无法呈现为设备事件 |
| 其他 | `unavailable_device_tracer.cc` | 显式的「无设备活动」回退 |

## Correlation id

一条 trace 中存在两套彼此独立的编号体系，都叫 “correlation”，外观相似但含义不同：

| | `correlation_id` | `external_correlation_id` |
|---|---|---|
| 归属 | 活动 API 的编号 | PyTorch 的编号 |
| 关联对象 | 一次运行期调用与它产生的设备内核 | 一次设备/运行期活动与发起它的 CPU 算子 |
| 用途 | 绘制流向箭头 | 设备时间归因 |
| trace 字段 | `args["correlation"]` | `args["External id"]` |

传错会静默失败：trace 仍能正常生成、箭头消失、`self_device_time_total` 读数为 0。设备时间必须通过 `getLinkedActivity` 回调（external id）解析，而流向箭头基于活动 correlation id。

## 调试

| 变量 | 默认值 | 作用 |
|---|---|---|
| `FLAGOS_TRACE` | `0` | 设备 profiler shim 的详细日志：事件排空、采集时间窗、追踪器绑定与注册 |
| `FLAGOS_TRACER_LIBRARY` | 自动探测 | 当默认路径与已安装驱动不匹配时，覆盖 profiler shim `dlopen` 的追踪器库 |

有两类告警刻意不受 `FLAGOS_TRACE` 控制 —— 空的 linked-activity 回调与活动记录布局不匹配 —— 因为它们都会静默地把设备时间归零。

## 对等性测试与基线

`tests/integration/test_profiler_parity.py` 将 `flagos` trace 与在原生 `torch+cuda` 上采集的基线对比。七项断言全部只检查结构，不检查计数或耗时：

| # | 断言 | 检查内容 |
|---|---|---|
| 1 | `test_category_coverage` | `flagos` trace 覆盖 `torch.cuda` 基线中的全部类别 |
| 2 | `test_flow_arrows_are_paired` | 每个流向箭头的起始半边都有对应的结束半边 |
| 3 | `test_arg_key_supersets` | 各类别的参数键是基线的超集 |
| 4 | `test_device_time_attribution` | 算子的 `self_device_time_total` 与其拥有的设备事件时长之和相吻合 |
| 5 | `test_kernel_names_are_demangled` | 不存在裸露的 C++ 修饰符号 |
| 6 | `test_runtime_names_come_from_cbid` | 运行期事件名由 callback id 解码得到 |
| 7 | `test_capture_window_containment` | 没有设备或运行期事件逸出采集时间窗 |

基线位于 `tests/data/profiler_cuda_baseline.json`。第 2 项断言刻意比上游 `torch.cuda` 更严格：它是 PyTorch-Plugin-FL 自身的约束，保留它是因为流向箭头出现悬空半边正是它要防的回归。

## 已知缺口

- 不采集 `overhead` 活动类别：它衡量的是 profiling 自身的开销而非用户工作负载。该缺口以已知项形式记录在基线中，而不是被静默省略。
- MetaX 的 MCPTI 运行期 callback id 并非 NVIDIA CUPTI id，追踪器使用 MetaX 的 callback 命名空间，并把 API 名称解析推迟到活动刷出之后 —— 在 buffer 回调中调用解析器可能使 profiler 死锁。该扫描逻辑尚未在多个 MetaX SDK 版本、多种设备或非默认流上验证。
- 燧原 GCU 的 profiler 支持仅为运行时级别，见上表。
