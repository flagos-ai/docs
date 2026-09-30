# 硬件与远程目标

FlagQuantum 既能在当前进程可控的资源上运行同一份程序，也能把它送到外部执行目标。两者刻意采用不同的命名：`ExecutionOptions` 描述当前进程的设备，而 `target` 命名外部系统。

## 经 Torch-FL 使用 FlagOS 加速器

`flagquantum` 依赖 PyTorch，而不是 Torch-FL。导入 FlagQuantum、查询后端或运行 CPU 与 CUDA 时都不会导入 `torch_fl`；只有在显式选择 `flagos` 时才会激活这个可选提供方，而 Torch-FL 缺失或不兼容会在激活时报出诊断错误，而不会禁用 CPU 或 CUDA。

```{code-block} python
import flagquantum as fq

result = fq.run(
    circuit,
    options=fq.ExecutionOptions(device="flagos:0"),
)
```

国产加速器的相关职责全部留在 Torch-FL：由它识别厂商与运行时，并通过 `flagos` 契约暴露路由。FlagQuantum 记录 Torch-FL 的运行时身份与路由证据，而不重复实现厂商分支。CUDA 仍是唯一会被自动选择的加速器；`flagos` 需要显式选择。

在 `flagos` 上执行本地态向量之前，会强制检查随包发布的算子配置：设备名与环境提示不被接受为已验证证据。单卡认证试验台用于采集由供方独占证明的执行候选结果，即使运行成功也仍然只是待评审候选，而不是自动获得硬件认证。

## 远程任务

面向 Notebook 的提交最看重可用性：`fq.run()` 会一直等到结果，而 `fq.submit()` 在准备与提供方确认完成后就返回，因此在任务排队期间内核仍然可用。

```{code-block} python
import flagquantum as fq

job = fq.submit(fq.Circuit(2).x(0), target="quafu:Baihua", shots=1024)
job.save("quafu-job.json")
print(job.id)
```

```{code-block} python
state = job.status()
if state == "succeeded":
    result = job.result()
    print(result.counts)
```

`status()` 只查询一次，且从不把未知或缺失状态当作成功。`result()` 不做轮询：需要阻塞时请显式使用 `job.wait(timeout=...)`。回执是不含凭据的 JSON，恢复回执不会重新提交任务。九鼎工作区为同一套可观测量接口提供低延迟远程算力：

```{code-block} python
result = fq.run(
    circuit,
    target="jiuding:gpu",
    outputs=(fq.samples(wires=(0, 1)), fq.counts(wires=(0, 1))),
    shots=1024,
)
```

采样与计数归约无需返回完整态向量即可执行；可通过 `result.runtime` 与 `result.provenance` 查看所选设备、结果传输、计数聚合以及任何 CPU 回退证据。

## 真实量子硬件

显式指定编译器与提供方目标可以让这条路径保持失败即拒绝——该路径绝不会隐式选择或替换编译器、提供方：

```{code-block} python
result = fq.run(
    circuit,
    compiler="qsteed",
    target="quafu:Baihua",
    shots=1024,
    name="bell calibration",
)
counts = result.measurement("counts").value[0]
```

线路会被编译、封装、提交并等待，而稳定的 `fq.ExecutionResult` 返回类型不变。`target_qubits` 可选地按序把逻辑线号映射到物理比特；一旦提供，除非当前目标快照能证明该选择有效且连通，否则编译会失败。同一个远程入口也可以测量单个泡利期望值，量子位逐位对易的各项会在同一物理映射下分到不同的封装任务中测量。

## 部署包

`flagquantum.deployment.create_deployment_package` 会绑定训练好的参数、面向目标编译，并封装出一个可审计的包，便于之后持久化、签名或提交。预检会把程序与目标做校验，并对确切的包做身份核验，而不联系提供方：

```{code-block} python
import flagquantum.deployment as deployment
from flagquantum.services import preflight_deployment

backend = deployment.CloudBackendProfile.simulator(2)
report = preflight_deployment(circuit, backend=backend, shots=1024)
if report.approved_for_submission:
    package = report.package
```

提供方的支持范围与凭据行为各不相同，能力目录中没有任何提供方获得发布认证。远程路径需要真实的提供方访问权限，本地检查并不覆盖它们。

## 边界

- 凭据只保留在宿主环境中；不要把原始令牌、密码或 API key 放进扩展清单、错误、测量或序列化载荷。
- 回执只是本地上下文，不是硬件执行内容的密码学证明。
- 实验性远程适配器的范围有限：没有自动上传、镜像构建、多卡或多机任务、日志流式输出，也不会自动恢复部分提交的工作。
