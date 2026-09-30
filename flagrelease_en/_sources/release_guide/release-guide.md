# FlagRelease Release Guide

## What is FlagRelease

FlagRelease is an automated model evaluation and release pipeline that supports NVIDIA, Ascend, Metax, Hygon, and other GPU platforms for:

* Model environment validation

* Accuracy evaluation

* Performance evaluation

* Automatic release

Suitable for validation and release workflows after model adaptation is completed.

---

# Environment Setup

## Operating System Requirements

* **Operating System**: Ubuntu 20.04+ or CentOS 7+ (Linux environment)

* **GPU Driver**: GPU driver from the target vendor installed

* **Network**: Access to Docker Hub, ModelScope, HuggingFace, GitHub

* **Docker Environment**: Ensure Docker is installed and running

* **Model Recommendation**: opus4.6

## Install Node.js

```bash
sudo apt remove libnode-dev nodejs
apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

---

## Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

---

## Configure Claude Code

Edit:

```bash
~/.claude/settings.json
```

Fill in:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "<URL>",
    "ANTHROPIC_AUTH_TOKEN": "<TOKEN>",
    "ANTHROPIC_MODEL": "<MODEL>"
  }
}
```

---

# Get the Code

```bash
git clone https://github.com/Lxiparer/FlagRelease.git
cd FlagRelease
```

---

# Run the Pipeline

## Command Format

```bash
bash prompts/run_pipeline.sh \
    <IMAGE> \
    <MODEL_NAME> \
    <MODELSCOPE_TOKEN> \
    <HF_TOKEN> \
    <GITHUB_TOKEN> \
    <HARBOR_USER> \
    <HARBOR_PASSWORD> \
    [--model-path PATH] \
    [--flagrelease-token TOKEN]
```

---

## Parameters to Modify

Usually you only need to focus on these three items:

### Image

Select the corresponding image based on your hardware.

| Platform | Image |
| --- | --- |
| NVIDIA (vLLM 0.20.2) | `harbor.baai.ac.cn/flagrelease-public/nv_vllm-0.20.2_gems_tree:202605131138` |
| Ascend (vLLM 0.13.0) | `harbor.baai.ac.cn/flagrelease-public/hw_gems_5.0.2_tree_0.5.0-ascend3.2:2605131051` |
| Metax (vLLM 0.13.0) | `harbor.baai.ac.cn/flagrelease-public/metax_gems_tree:2605061746` |
| Hygon (vLLM 0.13.0) | `harbor.baai.ac.cn/flagrelease-public/hy_gems_tree:2605111710` |
| Iluvatar (vLLM 0.13.0) | `harbor.baai.ac.cn/flagrelease-public/tianshu_gems_5.0.2_0.5.1-iluvatar3.1_vllm_fl_0.0.0:2605201817` |
| Moore Threads (vLLM 0.13.0) | `harbor.baai.ac.cn/flagrelease-public/mthreads_gt_gems_5.0.1rc0_tree_0.5.0-mthreads3.1:2605151801` |

---

### Model Name

Must match the name on HuggingFace or ModelScope.

For example:

```bash
Qwen/Qwen2-7B-Instruct
HY/Hy-MT2-7B
meta-llama/Llama-3.1-8B
```

---

### Model Path (Optional)

If you already have the model locally:

```bash
--model-path /mnt/workspace/models/Qwen/Qwen2-7B-Instruct
```

If not specified, it will automatically search or download.

---

# Running Examples

```bash
bash prompts/run_pipeline.sh \
    harbor.baai.ac.cn/flagrelease-public/nv_gems_tree:04081426 \
    Qwen/Qwen2-7B-Instruct \
    <MODELSCOPE_TOKEN> \
    <HF_TOKEN> \
    <GITHUB_TOKEN> \
    <HARBOR_USER> \
    <HARBOR_PASSWORD> \
    <--model-path /mnt/workspace/models/Qwen/Qwen2-7B-Instruct>
```

---

## Running in Background

Recommended approach:

```bash
nohup bash prompts/run_pipeline.sh ... \
    > pipeline.log 2>&1 &
```

View logs:

```bash
tail -f pipeline.log
```

View process:

```bash
ps -ef | grep run_pipeline
```

---

# Evaluation Results

After the pipeline completes, results are saved in:

```bash
/data/flagos-workspace/<MODEL_NAME>/
```

Directory structure:

```bash
results/    Evaluation results
traces/     Inference traces
logs/       Logs
config/     Configuration backup
```

---

# FAQ

## Docker Cannot Connect

```bash
Cannot connect to the Docker daemon
```

Start Docker:

```bash
sudo systemctl start docker
```

---

## Model Download Failed

Check:

* Is the model name correct

* Can the network access ModelScope/HuggingFace

* Is `--model-path` specified correctly

---

## Claude Code Authentication Failed

Check:

```bash
~/.claude/settings.json
```

Verify these settings:

```bash
ANTHROPIC_BASE_URL
ANTHROPIC_AUTH_TOKEN
ANTHROPIC_MODEL
```

Are configured correctly.

---

## View Detailed Logs

```bash
tail -f pipeline.log
```

Or:

```bash
tail -f /data/flagos-workspace/<MODEL_NAME>/logs/pipeline.log
```

---

# Supported Platforms

| Platform | Status |
| --- | --- |
| NVIDIA | ✅ |
| Ascend | ✅ |
| Metax | ✅ |
| Hygon | ✅ |
| Iluvatar | In Development |
| Kunlunxin | In Development |
| Moore Threads | In Development |