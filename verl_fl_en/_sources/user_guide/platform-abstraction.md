# Platform Abstraction and Multi-Chip Training

verl-FL replaces the hard-coded `torch.cuda` calls of upstream verl with a platform abstraction layer, and integrates the FlagOS training engines, so the same RL post-training script runs on NVIDIA, Huawei Ascend, MetaX (MACA), Moore Threads (MUSA), and CPU. This page describes the abstraction, the engine plugins, and the validated end-to-end workflows.

## Platform Abstraction Layer

The abstraction lives under `verl/plugin/platform/` and follows the Strategy Pattern:

```text
verl/plugin/platform/
├── __init__.py
├── platform_base.py        # PlatformBase ABC (16 device-agnostic methods)
├── platform_cuda.py        # CUDA + FlagCX auto-detection
├── platform_metax.py       # MetaX MACA
├── platform_npu.py         # Ascend NPU
├── platform_musa.py        # Moore Threads MUSA + FlagCX
├── platform_cpu.py         # CPU fallback
├── platform_manager.py     # Singleton, VERL_PLATFORM env var override
└── README.md               # Guide for adding new backends
```

`PlatformBase` defines 16 device-agnostic methods covering device allocation, memory management, stream operations, and distributed initialization. Business logic calls the platform API instead of `torch.cuda.*`.

Select the platform at runtime with the `VERL_PLATFORM` environment variable; without it the platform is auto-detected at startup.

```bash
export VERL_PLATFORM=metax     # MetaX
export VERL_PLATFORM=npu       # Ascend NPU
export VERL_PLATFORM=musa      # Moore Threads MUSA
export VERL_PLATFORM=cpu       # CPU (testing)
```

## Engine Plugin Architecture

Training engines are pluggable and registered per device:

```text
verl/plugin/engine/
├── __init__.py             # Engine registry
├── fsdp_fl/
│   ├── __init__.py
│   └── transformer_impl.py # TE-FL based FSDP engine
└── megatron_fl/
    └── __init__.py         # Megatron-LM-FL based engine
```

The FlagOS engines are selected through the engine device and vendor, independently of the platform:

```bash
export VERL_ENGINE_DEVICE=flagos
export VERL_ENGINE_VENDOR=flagos
```

- **FSDP engine** — built on TransformerEngine-FL; supports fp8 and multi-backend operator dispatch.
- **Megatron engine** — built on Megatron-LM-FL for large-scale distributed training.

## Heterogeneous Training with FlagCX

