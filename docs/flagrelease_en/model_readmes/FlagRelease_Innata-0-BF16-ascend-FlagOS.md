---
license: apache-2.0
language:
- zh
- en
---

# Introduction
BAAI (Beijing Academy of Artificial Intelligence) releases **Innata-0**, a native embodied world system. Built on a unified multi-chip software stack, the FlagOS open community provides **Day0 cross-chip adaptation support** focusing on embodied understanding, action-conditioned world prediction and robotic action generation. This adaptation targets six platforms: NVIDIA, MetaX, Hygon, Ascend, Moore Threads and T-Head. It verifies model outputs and inference efficiency across various tasks to support the deployment and evaluation of embodied models on diverse computing hardware.

Centered on three core capabilities — planning, recovery and evolution — Innata-0 is built with co-design of models and agents. **Innata-0-WAM** adopts a three-tower Mixture-of-Transformers architecture to jointly model world understanding, visual prediction, as well as action and tactile generation. **Innata-0-Agent** is responsible for task planning, execution validation, error recovery and accumulation of reusable experience. In the official RoboCasa365 simulation benchmark, equipping the base WAM with the complete agent stack raises the overall task success rate from **60.2% to 65.4%**. For unseen compositional tasks, the success rate increases from **32.4% to 43.6%**. These results illustrate the value of combining model execution with agent-enabled planning, validation and recovery.


### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Ascend** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.


# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | 910C x4卡 |
| Docker Version | 20.10.8 |
| Operating System | openEuler 22.03 (LTS-SP4) |
| Driver | 25.5.0 |
| SDK | CANN 8.5.0 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/innata-0-ascend001-gems5.4.0-tree0.7.1-cx0.14.0-pluginnone-vllm0.20.2-sglangnone-sglangflnone-cp311-ptnpunone-cann90-a64-none:202611270814
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Innata-0-BF16-ascend-FlagOS
```

### Start the Container
```bash
docker run -d --name Innata-0 \
  --privileged \
  --ipc=host \
  --net=host \
  --device=/dev/davinci0 --device=/dev/davinci1 \
  --device=/dev/davinci2 --device=/dev/davinci3 \
  --device=/dev/davinci4 --device=/dev/davinci5 \
  --device=/dev/davinci6 --device=/dev/davinci7 \
  --device=/dev/davinci_manager \
  --device=/dev/devmm_svm \
  --device=/dev/hisi_hdc \
  -v /usr/local/Ascend/driver:/usr/local/Ascend/driver:ro \
  -v /usr/local/dcmi:/usr/local/dcmi \
  -v /etc/ascend_install.info:/etc/ascend_install.info \
  -v /public-flash/models/innata:/models \
  -v /data/innata-work:/work \
  harbor.baai.ac.cn/flagrelease-public/innata-0-ascend001-gems5.4.0-tree0.7.1-cx0.14.0-pluginnone-vllm0.20.2-sglangnone-sglangflnone-cp311-ptnpunone-cann90-a64-none:202611270814 \
  sleep infinity
docker exec -it Innata-0 /bin/bash
```

### Start the Inference Server
```bash
1. Innata-0-Understanding
docker exec \
  -e ASCEND_RT_VISIBLE_DEVICES=11 \
  Innata-0 bash -lc '
source /opt/flagos-env.sh

A=/work/agent2/understanding
source $A/compat/flagos_env.sh

export PYTHONPATH=$A/compat:$A/repo:$A/pylibs:/opt/flagos-stack/lib/python3.11/site-packages
export COSMOS_TRAINING=0 COSMOS_INTERNAL=0 HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1
export OMP_NUM_THREADS=16 TORCH_COMPILE_DISABLE=1 TORCHDYNAMO_DISABLE=1

# FlagGems 不可用的算子（outer/index/gather 内部用 device="npu"；addmm 混合 dtype；conv3d autotune 不收敛）
export INNATA_GEMS_EXCLUDE=outer,index,gather,conv3d,addmm,embedding,lift_fresh,mul,div,sub,add
# 保留 1 个 FlagGems 算子（mean：实测调用 290 次，只比厂商慢 0.3%）
export INNATA_GEMS_YAML=$A/enable_mean_only.yaml

