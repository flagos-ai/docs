# Introduction
Alibaba open‑sources the vision‑language model Qwen3.8‑27B, and the Zhongzhi (众智) FlagOS community simultaneously completes Day 0 multi‑chip adaptation; based on the FlagOS unified open‑source technology stack, Qwen3.8‑27B has finished multi‑chip adaptation, precision alignment and deployment verification across 11 AI chips including T-Head（平头哥）、NVIDIA（英伟达）、Moore Threads（摩尔线程）、MetaX（沐曦）、Kunlunxin（昆仑芯）、Ascend（华为昇腾）、Hygon（海光）、Iluvatar CoreX（天数智芯）、Tsingmicro（清微智能）、Enflame（燧原科技）and Sunrise（曦望）, among which NVIDIA and Moore Threads support FP8 precision deployment while the rest run on BF16, and FlagOS has for the first time extended the adaptation of the latest Qwen model to ARM edge‑side platforms with a W4A8 low‑bit version, enabling developers to directly obtain corresponding out‑of‑the‑box solutions.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

Native Apple M5 Pro Runtime for Qwen3.8-27B W4A8 G128 inference. It packages
Python 3.11, PyTorch, vLLM 0.20.2, flagtree-cpu, FlagGems, vLLM-Plugin-FL,
libtriton_jit and the required native libraries.

This Runtime uses the Arm CPU only. Docker, a virtual machine and Metal are not
used. The current developer release is validated on Mac17,9 / Apple M5 Pro /
64 GiB. Model weights are distributed separately through ModelScope.
# Validated batch-one performance

Test environment:

| Item | Configuration |
| --- | --- |
| Hardware | Apple M5 Pro, 18-core CPU, 64 GiB unified memory, 307 GB/s memory bandwidth |
| System | macOS arm64, CPU only; Metal and GPU offload disabled |
| Model | Qwen3.8-27B, GPTQ packed W4A8 G128 |
| Serving | Real OpenAI-compatible `vllm serve`, standard batch size 1 |

Measured with a 512-token prompt and 128 generated tokens:

| Workload | Performance |
| --- | ---: |
| Prefill, pp512 | 74.93 tokens/s |
| Decode, tg128 | 12.73 tokens/s |
| Decode TPOT | 78.55 ms |
| End-to-end time, pp512 + tg128 | 16.81 s |
| Total workload throughput, 640 tokens | 38.07 tokens/s |

Total workload throughput is 640 tokens divided by end-to-end time; it is not
the decode-only generation rate.

