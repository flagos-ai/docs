# 运行测试

先安装开发依赖，然后从最小的有效分层开始，按影响范围逐步扩展。

```{code-block} shell
python -m pip install -e ".[dev]"

# 日常开发基线
python tools/ci_tier.py pr-default

# 本地 API、运行时、规划器与编译器改动
python tools/ci_tier.py pr-runtime

# CPU 上的分布式规划、审计与基准契约
python tools/ci_tier.py pr-distributed

# 加速器与设备绑定的 Triton 测试
python tools/ci_tier.py gpu-scheduled
```

也可以直接使用 pytest：

```{code-block} shell
python -m pytest tests/unit -q
python -m pytest tests/qec -q
python -m pytest -m qiskit
python -m pytest -m pennylane
```

## 各分层证明了什么

| 分层 | 能证明 | 不能证明 |
| --- | --- | --- |
| 推送门禁 | 导入、最小线路、自动微分、纯规划与审计辅助 | 运行时集成、分布式行为、性能、发布就绪 |
| 本地运行时 | 本地运行时与 API 行为的固定种子集成覆盖 | 多进程传输、GPU 执行、可扩展性 |
| 分布式 CPU | CPU 分布式语义、失败即拒绝门禁、基准契约、发布门禁校验 | 真实多卡或多机容量扩展 |
| GPU 定时任务 | 加速器与设备绑定内核测试 | 多机传输或单独构成发布级可扩展性 |

空的标记选择不算验证。CPU 分布式测试只证明语义，永远不会被用作可扩展性的发布证据。
