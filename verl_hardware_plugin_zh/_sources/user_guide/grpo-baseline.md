# GRPO 验收基线（GSM8K）

新硬件平台适配的标准验收测试是使用 Qwen3-0.6B 在 GSM8K 上进行 GRPO 训练。参考实现为仓库中的 `scripts/baseline_grpo_gsm8k.sh`。

## 基线验证内容

- 在目标硬件上的端到端 RL 后训练（FSDP actor/critic + vLLM rollout）。
- `critic/rewards/mean` 曲线应与 [NVIDIA 参考运行](https://swanlab.cn/@heavyrain/verl_grpo_gsm8k_math/runs/8h196r8o/chart)对齐。
- 平台注册、引擎查找，以及（启用时）FlagCX 通信与 FlagGems 算子加速。

## 运行基线

1. 完成平台[安装](../getting_started/install.md)，并准备 Qwen3-0.6B 与 GSM8K 的 `train.parquet` / `test.parquet`。
2. 启动 Ray：

   ```bash
   ray start --head --dashboard-host=0.0.0.0
   ```

3. 为你的硬件设置平台环境变量（例如 `VERL_PLATFORM=metax`，FlagOS 引擎用 `VERL_ENGINE_DEVICE=cuda` + `VERL_ENGINE_VENDOR=flagos`）。
4. 运行基线脚本，将 `DATA_DIR` 与 `MODEL_DIR` 调整为本地路径：

   ```bash
   bash scripts/baseline_grpo_gsm8k.sh
   ```

脚本使用以下默认超参数（均可通过环境变量覆盖）：

| 参数 | 默认值 |
|------|--------|
| 模型 | Qwen3-0.6B |
| `train_batch_size` | 64 |
| `ppo_mini_batch_size` | 16 |
| `max_prompt_length` / `max_response_length` | 1024 / 1024 |
| `rollout_n` | 5 |
| `total_epochs` | 15 |
| 算法 | GRPO（`algorithm.adv_estimator=grpo`，`use_kl_in_reward=False`） |

训练成功启动时，日志会显示平台自动检测与 step 级进度：

```text
INFO platform_manager.py: Auto-detected platform: metax
INFO platform_manager.py: verl platform initialised: cuda
step:1 - actor/entropy:... - perf/mfu/actor_infer:... - critic/rewards/mean:...
```

## FlagOS 引擎环境变量

使用 FlagOS 引擎（vendor `flagos`）时，以下变量控制按阶段加速：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VERL_ENGINE_DEVICE` | 设备类型，如 `cuda` | - |
| `VERL_ENGINE_VENDOR` | 厂商标识，设为 `flagos` | - |
| `TRAINING_FL_FLAGGEMS_ENABLE` | 训练阶段启用 FlagGems | `0` |
| `TRAINING_FL_FLAGOS_WHITELIST` | 训练算子白名单 | （无） |
| `TRAINING_FL_FLAGOS_BLACKLIST` | 训练算子黑名单 | （无） |
| `USE_FLAGCX` | 启用 FlagCX 通信 | `0` |
| `RAY_ACCEL_ENV_VAR_OVERRIDE_ON_ZERO` | Ray GPU 检测覆盖 | `1`（基线中设为 `0`） |

vLLM rollout 调度变量（`VLLM_FL_PREFER`、`VLLM_FL_STRICT`、允许/拒绝列表等）见 [vllm-plugin-FL 调度文档](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/vllm_fl/dispatch/README.md#environment-variables)。
