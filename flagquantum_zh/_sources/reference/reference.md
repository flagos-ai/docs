# 参考资料

稳定接口、配置与支持边界。

## 稳定 API

FlagQuantum 只暴露一套经过整理的 Python 接口，即 `import flagquantum as fq`。稳定名称由受检清单圈定，并由可执行的契约测试验证。

| API | 稳定性 |
| --- | --- |
| `fq.Circuit`、`fq.CircuitIR`、`fq.Instruction` | 稳定 |
| `fq.ExecutionOptions`、`fq.ExecutionPlan`、`fq.ExecutionResult` | 稳定 |
| `fq.MeasurementResult`、`fq.Observable`、`fq.OutputRequest` | 稳定 |
| `fq.Parameter`、`fq.ParameterExpression`、`fq.RuntimePolicy` | 稳定 |
| `fq.Module`、`fq.TrainingResult` | 稳定 |
| `fq.I`、`fq.X`、`fq.Y`、`fq.Z` | 稳定 |
| `fq.IR_VERSION`、`fq.IRSerializationError`、`fq.IRValidationError` | 稳定 |
| `fq.compile`、`fq.plan`、`fq.run`、`fq.train` | 稳定 |
| `fq.counts`、`fq.expectation`、`fq.probabilities`、`fq.samples` | 稳定 |
| `fq.submit`、`fq.restore_job` | 稳定 |
| `fq.experimental`、`fq.twin`、`fq.__version__` | 稳定 |

## API 对照

| 任务 | 主要接口 | 结果 |
| --- | --- | --- |
| 构建程序 | `fq.Circuit` | 由 FlagQuantum IR 支撑的线路 |
| 优化程序 | `flagquantum.compiler.optimize` | `fq.CircuitIR` |
| 面向所选工具与目标编译 | `fq.compile` | `fq.CircuitIR` |
| 查看执行决策 | `fq.plan`、`Circuit.runtime_plan` | 可解释的运行时规划 |
| 本地或远程执行 | `fq.run` | `fq.ExecutionResult` |
| 定义可训练量子层 | `fq.Module` | PyTorch 模块 |
| 训练 | `fq.train` | `fq.TrainingResult` |
| 面向目标打包 | `flagquantum.deployment.create_deployment_package` | 已封装的部署包 |

## 运行时配置

`RuntimeConfig` 是 FlagQuantum 的不可变执行策略：后端、设备、实数与复数精度、JAX 精度、矩阵乘法策略与绘制风格。`Circuit` 在构造时捕获配置，并把版本化清单嵌入 IR 与执行规划中，因此分布式工作进程可以重建同一套策略。

```{code-block} python
import flagquantum as fq
from flagquantum.runtime.configuration import RuntimeConfig, runtime_config

config = RuntimeConfig(device="cuda")
circuit = fq.Circuit(4, config=config)

with runtime_config(complex_dtype="complex128"):
    circuit = fq.Circuit(2)  # 捕获 complex128
```

每次执行只解析一次复数精度：`complex64` 意味着 float32 参数与实部组件，`complex128` 意味着 float64。解析结果支配规划字节数、态分配、参数张量、门矩阵与分布式模拟，这些阶段不会各自去查询进程默认值。dtype 冲突会在应用任何门之前失败。

## 算子

线路操作与后端降级能力来自同一份带类型的算子注册表。注册了某个后端的降级，只意味着该算子可以为这个后端降级——它不是发布证据。仓库中生成的算子表是注册集合的权威来源，覆盖泡利门、Clifford 门、旋转门、受控门、对称双比特门与相位门，以及稳定噪声模型所用的噪声信道。

## 错误

| 类别 | 含义 |
| --- | --- |
| `ValidationError` | 语义输入非法 |
| `PlanningError` | 规划过期、被篡改或不兼容 |
| `CapabilityError` | 请求的能力不可用 |
| `ExecutionError` | 执行或训练失败 |

所有类别都继承 `FlagQuantumError` 以及一个兼容的 Python 内置异常。类型错误与未知关键字参数抛出 `TypeError`。

## 稳定性边界

- `fq.experimental` 不提供兼容性保证。
- 兼容导入属于迁移辅助，并不意味着稳定。
- 规划结果描述意图与估计，永远不是运行时或基准证据。
- 运行时证据必须满足带类型、带版本的运行时契约。
- 新的公开名称必须首先可导入、通过快照测试，并被加入稳定 API 清单。

## 延伸阅读

- [能力参考](capabilities.md)：各能力对应的成熟度与支持边界。
- [架构](../FlagQuantum_overview/architecture.md)：层次划分、依赖方向与各项契约。
