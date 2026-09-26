# 配置后端选择

调度系统支持多种方式配置后端选择：

1. **用户指定的配置文件（YAML）** - 完全覆盖
2. **环境变量** - 覆盖特定项
3. **平台特定配置文件** - 自动检测的默认值
4. **内置默认值**

## 配置优先级

```
┌─────────────────────────────────────────────────────────────────┐
│                    配置优先级                                     │
│                  （从高到低）                                      │
├─────────────────────────────────────────────────────────────────┤
│  1. VLLM_FL_CONFIG        │ 用户配置文件，完全覆盖               │
│  2. 环境变量               │ 覆盖特定项                          │
│  3. 平台配置文件           │ ascend.yaml / cuda.yaml 默认值       │
│  4. 内置默认值             │ 代码定义的默认值                     │
└─────────────────────────────────────────────────────────────────┘
```

```{note}
- 环境变量可以覆盖平台配置中的特定项
- 如果用户未设置任何环境变量，则使用平台配置
- 用户也可以直接修改平台配置文件
```

调度系统按以下顺序应用配置：

```
┌─────────────────────────────────────────────────────────────────────┐
│                     配置解析                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  设置了 VLLM_FL_CONFIG？                                              │
│       │                                                               │
│       ├── 是 ──▶ 使用用户配置文件（完全覆盖）                          │
│       │                                                               │
│       └── 否 ──▶ 对每个设置：                                         │
│                       │                                               │
│                       ├── 设置了环境变量？──▶ 使用环境变量值           │
│                       │                                               │
│                       └── 未设置 ──▶ 使用平台配置值                    │
│                                              │                        │
│                                              └── 未找到 ──▶ 默认值    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 用户指定的配置文件（YAML）

设置 `VLLM_FL_CONFIG` 环境变量以指定一个 YAML 配置文件，该文件将完全覆盖所有其他设置：

```bash
export VLLM_FL_CONFIG=/path/to/vllm_fl_dispatch.yaml
```

### 配置文件示例

```{code-block} yaml
# vllm_fl_dispatch.yaml

# 首选后端类型：flagos、vendor 或 reference
prefer: vendor

# 严格模式：
#   true  = 出错立即失败，不回退
#   false = 失败时尝试下一个后端（默认）
strict: false

# 厂商白名单（可选）
allow_vendors:
  - cuda

# 厂商黑名单（可选）
deny_vendors:
  - ascend

# 每个算子的后端选择顺序（可选）
# 仅尝试列出的后端，按指定顺序。
op_backends:
  rms_norm:
    - vendor        # 先尝试任何可用的厂商
    - flagos        # 再尝试 flagos
    # 未列出 reference，因此不会用于 rms_norm

  silu_and_mul:
    - vendor:cuda   # 仅尝试 CUDA，不尝试其他厂商
    - flagos
    - reference

# FlagGems 算子黑名单（可选）
# 这些算子不会使用 FlagGems 实现
flagos_blacklist:
  - to_copy
  - zeros
  - mm

# OOT 算子黑名单（可选）
# 这些算子不会注册为 OOT 替换
oot_blacklist:
  - fused_moe
```

#### Token 类型说明

| Token | 说明 |
|-------|-------------|
| `flagos` | FlagOS 默认实现 |
| `reference` | PyTorch 参考实现 |
| `vendor` | 任何可用的厂商后端（自动检测硬件） |
| `vendor:cuda` | 仅 CUDA 厂商后端 |
| `vendor:ascend` | 仅 Ascend 厂商后端 |

**注意**：使用 `vendor`（不指定厂商名称）时，系统会根据硬件检测自动选择可用的厂商后端。

#### 更多算子后端选择示例

```yaml
op_backends:
  mul:
    - flagos
  silu_and_mul:
    - flagos
    - vendor
    - reference
