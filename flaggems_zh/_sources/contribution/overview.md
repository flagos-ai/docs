
# 概述

在拉取请求（Pull Request）中，贡献者应该就所提议的变更给出描述，包括变更的原因。
在需要的情况下，请一并提交单元测试用例。
在拉取请求被最终合入之前，需要**一个项目成员**的批准。
此外，这类拉取请求也必须通过持续集成（Continuous Integration，CI）测试。

## 1. 算子目录

从 v4.2 版本开始，FlagGems 项目开始引入算子目录，即 `conf/operators.yaml` 文件。
其中每个算子都有一个用 `id` 字段来表述的唯一标识符（ID）。其他字段还包括：

- `description`：关于算子用途的一段简要描述。
- `for`：标记算子用来替代的 PyTorch 操作或函数（如果有的话）。
- `labels`：与算子关联的一个标签字符串列表。标签用来在不同维度对算子进行分组。
- `kind`：算子的主要分类类别。

- `stages`：由一组键-值对组成的列表，用来记述算子的演化历史。`stages` 中的每个**阶段（stage）**
  包含一个主键（取值为 `alpha`、`beta`、`stable` 或者 `removed`），以及一个版本字符串值，
  用来记录算子进入对应阶段时的 FlagGems 版本号。算子的**阶段**是用来衡量算子成熟度的指标，
  具体定义如下：

  - 一个新的、手工编写的算子通常以 `beta` 阶段作为起点。
  - 一个新的、AI 生成的算子通常以 `alpha` 阶段作为起点。
  - 当某个算子被持续测试一段时间，在一整个发版周期内都没有发现重大问题，
    就可能在接下来的发布版本中被提升为新的阶段。例如，假定有一个算子在 *5.0* 版本内以 `alpha`
    阶段引入，并且在至少一个发版周期内都没有发现重大缺陷，那么它就可能在下一个发布版本（*5.1*）
    中被提升为 `beta` 阶段算子。
  - 已有的算子在开始经常出错时，也可能会被从 `stable` 降格为 `beta` 或 `alpha`。

所有新的算子都必须被注册到 `conf/operators.yaml` 算子目录文件中，用来跟踪其成熟度。
在为算子确定其标识符（ID）时，请遵循以下建议：

- 对于在 `src/flag_gems/__init__.py` 中注册的所有 aten 算子，必须在 `conf/operators.yaml`
  算子目录中有一独立条目。
- 对于在 `src/flag_gems/fused/__init__.py` 文件中注册的所有融合算子，必须在算子目录文件
  `conf/operators.yaml` 中存在独立条目。
- 对于已有算子的变种，例如 *in-place* 算子（名字通常带一个 `_` 后缀），或者 `.out` 算子，
  即将输出结果赋给给定的 `out` 参数的算子，通常也需要在算子目录 `conf/operators.yaml`
  文件中给出独立表项。这是因为这类算子也会被 PyTorch 框架作为独立的算子来派发。
- 对于其他变种，例如处理张量和标量的不同算子，我们使用相同的判别标准来决定是否需要在算子目录
  `conf/operators.yaml` 中注册独立条目。

## 2. 代码格式检查

在 FlagGems 项目中使用 `pre-commit` GIT 回调机制，你可以较容易地完成对 Python
源代码的格式化，并且在执行 `git commit` 命令时自动执行一些基本的代码预检工作。

```shell
pip install pre-commit
pre-commit install
pre-commit
```

## 3. 算子单元测试 {#operator-unit-tests}

单元测试的目的是检查算子实现的正确性。
在添加新的算子实现时，你需要在 `tests` 目录下对应的文件中为其添加单元测试。
添加新的测试文件时，

针对算子的单元测试，需要在测试函数之前使用 `@pytest.mark.{OP_ID}` 修饰符进行修饰，
这样方便我们使用 `pytest -m` 命令来启动针对特定算子的单元测试。

当添加新的 C++ 封装的算子时，你需要为算子添加对应的 *ctest*。
参见[添加 C++ 封装的算子](../contribution/cpp-wrapper)。

### 模型测试  {#model-test}

模型测试的作用是检查模型的正确性。
添加新模型的过程与添加一个新算子的过程类似。

### 测试覆盖率 {#test-coverage}

Python 测试覆盖率检测某个算子的单元测试覆盖率。
在执行单元测试时，可以使用 `coverage` 工具来收集单元测试所覆盖的代码行，
工具会自行计算覆盖率数值。

测试覆盖率会在单元测试和每日的全量单元测试任务中进行汇总。
汇总后的单元测试率数据会通过 FlagGems 的项目网站公布。

## 4. 算子的性能基准测试 {#operator-performance-benchmarking}

**算子基准测试（Operator Benchmark）** 用来评估算子实现的性能状况。
在添加新的算子实现或者优化现有算子时，你需要在 `benchmark/` 目录下
对应的文件中添加性能测试用例。

当有新的测试用例被添加到 `benchmark/` 子目录，或者该子目录下现有的测试用例被更改时，
CI 流水线会自动检测到这类变更并触发对应的性能测试操作。

关于如何编写性能测试用例的详细信息，可参阅
[Python 性能测试](../performance/benchmark)一节。

## 5. 关于测例的标记（marks）

我们用来驱动精度测试（单元测试）和性能测试（基准测试）的 `pytest` 工具提供一种机制，
允许我们为测试用例添加注解，为之打上**定制标记（Custom Marks）**。
FlagGems 项目利用这一设施来选择性地执行针对某个（某些）算子的测试或性能分析。
在下面的例子中，测试用例的注解 `@pytest.mark.abs` 标明此测试用例是用来测试 `abs` 算子的。

```python
@pytest.mark.abs
@pytest.mark.parametrize("shape", utils.POINTWISE_SHAPES)
@pytest.mark.parametrize("dtype", utils.FLOAT_DTYPES)
def test_abs(shape, dtype):
   inp = torch.randn(shape, dtype=dtype, device=flag_gems.device)
   # ...
```

注意，我们将定制标记（这里的 `abs`）视为算子的标识符（ID）。
每一个单元测试用例或者性能测试用例都必须使用算子的 ID 进行标记。
