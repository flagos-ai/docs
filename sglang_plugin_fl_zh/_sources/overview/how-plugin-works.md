# 插件工作原理

## 加载插件

SGLang 在启动时通过 setuptools entry_points 自动发现并加载插件。

插件在 `pyproject.toml` 中注册了两个 entry_points：

```{code-block} python
[project.entry-points."sglang.srt.plugins"]
sglang_fl = "sglang_fl:load_plugin"

[project.entry-points."sglang.srt.platforms"]
sglang_fl = "sglang_fl:activate_platform"
```

## 调度钩子

核心机制使用 `MultiPlatformOp.dispatch_forward()` 上的 AROUND 钩子，结合标准化调度系统：

<!-- CHANGED: v0.2.0 dispatch no longer documents a fixed flagos > vendor > reference resolution order. -->
```{code-block} python
dispatch_forward() 被调用（例如 RMSNorm）
  → AROUND 钩子拦截
    → 检查 OOT_WHITELIST/OOT_BLACKLIST
    → 通过 MRO 查找桥接函数（RMSNorm → rms_norm_bridge）
    → 返回桥接函数作为 forward 方法
  → SGLang 使用框架参数调用桥接函数：
      rms_norm_bridge(self, x, residual, post_residual_addition)
    → 桥接函数处理 SGLang 特定参数（post_residual_addition → 合并到 residual）
    → 桥接函数调用 dispatch.call_op("rms_norm", obj, x, residual)
      → OpManager 请求 SelectionPolicy 提供候选后端顺序
      → 策略综合全局偏好、逐算子顺序、可用性、厂商过滤和严格模式
      → OpManager 选择第一个可用实现并缓存结果，或在允许时执行回退
      → 调用选中的后端实现
```
桥接层将框架特定参数与标准化算子签名解耦。厂商后端只需实现标准签名——同一实现可同时用于 sglang-plugin-FL 和 vllm-plugin-FL。

<!-- NEW in v0.2.0 -->
严格模式会禁用回退：如果首选后端或显式指定顺序中的后端无法使用，调度会报告错误，而不是静默选择其他后端。在非严格模式下，不可用后端会被过滤，随后运行下一个允许的候选后端。
<!-- END NEW -->

## 调度架构（与 vllm-plugin-FL 共享）

```{code-block} python
┌─────────────────────────────────────────────────────────────┐
│  SGLang AROUND Hook        │  vLLM forward_oot override     │
│  (bridge/rms_norm.py)      │  (vllm_fl/ops/layernorm.py)    │
└────────────┬───────────────┴────────────────┬───────────────┘
             │                                │
             ▼                                ▼
┌─────────────────────────────────────────────────────────────┐
│  dispatch.call_op("rms_norm", obj, x, residual)             │
│  OpManager → SelectionPolicy → OpRegistry → resolve impl    │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   ┌─────────────┐  ┌───────────┐  ┌──────────────┐
   │ FLAGOS      │  │ VENDOR    │  │ REFERENCE    │
   │ (FlagGems)  │  │ (chip-    │  │ (PyTorch)    │
   │             │  │ native)   │  │              │
   └─────────────┘  └───────────┘  └──────────────┘
```
芯片厂商为两个框架实现**相同的后端接口**。唯一的框架特定代码是桥接层，由插件维护。

## ATen 替换

```{code-block} python
插件加载 → flag_gems.enable(record=True)
  → PyTorch 调度表为 ATen 算子注册 Triton 内核
  → 首次推理调用时，记录每个被替换的算子
  → _AtenOnlyFilter 确保只记录 flag_gems.ops.* 调用
    （排除第二层 flagos 实现中触发的内部 FlagGems 调用）
```

<!-- NEW in v0.2.0 -->
## 空模式边界

空模式是一种安装与运行时组装机制，适用于以 CUDA 为导向的依赖集并非部署环境的目标平台。它不是无设备模式。目标平台仍需提供厂商 torch、驱动、固件、设备运行时、通信库、平台注意力后端以及插件未覆盖的算子。

有关特定平台的运行时和镜像选择，请使用集中式厂商/框架/镜像选择页面：[集中式厂商/框架/镜像选择页面](https://flagos.io/resourcedownload?lang=en)。
<!-- END NEW -->