```

(environment-variables)=
## 环境变量

环境变量可以覆盖平台配置中的特定项。如果未设置，则使用平台配置文件中的值。

### 核心配置

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `VLLM_FL_PREFER_ENABLED` | `true` | 全局开关。设为 `false` 禁用所有调度功能 |
| `VLLM_FL_CONFIG` | （无） | YAML 配置文件路径（完全覆盖） |
| `VLLM_FL_PLATFORM` | （自动） | 强制平台：`ascend`、`cuda` |

### 后端选择

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `VLLM_FL_PREFER` | `flagos` | 首选后端：`flagos`、`vendor`、`reference` |
| `VLLM_FL_STRICT` | `0` | 严格模式：`1` = 出错即失败，`0` = 尝试回退 |
| `VLLM_FL_PER_OP` | （无） | 每个算子的顺序：`op1=a\|b\|c;op2=x\|y` |
| `VLLM_FL_HOPPER_LONG_CONTEXT_OPT` | `0` | 在 NVIDIA Hopper 上，将 attention 路由到 FA3，将 `mm`/`mm_out` 路由到原生 CUDA |
| `VLLM_FL_ALLOW_VENDORS` | （无） | 厂商白名单，逗号分隔 |
| `VLLM_FL_DENY_VENDORS` | （无） | 厂商黑名单，逗号分隔 |

### FlagGems 控制

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `USE_FLAGGEMS` | `true` | 启用/禁用 FlagGems |
| `VLLM_FL_FLAGOS_WHITELIST` | （无） | FlagGems 算子白名单（与黑名单互斥） |
| `VLLM_FL_FLAGOS_BLACKLIST` | （无） | FlagGems 算子黑名单（与白名单互斥） |
| `VLLM_FL_FLAGOS_BLACKLIST_APPEND` | （无） | 在已选定的平台或显式黑名单基础上追加排除项；白名单生效时忽略此项 |

**优先级**：`WHITELIST` > （`BLACKLIST` 环境变量或平台 `flagos_blacklist`） + `BLACKLIST_APPEND`

### OOT 算子控制

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `VLLM_FL_OOT_ENABLED` | `1` | 启用 OOT 算子注册 |
| `VLLM_FL_OOT_WHITELIST` | （无） | OOT 算子白名单 |
| `VLLM_FL_OOT_BLACKLIST` | （无） | OOT 算子黑名单 |

**优先级**：`WHITELIST` > `BLACKLIST`（环境变量）> `oot_blacklist`（配置文件）

### 调试与日志

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `VLLM_FL_LOG_LEVEL` | `INFO` | 日志级别：`DEBUG`、`INFO`、`WARNING`、`ERROR` |
| `VLLM_FL_DISPATCH_DEBUG` | `0` | 启用调度调试模式 |

### 插件

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `VLLM_FL_PLUGIN_MODULES` | （无） | 外部插件模块，逗号分隔 |
| `VLLM_FL_OP_CONFIG` | （无） | 算子配置 JSON 文件路径 |

### 其他环境变量

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `FLAGCX_PATH` | （无） | FlagCX 库路径（启用 FlagCX 通信后端） |
| `FLAGGEMS_ENABLE_OPLIST_PATH` | `/tmp/flaggems_enable_oplist.txt` | FlagGems 启用算子列表文件 |

### 示例

```bash
# 使用平台默认配置（自动检测）
# 无需设置——直接运行您的应用程序

# 仅覆盖 prefer 设置（其他项来自平台配置）
export VLLM_FL_PREFER=vendor

# 覆盖 FlagGems 黑名单（覆盖配置文件黑名单）
export VLLM_FL_FLAGOS_BLACKLIST="mm,to_copy,zeros"

# 保留平台默认配置并追加一条部署相关的排除项
export VLLM_FL_FLAGOS_BLACKLIST_APPEND="linear"

# 改用白名单（完全忽略任何黑名单）
export VLLM_FL_FLAGOS_WHITELIST="silu_and_mul,rms_norm"

# 指定每个算子的顺序
export VLLM_FL_PER_OP="rms_norm=vendor|flagos|reference"

# 为 A/B 对比启用 NVIDIA Hopper 长上下文路由
export VLLM_FL_HOPPER_LONG_CONTEXT_OPT=1

# 使用完全自定义的配置文件
export VLLM_FL_CONFIG=/path/to/my_config.yaml

# 强制指定平台
export VLLM_FL_PLATFORM=ascend

# 启用调试日志
export VLLM_FL_LOG_LEVEL=DEBUG
```

### 白名单与黑名单优先级

对于 FlagGems 和 OOT 算子：

```
WHITELIST（环境变量）──▶ 完全覆盖黑名单
       │
       └── 未设置 ──▶ BLACKLIST（环境变量）──▶ 覆盖配置黑名单
                              │
                              └── 未设置 ──▶ 配置文件黑名单
                                                    │
                                                    └── 未设置 ──▶ 全部允许
```

```{note}
- 白名单和黑名单环境变量互斥（同时设置会报错）
- 如果设置了白名单，则完全忽略任何黑名单（环境变量或配置）
- 环境变量黑名单覆盖配置文件黑名单（不合并）
- `VLLM_FL_FLAGOS_BLACKLIST_APPEND` 保留已选定的平台黑名单或显式黑名单，并在其基础上追加部署相关的排除项
```

#### 示例：组合环境变量

```bash
# 平台配置（ascend.yaml）包含：
#   prefer: flagos
#   flagos_blacklist: [to_copy, zeros, mm, ...]

# 用户仅覆盖 prefer，黑名单仍来自配置
export VLLM_FL_PREFER=vendor

# 结果：
#   prefer: vendor（来自环境变量）
#   flagos_blacklist: [to_copy, zeros, mm, ...]（来自配置）
```

```bash
# 用户也想覆盖黑名单
export VLLM_FL_PREFER=vendor
export VLLM_FL_FLAGOS_BLACKLIST="custom_op1,custom_op2"

