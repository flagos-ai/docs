# 调试与诊断

本节介绍算子调度的诊断方法。

<!-- NEW in v0.2.0 -->
## 策略与后端解析

调度采用基于策略的方式，而不是固定的 `flagos > vendor > reference` 链。当算子未使用预期实现时，请检查有效配置和后端可用性：

1. 检查 `SGLANG_FL_PREFER`、`SGLANG_FL_PER_OP`、`SGLANG_FL_ALLOW_VENDORS`、`SGLANG_FL_DENY_VENDORS` 和 `SGLANG_FL_STRICT` 等环境变量覆盖项。
2. 检查 `SGLANG_FL_CONFIG` 以及 `sglang_fl/dispatch/config/` 下检测到的平台 YAML。
3. 如果需要额外的策略诊断，请启用 `SGLANG_FL_DISPATCH_DEBUG=[TODO: needs confirmation]`。
4. 确认所选后端的运行时和设备在目标镜像中可用。

严格模式下，如果首选或显式排序的后端不可用，系统会报错而不是回退。未启用严格模式时，调度会过滤不可用或不允许的候选项，并选择下一个允许的实现。

## 分布式与 FlagCX 诊断

对于分布式通信故障，请检查所选的 `SGLANG_FL_DIST_BACKEND`、预期使用 FlagCX 时的 `FLAGCX_PATH`、设备可见性、网络配置以及张量并行 / 流水线并行设置。平台特定的框架、镜像和网络设备前置条件记录在[集中式厂商 / 框架 / 镜像选择页面](https://flagos.io/resourcedownload?lang=en)中。
<!-- END NEW -->

## 调度日志

查看每个融合算子解析到哪个后端（在服务器启动时写入）：

```{code-block} python
rm -f /tmp/dispatch.log
SGLANG_FL_DISPATCH_LOG=/tmp/dispatch.log \
  python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

sort -u /tmp/dispatch.log
# [OOT-DISPATCH] SiluAndMul → flagos(flagos)
# [OOT-DISPATCH] RMSNorm → flagos(flagos)
# [OOT-DISPATCH] RotaryEmbedding → flagos(flagos)
```

## ATen 替换日志

记录哪些 PyTorch ATen 算子被 FlagGems 替换：

```{code-block} python
rm -f /tmp/gems_aten.txt
SGLANG_FLAGGEMS_RECORD=1 SGLANG_FLAGGEMS_LOG_PATH=/tmp/gems_aten.txt \
  python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# 首次推理请求后：
sort -u /tmp/gems_aten.txt
```

```{note}
日志使用 `_AtenOnlyFilter` 仅记录 `flag_gems.ops.*` 命名空间调用，排除第二层实现触发的内部 FlagGems 调用。
```

## 通过精度二分法排查数值精度问题

当出现数值差异时，隔离出导致问题的层。如果输出在第 N 步发散但第 N-1 步正常，则问题层 / 算子被定位。

```{code-block} python
# 第 1 步：禁用所有——确认原生 SGLang 正常工作
SGLANG_PLUGINS="__none__" python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# 第 2 步：仅启用第二层（融合算子），禁用 ATen 替换
USE_FLAGGEMS=0 python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# 第 3 步：逐算子隔离——仅 SiluAndMul 使用 flagos，RMSNorm 使用 reference
USE_FLAGGEMS=0 \
SGLANG_FL_PER_OP="silu_and_mul=flagos;rms_norm=reference" \
    python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# 第 4 步：禁用第二层，仅 ATen 替换激活
SGLANG_FL_OOT_ENABLED=0 python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# 第 5 步：通过白名单逐步启用 ATen 算子
SGLANG_FL_OOT_ENABLED=0 SGLANG_FL_FLAGOS_WHITELIST=rms_norm,silu \
    python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph
```

## 常见问题

| 症状 | 原因与解决方案 |
| :--- | :--- |
| `dispatch.log` 为空 | 插件未加载——检查 `pip show sglang_fl` |
| `gems_aten.txt` 为空 | 设置了 `USE_FLAGGEMS=0`，或 `SGLANG_FL_FLAGOS_WHITELIST` 排除了该算子 |
| 非 NVIDIA 设备上报 `forward_cuda` 错误 | 某算子缺少 OOT 注册——注册它或添加到白名单 |
| `ImportError: sgl_kernel` | 非 CUDA 环境下正常——OOT 调度会绕过 `forward_cuda` |
| `tp>1` 启动时卡住 | 检查 GPU 数量、NCCL 环境变量、模型 TP 兼容性 |
| 引擎启动时 OOM | 降低 `--mem-fraction-static`（默认 0.5） |
