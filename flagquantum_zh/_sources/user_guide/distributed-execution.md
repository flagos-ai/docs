# 分布式执行

分布式执行把同一套编程模型扩展到真正切分的负载上。同一份逻辑负载被切到多个 rank，复制式执行永远不会被当作容量扩展来呈现。

## 分片态向量

在已初始化的多 rank 进程组下，同一态向量模块与结果面会自动使用原生分片态向量运行时。分布式拓扑来自执行环境，而不是另一套模式词汇。

```{code-block} shell
torchrun --nproc_per_node=4 your_script.py
```

```{code-block} python
import flagquantum as fq

def circuit(parameters):
    return fq.Circuit(20).ry(0, parameters[0]).cx(0, 1)

module = fq.Module(circuit, n_parameters=1)
result = module.execute()
```

分片态向量训练让优化器状态与检查点都归所声明的分布所有，因此前向执行、梯度、优化器更新与重启都保持同一套语义。

## 按 rank 拥有的 MPS

分布式 MPS 训练让前向、反向与优化器状态都由 rank 拥有。它是单设备放不下、纠缠又较低的大系统的路径，并支持语义匹配的检查点与恢复。面向有键结构的系统，还可以使用带 owner 本地有限内存历史的实验性 `adam_lbfgs` 调度。

```{code-block} shell
python examples/distributed_mps/variable_bond_capacity_8gpu.py
python examples/distributed_statevector_topologies/run.sh
```

## 这里的分布式证据意味着什么

- 主张分布式可扩展性，必须把同一份逻辑负载切分到多个 rank。
- CPU 分布式分层只证明语义与失败即拒绝的行为，不是容量证据。
- 运行时记录会报告自身的 `distribution_semantics`，从而把分片容量与复制吞吐区分开。
- 在受支持的分片态向量与 MPS 配置之外，分布式训练仍明确属于实验性。

## FlagOS 加速器

在 FlagOS 支持的加速器上，同一份程序通过 Torch-FL 运行在逻辑设备 `flagos:0` 上，因此分布式传输与集合通信都走 FlagOS 路由。详见[硬件与远程目标](hardware-and-remote.md)。
