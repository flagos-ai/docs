# 多平台训练与测试

本指南介绍如何在四类非 NVIDIA 平台上安装 Megatron-LM-FL 并跑通一次 Qwen3 端到端训练：沐曦（MetaX）、海光（Hygon）、昇腾（Ascend）、平头哥（T-Head PPU）。下文中的每条命令、每个配置文件与每段日志均来自各平台的实际验证运行。

整个流程把三个 FlagOS 组件组合在一起使用：

- **Megatron-LM-FL** —— 训练引擎（本组件）。
- **TransformerEngine-FL** —— Transformer 算子层。参见 [TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL)。
- **FlagScale** —— 编排与配置层。参见 [FlagScale](https://github.com/flagos-ai/FlagScale)。

---

## 1. 支持平台

| 平台 | 设备检查命令 | 可见设备环境变量 | FlagTree 后端 |
|------|--------------|------------------|---------------|
| 沐曦 MetaX | `mx-smi` | `MACA_VISIBLE_DEVICES` | `metax` |
| 海光 Hygon | `hy-smi` | `HIP_VISIBLE_DEVICES` | `hcu` |
| 昇腾 Ascend | `npu-smi info` | `ASCEND_RT_VISIBLE_DEVICES` | `ascend` |
| 平头哥 PPU | `ppu-smi` | `CUDA_VISIBLE_DEVICES` | `ppu` |

```{note}
平头哥 PPU 仍沿用 `CUDA_VISIBLE_DEVICES` 变量名，没有单独的 `PPU_VISIBLE_DEVICES`。
```

---

## 2. 环境准备

### 2.1 拉取代码

```bash
mkdir /data/wk
cd /data/wk
git clone https://github.com/flagos-ai/FlagTree.git
git clone https://github.com/flagos-ai/FlagGems.git
git clone https://github.com/flagos-ai/FlagScale.git
git clone https://github.com/flagos-ai/TransformerEngine-FL.git
git clone https://github.com/flagos-ai/Megatron-LM-FL.git
```

### 2.2 获取镜像并启动容器

Megatron-LM-FL 通过预构建的 Docker 镜像运行。打开 [FlagOS 主页面](https://flagos.io/Home)，在页面正中间的下载列表中选择与你的硬件对应的镜像，按页面上的说明拉取镜像、进入容器并启动。

在下面的安装步骤开始前，先在容器内确认设备可见（各平台的检查命令见第 1 节）。

```{note}
网络受限时，先在容器内导出 `http_proxy` / `https_proxy` / `no_proxy` 再安装依赖。
```

---

## 3. 安装 Megatron-LM-FL

```bash
cd /workspace/Megatron-LM-FL
git checkout v0.3.0
pip install . --no-build-isolation --root-user-action=ignore
```

确认安装版本：

```bash
pip list | grep megatron
megatron-core                            0.18.2+c8fa61f2e
megatron-energon                         6.0.1
```

Megatron-LM-FL v0.3.0 已同步上游 Megatron-LM v0.18.2。

---

## 4. 准备数据集与分词器

```bash
cd /workspace/FlagScale
mkdir -p ./data && cd ./data
wget https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/datasets/enron_emails_demo_text_document_qwen/enron_emails_demo_text_document_qwen.idx
wget https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/datasets/enron_emails_demo_text_document_qwen/enron_emails_demo_text_document_qwen.bin

mkdir -p ../qwentokenizer && cd ../qwentokenizer
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/tokenizer_config.json" -O tokenizer_config.json
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/qwen.tiktoken" -O qwen.tiktoken
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/qwen_generation_utils.py" -O qwen_generation_utils.py
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/tokenization_qwen.py" -O tokenization_qwen.py
```

---

## 5. 运行训练测试

### 5.1 模型配置

修改 `./examples/qwen3/conf/train/0_6b.yaml`，把数据与分词器指向本地路径，并调小批量以适配单机测试：

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
    lr_warmup_samples: 2048     # 从 2048000 调小，缩短预热等待
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

### 5.2 任务配置

修改 `./examples/qwen3/conf/train.yaml`，使所选的模型配置名与文件名一致，并设置当前平台的设备变量：

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
  cmds:
    before_start: ulimit -n 1048576 && source /root/miniconda3/bin/activate flagscale-train
  envs:
    LOGLEVEL: "INFO"
    CUDA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"
    CUDA_DEVICE_MAX_CONNECTIONS: 1
    MACA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"   # 沐曦

action: run
```

最后一行按平台替换：

| 平台 | 需设置的变量 |
|------|--------------|
| 沐曦 MetaX | `MACA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"` |
| 海光 Hygon | `HIP_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"` |
| 昇腾 Ascend | `ASCEND_RT_VISIBLE_DEVICES: "0,1,2,3"` |
| 平头哥 PPU | `CUDA_VISIBLE_DEVICES: "8,9,10,11,12,13,14,15"` |

### 5.3 启动训练

```bash
cd /workspace/FlagScale
flagscale train qwen3 --config ./examples/qwen3/conf/train.yaml
```

训练过程中观察卡占用情况：

```bash
mx-smi            # 沐曦
npu-smi info      # 昇腾
ppu-smi           # 平头哥
```

### 5.4 正常输出

昇腾单卡正常日志（Qwen3，`global_batch_size: 32`）：

```text
[default0]: [2026-09-11 12:06:52.987995] iteration        3/ 7629408 | consumed samples:           96 | elapsed time per iteration (ms): 24379.9 | throughput per GPU (TFLOP/s/GPU): 26.8 | learning rate: 1.406250E-04 | global batch size:    32 | lm loss: 1.107468E+01 | loss scale: 1.0 | grad norm: 30.066 | num zeros: 1299.0 | params norm: 496.206 | number of skipped iterations:   0 | number of nan iterations:   0 |
[default0]: [2026-09-11 12:07:17.375194] iteration        4/ 7629408 | consumed samples:          128 | elapsed time per iteration (ms): 24386.9 | throughput per GPU (TFLOP/s/GPU): 26.8 | learning rate: 1.875000E-04 | global batch size:    32 | lm loss: 1.044366E+01 | loss scale: 1.0 | grad norm: 4.157 | num zeros: 871.0 | params norm: 496.205 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

沐曦八卡正常日志（Qwen3，`global_batch_size: 32`）：

```text
[default7]: [2026-09-08 20:31:37.112485] iteration      561/ 7629408 | consumed samples:        17952 | elapsed time per iteration (ms): 1510.4 | throughput per GPU (TFLOP/s/GPU): 54.1 | learning rate: 3.000000E-03 | global batch size:    32 | lm loss: 4.858129E-02 | loss scale: 1.0 | grad norm: 0.027 | num zeros: 3.0 | params norm: 967.809 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

平头哥八卡开启 FlagOS 算子栈后的正常日志：

```text
[default7]: [2026-09-14 15:08:27.273656] iteration       44/  102400 | consumed samples:          352 | elapsed time per iteration (ms): 6922.3 | throughput per GPU (TFLOP/s/GPU): 62.0 | learning rate: 1.289062E-04 | global batch size:     8 | lm loss: 6.457796E+00 | loss scale: 1.0 | grad norm: 4.096 | num zeros: 760881152.0 | params norm: 2241.466 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

停止训练：

```bash
flagscale train qwen3 --stop
```

---

## 6. 更换底层编译器和算子库

上面的训练使用厂商自带算子库。若要改用 FlagOS 软件栈运行，需用 FlagTree 替换 Triton 并安装 FlagGems。

### 6.1 安装 FlagTree

```bash
python -m pip uninstall -y triton
cd /workspace/FlagTree
git checkout 0.7.0+triton3.6

pip install "nanobind>=2.4,<3"
pip install -U scikit-build-core==0.11 pybind11 ninja cmake
# 仅昇腾：安装 CANN shmem，并清理残留 LLVM 变量
pip install -r /workspace/FlagTree/python/requirements-ascend.txt
unset LLVM_SYSPATH LLVM_INCLUDE_DIRS LLVM_LIBRARY_DIR

export FLAGTREE_BACKEND=metax        # metax | hcu | ascend | ppu
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v

python -c "import triton; print('Triton:', triton.__version__)"
```

```{note}
平头哥 PPU 上 `/workspace` 是 OSS 对象存储 FUSE 挂载（`ossfs2`），汇编器无法就地写入 ELF 目标文件（报 `file truncated`）。请把源码（含 `.git`，`setuptools_scm` 需要它来确定版本号）复制到本地磁盘（如 `/root/FlagTree`）后再编译。FlagGems 同理。
```

### 6.2 安装 FlagGems

```bash
cd /workspace/FlagGems
git checkout v5.4.0
pip install --no-build-isolation -e .
python -c "import flag_gems; print(flag_gems.__version__)"
```

### 6.3 在训练中启用 FlagOS 算子栈

使用 `./examples/qwen3/conf/train_te_fl.yaml` 配合 `./examples/qwen3/conf/train/te_fl.yaml`，并选择 FlagOS 后端：

```yaml
model:
  transformer_impl: transformer_engine
  te_fl_prefer: flagos
  enable_flag_gems: true
  flag_gems_unused: ["chunk", "conv3d", "mul", "mul_", "index_put", "index_put_", "_index_put_impl_", "baddbmm", "mm", "normal_", "sum_dim", "gather_backward", "index_add_", "slice_backward", "slice"]
  flag_gems_log_path: ${experiment.exp_name}
```

```bash
flagscale train qwen3 --config ./examples/qwen3/conf/train_te_fl.yaml
```

```{note}
`flag_gems_log_path` 不可指向 runner 的 hostfile：FlagGems 会以 `mode="w"` 打开该路径并覆盖 hostfile，随后 FlagScale 会报 `ValueError: Invalid entry in hostfile`。请指向专用日志文件。
```

---

## 7. 已知问题与规避方式

### 7.1 沐曦 MetaX

**`ImportError: cannot import name 'AttrsDescriptor' from 'triton.compiler.compiler'`** —— PyTorch 的 `torch._inductor` 会从 Triton 导入 `AttrsDescriptor`，而 FlagTree 未提供该类。在 `/opt/conda/lib/python3.12/site-packages/triton/compiler/compiler.py` 中补充兼容定义：

```python
import triton.compiler.compiler as compiler

class AttrsDescriptor:
    def __init__(self, arg_properties, func_properties):
        self.arg_properties = arg_properties
        self.func_properties = func_properties

compiler.AttrsDescriptor = AttrsDescriptor
```

**非 CUDA 芯片也需要设置 `CUDA_DEVICE_MAX_CONNECTIONS`** —— 通过 `te_fl.yaml` 启用多卡并行时，参数校验仍要求该变量。请在 `train_te_fl.yaml` 中补上。

**底层切换为 FlagOS 后多卡训练报错** —— 沐曦后端的 C++ 绑定（`metax.passes.ttgpuir.add_accelerate_matmul`）与 Triton 3.6.0 的 Python API 不兼容：该绑定期望 C++ 的 `mlir::PassManager`，实际收到的是 Python 包装的 `triton._C.libtriton.ir.pass_manager`。

### 7.2 海光 Hygon

**`gradient_accumulation_fusion` 需要 APEX CUDA 扩展** —— 在任务配置中关闭：

```yaml
no_gradient_accumulation_fusion: true
```
。

**JIT 算子融合（`torch.compile`、`@jit_fuser`）失败** —— 关闭 JIT fuser：

```yaml
disable_jit_fuser: true
```
。

**`NotImplementedError: the derivative for 'chunk' is not implemented`** —— FlagGems 的 `chunk` 算子暂无反向实现。把 `chunk` 加入 `flag_gems_unused`，或在算子修复前用 `enable_flag_gems: false` 关闭全量 FlagGems 算子替换。

**`AssertionError: Unknown c10d backend type FLAGCX`** —— 把分布式后端改回厂商集合通信库：

```yaml
system:
  distributed_backend: nccl
```

**`FlagTune ManifestFetchError: FLAGTUNE_MANIFEST_URL is not configured`** —— FlagTune 代价模型没有可用缓存。

**`ValueError: Invalid entry in hostfile`** —— 由 `flag_gems_log_path` 指向 hostfile 引起，见 6.3 节。

### 7.3 昇腾 Ascend

**`TypeError: '<' not supported between instances of 'NoneType' and 'int'`** —— NPU 设备上 `torch.cuda.get_device_properties(...).major` 返回 `None`，导致 Blackwell 判断 `get_device_arch_version() < 10` 报错。该代码路径仅在 `tensor_model_parallel_size > 1` 或 `context_parallel_size > 1` 时进入，因此单卡可跑、多卡失败。修复 `get_device_arch_version()`，让非 NVIDIA 设备返回小于 10 的值：

```python
def get_device_arch_version():
    """Returns GPU arch version (8: Ampere, 9: Hopper, 10: Blackwell, ...)"""
    props = torch.cuda.get_device_properties(torch.device("cuda:0"))
    major = getattr(props, "major", None)
    if major is None:  # NPU / 非 NVIDIA 设备没有 compute capability
        return 9
    return major
```

**Python 3.10 兼容性** —— 镜像内为 Python 3.10，`flagscale/train/megatron/training/models/hybrid.py` 需要改用 `typing_extensions` 导入 `override`。

**FlagGems attention 反向 kernel 报 `MLIRCompilationError: ub overflow`** —— attention 反向 kernel 需要的 unified buffer 超出 NPU 可用容量。可降低 `seq_length`（如从 4096 降到 1024），或改用原生 TransformerEngine 后端而不使用 FlagGems。编译器默认开启多缓冲（`--enable-auto-multi-buffer=True`），会使需求翻倍；设置 `num_stages=1` 可关闭。

### 7.4 平头哥 PPU

**FlagTree 与 FlagGems 无法在 `/workspace` 编译** —— 见 6.1 节说明，请在本地磁盘编译。

**FlagCX 未启用** —— 该平台打开 FlagCX 会出问题，`distributed_backend` 保持使用厂商集合通信库。

---

## 8. 注意事项

- 请根据平台镜像切换 conda 环境。
- 使用 5.2 节中对应平台的可见设备变量——变量写错会导致任务静默地只跑单卡。
- 训练日志写入实验目录下；`flagscale train qwen3 --stop` 可停止任务。
- 完整的算子调度配置请参见 [TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL) 与 [FlagGems](https://github.com/flagos-ai/FlagGems)。
