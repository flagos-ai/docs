# Multi-Platform Build and Testing

This guide covers building TransformerEngine-FL and validating it with an end-to-end training workflow across CUDA (NVIDIA), MetaX, Hygon, Ascend, and T-Head PPU. It focuses on the parts that are specific to this component — the operator backend tiers, the vendor backends, and the attention backends — and on how to tell a healthy build from a broken one.

For the training orchestration around it, see [Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL) and [FlagScale](https://github.com/flagos-ai/FlagScale).

---

## 1. Backend layout

TransformerEngine-FL dispatches every operator through three tiers. Knowing which tier a failure comes from is the fastest way to localize a problem.

| Tier | Package path | Purpose |
|------|--------------|---------|
| FlagOS | `transformer_engine/plugin/core/backends/flagos` | Default Triton implementation, built on FlagGems |
| Vendor | `transformer_engine/plugin/core/backends/vendor/<vendor>` | Hardware-specific implementations |
| Reference | `transformer_engine/plugin/core/backends/reference` | Pure PyTorch fallback |

Vendor backends shipped in v0.3.0:

| Vendor | Directory | Notes |
|--------|-----------|-------|
| CUDA | `vendor/cuda` | NVIDIA GPUs |
| MetaX | `vendor/metax` | Flash attention |
| Hygon | `vendor/hygon` | DCU, flash attention |
| Ascend NPU | `vendor/npu` | Requires `transformer_engine_npu` |
| KunlunXin | `vendor/kunlunxin` | Flash attention |
| Iluvatar | `vendor/iluvatar` | Corex GPU |
| MUSA | `vendor/musa` | Moore Threads S-series |
| ENFLAME | `vendor/enflame` | Flash attention |
| Tsingmicro | `vendor/tsingmicro` | TXDA |

---

## 2. Platform prerequisites

| Platform | Device check | FlagTree backend | Visible-devices env |
|----------|--------------|------------------|---------------------|
| NVIDIA | `nvidia-smi` | — | `CUDA_VISIBLE_DEVICES` |
| MetaX | `mx-smi` | `metax` | `MACA_VISIBLE_DEVICES` |
| Hygon | `hy-smi` | `hcu` | `HIP_VISIBLE_DEVICES` |
| Ascend | `npu-smi info` | `ascend` | `ASCEND_RT_VISIBLE_DEVICES` |
| T-Head PPU | `ppu-smi` | `ppu` | `CUDA_VISIBLE_DEVICES` |

```{note}
Hygon requires `source /opt/dtk/env.sh` before any build or run command.
```

---

## 3. Prepare the environment

### 3.1 Get the image and start the container

Go to the [FlagOS main page](https://flagos.io/Home), pick the image for your hardware from the download list in the middle of the page, and follow the on-page instructions to pull the image, enter the container, and start it.

Before installing the packages below, check inside the container that your device is visible (section 2 lists the command for each platform).

```{note}
Behind a restricted network, export `http_proxy` / `https_proxy` / `no_proxy` inside the container before installing packages.
```

### 3.2 Clone the repositories

```bash
mkdir /data/wk
cd /data/wk
git clone https://github.com/flagos-ai/FlagTree.git
git clone https://github.com/flagos-ai/FlagGems.git
git clone https://github.com/flagos-ai/FlagScale.git
git clone https://github.com/flagos-ai/TransformerEngine-FL.git
git clone https://github.com/flagos-ai/Megatron-LM-FL.git
```

### 3.3 Install FlashAttention

On CUDA, install FlashAttention after entering the container:

```bash
pip install flash-attn==2.8.3 --no-build-isolation
```

---

## 4. Build and install TransformerEngine-FL

```bash
git clone https://github.com/flagos-ai/TransformerEngine-FL.git
cd TransformerEngine-FL
git checkout v0.3.0
git submodule update --init --recursive
```

On NVIDIA, build against the CUDA toolkit:

```bash
MAX_JOBS=64 pip install -v . --no-build-isolation --root-user-action=ignore
```

On every non-NVIDIA platform, skip the CUDA extension and build only the plugin layer:

```bash
TE_FL_SKIP_CUDA=1 MAX_JOBS=64 pip install -v . --no-build-isolation --root-user-action=ignore
```

Verify the installed version:

```bash
pip list | grep transformer
transformer_engine                       2.17.0+69cf722e
transformers                             5.8.1
```

```{note}
`TE_FL_SKIP_CUDA=1` is mandatory on non-NVIDIA platforms. Without it the build tries to compile the CUDA kernels and fails.
```

On MetaX, the same result is reported as:

```text
transformer_engine                       2.17.0+f247b9fe
transformer_engine_metax                 2.9.0
transformers                             4.51.0
```

### Install Megatron-LM-FL

```bash
cd /workspace/Megatron-LM-FL
git checkout v0.3.0
pip install . --no-build-isolation --root-user-action=ignore
```

### Prepare FlagScale

```bash
cd /workspace/FlagScale
# On CUDA
pip install -r requirements/cuda/train.txt
git checkout <release-tag>
```

---

## 5. Install the FlagOS compiler and operator library

TransformerEngine-FL's FlagOS tier is built on FlagGems, which in turn needs FlagTree as its compiler. Install both before enabling `te_fl_prefer: flagos`.

```bash
python -m pip uninstall -y triton
cd /workspace/FlagTree
git checkout 0.7.0+triton3.6

pip install "nanobind>=2.4,<3"
pip install -U scikit-build-core==0.11 pybind11 ninja cmake
# Ascend only
pip install -r /workspace/FlagTree/python/requirements-ascend.txt
unset LLVM_SYSPATH LLVM_INCLUDE_DIRS LLVM_LIBRARY_DIR

export FLAGTREE_BACKEND=metax        # metax | hcu | ascend | ppu
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v

python -c "import triton; print('Triton:', triton.__version__)"
```

```bash
cd /workspace/FlagGems
git checkout v5.4.0
pip install --no-build-isolation -e .
python -c "import flag_gems; print(flag_gems.__version__)"
```

```{note}
On T-Head PPU, `/workspace` is an OSS object-store FUSE mount (`ossfs2`) that cannot host in-place ELF writes (the assembler fails with `file truncated`). Build FlagTree and FlagGems from local disk instead, keeping `.git` so `setuptools_scm` can resolve the version.
```

---

## 6. Operator selection

Operator selection is driven by three model arguments in the task-level YAML:

| Argument | Meaning | Example |
|----------|---------|---------|
| `te_fl_prefer` | Preferred tier for every operator | `flagos`, `vendor`, `reference` |
| `te_fl_per_op` | Per-operator override, `op=backend\|backend` | `rmsnorm_fwd=vendor:acme\|flagos;rope_fwd=flagos\|reference` |
| `te_fl_allow_vendors` / `te_fl_deny_vendors` | Vendor allow/deny lists | `vendor_a` |

```yaml
model:
  transformer_impl: transformer_engine
  te_fl_prefer: flagos
  te_fl_per_op: "rmsnorm_fwd=vendor:acme|flagos;rope_fwd=flagos|reference"
  te_fl_allow_vendors: "vendor_a"
  te_fl_deny_vendors: "vendor_b"
  enable_flag_gems: True
  flag_gems_log_path: ${experiment.exp_name}
```

Fallback order is: preferred backend → the per-operator list → the default vendor backend → the sole registered vendor → Reference.

---

## 7. Run the Qwen3 training test

The test job is a Qwen3 training run driven by FlagScale, with TransformerEngine-FL supplying the transformer operators.

First prepare the dataset and tokenizer:

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

Edit `./examples/qwen3/conf/train/0_6b.yaml` to point at the local dataset and tokenizer, and shrink the batch sizes so the job fits a single node:

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
    lr_warmup_samples: 2048     # reduced from 2048000 to shorten the warm-up
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

Edit `./examples/qwen3/conf/train.yaml` so that the selected model config matches the file name:

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
    MACA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"   # MetaX

action: run
```

Replace the last visible-devices line with the variable of your platform:

| Platform | Variable to set |
|----------|-----------------|
| MetaX | `MACA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"` |
| Hygon | `HIP_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"` |
| Ascend | `ASCEND_RT_VISIBLE_DEVICES: "0,1,2,3"` |
| T-Head PPU | `CUDA_VISIBLE_DEVICES: "8,9,10,11,12,13,14,15"` |

Launch:

```bash
cd /workspace/FlagScale
flagscale train qwen3 --config ./examples/qwen3/conf/train_te_fl.yaml
```

Watch device utilization while training runs:

```bash
mx-smi            # MetaX
npu-smi info      # Ascend
ppu-smi           # T-Head PPU
```

### Expected output

A healthy single-card run on Ascend (Qwen3, `global_batch_size: 32`):

```text
[default0]: [2026-09-11 12:06:52.987995] iteration        3/ 7629408 | consumed samples:           96 | elapsed time per iteration (ms): 24379.9 | throughput per GPU (TFLOP/s/GPU): 26.8 | learning rate: 1.406250E-04 | global batch size:    32 | lm loss: 1.107468E+01 | loss scale: 1.0 | grad norm: 30.066 | num zeros: 1299.0 | params norm: 496.206 | number of skipped iterations:   0 | number of nan iterations:   0 |
[default0]: [2026-09-11 12:07:17.375194] iteration        4/ 7629408 | consumed samples:          128 | elapsed time per iteration (ms): 24386.9 | throughput per GPU (TFLOP/s/GPU): 26.8 | learning rate: 1.875000E-04 | global batch size:    32 | lm loss: 1.044366E+01 | loss scale: 1.0 | grad norm: 4.157 | num zeros: 871.0 | params norm: 496.205 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

A healthy 8-card run on MetaX (Qwen3, `global_batch_size: 32`):

```text
[default7]: [2026-09-08 20:31:37.112485] iteration      561/ 7629408 | consumed samples:        17952 | elapsed time per iteration (ms): 1510.4 | throughput per GPU (TFLOP/s/GPU): 54.1 | learning rate: 3.000000E-03 | global batch size:    32 | lm loss: 4.858129E-02 | loss scale: 1.0 | grad norm: 0.027 | num zeros: 3.0 | params norm: 967.809 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

A healthy 8-card run on T-Head PPU with the FlagOS operator stack enabled:

```text
[default7]: [2026-09-14 15:08:27.273656] iteration       44/  102400 | consumed samples:          352 | elapsed time per iteration (ms): 6922.3 | throughput per GPU (TFLOP/s/GPU): 62.0 | learning rate: 1.289062E-04 | global batch size:     8 | lm loss: 6.457796E+00 | loss scale: 1.0 | grad norm: 4.096 | num zeros: 760881152.0 | params norm: 2241.466 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

Stop the job:

```bash
flagscale train qwen3 --stop
```

---

## 8. Run the DeepSeek-V3 training test

Requires 4 GPUs. Uses expert parallelism and per-operator backend configuration for grouped GEMM.

```bash
cd /workspace/FlagScale
python run.py \
    --config-path examples/deepseek_v3/conf \
    --config-name train.yaml \
    action=run \
    experiment.exp_dir=./ \
    'experiment.cmds.before_start="ulimit -n 1048576 && source /root/miniconda3/bin/activate base"' \
    'experiment.envs.CUDA_VISIBLE_DEVICES="4,5,6,7"' \
    train.system.decoder_first_pipeline_num_layers=2 \
    train.system.expert_model_parallel_size=2 \
    train.model.num_layers=4 \
    'train.model.moe_layer_freq="[0]+[1]*3"' \
    train.data.data_path=./data/enron_emails_demo_text_document_qwen \
    train.data.tokenizer.tokenizer_path=./qwentokenizer \
    +train.model.enable_flag_gems=False \
    +train.model.attention_backend=unfused \
    +train.model.te_fl_prefer=vendor \
    '+train.model.te_fl_per_op="te_general_grouped_gemm=vendor"'
```

---

## 9. Known issues and workarounds

### 9.1 MetaX

**`ImportError: cannot import name 'AttrsDescriptor' from 'triton.compiler.compiler'`** — PyTorch's `torch._inductor` imports `AttrsDescriptor` from Triton, which FlagTree does not provide. Add a compatibility shim to `/opt/conda/lib/python3.12/site-packages/triton/compiler/compiler.py`:

```python
import triton.compiler.compiler as compiler

class AttrsDescriptor:
    def __init__(self, arg_properties, func_properties):
        self.arg_properties = arg_properties
        self.func_properties = func_properties

compiler.AttrsDescriptor = AttrsDescriptor
```

**`CUDA_DEVICE_MAX_CONNECTIONS` is required even on non-CUDA chips** — with multi-card parallelism enabled through `te_fl.yaml`, the argument validation still requires it. Add the line to `train_te_fl.yaml`.

**Multi-card training fails after switching the backend to FlagOS** — the MetaX backend C++ bindings (`metax.passes.ttgpuir.add_accelerate_matmul`) are not compatible with the Triton 3.6.0 Python API: the binding expects a C++ `mlir::PassManager` but receives a Python-wrapped `triton._C.libtriton.ir.pass_manager`.

### 9.2 Hygon

**`gradient_accumulation_fusion` requires APEX CUDA extensions** — disable it in the task configuration:

```yaml
no_gradient_accumulation_fusion: true
```

**JIT operator fusion (`torch.compile`, `@jit_fuser`) fails** — disable the JIT fuser:

```yaml
disable_jit_fuser: true
```

**`NotImplementedError: the derivative for 'chunk' is not implemented`** — the FlagGems `chunk` operator has no backward implementation. Add `chunk` to `flag_gems_unused`, or disable the full FlagGems operator replacement with `enable_flag_gems: false` while the operator is being fixed.

**`AssertionError: Unknown c10d backend type FLAGCX`** — set the distributed backend back to the vendor collective library:

```yaml
system:
  distributed_backend: nccl
```

**`FlagTune ManifestFetchError: FLAGTUNE_MANIFEST_URL is not configured`** — the FlagTune cost model has no cached manifest.

**`ValueError: Invalid entry in hostfile`** — caused by `flag_gems_log_path` pointing at the hostfile, as described in section 6.

### 9.3 Ascend

**`TypeError: '<' not supported between instances of 'NoneType' and 'int'`** — on NPU devices `torch.cuda.get_device_properties(...).major` returns `None`, so the Blackwell check `get_device_arch_version() < 10` fails. The code path is only reached when `tensor_model_parallel_size > 1` or `context_parallel_size > 1`, which is why single-card runs pass and multi-card runs fail. Patch `get_device_arch_version()` so non-NVIDIA devices return a value below 10:

```python
def get_device_arch_version():
    """Returns GPU arch version (8: Ampere, 9: Hopper, 10: Blackwell, ...)"""
    props = torch.cuda.get_device_properties(torch.device("cuda:0"))
    major = getattr(props, "major", None)
    if major is None:  # NPU / non-NVIDIA devices have no compute capability
        return 9
    return major
```

**Python 3.10 compatibility** — the image ships Python 3.10, so `flagscale/train/megatron/training/models/hybrid.py` needs the `typing_extensions` import path for `override`.

**`MLIRCompilationError: ub overflow` in the FlagGems attention backward kernel** — the unified buffer required by the attention backward kernel exceeds what the NPU provides. Lower `seq_length` (for example from 4096 to 1024), or use the native TransformerEngine backend instead of FlagGems. The compiler enables multi-buffering by default (`--enable-auto-multi-buffer=True`), which doubles the requirement; setting `num_stages=1` disables it.

### 9.4 T-Head PPU

**FlagTree and FlagGems cannot be compiled on `/workspace`** — see the note in section 5. Build from local disk.

**FlagCX is not enabled** — the FlagCX path is known to fail on this platform; keep `distributed_backend` on the vendor collective library.

---

## 10. Notes

- Always pass `TE_FL_SKIP_CUDA=1` on non-NVIDIA platforms.
- Change the conda environment to match your platform image.
- `te_fl_prefer: flagos` requires FlagTree and FlagGems to be installed first; otherwise dispatch falls through to the vendor or Reference tier.
- Use `te_fl_per_op` to work around a single failing operator instead of abandoning the whole FlagOS tier.
- Use the platform-specific visible-devices variable from section 7 — an incorrect variable silently leaves the job on a single device.
- Training logs are written under the experiment directory; `flagscale train qwen3 --stop` stops the job.
- For the full operator dispatch configuration, see [TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL) and [FlagGems](https://github.com/flagos-ai/FlagGems).
- For operator-level API details, see the [reference](../references/reference.md) page.
