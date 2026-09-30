# Multi-Platform Training and Testing

FlagScale has no hardware requirements of its own — it orchestrates training through the FlagOS plugins. This guide shows how to drive an end-to-end training job on four non-NVIDIA platforms (MetaX, Hygon, Ascend, T-Head PPU) with the plugin stack underneath.

Platform-specific plugin installation is documented in the plugin guides:

- [Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL) — training engine
- [TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL) — transformer operator layer

---

## 1. Component versions used

| Component | Version | Repository |
|-----------|---------|------------|
| FlagScale | v2.1.0 | [flagos-ai/FlagScale](https://github.com/flagos-ai/FlagScale) |
| Megatron-LM-FL | v0.3.0 | [flagos-ai/Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL) |
| TransformerEngine-FL | v0.3.0 | [flagos-ai/TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL) |
| FlagTree | 0.7.0 | [flagos-ai/FlagTree](https://github.com/flagos-ai/FlagTree) |
| FlagGems | v5.4.0 | [flagos-ai/FlagGems](https://github.com/flagos-ai/FlagGems) |

```{note}
All five components above are required together for the FlagOS 2.2 stack.
```

---

## 2. Platform environment variables

FlagScale passes device visibility through the experiment-level YAML `envs` block. Each platform uses a different variable name.

| Platform | Device check | Visible-devices env | FlagTree backend |
|----------|--------------|---------------------|------------------|
| MetaX | `mx-smi` | `MACA_VISIBLE_DEVICES` | `metax` |
| Hygon | `hy-smi` | `HIP_VISIBLE_DEVICES` | `hcu` |
| Ascend | `npu-smi info` | `ASCEND_RT_VISIBLE_DEVICES` | `ascend` |
| T-Head PPU | `ppu-smi` | `CUDA_VISIBLE_DEVICES` | `ppu` |

```{note}
`CUDA_DEVICE_MAX_CONNECTIONS: 1` must stay in the config even on non-CUDA platforms — the training engine's argument validation still requires it when multi-card parallelism is enabled.
```

T-Head PPU keeps the `CUDA_VISIBLE_DEVICES` name; there is no `PPU_VISIBLE_DEVICES`.

---

## 3. Install FlagScale

```bash
cd /workspace/FlagScale
git checkout v2.1.0
pip install . --no-build-isolation
```

Verify, then install the logging dependencies used by the training runs:

```bash
pip list | grep flagscale
pip install wandb aiohttp
```

---

## 4. Configure the training task

### 4.1 Experiment-level YAML

`examples/qwen3/conf/train.yaml` selects the task-level config and defines the runner environment:

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
    MACA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"   # replace per platform

action: run
```

Replace the last line with the platform variable from section 2:

| Platform | Replace with |
|----------|--------------|
| MetaX | `MACA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"` |
| Hygon | `HIP_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"` |
| Ascend | `ASCEND_RT_VISIBLE_DEVICES: "0,1,2,3"` |
| T-Head PPU | `CUDA_VISIBLE_DEVICES: "8,9,10,11,12,13,14,15"` |

### 4.2 Task-level YAML

`examples/qwen3/conf/train/0_6b.yaml` carries the model, dataset, and optimizer settings:

```yaml
micro_batch_size: 1
global_batch_size: 32          # reduced from 2048 to shorten the test
eval_iters: 0
eval_interval: 1000
train_samples: 244141056

model:
  lr_scheduler:
    lr: 3.0e-3
    min_lr: 3.0e-4
    lr_warmup_samples: 2048     # reduced from 2048000
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

## 5. Run the training test

```bash
cd /workspace/FlagScale
flagscale train qwen3 --config ./examples/qwen3/conf/train.yaml
```

Monitor device utilization in a second shell:

```bash
mx-smi            # MetaX
npu-smi info      # Ascend
ppu-smi           # T-Head PPU
```

Stop the job:

```bash
flagscale train qwen3 --stop
```

### Expected output

A healthy Ascend single-card run:

```text
[default0]: [2026-09-11 12:06:52.987995] iteration        3/ 7629408 | consumed samples:           96 | elapsed time per iteration (ms): 24379.9 | throughput per GPU (TFLOP/s/GPU): 26.8 | learning rate: 1.406250E-04 | global batch size:    32 | lm loss: 1.107468E+01 | loss scale: 1.0 | grad norm: 30.066 | num zeros: 1299.0 | params norm: 496.206 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

A healthy MetaX eight-card run:

```text
[default7]: [2026-09-08 20:31:37.112485] iteration      561/ 7629408 | consumed samples:        17952 | elapsed time per iteration (ms): 1510.4 | throughput per GPU (TFLOP/s/GPU): 54.1 | learning rate: 3.000000E-03 | global batch size:    32 | lm loss: 4.858129E-02 | loss scale: 1.0 | grad norm: 0.027 | num zeros: 3.0 | params norm: 967.809 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

A healthy T-Head PPU eight-card run with the FlagOS operator stack enabled:

```text
[default7]: [2026-09-14 15:08:27.273656] iteration       44/  102400 | consumed samples:          352 | elapsed time per iteration (ms): 6922.3 | throughput per GPU (TFLOP/s/GPU): 62.0 | learning rate: 1.289062E-04 | global batch size:     8 | lm loss: 6.457796E+00 | loss scale: 1.0 | grad norm: 4.096 | num zeros: 760881152.0 | params norm: 2241.466 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

---

## 6. Run on the FlagOS operator stack

To run the same job through FlagTree and FlagGems instead of the vendor operator library, use the `te_fl` configuration pair and select the FlagOS tier:

```bash
flagscale train qwen3 --config ./examples/qwen3/conf/train_te_fl.yaml
```

`examples/qwen3/conf/train/te_fl.yaml` enables the FlagOS backends:

```yaml
model:
  transformer_impl: transformer_engine
  te_fl_prefer: flagos
  enable_flag_gems: True
  flag_gems_unused: ["chunk", "conv3d", "mul", "mul_", "index_put", "index_put_", "_index_put_impl_", "baddbmm", "mm", "normal_", "sum_dim", "gather_backward", "index_add_", "slice_backward", "slice"]
  flag_gems_log_path: ${experiment.exp_name}
```

```{note}
`flag_gems_log_path` must not point at the runner hostfile. FlagGems opens that path with `mode="w"` and overwrites the hostfile, after which FlagScale aborts with `ValueError: Invalid entry in hostfile`.
```

---

## 7. Known issues and workarounds

### 7.1 MetaX

**`ImportError: cannot import name 'AttrsDescriptor' from 'triton.compiler.compiler'`** — after switching to FlagTree, PyTorch's `torch._inductor` cannot find `AttrsDescriptor`. Add a shim to `/opt/conda/lib/python3.12/site-packages/triton/compiler/compiler.py`:

```python
import triton.compiler.compiler as compiler

class AttrsDescriptor:
    def __init__(self, arg_properties, func_properties):
        self.arg_properties = arg_properties
        self.func_properties = func_properties

compiler.AttrsDescriptor = AttrsDescriptor
```

**`CUDA_DEVICE_MAX_CONNECTIONS` required on a non-CUDA platform** — keep `CUDA_DEVICE_MAX_CONNECTIONS: 1` in the task config.

**Multi-card failure after switching to FlagOS** — the MetaX backend C++ bindings are incompatible with the Triton 3.6.0 Python API.

### 7.2 Hygon

**`gradient_accumulation_fusion` needs APEX CUDA extensions** — set `no_gradient_accumulation_fusion: true` in the task config.

**JIT operator fusion fails** — set `disable_jit_fuser: true`.

**`NotImplementedError: the derivative for 'chunk' is not implemented`** — the FlagGems `chunk` operator has no backward. Add `chunk` to `flag_gems_unused`, or set `enable_flag_gems: false`.

**`AssertionError: Unknown c10d backend type FLAGCX`** — set `system.distributed_backend: nccl`.

**`ValueError: Invalid entry in hostfile`** — caused by `flag_gems_log_path` pointing at the hostfile. Point it at a dedicated log path instead.

### 7.3 Ascend

**`TypeError: '<' not supported between instances of 'NoneType' and 'int'`** — `get_device_arch_version()` returns `None` on NPU because the device has no `.major` attribute. The path is only reached when `tensor_model_parallel_size > 1` or `context_parallel_size > 1`, so single-card runs pass and multi-card runs fail. Patch the function to return a value below 10 on non-NVIDIA devices:

```python
def get_device_arch_version():
    props = torch.cuda.get_device_properties(torch.device("cuda:0"))
    major = getattr(props, "major", None)
    if major is None:  # NPU / non-NVIDIA devices
        return 9
    return major
```

**Python 3.10 compatibility** — `flagscale/train/megatron/training/models/hybrid.py` needs the `typing_extensions` import path for `override`.

**`MLIRCompilationError: ub overflow`** in the FlagGems attention backward kernel — lower `seq_length` or fall back to the native TransformerEngine backend.

### 7.4 T-Head PPU

**FlagTree and FlagGems cannot be compiled on `/workspace`** — `/workspace` is an OSS object-store FUSE mount (`ossfs2`) that cannot host in-place ELF writes. Build from local disk, keeping `.git` for `setuptools_scm`.

**FlagCX is not enabled** — the FlagCX path is known to fail on this platform.

---

## 8. Notes

- FlagScale itself needs no hardware-specific install; the platform support comes entirely from the plugins.
- Keep `CUDA_DEVICE_MAX_CONNECTIONS: 1` in every config, including non-CUDA platforms.
- Training logs are written under the experiment directory; `--stop` terminates the job.
- For model-level configuration options, see [Requirements](requirements.md) and the [examples](https://github.com/flagos-ai/FlagScale/tree/main/examples) directory.
