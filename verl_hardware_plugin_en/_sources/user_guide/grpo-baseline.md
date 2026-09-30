# GRPO Acceptance Baseline (GSM8K)

The standard acceptance test for a new hardware platform adaptation is GRPO training on GSM8K with Qwen3-0.6B. The reference implementation is `scripts/baseline_grpo_gsm8k.sh` in the repository.

## What the Baseline Validates

- End-to-end RL post-training (FSDP actor/critic + vLLM rollout) on the target hardware.
- The `critic/rewards/mean` curve should align with the [NVIDIA reference run](https://swanlab.cn/@heavyrain/verl_grpo_gsm8k_math/runs/8h196r8o/chart).
- Platform registration, engine lookup, and (when enabled) FlagCX communication and FlagGems operator acceleration.

## Running the Baseline

1. Complete the platform [installation](../getting_started/install.md) and prepare Qwen3-0.6B and the GSM8K `train.parquet` / `test.parquet`.
2. Start Ray:

   ```bash
   ray start --head --dashboard-host=0.0.0.0
   ```

3. Set the platform environment variables for your hardware (for example `VERL_PLATFORM=metax`, or `VERL_ENGINE_DEVICE=cuda` + `VERL_ENGINE_VENDOR=flagos` for the FlagOS engine).
4. Run the baseline script, adjusting `DATA_DIR` and `MODEL_DIR` to your local paths:

   ```bash
   bash scripts/baseline_grpo_gsm8k.sh
   ```

The script uses these default hyperparameters (all overridable via environment variables):

| Parameter | Default |
|-----------|---------|
| Model | Qwen3-0.6B |
| `train_batch_size` | 64 |
| `ppo_mini_batch_size` | 16 |
| `max_prompt_length` / `max_response_length` | 1024 / 1024 |
| `rollout_n` | 5 |
| `total_epochs` | 15 |
| Algorithm | GRPO (`algorithm.adv_estimator=grpo`, `use_kl_in_reward=False`) |

When training starts successfully, logs show platform auto-detection and step-level progress:

```text
INFO platform_manager.py: Auto-detected platform: metax
INFO platform_manager.py: verl platform initialised: cuda
step:1 - actor/entropy:... - perf/mfu/actor_infer:... - critic/rewards/mean:...
```

## FlagOS Engine Environment Variables

When running with the FlagOS engine (vendor `flagos`), the following variables control stage-scoped acceleration:

| Variable | Description | Default |
|----------|-------------|---------|
| `VERL_ENGINE_DEVICE` | Device type, e.g. `cuda` | - |
| `VERL_ENGINE_VENDOR` | Vendor identifier, set to `flagos` | - |
| `TRAINING_FL_FLAGGEMS_ENABLE` | Enable FlagGems for training | `0` |
| `TRAINING_FL_FLAGOS_WHITELIST` | Training operator whitelist | (none) |
| `TRAINING_FL_FLAGOS_BLACKLIST` | Training operator blacklist | (none) |
| `USE_FLAGCX` | Enable FlagCX communication | `0` |
| `RAY_ACCEL_ENV_VAR_OVERRIDE_ON_ZERO` | Ray GPU detection override | `1` (set to `0` in the baseline) |

For vLLM rollout dispatch variables (`VLLM_FL_PREFER`, `VLLM_FL_STRICT`, allow/deny lists, etc.), see the [vllm-plugin-FL dispatch documentation](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/vllm_fl/dispatch/README.md#environment-variables).
