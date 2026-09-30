# 多平台训练与测试

FlagScale 本身没有硬件平台要求——它通过 FlagOS 插件来编排训练。本指南介绍如何在四类非 NVIDIA 平台（沐曦、海光、昇腾、平头哥）上，配合底层插件栈跑通一次端到端训练。

各平台插件的安装方式见插件文档：

- [Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL) —— 训练引擎
- [TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL) —— Transformer 算子层

---

## 1. 使用的组件版本

| 组件 | 版本 | 仓库 |
|------|------|------|
| FlagScale | v2.1.0 | [flagos-ai/FlagScale](https://github.com/flagos-ai/FlagScale) |
| Megatron-LM-FL | v0.3.0 | [flagos-ai/Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL) |
| TransformerEngine-FL | v0.3.0 | [flagos-ai/TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL) |
| FlagTree | 0.7.0 | [flagos-ai/FlagTree](https://github.com/flagos-ai/FlagTree) |
| FlagGems | v5.4.0 | [flagos-ai/FlagGems](https://github.com/flagos-ai/FlagGems) |

```{note}
以上五个组件是 FlagOS 2.2 软件栈的配套版本，需一起使用。
```

---

## 2. 平台环境变量

FlagScale 通过实验级 YAML 的 `envs` 段传递设备可见性，各平台的变量名不同。

| 平台 | 设备检查命令 | 可见设备环境变量 | FlagTree 后端 |
|------|--------------|------------------|---------------|
| 沐曦 MetaX | `mx-smi` | `MACA_VISIBLE_DEVICES` | `metax` |
| 海光 Hygon | `hy-smi` | `HIP_VISIBLE_DEVICES` | `hcu` |
| 昇腾 Ascend | `npu-smi info` | `ASCEND_RT_VISIBLE_DEVICES` | `ascend` |
| 平头哥 PPU | `ppu-smi` | `CUDA_VISIBLE_DEVICES` | `ppu` |

```{note}
即使在非 CUDA 平台，配置中也必须保留 `CUDA_DEVICE_MAX_CONNECTIONS: 1`——只要启用多卡并行，训练引擎的参数校验就仍要求该变量。
```

平头哥 PPU 沿用 `CUDA_VISIBLE_DEVICES` 名称，没有 `PPU_VISIBLE_DEVICES`。

---

## 3. 安装 FlagScale

```bash
cd /workspace/FlagScale
git checkout v2.1.0
pip install . --no-build-isolation
```

确认版本，并安装训练所需的日志依赖：

```bash
pip list | grep flagscale
pip install wandb aiohttp
```

---

## 4. 配置训练任务

### 4.1 实验级 YAML

`examples/qwen3/conf/train.yaml` 用于选择任务级配置并定义 runner 环境：

```yaml
defaults:
  - _self_
  - train: 0_6b

experiment:
  exp_name: Qwen3-06b-Train
  seed: 42
  save_steps: 10000
  load: null
  exp_dir: xxx
  ckpt_format: torch
  task:
    type: train
    backend: megatron
    entrypoint: flagscale/train/megatron/train_gpt.py
  cmds:
    before_start: ulimit -n 1048576 && source /root/miniconda3/bin/activate flagscale-train
  envs:
    LOGLEVEL: "INFO"
    CUDA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"
    CUDA_DEVICE_MAX_CONNECTIONS: 1
    MACA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"   # 按平台替换

action: run
```

最后一行按第 2 节的平台变量替换：

| 平台 | 替换为 |
|------|--------|
| 沐曦 MetaX | `MACA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"` |
| 海光 Hygon | `HIP_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"` |
| 昇腾 Ascend | `ASCEND_RT_VISIBLE_DEVICES: "0,1,2,3"` |
| 平头哥 PPU | `CUDA_VISIBLE_DEVICES: "8,9,10,11,12,13,14,15"` |

### 4.2 任务级 YAML

`examples/qwen3/conf/train/0_6b.yaml` 承载模型、数据集与优化器设置：

```yaml
micro_batch_size: 1
global_batch_size: 32          # 从 2048 调小，缩短测试时间
eval_iters: 0
eval_interval: 1000
train_samples: 244141056

model:
  lr_scheduler:
    lr: 3.0e-3
    min_lr: 3.0e-4
    lr_warmup_samples: 2048     # 从 2048000 调小
    lr_decay_style: cosine

data:
  data_path: /workspace/FlagScale/data/enron_emails_demo_text_document_qwen
  split: 1
  no_mmap_bin_files: true
  tokenizer:
    tokenizer_type: QwenTokenizerFS
    tokenizer_path: /workspace/FlagScale/qwentokenizer
    vocab_size: 151936
```

---

## 5. 运行训练测试

```bash
cd /workspace/FlagScale
flagscale train qwen3 --config ./examples/qwen3/conf/train.yaml
```

在另一个终端观察卡占用情况：

```bash
mx-smi            # 沐曦
npu-smi info      # 昇腾
ppu-smi           # 平头哥
```

停止训练：

```bash
flagscale train qwen3 --stop
```

### 正常输出

昇腾单卡正常日志：

```text
[default0]: [2026-09-11 12:06:52.987995] iteration        3/ 7629408 | consumed samples:           96 | elapsed time per iteration (ms): 24379.9 | throughput per GPU (TFLOP/s/GPU): 26.8 | learning rate: 1.406250E-04 | global batch size:    32 | lm loss: 1.107468E+01 | loss scale: 1.0 | grad norm: 30.066 | num zeros: 1299.0 | params norm: 496.206 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

沐曦八卡正常日志：

```text
[default7]: [2026-09-08 20:31:37.112485] iteration      561/ 7629408 | consumed samples:        17952 | elapsed time per iteration (ms): 1510.4 | throughput per GPU (TFLOP/s/GPU): 54.1 | learning rate: 3.000000E-03 | global batch size:    32 | lm loss: 4.858129E-02 | loss scale: 1.0 | grad norm: 0.027 | num zeros: 3.0 | params norm: 967.809 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

平头哥八卡开启 FlagOS 算子栈后的正常日志：

```text
[default7]: [2026-09-14 15:08:27.273656] iteration       44/  102400 | consumed samples:          352 | elapsed time per iteration (ms): 6922.3 | throughput per GPU (TFLOP/s/GPU): 62.0 | learning rate: 1.289062E-04 | global batch size:     8 | lm loss: 6.457796E+00 | loss scale: 1.0 | grad norm: 4.096 | num zeros: 760881152.0 | params norm: 2241.466 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

---

## 6. 使用 FlagOS 算子栈运行

若要把同一个任务改到 FlagTree + FlagGems 上运行（而非厂商算子库），使用 `te_fl` 配置对并选择 FlagOS 层：

```bash
flagscale train qwen3 --config ./examples/qwen3/conf/train_te_fl.yaml
```

`examples/qwen3/conf/train/te_fl.yaml` 用于启用 FlagOS 后端：

```yaml
model:
  transformer_impl: transformer_engine
  te_fl_prefer: flagos
  enable_flag_gems: True
  flag_gems_unused: ["chunk", "conv3d", "mul", "mul_", "index_put", "index_put_", "_index_put_impl_", "baddbmm", "mm", "normal_", "sum_dim", "gather_backward", "index_add_", "slice_backward", "slice"]
  flag_gems_log_path: ${experiment.exp_name}
```

```{note}
`flag_gems_log_path` 不可指向 runner 的 hostfile。FlagGems 会以 `mode="w"` 打开该路径并覆盖 hostfile，随后 FlagScale 会以 `ValueError: Invalid entry in hostfile` 中断。
```

---

## 7. 已知问题与规避方式

### 7.1 沐曦 MetaX

**`ImportError: cannot import name 'AttrsDescriptor' from 'triton.compiler.compiler'`** —— 切换到 FlagTree 后，PyTorch 的 `torch._inductor` 找不到 `AttrsDescriptor`。在 `/opt/conda/lib/python3.12/site-packages/triton/compiler/compiler.py` 中补充兼容定义：

```python
import triton.compiler.compiler as compiler

class AttrsDescriptor:
    def __init__(self, arg_properties, func_properties):
        self.arg_properties = arg_properties
        self.func_properties = func_properties

compiler.AttrsDescriptor = AttrsDescriptor
```

**非 CUDA 平台仍要求 `CUDA_DEVICE_MAX_CONNECTIONS`** —— 在任务配置中保留 `CUDA_DEVICE_MAX_CONNECTIONS: 1`。

**切换到 FlagOS 后多卡失败** —— 沐曦后端的 C++ 绑定与 Triton 3.6.0 的 Python API 不兼容。

### 7.2 海光 Hygon

**`gradient_accumulation_fusion` 需要 APEX CUDA 扩展** —— 在任务配置中设置 `no_gradient_accumulation_fusion: true`。

**JIT 算子融合失败** —— 设置 `disable_jit_fuser: true`。

**`NotImplementedError: the derivative for 'chunk' is not implemented`** —— FlagGems 的 `chunk` 算子暂无反向实现。把 `chunk` 加入 `flag_gems_unused`，或设置 `enable_flag_gems: false`。

**`AssertionError: Unknown c10d backend type FLAGCX`** —— 设置 `system.distributed_backend: nccl`。

**`ValueError: Invalid entry in hostfile`** —— 由 `flag_gems_log_path` 指向 hostfile 引起。请将其指向专用的日志路径。

### 7.3 昇腾 Ascend

**`TypeError: '<' not supported between instances of 'NoneType' and 'int'`** —— NPU 设备没有 `.major` 属性，导致 `get_device_arch_version()` 返回 `None`。该路径仅在 `tensor_model_parallel_size > 1` 或 `context_parallel_size > 1` 时进入，因此单卡可跑、多卡失败。修补该函数，让非 NVIDIA 设备返回小于 10 的值：

```python
def get_device_arch_version():
    props = torch.cuda.get_device_properties(torch.device("cuda:0"))
    major = getattr(props, "major", None)
    if major is None:  # NPU / 非 NVIDIA 设备
        return 9
    return major
```

**Python 3.10 兼容性** —— `flagscale/train/megatron/training/models/hybrid.py` 需要改用 `typing_extensions` 导入 `override`。

**FlagGems attention 反向 kernel 报 `MLIRCompilationError: ub overflow`** —— 降低 `seq_length`，或改用原生 TransformerEngine 后端。

### 7.4 平头哥 PPU

**FlagTree 与 FlagGems 无法在 `/workspace` 编译** —— `/workspace` 是 OSS 对象存储 FUSE 挂载（`ossfs2`），无法就地写入 ELF。请在本地磁盘编译，并保留 `.git` 以便 `setuptools_scm` 解析版本号。

**FlagCX 未启用** —— 该平台打开 FlagCX 会出问题。

---

## 8. 注意事项

- FlagScale 本身无需按平台安装，平台支持完全来自插件。
- 所有配置中都要保留 `CUDA_DEVICE_MAX_CONNECTIONS: 1`，非 CUDA 平台也不例外。
- 训练日志写入实验目录下；`--stop` 可终止任务。
- 模型级配置项请参见[要求](requirements.md)与 [examples](https://github.com/flagos-ai/FlagScale/tree/main/examples) 目录。
