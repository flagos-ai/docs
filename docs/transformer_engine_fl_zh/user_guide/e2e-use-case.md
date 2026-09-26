# 端到端用例：TransformerEngine-FL + Megatron-LM-FL + FlagScale

本指南介绍使用 TransformerEngine-FL、Megatron-LM-FL 和 FlagScale 的端到端训练工作流，在 CUDA（NVIDIA）和 MetaX 平台上执行。

---

## 1. Docker 环境

打开 [FlagOS 主页面](https://flagos.io/Home)，在页面正中间的下载列表中选择与你的硬件对应的镜像，按页面上的说明拉取镜像、进入容器并启动。

进入容器后，安装 FlashAttention：

```bash
pip install flash-attn==2.8.3 --no-build-isolation
```

## 2. 准备 FlagScale

```bash
git clone https://github.com/flagos-ai/FlagScale.git
cd FlagScale
# 仅 CUDA
pip install -r requirements/cuda/train.txt
git checkout <release-tag>
```

---

## 3. 准备 Megatron-LM-FL

```bash
git clone https://github.com/flagos-ai/Megatron-LM-FL.git
cd Megatron-LM-FL
git checkout <release-tag>
pip install . --no-build-isolation --root-user-action=ignore
```

---

## 4. 准备 TransformerEngine-FL

```bash
git clone https://github.com/flagos-ai/TransformerEngine-FL.git
cd TransformerEngine-FL
git checkout <release-tag>
git submodule update --init --recursive
MAX_JOBS=64 pip install -v . --no-build-isolation --root-user-action=ignore

# 沐曦平台：
TE_FL_SKIP_CUDA=1 MAX_JOBS=64 pip install -v . --no-build-isolation --root-user-action=ignore
```

---

## 5. 准备数据集和分词器

### 数据集

```bash
mkdir -p ./data && cd ./data
wget https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/datasets/enron_emails_demo_text_document_qwen/enron_emails_demo_text_document_qwen.idx
wget https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/datasets/enron_emails_demo_text_document_qwen/enron_emails_demo_text_document_qwen.bin
```

### 分词器

```bash
mkdir -p ./qwentokenizer && cd ./qwentokenizer
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/tokenizer_config.json" -O tokenizer_config.json
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/qwen.tiktoken" -O qwen.tiktoken
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/qwen_generation_utils.py" -O qwen_generation_utils.py
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/tokenization_qwen.py" -O tokenization_qwen.py
```

---

## 6. Qwen3 训练测试

需要 4 个 GPU。`te_fl_prefer` 参数控制后端选择 — 使用 `vendor` 选择供应商特定实现，或使用 `reference` 选择纯 PyTorch 回退。

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

关键配置选项：

| 参数 | 描述 | 值 |
|------|------|-----|
| `te_fl_prefer` | 首选后端 | `vendor`、`reference`、`flagos` |
| `attention_backend` | 注意力实现 | `flash`、`unfused` |
| `enable_flag_gems` | 启用 FlagGems 算子调度 | `True`、`False` |

---

## 7. DeepSeek-V3 训练测试

需要 4 个 GPU。使用专家并行和逐算子后端配置进行分组 GEMM。

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

## 8. 注意事项

- 根据您的平台更改 conda 环境
- 所有训练测试需要 4 个 GPU
- 标记为**可选**的参数可根据您的设置进行调整
- 训练日志写入：`./logs/host_0_localhost.output`
- 沐曦平台安装 TransformerEngine-FL 前需设置 `TE_FL_SKIP_CUDA=1`
