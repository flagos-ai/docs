# 教程

教程系列讲解可运行示例背后的概念。新用户建议按顺序阅读，但每个笔记本同样可以独立使用。

| 序号 | 笔记本 | 学习目标 |
| --- | --- | --- |
| 00 | 理解态 | 态张量、振幅、概率与量子比特顺序 |
| 01 | 基本操作 | 单比特与双比特操作 |
| 02 | 测量 | 测量态并解释期望值 |
| 03 | 参数化门 | 可训练门与梯度 |
| 04 | 线路构建器 | 构建并查看可复用线路 |
| 05 | 量子机器学习 | 端到端训练一个小型 QML 模型 |
| 06 | 态向量 VQE | 用本地态向量模拟训练小型 VQE 模型 |
| 07 | 运行时选择 | 比较态向量、MPS 与张量网络的摘要结果 |
| 08 | PyTorch 与 JAX 层 | 训练由 JAX 量子内核支撑的 `fq.Module` |
| 09 | 梯度精度与速度 | 比较各运行时的梯度精度与「值+梯度」速度 |

笔记本以空输出入库，请在全新的内核中运行。JAX 教程需要可选的 `jax` 依赖。

## 教程之外的示例

| 目标 | 起点 |
| --- | --- |
| 学习线路、测量、梯度与 QML | 教程 00–05 |
| 验证本地 CPU 或单卡 GPU 路径 | `examples/single_machine_quantum_ai/` |
| 训练本地态向量 VQE | `examples/single_machine_quantum_ai/01_vqe_statevector.py` |
| 使用 MPS 训练 | `examples/single_machine_quantum_ai/03_mps_training.py` |
| 在 PyTorch 中使用 JAX 内核 | `examples/single_machine_quantum_ai/04_jax_kernel_torch_layer.py` |
| 查看分片态向量的归属 | `examples/distributed_statevector_topologies/` |
| 查看按 rank 拥有的 MPS 执行 | `examples/distributed_mps/` |
| 训练并打包一个线路 | `examples/train_parameterized_circuit_then_deploy.py` |
| 构建扩展 | `examples/extensions/`（实验性 API） |
| 端到端运行一个算法单元 | `examples/algorithms/` |

## 推荐的冒烟运行

```{code-block} shell
python examples/single_machine_quantum_ai/00_local_fast_path_check.py
python examples/single_machine_quantum_ai/01_vqe_statevector.py --backend torch --steps 2 --n-qubits 3
python examples/single_machine_quantum_ai/02_quantum_classifier.py --steps 2
python examples/single_machine_quantum_ai/03_mps_training.py --steps 2 --n-qubits 4 --max-bond 8
```

示例会先报告正确性参考，再谈速度：VQE 与 MPS 示例会打印小哈密顿量的精确稠密基态能量以及最终能量差，分类器则与教师线路生成的数据对比。
