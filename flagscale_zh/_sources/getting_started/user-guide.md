# 用户指南

本指南介绍如何配置 FlagScale 以及如何运行训练、推理、服务和强化学习任务。

```{toctree}
:maxdepth: 2

multi-platform-training.md
```

## 第一步：配置 YAML 文件

FlagScale 使用 [Hydra](https://hydra.cc/) 进行配置管理。每个任务由两个协同工作的 YAML 文件驱动：一个实验级文件和一个任务级文件，均位于 `examples/` 目录下。运行任务前，需要先配置这些文件。

### 实验级 YAML

以 `examples/qwen3/conf/serve.yaml` 为例说明此配置文件。

实验级文件是 `flagscale` 命令的入口。它定义了运行的全局上下文：

- 输出存储位置：`exp_dir: outputs/${experiment.exp_name}`

- 使用哪个后端引擎：`backend: vllm`

- 加载哪个任务级文件：`defaults: - serve: 8b`

```{code-block} yaml
# 示例：examples/qwen3/conf/serve.yaml
defaults:
- _self_
- serve: 8b

experiment:
  exp_name: qwen3_8b
  exp_dir: outputs/${experiment.exp_name}
  task:
    type: serve
    backend: vllm
  runner:
    hostfile: null
    deploy:
      use_fs_serve: false
  envs:
    CUDA_VISIBLE_DEVICES: 0
    CUDA_DEVICE_MAX_CONNECTIONS: 1

action: run

hydra:
  run:
    dir: ${experiment.exp_dir}/hydra
```

### 任务级 YAML

以 `examples/qwen3/conf/serve/8b.yaml` 为例说明此配置文件。

任务级 YAML 文件指定模型、数据集以及训练或推理等具体任务的参数。此文件中的每个参数都直接映射到后端引擎接受的参数，其中连字符（-）替换为下划线（\\_）。

```{code-block} yaml
# 示例：examples/qwen3/conf/serve/8b.yaml
- serve_id: vllm_model
  engine_args:
    model: ${oc.env:QWEN3_PATH}
    host: 0.0.0.0
    uvicorn_log_level: warning
    port: ${oc.env:QWEN3_PORT}
    gpu_memory_utilization: 0.9
    trust_remote_code: true
    no_enable_prefix_caching: true
    compilation_config: '{"full_cuda_graph": true}'
```

## 第二步：运行任务

FlagScale 为各种任务提供统一的运行器，包括训练、推理、强化学习和服务。只需指定配置文件，即可通过一条 `flagscale` 命令运行任务。运行器会自动加载配置并执行任务。以下各节演示如何运行分布式训练任务。

### 训练

需要 Megatron-LM-FL 环境

1. 准备数据集演示和分词器：

   - 下载数据集：我们提供了来自 [Pile](https://pile.eleuther.ai/) 数据集的一个小型预处理数据（[bin](https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/datasets/enron_emails_demo_text_document_qwen/enron_emails_demo_text_document_qwen.bin) 和 [idx](https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/datasets/enron_emails_demo_text_document_qwen/enron_emails_demo_text_document_qwen.idx)）。
  
   ```{code-block} shell
   mkdir -p ./data && cd ./data
   wget https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/datasets/enron_emails_demo_text_document_qwen/enron_emails_demo_text_document_qwen.idx
   wget https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/datasets/enron_emails_demo_text_document_qwen/enron_emails_demo_text_document_qwen.bin
   ```

   - 下载分词器
  
   ```{code-block} shell
   mkdir -p ./qwentokenizer && cd ./qwentokenizer
   wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/tokenizer_config.json" -O tokenizer_config.json
   wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/qwen.tiktoken" -O qwen.tiktoken
   wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/qwen_generation_utils.py" -O qwen_generation_utils.py
   wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/tokenizers/qwentokenizer/tokenization_qwen.py" -O tokenization_qwen.py
   ```
  
2. 修改任务级 YAML 文件中的数据集和分词器路径，以及实验级 YAML 文件中的模型名称
   {style=lower-alpha}

   1. **任务级 YAML 文件**：修改 ./examples/qwen3/conf/train/0\\_6b.yaml 中的 `data_path` 和 `tokenizer_path`。

   ```{code-block} yaml
   data:
    data_path: ./data/enron_emails_demo_text_document_qwen    # 在此修改 data_path
    split: 1
    no_mmap_bin_files: true
    tokenizer:
        legacy_tokenizer: true
        tokenizer_type: QwenTokenizerFS
        tokenizer_path: ./qwentokenizer   # 在此修改 tokenizer_path
        vocab_size: 151936
        make_vocab_size_divisible_by: 64
   ```

   2. **实验级 YAML**：修改 ./examples/qwen3/conf/train.yaml 中的 `train` 模型名称。该值必须与上述文件名 **0\\_6b**.yaml 匹配。

   ```{code-block} yaml
   defaults:
   - _self_
   - train: 0_6b  # 修改：train 值必须与其对应的配置文件名匹配
   ```

3. 启动分布式训练任务：

   ```{code-block} shell
   flagscale train qwen3 --config ./examples/qwen3/conf/train.yaml
   # 或
   flagscale train qwen3 -c ./examples/qwen3/conf/train.yaml
   ```

4. 停止分布式训练任务：

   ```{code-block} shell
   flagscale train qwen3 --stop
   ```

### 推理

需要 vLLM-FL 环境

1. 下载推理模型

   ```{code-block} shell
   modelscope download --model Qwen/Qwen3-4B --local_dir ./Qwen3-4B
   ```

2. 修改任务级 YAML 文件中的模型路径和实验级 YAML 文件中的模型名称
   {style=lower-alpha}
   1. **任务级 YAML 文件**：修改 `./examples/qwen3/conf/inference/4b.yaml` 中的 `model` 路径。

   ```{code-block} yaml
   llm:
    model: ./Qwen3-4B         # 修改：设置模型目录
    trust_remote_code: true
    tensor_parallel_size: 1
    pipeline_parallel_size: 1
    gpu_memory_utilization: 0.9
    seed: 1234
   ```

   2. **实验级 YAML**：修改 `./examples/qwen3/conf/inference_fl.yaml` 中的 `inference` 模型名称。该值必须与上述文件名 **4b**.yaml 匹配。

   ```{code-block} python
   defaults:
   - _self_
   - inference: 4b    # 修改：Inference 值必须与其对应的配置文件名匹配
   ```

3. 启动推理：

```{code-block} shell
flagscale inference qwen3 --config ./examples/qwen3/conf/inference_fl.yaml
# 或
flagscale inference qwen3 -c ./examples/qwen3/conf/inference_fl.yaml
```

### 服务

1. 下载服务模型

2. 修改任务级 YAML 文件中的模型路径和实验级 YAML 文件中的模型名称
   {style=lower-alpha}
   1. **任务级 YAML 文件**：修改 `./examples/qwen3/conf/serve/0_6b.yaml` 中的 `model` 路径。

   ```{code-block} yaml
   - serve_id: vllm_model
   engine_args:
      model: ./Qwen3-0.6B          # 修改：设置模型目录
      host: 0.0.0.0
      max_model_len: 4096
      max_num_seqs: 4
      uvicorn_log_level: warning
      port: 30000                  # 您环境中可用的端口，例如：30000
   ```

   2. **实验级 YAML**：修改 `./examples/qwen3/conf/serve.yaml` 中的 `serve` 模型名称。

   ```{code-block} yaml
   defaults:
   - _self_
   - serve: 0_6b         # 修改：Serve 值必须与其对应的配置文件名匹配
   experiment:
   exp_name: qwen3-0.6b  # 根据需要修改以便测试区分
   exp_dir: outputs/${experiment.exp_name}
   task:
      type: serve
      backend: vllm
   runner:
      hostfile: null
      deploy:
      use_fs_serve: false
   envs:
      CUDA_VISIBLE_DEVICES: 0
      CUDA_DEVICE_MAX_CONNECTIONS: 1
   ```

3. 启动服务：

   ```{code-block} shell
   flagscale serve qwen3 --config ./examples/qwen3/conf/serve.yaml
   # 或
   flagscale serve qwen3 -c ./examples/qwen3/conf/serve.yaml
   ```


4. 停止服务：

   ```{code-block} python
   flagscale serve qwen3 --stop
   ```


### 强化学习

需要 verl-FL 环境

1. 下载模型

   ```{code-block} shell
   modelscope download --model Qwen/Qwen3-0.6B --local_dir ./Qwen3-0.6B
   ```

2. 下载数据集

   ```{code-block} python
   mkdir gsm8k && cd gsm8k
   wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/rl/datasets/gsm8k/train.parquet"
   wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/rl/datasets/gsm8k/test.parquet"
   ```


3. 修改任务级 YAML 文件中的模型路径和实验级 YAML 文件中的模型名称
   {style=lower-alpha}
   1. **任务级 YAML 文件**：在 `./examples/qwen3/conf/rl/0_6b.yaml` 中

      - 修改 `train_files`（训练数据集路径）和 `val_files`（测试数据集路径）。

      ```{code-block} python
      data:
         train_files: /workspace/data/gsm8k/train.parquet # 修改：设置您的训练数据集
         val_files: /workspace/data/gsm8k/test.parquet # 修改：设置您的测试数据集
         train_batch_size: 1024
         max_prompt_length: 512
         max_response_length: 1024
         filter_overlong_prompts: true
         truncation: "error"
      ```

      - 修改 `path`（模型检查点路径）。

      ```{code-block} python
      actor_rollout_ref:
         model:
            path: /workspace/data/ckpt/Qwen3-0.6B # 修改：设置您的模型检查点目录
            use_remove_padding: true
            enable_gradient_checkpointing: true
            trust_remote_code: true
      ```

   2. **实验级 YAML**：修改 `./examples/qwen3/conf/rl.yaml` 中的 exp\\_dir（实验目录）和 runtime\\_env（运行时环境路径）。

   ```{code-block} python
   experiment:
      exp_name: 0_6b
      exp_dir: /workspace/qwen3-rl/ # 修改：设置您的实验目录
      runner:
         runtime_env: /path/to/verl-FL/verl/trainer/runtime_env.yaml # 修改：设置您的 runtime_env.yaml
   ```

4. 启动强化学习：

   ```{code-block} shell
   flagscale rl qwen3 --config ./examples/qwen3/conf/rl.yaml
   # 或
   flagscale rl qwen3 -c ./examples/qwen3/conf/rl.yaml
   ```

   您可以在实验目录中查看输出。

5. 停止强化学习：

   ```{code-block} shell
   flagscale rl qwen3 --stop
   ```

   或强制停止 Ray 集群。

   ```{code-block} python
   ray stop
   ```