The production G128 path uses Arm SDOT/I8MM. SME2 is detected but is not used
by the production kernels. Detailed protocol and retained measurements are in
the Runtime repository's
[benchmarks directory](https://github.com/kevinzs2048/flagos-macos-runtime/tree/v0.1.0-alpha.1/benchmarks).

## Operation Steps

### 1. Download the W4A8 model weights

Install the ModelScope command-line tool:

```bash
python3 -m pip install --user modelscope
```

Set `MODEL_REPO` to the published ModelScope repository ID, then download the
model. The repository ID is intentionally left blank here for publication.

```bash
MODEL_REPO="FlagRelease/Qwen3.8-27B-W4A8-arm-FlagOS-Express"
MODEL_DIR="$HOME/Models/Qwen3.8-27B-W4A8-GPTQ-G128-packed"

modelscope download \
  --model "$MODEL_REPO" \
  --local_dir "$MODEL_DIR"
```

The supported checkpoint layout is:

- Model body: GPTQ W4A8, group size 128, packed compressed-tensors format.
- Input activations: dynamic per-token INT8.
- `lm_head`: BF16 checkpoint weight, prepared as W8A8 by the Runtime.
- Text-only inference path; vision and MTP are not enabled.

### 2. Install the prebuilt macOS Runtime (recommended)

Download the installer and verify it before execution:

```bash
VERSION=0.1.0-alpha.1
BASE="https://github.com/kevinzs2048/flagos-macos-runtime/releases/download/v$VERSION"

curl --fail --location --remote-name "$BASE/install.sh"
curl --fail --location --remote-name "$BASE/install.sh.sha256"
shasum -a 256 -c install.sh.sha256
bash install.sh
```

Add the installed standard `vllm` command to the current shell:

```bash
export PATH="$HOME/Library/FlagOS/current/bin:$PATH"
vllm --version
```

The installer requires no `sudo`. It downloads nine independently checksummed
Runtime parts (four at a time), verifies and reconstructs the complete archive,
installs it below `~/Library/FlagOS/` and activates the selected version. The
path intentionally contains no spaces because PyTorch Inductor cannot compile
its CPU sampler against library paths containing whitespace.

### 3. Build the Runtime from source (developer alternative)

Skip this section when using the prebuilt Runtime. A source build requires a
clean stock vLLM v0.20.2 checkout containing its validated macOS CPU extension
and Python 3.11 environment, plus a relocatable libomp prefix.

```bash
git clone --branch v0.1.0-alpha.1 \
  https://github.com/kevinzs2048/flagos-macos-runtime.git
cd flagos-macos-runtime

./build.sh /path/to/vllm-0.20.2 /path/to/relocatable-libomp

bash install.sh \
  --asset artifacts/flagos-runtime-0.1.0-alpha.1-darwin-arm64-m5pro.tar.gz
export PATH="$HOME/Library/FlagOS/current/bin:$PATH"
```

The build reads exact component commits from `sources.lock.json`, verifies
their Git tree IDs and produces both the end-user Runtime and a developer
wheelhouse. See the Runtime repository's
[BUILDING.md](https://github.com/kevinzs2048/flagos-macos-runtime/blob/v0.1.0-alpha.1/BUILDING.md)
for the detailed build inputs and local source overrides.

### 4. Start W4A8 inference with vLLM

The packaged `vllm` launcher automatically loads the validated M5 Pro profile
and enables vLLM-Plugin-FL. No additional plugin command is required.

```bash
MODEL_DIR="$HOME/Models/Qwen3.8-27B-W4A8-GPTQ-G128-packed"

vllm serve "$MODEL_DIR" \
  --host 127.0.0.1 \
  --port 8000 \
  --served-model-name qwen38 \
  --max-model-len 1024 \
  --max-num-batched-tokens 1024 \
  --max-num-seqs 1 \
  --enforce-eager \
  --language-model-only \
  --limit-mm-per-prompt '{"image":0,"video":0}' \
  --generation-config vllm \
  --reasoning-parser qwen3 \
  --distributed-executor-backend uni \
  --disable-log-stats
```

The startup path is:

```text
vllm launcher
  -> M5 Pro performance profile
  -> vLLM 0.20.2
  -> vLLM-Plugin-FL
  -> FlagGems Q4/W8/GDN kernels
  -> Flagtree-cpu(Triton CPU) and native Arm SDOT/I8MM operators
```

### 5. Send a request

In another terminal:

```bash
curl --fail --max-time 300 http://127.0.0.1:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "qwen38",
    "messages": [
      {"role": "user", "content": "Introduce yourself briefly."}
    ],
    "max_tokens": 128,
    "temperature": 0.6
  }'
```

Qwen3.8 thinking output is parsed with the built-in `qwen3` reasoning parser:
the final answer is returned in `message.content`, while thinking text is
returned separately in `message.reasoning`.

### AnythingLLM Integration Guide

#### 1. Download & Install

- Visit the official site: https://anythingllm.com/
- Choose the appropriate version for your OS (Windows/macOS/Linux)
- Follow the installation wizard to complete the setup

#### 2. Configuration

- Launch AnythingLLM
- Open settings (bottom left, fourth tab)
- Configure core LLM parameters
- Click "Save Settings" to apply changes

#### 3. Model Interaction

- After model loading is complete:
- Click **"New Conversation"**
- Enter your question (e.g., "Explain the basics of quantum computing")
- Click the send button to get a response

# Technical Overview
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a "develop once, run anywhere" workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of \<chip + open-source model\>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.
## FlagGems
FlagGems is a high-performance, generic operator libraryimplemented in [Triton](https://github.com/openai/triton) language. It is built on a collection of backend-neutralkernels that aims to accelerate LLM (Large-Language Models) training and inference across diverse hardware platforms.
## FlagTree
FlagTree is an open source, unified compiler for multipleAI chips project dedicated to developing a diverse ecosystem of AI chip compilers and related tooling platforms, thereby fostering and strengthening the upstream and downstream Triton ecosystem. Currently in its initial phase, the project aims to maintain compatibility with existing adaptation solutions while unifying the codebase to rapidly implement single-repository multi-backend support. Forupstream model users, it provides unified compilation capabilities across multiple backends; for downstream chip manufacturers, it offers examples of Triton ecosystem integration.
## FlagScale and vllm-plugin-fl
Flagscale is a comprehensive toolkit designed to supportthe entire lifecycle of large models. It builds on the strengths of several prominent open-source projects, including [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) and [vLLM](https://github.com/vllm-project/vllm), to provide a robust, end-to-end solution for managing and scaling large models.
vllm-plugin-fl is a vLLM plugin built on the FlagOS unified multi-chip backend, to help flagscale support multi-chip on vllm framework.
## **FlagCX**
FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.

## **FlagEval Evaluation Framework**
 FlagEval is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
 - **Multi-dimensional Evaluation**: Supports 800+ modelevaluations across NLP, CV, Audio, and Multimodal fields,covering 20+ downstream tasks including language understanding and image-text generation.
 - **Industry-Grade Use Cases**: Has completed horizonta1 evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support

# License
The model weights are derived from Qwen/Qwen3.8-27B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt


