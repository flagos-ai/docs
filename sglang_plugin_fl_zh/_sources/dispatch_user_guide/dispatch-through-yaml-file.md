# 通过 YAML 配置文件进行调度

<!-- CHANGED: v0.2.0 stores platform defaults under sglang_fl/dispatch/config and distinguishes explicit YAML from platform auto-detection. -->
插件在 `sglang_fl/dispatch/config/` 下提供平台 YAML 默认配置。可用的平台文件包括 `ascend.yaml`、`gcu.yaml`、`hygon.yaml`、`iluvatar.yaml`、`kunlunxin.yaml`、`musa.yaml`、`nvidia.yaml` 和 `tsingmicro.yaml`。这些文件提供默认调度策略；它们不是厂商验证矩阵。

当您需要覆盖平台默认值时，请创建显式 YAML 文件：

```{code-block} shell
SGLANG_FL_CONFIG=./my_config.yaml python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph
```

配置优先级如下：

```{code-block} text
environment variables > explicit YAML (`SGLANG_FL_CONFIG`) > platform auto-detected YAML > code defaults
```

如果未提供显式 YAML，则使用检测到的平台 YAML 和代码默认值。环境变量可以覆盖任一 YAML 来源。

## 配置字段

```yaml
# 全局后端偏好：flagos | vendor | reference
prefer: flagos

# 逐算子后端优先级（有序列表，第一个可用者胜出）
op_backends:
  rms_norm: [vendor, flagos, reference]
  silu_and_mul: [flagos, vendor, reference]

# 要跳过的第二层融合算子（回退到 SGLang 原生路径）
oot_blacklist:
  - RotaryEmbedding

# 要从 FlagGems Triton 替换中排除的第一层 ATen 算子
flagos_blacklist:
  - mul
  - sub

# 可选厂商过滤器
allow_vendors: []
deny_vendors: []

# 为 true 时禁用回退
strict: false
```

| 字段 | 描述 |
|-------|-------------|
| `prefer` | 全局后端偏好：`flagos`、`vendor`、`reference` |
| `op_backends` | 逐算子有序后端列表；选择第一个可用且被允许的后端 |
| `oot_blacklist` | 要从 OOT 调度中跳过的第二层融合算子 |
| `flagos_blacklist` | 要从 FlagGems 替换中排除的第一层 ATen 算子 |
| `allow_vendors` | 可选厂商允许列表；只有列出的厂商符合条件 |
| `deny_vendors` | 可选厂商拒绝列表 |
| `strict` | 启用后禁用回退；确切 YAML 布尔语法为 [TODO: needs confirmation] |

## 常用配置方案

每个方案展示一个 YAML 配置和预期的调度结果。使用[调度日志](debugg-and-diagonostics.md)进行验证。

### 1. 跳过 RotaryEmbedding 的 OOT 调度（回退到 SGLang 原生路径）

```yaml
# my_config.yaml
prefer: flagos
oot_blacklist:
  - RotaryEmbedding
```

预期调度日志：仅出现 SiluAndMul 和 RMSNorm，不出现 RotaryEmbedding。

### 2. 强制 RMSNorm 使用 vendor 后端，其他使用 flagos

```yaml
# my_config.yaml
prefer: flagos
op_backends:
  rms_norm: [vendor, flagos, reference]
```

预期调度日志：根据当前平台和厂商过滤器，选择第一个可用且被允许的后端。

### 3. 所有算子使用纯 PyTorch reference（适用于精度调试）

```yaml
# my_config.yaml
prefer: reference
```

预期调度日志：在可用时选择 reference 实现。
