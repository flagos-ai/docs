# 平台抽象与多芯片训练

verl-FL 用平台抽象层替代了上游 verl 中硬编码的 `torch.cuda` 调用，并集成 FlagOS 训练引擎，使同一份 RL 后训练脚本可运行在 NVIDIA、华为昇腾、沐曦 MetaX（MACA）、摩尔线程 MUSA 与 CPU 上。本页介绍该抽象层、引擎插件以及已验证的端到端流程。

## 平台抽象层

抽象层位于 `verl/plugin/platform/`，采用策略模式：

```text
verl/plugin/platform/
├── __init__.py
├── platform_base.py        # PlatformBase 抽象基类（16 个设备无关方法）
├── platform_cuda.py        # CUDA + FlagCX 自动检测
├── platform_metax.py       # 沐曦 MetaX MACA
├── platform_npu.py         # 昇腾 NPU
├── platform_musa.py        # 摩尔线程 MUSA + FlagCX
├── platform_cpu.py         # CPU 回退
├── platform_manager.py     # 单例，支持 VERL_PLATFORM 环境变量覆盖
└── README.md               # 新增后端的指南
```

`PlatformBase` 定义了 16 个设备无关方法，涵盖设备分配、内存管理、流操作与分布式初始化。业务逻辑调用平台 API，而不再直接调用 `torch.cuda.*`。

通过 `VERL_PLATFORM` 环境变量在运行时选择平台；不设置时会在启动阶段自动检测。

```bash
export VERL_PLATFORM=metax     # 沐曦 MetaX
export VERL_PLATFORM=npu       # 昇腾 NPU
export VERL_PLATFORM=musa      # 摩尔线程 MUSA
export VERL_PLATFORM=cpu       # CPU（测试用）
```

## 引擎插件架构

训练引擎可按设备插拔注册：

```text
verl/plugin/engine/
├── __init__.py             # 引擎注册表
├── fsdp_fl/
│   ├── __init__.py
│   └── transformer_impl.py # 基于 TE-FL 的 FSDP 引擎
└── megatron_fl/
    └── __init__.py         # 基于 Megatron-LM-FL 的引擎
```

FlagOS 引擎通过引擎设备与厂商选择，与平台相互独立：

```bash
export VERL_ENGINE_DEVICE=flagos
export VERL_ENGINE_VENDOR=flagos
```

- **FSDP 引擎** —— 基于 TransformerEngine-FL，支持 fp8 与多后端算子调度。
- **Megatron 引擎** —— 基于 Megatron-LM-FL，面向大规模分布式训练。

## 基于 FlagCX 的异构训练

