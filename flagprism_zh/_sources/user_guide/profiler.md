# Profiler

FlagTree Profiler 是面向 Triton 的轻量级性能分析器，提供从 Python 调用的 GPU kernel 的程序上下文、metadata 和硬件性能指标，并将记录聚合为调用树、时间线、Hatchet、元数据及厂商相关输出。

## 基本用法

分析一个函数：

```python
import flagtree.profiler as profiler

# name：profile 数据路径
# context：每个 GPU kernel 上下文的标注方式，支持 "shadow" 和 "python"
session_id = profiler.profile(func, name="profile_name", context="python")(args)
```

分析一段代码区域：

```python
session_id = profiler.start(name="profile_name", context="python")
# ... 待分析代码 ...
profiler.deactivate(session_id)   # 跳过某区域
profiler.activate(session_id)     # 重新开始分析
# ...
profiler.finalize()               # 写出 profile 数据并结束
```

## Scope 与指标

`python` 上下文报告每个 GPU kernel 被调用的文件、函数和行号；`shadow` 上下文报告用户标注的区域：

```python
import flagtree.profiler as profiler

session_id = profiler.start(name="profile_name", context="shadow")
with profiler.scope("test0"):
    with profiler.scope("test1"):
        foo[1,](x, y)
with profiler.scope("test2"):
    foo[1,](x, y)
profiler.finalize()
```

`scope` 还接受自定义指标字典（指标名 -> int/float），会按 scope 聚合并写入 profile 数据：

```python
with profiler.scope("test0", {"bytes": 1000}):
    ...
```

`cpu_timed_scope` 用法与 `scope` 类似，但会额外把该区域的 CPU 时间记录为 `cpu_time` 指标：

```python
with profiler.cpu_timed_scope("test"):
    foo[1,](x, y)
```

还可以用 `state` 标注调用路径。与 `scope` 不同，state 不递归，最内层 state 会覆盖外层；它作为后缀追加在每个 kernel 名称之上，并兼容两种上下文：

```python
with profiler.scope("test"):
    with profiler.state("state0"):
        with profiler.scope("test0"):
            foo0[1,](x, y)
        with profiler.scope("test1"):
            foo1[1,](x, y)
```

## 后端与模式

FlagTree Profiler 支持七个后端：

| 后端 | 目标 | 说明 |
| --- | --- | --- |
| `nvidia` | NVIDIA GPU | 默认 NVIDIA 后端；进程内 CUPTI 活动流，提供 launch 几何信息、kernel 时长、数据传输及硬件计数器指标。 |
| `cupti` | NVIDIA GPU | 旧版 NVIDIA 采集器；支持 `pcsampling`（指令采样）。 |
| `roctracer` | AMD GPU | 仅默认分析模式。 |
| `instrumentation` | NVIDIA 与 AMD | 自定义指标与细粒度 kernel 内 trace。 |
| `cann` | 昇腾 | 使用昇腾厂商适配器与 CANN 运行时/导入路径。 |
| `mthreads` | 摩尔线程 | 使用原生 MUPTI 接口；报告 launch 几何信息、占用率、资源使用与峰值显存带宽。 |
| `tianshu` | 天数/CoreX | 通过 CoreX 兼容驱动复用 Debugger instrumentation；从 ixKN CSV 导入指标。 |

默认情况下，profiler 根据活动目标后端自动选择 `nvidia`、`roctracer`、`cann`、`mthreads` 或 `tianshu`。可显式指定后端：

```python
profiler.start(name="profile_name", context="shadow", backend="cupti_pcsampling")
```

### 指令采样

NVIDIA GPU 可通过 `cupti_pcsampling` 使用指令采样；端到端开销约 20 倍（主要来自 CPU 侧传输与处理），但单个 kernel 的开销可以忽略。`flagtree-profiler-viewer` 的 `-i <regex> -d <depth> -t <threshold>` 选项可帮助过滤关注的 op。

### Instrumentation

`instrumentation` 后端提供细粒度的 kernel 内分析，生成 trace 或 tree 视图，默认分析 kernel cycles，可能需要共享内存。DSL 级插桩默认只支持 Gluon kernel；高阶用户可改为对 `ttir` 或 `ttgir` IR 插桩。

### 合并 profile

多个使用不同后端的并发 session 可以分析同一区域，再用 Hatchet 合并做事后分析：

```python
profiler.start(name="profile_name0", context="shadow", backend="cupti")
profiler.start(name="profile_name1", context="shadow", backend="instrumentation")
# ...
profiler.finalize()
```

## Launch metadata hook

使用 `hook="triton"` 时，profiler 会在每个 kernel 启动前调用 `launch_metadata` 函数，以便提供逐 kernel 的元数据：

```python
profiler.start("profile_name", hook="triton")

def metadata_fn(grid, metadata, args):
    return {"name": "<kernel_name>", "flops16": 1.0, "bytes": 0}

@triton.jit(launch_metadata=metadata_fn)
def foo(x, y):
    tl.store(y, tl.load(x))
```

支持的键为 `name`、`flops8`、`flops16`、`flops32`、`flops64`、`bytes`。

## 命令行

```bash
flagtree-profiler [options] script.py [script_args] [script_options]
flagtree-profiler [options] pytest [pytest_args] [script_options]
python -m flagtree.profiler.cli [options] script.py [script_args] [script_options]
```

命令行模式下会自动调用 `profiler.start` 和 `profiler.finalize`，且只支持单个 session。天数/ixKN 工作流请使用 `flagtree-profiler --ixkn` 包装器，因为 ixKN 需要从进程启动时开始分析目标进程。

## 结果可视化

默认 profile 以 JSON 写出，可被 [Hatchet](https://github.com/hatchet/hatchet) 读取（安装 `llnl-hatchet`；`hatchet` 包是另一套 API）：

```bash
flagtree-profiler-viewer -m time/s <profile.hatchet>
flagtree-profiler-viewer -m time/ns,time/% <profile.hatchet> --print-sorted
flagtree-profiler-viewer -m time/ns,cpu_time/ns <profile.hatchet>
```

若要导出完整 trace 而非聚合数据，启动 profiler 时设置 `data="trace"`。输出为 Chrome trace 格式，可用 `chrome://tracing` 或 [Perfetto](https://perfetto.dev) 查看。

全部选项见 `flagtree-profiler-viewer -h`。

## 环境变量

运行时环境变量使用 `FLAGTREE_PROFILER_*` 前缀。公开 Python 入口为 `flagtree.profiler`，native 模块为 `flagtree.profiler._native`；CLI 工具为 `flagtree-profiler` 和 `flagtree-profiler-viewer`。