# 结果：
#   prefer: vendor（来自环境变量）
#   flagos_blacklist: [custom_op1, custom_op2]（来自环境变量，忽略配置）
```

```{note}
- **环境变量覆盖，不合并**：设置环境变量会完全替换配置值
- **`VLLM_FL_PREFER` 设置偏好，而非排他性**：它定义选择顺序，但如果首选后端不可用，会回退到其他后端
- **强制特定后端**：结合 `PREFER` 与 `DENY_VENDORS` 或使用 `PER_OP` 排除不需要的后端
- **`VLLM_FL_STRICT=1`**：启用严格模式——主实现失败时立即报错，不尝试回退
```

### 回退机制

当 `VLLM_FL_STRICT=0`（默认）时，如果主实现失败，系统会自动尝试其他可用实现：

```
Op 'rms_norm' using 'default.flagos' (kind=flagos, vendor=None)
[WARNING] Implementation 'default.flagos' failed for op 'rms_norm': ...
Op 'rms_norm' fallback to 'reference.torch' (kind=reference, vendor=None)
```

## 平台特定配置

系统根据 vLLM 平台的 `vendor_name` 检测硬件平台，并从 `config/` 目录加载相应的配置文件。每份平台配置都设置了首选后端、每个算子的后端顺序，以及 FlagGems/OOT 黑名单。

| 平台 | 配置文件 | 平台 | 配置文件 |
|----------|-------------|----------|-------------|
| Ascend NPU | `config/ascend.yaml` | 摩尔线程（MUSA） | `config/musa.yaml` |
| NVIDIA GPU | `config/nvidia.yaml` | 沐曦（MACA） | `config/metax.yaml` |
| NVIDIA Hopper（可选开启） | `config/nvidia_hopper.yaml` | 昆仑芯 | `config/kunlunxin.yaml` |
| 天数智芯 | `config/iluvatar.yaml` | T-Head PPU | `config/thead.yaml` |
| 海光 DCU | `config/hygon.yaml` | 曦望 | `config/sunrise.yaml` |
| 燧原（GCU） | `config/enflame.yaml` | 阿里 PPU | `config/ptg.yaml` |

当设置了 `VLLM_FL_HOPPER_LONG_CONTEXT_OPT=1` 且设备算力为 9.x 时，会选择 `nvidia_hopper.yaml` 而不是 `nvidia.yaml`。

您可以使用 `VLLM_FL_PLATFORM` 环境变量强制指定平台：

```bash
export VLLM_FL_PLATFORM=ascend  # 强制使用 Ascend 配置
export VLLM_FL_PLATFORM=cuda    # 强制使用 CUDA 配置
```

## 算子列表

本参考列出了 vllm-plugin-FL 支持的所有算子及其后端可用性。

### 支持的算子

| 算子 | 说明 | FlagGems | Reference | Vendor |
|----------|-------------|----------|-----------|--------|
| `dynamic_per_token_quant_int8` | 对称动态 per-token INT8 量化（兼容 vLLM） | ✓ | ✓ | - |
| `silu_and_mul` | SiLU 激活 + 逐元素乘法 | ✓ | ✓ | ✓ |
| `gelu_and_mul` | GELU 激活 + 逐元素乘法 | ✓ | ✓ | ✓ |
| `rms_norm` | RMS 归一化 | ✓ | ✓ | ✓ |
| `rotary_embedding` | 旋转位置编码 | ✓ | ✓ | ✓ |
| `attention_backend` | 注意力后端类路径 | ✓ | ✓ | ✓ |
| `topk_softmax` | MoE top-k 路由 + softmax | ✓ | ✓ | ✓ |
| `grouped_topk` | MoE 分组 top-k 路由 | ✓ | ✓ | ✓ |
| `moe_align_block_size` | MoE token 对齐与 block size 计算 | ✓ | ✓ | ✓ |
| `moe_sum` | MoE 专家输出归约 | ✓ | ✓ | ✓ |
| `invoke_fused_moe_triton_kernel` | Fused MoE Triton kernel 调用 | ✓ | ✓ | ✓ |
| `chunk_gated_delta_rule_fwd` | Gated delta rule 前向（prefill 路径，线性注意力） | - | - | ✓ |
| `fused_recurrent_gated_delta_rule_fwd` | Gated delta rule 前向（decode 路径，线性注意力） | - | - | ✓ |
| `causal_conv1d_fn` | 因果一维卷积（prefill 路径，Mamba 类模型） | - | - | ✓ |
| `causal_conv1d_update` | 因果一维卷积（decode 路径，Mamba 类模型） | - | - | ✓ |
| `fused_gdn_gating` | 融合 gated delta network 门控 | - | - | ✓ |

### 后端优先级

调度系统根据以下优先级层级选择算子。优先级值间隔 50，以便将来插入中间优先级。

1. **FlagGems**（DEFAULT）— 优先级 150
2. **厂商特定** — 优先级 100
3. **PyTorch 参考** — 优先级 50

优先级值越高越优先。当某个实现不可用时，系统会回退到下一个优先级级别。