[FlagCX](https://github.com/flagos-ai/FlagCX) 是统一的跨厂商通信后端。它允许同一集群混用加速器：NVIDIA 节点运行 actor/critic（FSDP），摩尔线程 MUSA 节点运行 rollout（vLLM），权重同步与设备隔离通过 Ray 运行时上下文完成。

```text
┌─────────────────────────┐              ┌─────────────────────────┐
│  NVIDIA 节点            │              │  MUSA 节点              │
│  (Actor / Critic)       │◄── FlagCX ──►│  (Rollout / vLLM)       │
│  FSDP + NCCL            │              │  torch_musa             │
└─────────────────────────┘              └─────────────────────────┘
```

### 环境要求

- **NVIDIA 节点：** 基础镜像 `nvidia/cuda:12.9.1-devel-ubuntu22.04`，Python 3.10；需安装 torch 2.9.0+cu129、vLLM 0.12.0、vllm-plugin-FL、TransformerEngine-FL、Megatron-LM-FL、FlagCX、Ray 与 verl-FL。
- **MUSA 节点：** 基础镜像 `registry.mthreads.com/presale/devtech/vllm_plugin_fix:20260327hg`（已含 `torch_musa`、MUSA 工具链与 vllm-plugin-FL），Python 3.10；需安装 FlagCX、Ray 与 verl-FL。
- **两个节点：** Python 3.10，跨节点通信需要 InfiniBand。模型：Qwen3-0.6B。数据集：GSM8K（`train.parquet` / `test.parquet`）。

### 第一步 —— 启动 Ray 集群

在 MUSA 节点（head，承载 rollout）：

```bash
export RAY_EXPERIMENTAL_NOSET_MUSA_VISIBLE_DEVICES=1
export MUSA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export MCCL_NET_GDR_LEVEL=2
export MCCL_IB_HCA=mlx5_bond_0
export FLAGCX_PATH=/workspace/FlagCX
export USE_FLAGCX=1
export FLAGCX_IB_HCA=mlx5

# 如未安装 RDMA 依赖
apt install -y rdma-core libibverbs1 libibverbs-dev ibverbs-utils

ray start --head --port=6379 --node-ip-address=<MUSA_NODE_IP> --num-gpus=8
```

在 NVIDIA 节点（worker，承载 actor/critic）：

```bash
export FLAGCX_PATH=/workspace/FlagCX
export USE_FLAGCX=1
export FLAGCX_LOG_LEVEL=DEBUG

ray start --address='<MUSA_NODE_IP>:6379' --node-ip-address=<NVIDIA_NODE_IP> --num-gpus=8
```

### 第二步 —— 启动异构 GRPO 训练

将 `config/one_step_off_ppo_trainer.yaml` 中的数据与模型路径改为本地路径：

```yaml
data:
  train_files: <path/to/gsm8k/train.parquet>
  val_files: <path/to/gsm8k/test.parquet>

actor_rollout_ref:
  model:
    path: <path/to/Qwen3-0.6B>
```

然后在 NVIDIA（worker）节点上运行：

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

### （可选）先验证 FlagCX 跨节点通信

在完整训练之前，可以先不借助 Ray 与 verl-FL，仅验证两个节点能否通过 FlagCX 通信。在 MUSA 节点（rank 0）：

```bash
export FLAGCX_DEBUG=INFO
export FLAGCX_DEBUG_SUBSYS=ALL
export FLAGCX_SOCKET_IFNAME=<MUSA_IB_IFNAME>   # 例如 bond0，用 `ip a` 查看
export MUSA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export FLAGCX_IB_HCA=mlx5
export FLAGCX_ENABLE_TOPO_DETECT=TRUE

torchrun --nproc_per_node 8 --nnodes=2 --node_rank=0 \
    --master_addr=<MUSA_NODE_IP> --master_port=8122 \
    example.py
```

在 NVIDIA 节点（rank 1）：

```bash
export FLAGCX_DEBUG=INFO
export FLAGCX_DEBUG_SUBSYS=ALL
export FLAGCX_SOCKET_IFNAME=<NVIDIA_IB_IFNAME>   # 例如 ens22f0，用 `ip a` 查看
export CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export FLAGCX_IB_HCA=mlx5
export FLAGCX_ENABLE_TOPO_DETECT=TRUE

torchrun --nproc_per_node 8 --nnodes=2 --node_rank=1 \
    --master_addr=<MUSA_NODE_IP> --master_port=8122 \
    example.py
```

两侧输出的 allreduce 结果一致，且 `example.py`（来自 FlagCX 仓库）无报错退出。

## 验证通过的表现

| 范围 | 预期结果 |
|------|----------|
| NVIDIA 端到端 GRPO 训练 | 全部通过，训练收敛 |
| 沐曦 MetaX（MACA）端到端 GRPO 训练 | 全部通过，训练收敛 |
| MUSA 异构（NVIDIA actor/critic + MUSA rollout） | FlagCX 跨节点通信建立、训练不崩溃：`critic/score/mean` 全程大于 0，`rollout_corr/log_ppl_diff` 小于 0.005（训练与 rollout 的 PPL 保持一致，例如第 1 步 `training_log_ppl` 约 0.76、`rollout_log_ppl` 约 0.76） |

## 新增后端

1. 在 `verl/plugin/platform/` 下实现继承 `PlatformBase` 的平台类。
2. 在平台管理器中注册，使 `VERL_PLATFORM` 与自动检测能够找到它。
3. 在 `verl/plugin/engine/` 下补充对应的 FSDP 和/或 Megatron 引擎。
4. 将业务逻辑中遗留的硬件特定调用替换为平台 API。

带完整注释的模板见仓库中的 `verl/plugin/platform/README.md`。