export INNATA_COMPAT_DIR=$A/compat
export INNATA_CKPT_DIR=$A/ckpt

REQ=/work/kit/requests/understanding/blink-image.json
D=/work/acwm/out2/under-agent
rm -rf $D; mkdir -p $D
cd $A/repo

timeout 3600 python3 -c "
import flagos_boot
import runpy, sys
sys.argv = [\"cosmos_framework.scripts.inference\",
            \"-i\", \"$REQ\", \"-o\", \"$D\",
            \"--checkpoint-path\", \"$INNATA_CKPT_DIR\", \"--no-guardrails\"]
runpy.run_module(\"cosmos_framework.scripts.inference\", run_name=\"__main__\")
" > $D/full.log 2>&1

echo "EXIT=$?"
tail -20 $D/full.log
'
2. Innata-0-ACWM
docker exec \
  -e ASCEND_RT_VISIBLE_DEVICES=8 \
  Innata-0 bash -lc '
source /opt/flagos-env.sh

A=/work/agent2/acwm
# 依赖都在 venv 里，PYTHONPATH 只需 compat + repo + venv
export PYTHONPATH=$A/compat:$A/repo:/opt/flagos-stack/lib/python3.11/site-packages
export COSMOS_TRAINING=0 COSMOS_INTERNAL=0 HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1
export OMP_NUM_THREADS=16 TORCH_COMPILE_DISABLE=1 TORCHDYNAMO_DISABLE=1
export INNATA_COMPAT_DIR=$A/compat

D=/work/acwm/out2/acwm-agent
rm -rf "$D"; mkdir -p "$D"
cd $A/repo

cat > "$D/_launch.py" <<PYEOF
import flagos_boot   # 顺序关键：必须在 torch 之前
import runpy, sys
sys.argv = [
    "cosmos_framework.scripts.inference",
    "-i", "/work/kit/requests/acwm/request.json",
    "-o", "$D",
    "--checkpoint-path", "/models/Innata-0-ACWM",
    "--no-guardrails", "--no-diffusion-cache",
]
runpy.run_module("cosmos_framework.scripts.inference", run_name="__main__")
PYEOF

timeout 3600 python3 "$D/_launch.py" > "$D/full.log" 2>&1

echo "EXIT=$?"
ls -la "$D"/episode576__c000/ 2>/dev/null
tail -20 "$D/full.log"
'
3. Innata-0-WAM-RoboDojo
docker exec \
  -e ASCEND_RT_VISIBLE_DEVICES=13 \
  Innata-0 bash -lc '
source /opt/flagos-env.sh

A=/work/agent2/robodojo
export PYTHONPATH=$A/compat:$A/repo:/opt/flagos-stack/lib/python3.11/site-packages:$A/pydeps
export INNATA_COMPAT_DIR=$A/compat
export COSMOS_DEVICE=npu
export COSMOS_TRAINING=0 COSMOS_INTERNAL=0 HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1
export OMP_NUM_THREADS=16 TORCH_COMPILE_DISABLE=1 TORCHDYNAMO_DISABLE=1

# FlagGems 排除表（RoboDojo 比 ACWM 长很多）
export INNATA_GEMS_EXCLUDE=addmm,mm,mm_,bmm,bmm_,linear,embedding,lift_fresh,mul,mul_,div,div_,sub,sub_,add,add_,outer,gelu,gelu_,index,gather,_scaled_dot_product_efficient_attention,_scaled_dot_product_efficient_attention_backward,scaled_dot_product_attention,true_divide,true_div,div_Tensor,div_Scalar,div__Tensor,div__Scalar,mul_Tensor,mul_Scalar,add_Tensor,add_Scalar,sub_Tensor,sub_Scalar,linalg_solve,linalg_solve_ex,_linalg_solve_ex,linalg_vecdot,linalg_vector_norm,_upsample_nearest_exact2d,upsample_nearest2d,upsample_bilinear2d,upsample_nearest_exact3d,upsample_nearest3d,interpolate

# torch_fl 自己的 per-op 路由（与上面是两套机制，都要设）
export FLAGOS_OP_addmm=ascend
export FLAGOS_OP_addmm_out=ascend
export FLAGOS_OP_addmm_dtype=ascend
export FLAGOS_OP_mm=ascend
export FLAGOS_OP_bmm=ascend
export FLAGOS_OP_linear=ascend
export FLAGOS_OP_embedding=ascend
export FLAGOS_OP_mul=ascend
export FLAGOS_OP_div=ascend
export FLAGOS_OP_sub=ascend
export FLAGOS_OP_add=ascend
export FLAGOS_OP_outer=ascend
export FLAGOS_OP_gelu=ascend
export FLAGOS_OP_index=ascend
export FLAGOS_OP_gather=ascend
export FLAGOS_OP__scaled_dot_product_efficient_attention=ascend
export FLAGOS_OP__scaled_dot_product_efficient_attention_backward=ascend
export FLAGOS_OP_scaled_dot_product_attention=ascend

cd $A/repo
D=/work/acwm/out2/dojo-agent
rm -rf $D; mkdir -p $D

timeout 5400 python3 -c "
import flagos_boot
import os
_ex = [x for x in os.environ.get(\"INNATA_GEMS_EXCLUDE\", \"\").split(\",\") if x]
if _ex:
    import torch
    torch.flagos.current_device()
    import flag_gems
    flag_gems.enable(unused=_ex)
    print(\"[dsh] flag_gems enabled, excluded:\", _ex, flush=True)
import runpy, sys
sys.argv = [\"cosmos_framework.scripts.inference\",
            \"-i\", \"/work/kit/requests/robodojo/request-official.json\",
            \"-o\", \"$D\",
            \"--checkpoint-path\", \"/models/Innata-0-WAM-RoboDojo\",
            \"--no-guardrails\", \"--no-diffusion-cache\"]
runpy.run_module(\"cosmos_framework.scripts.inference\", run_name=\"__main__\")
" > $D/full.log 2>&1

echo "EXIT=$?"
tail -20 $D/full.log
'

4. Innata-0-WAM-RoboCasa365
docker exec \
  -e ASCEND_RT_VISIBLE_DEVICES=10 \
  Innata-0 bash -lc '
source /opt/flagos-env.sh

A=/work/agent2/robocasa
# 注意：compat 故意不放进 PYTHONPATH，避免 sitecustomize 提前半初始化 flag_gems
export PYTHONPATH=$A/repo:/opt/flagos-stack/lib/python3.11/site-packages
for d in $(ls $A/deps); do PYTHONPATH="$PYTHONPATH:$A/deps/$d"; done
# pyarrow（camera_geometry 需要），单独目录避免 shadow 标准库 types
export PYTHONPATH="$PYTHONPATH:$A/extradeps"
export PYTHONPATH

export COSMOS_DEVICE=npu
export INNATA_COMPAT_DIR=$A/compat
export COSMOS_TRAINING=0 COSMOS_INTERNAL=0 HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1
export OMP_NUM_THREADS=16 TORCH_COMPILE_DISABLE=1 TORCHDYNAMO_DISABLE=1

# 必设！action_normalization 行数按 native domain 决定（RoboCasa=2，RoboDojo=4），
# 不设会按 4 行构建导致权重 shape 不匹配
export INNATA_CKPT_DIR=/models/Innata-0-WAM-RoboCasa365

# FlagGems 默认不 eager 启用（实测 pointwise 走 Gems 要 211-269ms，原生仅 ~0.4ms）
export INNATA_GEMS_EAGER=0

cd $A/repo
D=/work/acwm/out2/casa-agent
rm -rf $D; mkdir -p $D

timeout 9000 python3 -c "
import flagos_boot
import runpy, sys
sys.argv = [\"cosmos_framework.scripts.inference\",
            \"-i\", \"/work/kit/requests/robocasa/request-ascend.json\",
            \"-o\", \"$D\",
            \"--checkpoint-path\", \"/models/Innata-0-WAM-RoboCasa365\",
            \"--no-guardrails\", \"--no-diffusion-cache\"]
runpy.run_module(\"cosmos_framework.scripts.inference\", run_name=\"__main__\")
" > $D/full.log 2>&1

echo "EXIT=$?"
ls -la $D/*/sample_outputs.json 2>/dev/null
tail -20 $D/full.log
'
```



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
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a "develop once, run anywhere" workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of <chip + open-source model>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.
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
The model weights are derived from Innata-0 and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

