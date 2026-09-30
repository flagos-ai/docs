# 测试 Python 算子

*FlagGems* 使用 `pytest` 来驱动算子精度测试和性能基准测试。
项目使用 Triton 的 `triton.testing.do_bench` 来执行内核层级的性能评估。

## 1. 算子精度测试

要在特定的后端硬件（如 CUDA）上运行测试：

```shell
pytest tests/test_${name}.py
```

下面的命令执行在 CPU 上的精度测试：

```shell
pytest tests/test_${case}.py --ref cpu
```

## 2. 在具体模型下执行精度测试

```shell
pytest examples/${name}_test.py
```

## 3. 测试算子的性能

在 CUDA 平台上测试算子的性能：

```shell
pytest benchmark/test_foo.py -s
```

下面的命令对算子执行端到端的性能基准测试：

```shell
pytest benchmark/test_foo.py -s --ref cpu
```