[FlagCX](https://github.com/flagos-ai/FlagCX) is the unified cross-vendor communication backend. It lets one cluster mix accelerators: NVIDIA nodes run actor/critic (FSDP) while Moore Threads MUSA nodes run rollout (vLLM), with weight synchronization and device isolation handled through the Ray runtime context.

```text
┌─────────────────────────┐              ┌─────────────────────────┐
│  NVIDIA Nodes           │              │  MUSA Nodes             │
│  (Actor / Critic)       │◄── FlagCX ──►│  (Rollout / vLLM)       │
│  FSDP + NCCL            │              │  torch_musa             │
└─────────────────────────┘              └─────────────────────────┘
```

### Environment requirements

- **NVIDIA node:** base image `nvidia/cuda:12.9.1-devel-ubuntu22.04`, Python 3.10; install torch 2.9.0+cu129, vLLM 0.12.0, vllm-plugin-FL, TransformerEngine-FL, Megatron-LM-FL, FlagCX, Ray, and verl-FL.
- **MUSA node:** base image `registry.mthreads.com/presale/devtech/vllm_plugin_fix:20260327hg` (ships `torch_musa`, the MUSA toolkit, and vllm-plugin-FL), Python 3.10; install FlagCX, Ray, and verl-FL.
- **Both nodes:** Python 3.10 and InfiniBand for cross-node communication. Model: Qwen3-0.6B. Dataset: GSM8K (`train.parquet` / `test.parquet`).

### Step 1 — Start the Ray cluster

On the MUSA node (head, handles rollout):

```bash
export RAY_EXPERIMENTAL_NOSET_MUSA_VISIBLE_DEVICES=1
export MUSA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export MCCL_NET_GDR_LEVEL=2
export MCCL_IB_HCA=mlx5_bond_0
export FLAGCX_PATH=/workspace/FlagCX
export USE_FLAGCX=1
export FLAGCX_IB_HCA=mlx5

# Install RDMA dependencies if not present
apt install -y rdma-core libibverbs1 libibverbs-dev ibverbs-utils

ray start --head --port=6379 --node-ip-address=<MUSA_NODE_IP> --num-gpus=8
```

On the NVIDIA node (worker, handles actor/critic):

```bash
export FLAGCX_PATH=/workspace/FlagCX
export USE_FLAGCX=1
export FLAGCX_LOG_LEVEL=DEBUG

ray start --address='<MUSA_NODE_IP>:6379' --node-ip-address=<NVIDIA_NODE_IP> --num-gpus=8
```

### Step 2 — Launch heterogeneous GRPO training

Point `config/one_step_off_ppo_trainer.yaml` at your local data and model:

```yaml
data:
  train_files: <path/to/gsm8k/train.parquet>
  val_files: <path/to/gsm8k/test.parquet>

actor_rollout_ref:
  model:
    path: <path/to/Qwen3-0.6B>
```

Then run on the NVIDIA (worker) node:

```bash
TORCH_COMPILE_DISABLE=1 RAY_DEDUP_LOGS=0 HYDRA_FULL_ERROR=1 \
FLAGCX_PATH=/workspace/FlagCX USE_FLAGCX=1 FLAGCX_LOG_LEVEL=DEBUG \
CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7 RAY_ACCEL_ENV_VAR_OVERRIDE_ON_ZERO=0 \
python3 -m recipe.one_step_off_policy.main_ppo \
    --config-path=config \
    --config-name='one_step_off_ppo_trainer.yaml' \
    actor_rollout_ref.actor.strategy=fsdp2 \
    actor_rollout_ref.actor.ppo_micro_batch_size_per_gpu=4 \
    actor_rollout_ref.actor.ppo_mini_batch_size=64 \
    actor_rollout_ref.rollout.name="vllm" \
    actor_rollout_ref.rollout.log_prob_micro_batch_size_per_gpu=4 \
    actor_rollout_ref.rollout.tensor_model_parallel_size=1 \
    +actor_rollout_ref.rollout.enable_sleep_mode=False \
    actor_rollout_ref.rollout.free_cache_engine=False \
    actor_rollout_ref.rollout.calculate_log_probs=True \
    +actor_rollout_ref.model.override_config.attn_implementation=eager \
    critic.strategy=fsdp2 \
    actor_rollout_ref.hybrid_engine=False \
    trainer.nnodes=1 \
    trainer.logger='["console"]' \
    trainer.n_gpus_per_node=8 \
    rollout.nnodes=1 \
    rollout.n_gpus_per_node=8 \
    2>&1 | tee onestep_hetero.log
```

### (Optional) Verify FlagCX cross-node communication first

Before a full run you can check that the two nodes communicate over FlagCX, without Ray or verl-FL. On the MUSA node (rank 0):

```bash
export FLAGCX_DEBUG=INFO
export FLAGCX_DEBUG_SUBSYS=ALL
export FLAGCX_SOCKET_IFNAME=<MUSA_IB_IFNAME>   # e.g. bond0; check with `ip a`
export MUSA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export FLAGCX_IB_HCA=mlx5
export FLAGCX_ENABLE_TOPO_DETECT=TRUE

torchrun --nproc_per_node 8 --nnodes=2 --node_rank=0 \
    --master_addr=<MUSA_NODE_IP> --master_port=8122 \
    example.py
```

On the NVIDIA node (rank 1):

```bash
export FLAGCX_DEBUG=INFO
export FLAGCX_DEBUG_SUBSYS=ALL
export FLAGCX_SOCKET_IFNAME=<NVIDIA_IB_IFNAME>   # e.g. ens22f0; check with `ip a`
export CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export FLAGCX_IB_HCA=mlx5
export FLAGCX_ENABLE_TOPO_DETECT=TRUE

torchrun --nproc_per_node 8 --nnodes=2 --node_rank=1 \
    --master_addr=<MUSA_NODE_IP> --master_port=8122 \
    example.py
```

Both sides print allreduce results that match, and `example.py` (from the FlagCX repository) exits without error.

## What a Validated Run Looks Like

| Scope | Expected result |
|-------|-----------------|
| NVIDIA E2E GRPO training | All tests pass, training converges |
| MetaX (MACA) E2E GRPO training | All tests pass, training converges |
| MUSA heterogeneous (NVIDIA actor/critic + MUSA rollout) | FlagCX cross-node communication is established and training runs without crashing: `critic/score/mean` stays above 0 throughout, and `rollout_corr/log_ppl_diff` is below 0.005 (training and rollout PPL stay consistent, e.g. `training_log_ppl` ~0.76 and `rollout_log_ppl` ~0.76 at step 1) |

## Adding a New Backend

1. Implement a platform class deriving from `PlatformBase` under `verl/plugin/platform/`.
2. Register it in the platform manager so `VERL_PLATFORM` and auto-detection can find it.
3. Add the corresponding FSDP and/or Megatron engine under `verl/plugin/engine/`.
4. Replace any remaining hardware-specific call in the business logic with the platform API.

See `verl/plugin/platform/README.md` in the repository for a fully annotated template.
