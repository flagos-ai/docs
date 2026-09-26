# End-to-End Use Case: TransformerEngine-FL + Megatron-LM-FL + FlagScale

This guide walks through an end-to-end training workflow using TransformerEngine-FL, Megatron-LM-FL, and FlagScale together, performed on both CUDA (NVIDIA) and MetaX platforms.

---

## 1. Docker Environment

Go to the [FlagOS main page](https://flagos.io/Home), pick the image for your hardware from the download list in the middle of the page, and follow the on-page instructions to pull the image, enter the container, and start it.

After entering the container, install FlashAttention:

```bash
pip install flash-attn==2.8.3 --no-build-isolation
```

## 2. Prepare FlagScale

```bash
git clone https://github.com/flagos-ai/FlagScale.git
cd FlagScale
# Only for CUDA
pip install -r requirements/cuda/train.txt
git checkout <release-tag>
```

---

## 3. Prepare Megatron-LM-FL

```bash
git clone https://github.com/flagos-ai/Megatron-LM-FL.git
cd Megatron-LM-FL
git checkout <release-tag>
pip install . --no-build-isolation --root-user-action=ignore
```

---

## 4. Prepare TransformerEngine-FL

```bash
git clone https://github.com/flagos-ai/TransformerEngine-FL.git
cd TransformerEngine-FL
git checkout <release-tag>
git submodule update --init --recursive
MAX_JOBS=64 pip install -v . --no-build-isolation --root-user-action=ignore

# On MetaX:
TE_FL_SKIP_CUDA=1 MAX_JOBS=64 pip install -v . --no-build-isolation --root-user-action=ignore
```

---

## 5. Prepare Dataset and Tokenizer

### Dataset

```bash
mkdir -p ./data && cd ./data
wget https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/datasets/enron_emails_demo_text_document_qwen/enron_emails_demo_text_document_qwen.idx
wget https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/datasets/enron_emails_demo_text_document_qwen/enron_emails_demo_text_document_qwen.bin
```

### Tokenizer

```bash
mkdir -p ./qwentokenizer && cd ./qwentokenizer
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/tokenizer_config.json" -O tokenizer_config.json
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/qwen.tiktoken" -O qwen.tiktoken
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/qwen_generation_utils.py" -O qwen_generation_utils.py
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/tokenization_qwen.py" -O tokenization_qwen.py
```

---

## 6. Qwen3 Training Test

Requires 4 GPUs. The `te_fl_prefer` parameter controls backend selection — use `vendor` for vendor-specific implementations or `reference` for pure PyTorch fallback.

```bash
cd FlagScale
python run.py \
    --config-path examples/qwen3/conf \
    --config-name train_te_fl.yaml \
    action=run \
    experiment.exp_dir=./ \
    experiment.runner.hostfile=null \
    '~experiment.runner.ssh_port' \
    'experiment.cmds.before_start="ulimit -n 1048576 && source /root/miniconda3/bin/activate base"' \
    'experiment.envs.CUDA_VISIBLE_DEVICES="4,5,6,7"' \
    train.system.tensor_model_parallel_size=4 \
    train.model.num_layers=4 \
    train.data.data_path=./data/enron_emails_demo_text_document_qwen \
    train.data.tokenizer.tokenizer_path=./qwentokenizer \
    train.model.te_fl_prefer=vendor \
    train.model.distributed_backend=nccl \
    +train.model.attention_backend=flash \
    train.model.enable_flag_gems=False \
    '~train.model.te_fl_allow_vendors' \
    '~train.model.te_fl_deny_vendors' \
    '~train.model.te_fl_per_op' \
    '~train.model.flag_gems_log_path' \
    '~train.model.flag_gems_unused'
```

Key configuration options:

| Parameter | Description | Values |
|-----------|-------------|--------|
| `te_fl_prefer` | Preferred backend | `vendor`, `reference`, `flagos` |
| `attention_backend` | Attention implementation | `flash`, `unfused` |
| `enable_flag_gems` | Enable FlagGems operator dispatch | `True`, `False` |

---

## 7. DeepSeek-V3 Training Test

Requires 4 GPUs. Uses expert parallelism and per-operator backend configuration for grouped GEMM.

```bash
cd FlagScale
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

## 8. Notes

- Change conda environment as needed for your platform
- All training tests require 4 GPUs
- Parameters marked as **Optional** can be adjusted for your setup
- Training logs are written to: `./logs/host_0_localhost.output`
- For MetaX, set `TE_FL_SKIP_CUDA=1` before installing TransformerEngine-FL
