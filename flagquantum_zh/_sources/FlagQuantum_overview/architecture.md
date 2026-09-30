# 架构

FlagQuantum 为量子 AI 程序在本地开发、加速内核、分布式模拟到部署之间提供同一套公开模型。它的组织方式保证后端变化不会改变程序含义。

## 核心层次

| 层次 | 职责 | 入口 |
| --- | --- | --- |
| 用户 API | 线路构建、PyTorch 模块、规划、执行、训练与部署 | `import flagquantum as fq` |
| 编译 | 变换线路并合法化目标输出，但不执行线路 | `fq.compile`、`flagquantum.compiler` |
| FlagQuantum IR | 版本化算子、测量、元数据、序列化与校验 | `fq.CircuitIR` |
| 规划 | 选择表示与执行策略，解释阻塞项与回退 | `fq.plan`、`Circuit.runtime_plan` |
| 运行时 | 本地或跨 rank 执行，并返回带类型的证据 | `fq.run`、`fq.ExecutionResult` |
| 训练 | 在各受支持运行时上保持 PyTorch 自动微分与优化器语义 | `fq.Module`、`fq.train` |
| 部署 | 绑定训练好的参数、面向目标编译并封装可审计的包 | `flagquantum.deployment.create_deployment_package` |

## 源码结构

```text
flagquantum/
├── _api.py                 # 根层 compile、plan、run 的组合
├── circuit.py              # 线路构建
├── core/                   # 后端中立的 IR 与共享语义
├── compiler/               # 校验、优化、降级与代码生成
├── runtime/                # 规划、执行生命周期、结果与协调
├── simulation/             # 数值方法与内核
├── noise/                  # 后端中立的噪声模型与信道
├── observables/            # 面向用户的测量构建
├── qec/                    # 纠错工作流与领域模型
├── twin/                   # 硬件数字孪生模型
├── compute/                # 当前进程所控制的资源
├── remote/                 # 外部任务系统与结果获取
├── ecosystem/              # 框架与格式适配器
├── deployment/             # 已封装的、目标中立的执行包
├── services/               # 可复用的多步应用工作流
├── algorithms/             # 面向用户的算法组合
├── benchmarking/           # 可复现的测量与证据生成
├── drawer/                 # 线路可视化
└── experimental/           # 明确不稳定的 API
```

## 依赖方向

依赖指向内部，因此可选的集成始终位于必需的本地 PyTorch 路径之外：

```text
用户门面 → 编译 / 运行时 / 应用工作流 → Core
                         │
                         ├── Simulation 数值方法
                         ├── Compute 本地资源适配器
                         └── Remote 外部任务系统适配器
```

Core 既不引入编排、也不引入数值引擎或厂商集成。编译器负责变换程序，但不执行程序；运行时负责组织执行，但不实现数值内核；Simulation 使用 Core 语义，但不选择资源；Compute 与 Remote 把硬件与外部系统的细节与其他领域隔离开来。

## 执行与训练契约

`fq.run` 是规范的执行入口，对受支持的本地与分布式模式返回 `fq.ExecutionResult`。专用的原生函数属于高级接口，可能暴露后端特有的对象。

`fq.train` 负责常规的 PyTorch 优化循环。按 rank 拥有的态向量与 MPS 训练有各自独立的分布式入口，它们并不会因为调用 `fq.train` 而自动生效。只有当分布式执行的前向、梯度、优化器更新与检查点归属都保持所声明的分布式语义时，分布式训练才算完成。

要主张分布式可扩展性，必须把同一份逻辑负载切分到多个 rank 上。复制的数据并行、rank 本地内核与手工张量切片会按各自的语义报告，绝不会被改称为容量扩展。

## 公开接口与内部接口

- 公开示例统一使用 `import flagquantum as fq`。
- 稳定名称由受检清单圈定，并由测试验证。
- `fq.experimental` 不提供兼容性保证。
- 兼容模块用于迁移，它们不定义新的稳定 API。
- 基准与研究工具永远不会成为运行时依赖。
