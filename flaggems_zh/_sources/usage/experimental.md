# 使用实验性质的算子

*FlagGems* 的 `experimental_ops` 模块提供了一个名字空间，
用来存放尚未为生产环境使用准备就绪的算子。
在这个包中的算子可以通过 `flag_gems.experimental_ops.*` 的形式来访问。
实验性质算子的开发与与核心的稳定算子相同的开发模式。

```python
from flag_gems import experimental_ops as ops

result = ops.rmsnorm(*args)
```

你也可以在 `use_gems()` 所构造的上下文管理器中使用实验性质的算子，
不过你必须使用算子的完整包名才能访问到这类算子。

```python
with flag_gems.use_gems():
    result = flag_gems.experimental_ops.rmsnorm(*args)
```
