# 启用调试日志

为了方便算子开发（尤其是调试和性能分析优化），*FlagGems* 为 `enable()`
和 `only_enable()` API 接口提供一些可选的参数，方便问题诊断。
具体如下：

| 参数名称       | 数据类型    | 描述                                            |
| -------------- | ----------- | ----------------------------------------------- |
| `record`       | `bool`      | 记录算子调用以便调试或性能分析                  |
| `path`         | `str`       | 给出日志文件路径（仅适用于 `record=True` 情形） |

如果你希望在运行时记录算子的调用情况，你可以设置 `record=True`，
同事将 `path` 设置为日志文件的路径字符串。

```python
flag_gems.enable(
    record=True,
    path="./gems_debug.log"
)
```

在你的程序结束执行之后，你可以检视日志文件（如 `./gems_debug.log`）
以了解哪些算子被通过 `flag_gems` 调用过（即被加速过）。

下面是日志输出的样子：

```shell
$ cat ./gems_debug.log
[DEBUG] flag_gems.ops.fill: GEMS FILL_SCALAR_
[DEBUG] flag_gems.ops.fill: GEMS FILL_SCALAR_
[DEBUG] flag_gems.ops.mm: GEMS MM
[DEBUG] flag_gems.fused.reshape_and_cache: GEMS RESHAPE_AND_CACHE
```

> [!WARNING]
> **警告**
>
> 记录日志的行为牵涉到磁盘 I/O 操作，可能会对工作负载的性能带来负面影响。
> 如果算子所执行的任务是比较简单的计算或者被调用的频率很高，
> 日志记录带来的性能影响可能不容忽视。
