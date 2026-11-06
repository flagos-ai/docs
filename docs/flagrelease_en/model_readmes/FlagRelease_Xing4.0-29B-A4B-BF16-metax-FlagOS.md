---
license: apache-2.0
language:
- zh
- en
---

# Xing4.0-29B-A4B（BF16 · MetaX C550 · FlagOS）

中国电信星辰语义大模型 Xing4.0-29B-A4B 的 **MetaX（沐曦）C550** 适配版本。
29B 总参数 / 4B 激活参数，mHC + MLA + MTP 架构，原生 256K 上下文。

本 README 中的**全部命令与期望输出均已在 MetaX C550 上实测跑通**（2026-11-06，
eager TP2 与 graph TP8 两种模式）。照此操作即可启动服务。

---

## 1. 已验证环境

| 项 | 值 |
|---|---|
| 加速卡 | 沐曦 MetaX C550（单卡 64 GB）× 2（eager TP=2）/ × 8（graph TP=8）|
| 镜像 | `harbor.baai.ac.cn/flagrelease-public/metax-vllm-0.24.0-pluginfl-tree3.6:xing4.0-metax-20260921` |
| 镜像内 vLLM | `vllm-0.1.dev17936+gee0da84ab`（v0.24.0 线）|
| 镜像内 vllm-plugin-FL | `ddc8ea6`（`support-Xing4.0-metax`，含 4 处 MetaX fix）|
| 镜像内 FlagGems | `5.3.2+g1ede19338` |
| 镜像内 torch / triton | `2.8.0+metax3.7.0.7` / `3.6.0`（FlagTree）|
| MACA | 3.7.1.5，驱动 3.8.1 |
| 权重 | `FlagRelease/Xing4.0-29B-A4B-BF16-metax-FlagOS`，53 个文件 / 62.4 GB |

> ⚠️ **不要用 `xingchen4-0907` 镜像**。那是适配期的基础镜像，不含 Xing4.0 的
> `xing4_0` 模型实现与 MetaX 修复，会直接起不来。必须使用上面这个 `xing4.0-metax-*` 镜像。

---

## 2. 硬件与磁盘要求

- **eager（推荐首次验证）**：2 × C550（TP=2），显存占用约 59.8 GB/卡（`--gpu-memory-utilization 0.9`）
- **graph（可选，更快）**：8 × C550（TP=8）
- 权重磁盘：≥ 70 GB（实测 62.4 GB）

---

## 3. 快速开始（eager · TP=2）

### 3.1 拉取镜像

```bash
docker pull harbor.baai.ac.cn/flagrelease-public/metax-vllm-0.24.0-pluginfl-tree3.6:xing4.0-metax-20260921
```

### 3.2 启动容器

权重目录用宿主 `/data` 挂进容器（也可换成任意有 ≥70 GB 空间的目录）：

```bash
mkdir -p /data

docker run -d --name flagos-xing4 \
  --network host \
  --shm-size 64g \
  --device /dev/dri:/dev/dri:rwm \
  --device /dev/mxcd:/dev/mxcd:rwm \
  -v /data:/data \
  harbor.baai.ac.cn/flagrelease-public/metax-vllm-0.24.0-pluginfl-tree3.6:xing4.0-metax-20260921 \
  sleep infinity
```

### 3.3 下载权重

镜像内已自带 `modelscope` 与全部依赖，**宿主机不需要装 python/pip**：

```bash
docker exec -it flagos-xing4 bash -lc '
  modelscope download \
    --model FlagRelease/Xing4.0-29B-A4B-BF16-metax-FlagOS \
    --local_dir /data/Xing4.0-29B-A4B \
    --max-workers 16'
```

实测约 5 分钟（16 并发）。完成后应得到 **53 个文件 / 62.4 GB**：

```bash
docker exec flagos-xing4 bash -lc 'ls -A /data/Xing4.0-29B-A4B | wc -l; du -sh /data/Xing4.0-29B-A4B'
# 53
# du 随文件系统略有出入（逻辑总量 62.4 GB），以文件数 53 为准
```

### 3.4 启动服务

```bash
docker exec -it flagos-xing4 bash
```

进入容器后执行：

```bash
export GEMS_VENDOR=metax
export VLLM_PLUGINS=fl
export MACA_VISIBLE_DEVICES=0,1
export VLLM_WORKER_MULTIPROC_METHOD=spawn
# ⚠️ 黑名单必须完整：漏掉 bmm/bmm_out/linear 会在 Triton 编译阶段崩溃
export VLLM_FL_FLAGOS_BLACKLIST=mm,mm_out,bmm,bmm_out,linear,sort,stable_sort,masked_fill,masked_fill_,slice
export VLLM_FL_USE_FLAGGEMS_ATTN=0
export VLLM_ENGINE_ITERATION_TIMEOUT_S=7200
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=7200

vllm serve /data/Xing4.0-29B-A4B \
  --served-model-name xing4 \
  --reasoning-parser xing4_0 \
  --dtype bfloat16 \
  --tensor-parallel-size 2 \
  --max-model-len 32768 \
  --max-num-seqs 256 \
  --gpu-memory-utilization 0.9 \
  --port 8032 \
  --enforce-eager \
  --no-enable-chunked-prefill \
  --trust-remote-code
```

首次启动约 **2 分钟**。实测（2×C550，权重在 `/data` 本地盘）：
加载权重 25.3 s、init engine 11.3 s，`Application startup complete` 约 **105 s**
（权重放 NFS 时加载 64.8 s、总计 135 s）。
看到下面这行即成功：

```
INFO:     Application startup complete.
```

正常日志特征（可作为自检基线）：

```
GPU KV cache size: 533,888 tokens
Maximum concurrency for 32,768 tokens per request: 16.29x
```

---

## 4. 验证推理

三个请求的输出**都应包含「北京」**（以下为实测原文）。

### 4.1 completions（基座续写）

```bash
curl -s http://localhost:8032/v1/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"xing4","prompt":"问:中国的首都是哪个城市呢？答:","max_tokens":16,"temperature":0.2}'
```

期望输出含：`中国的首都是北京。。`

### 4.2 chat（关闭 thinking）

```bash
curl -s http://localhost:8032/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"xing4","messages":[{"role":"user","content":"中国的首都是哪个城市？"}],"max_tokens":64,"temperature":0,"chat_template_kwargs":{"enable_thinking":false}}'
```

期望输出：`中国的首都是**北京**。北京是中国的政治、文化中心……`（`finish_reason: stop`）

### 4.3 chat（开启 thinking）

```bash
curl -s http://localhost:8032/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"xing4","messages":[{"role":"user","content":"中国的首都是哪个城市？"}],"max_tokens":128,"temperature":0}'
```

思考链会被 `--reasoning-parser xing4_0` 切到 `reasoning_content`，答案在 `content`；
实测 `reasoning_content` 末尾为 `中国的首都是北京`。

---

## 5. 可选：graph 模式（TP=8，更快）

graph 模式占满 8 张卡、端口 8033，与上面的 eager 服务**不能同时运行**（都用到 0,1 卡）。

```bash
docker exec -it flagos-xing4 bash

export GEMS_VENDOR=metax
export VLLM_PLUGINS=fl
export MACA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export VLLM_WORKER_MULTIPROC_METHOD=spawn
export VLLM_FL_FLAGOS_BLACKLIST=mm,mm_out,bmm,bmm_out,linear,sort,stable_sort,masked_fill,masked_fill_,slice
export VLLM_FL_USE_FLAGGEMS_ATTN=0
export VLLM_ENGINE_ITERATION_TIMEOUT_S=7200
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=7200

vllm serve /data/Xing4.0-29B-A4B \
  --served-model-name xing4 \
  --reasoning-parser xing4_0 \
  --dtype bfloat16 \
  --tensor-parallel-size 8 \
  --max-model-len 32768 \
  --max-num-seqs 16 \
  --gpu-memory-utilization 0.9 \
  --port 8033 \
  --no-enable-chunked-prefill \
  --trust-remote-code
```

（与 eager 的差别只有：`MACA_VISIBLE_DEVICES` 0–7、`--tensor-parallel-size 8`、
`--max-num-seqs 16`、端口 8033、**去掉 `--enforce-eager`**。）

实测（8×C550，`/data` 本地盘）：`Application startup complete` 135 s，
init engine 42.1 s（其中 Triton 编译 20.3 s），
`GPU KV cache size: 1,017,152 tokens`，32K 下最大并发 31.04x，0 ERROR / 0 Traceback。

验证时把第 4 节 curl 里的端口 `8032` 换成 `8033`，三项输出与 eager 一致（实测均含「北京」）。
graph 编译更久，首推超时已通过上面的 `VLLM_ENGINE_ITERATION_TIMEOUT_S=7200` 放大。

---

## 6. 常见问题

| 现象 | 原因 / 处理 |
|---|---|
| `xing4_0` 架构不支持、找不到 `Xing4_0ForCausalLM` | 镜像不对。必须用 `xing4.0-metax-*`，不要用 `xingchen4-0907` |
| 启动时 Triton 编译崩溃 / 卡住 / `pri_mem_sz` 超限 | `VLLM_FL_FLAGOS_BLACKLIST` 漏了算子。必须完整包含 `mm,mm_out,bmm,bmm_out,linear,sort,stable_sort,masked_fill,masked_fill_,slice` |
| 下载后文件数不是 53 / 大小不对 | 重跑 3.3 的下载命令（modelscope 会跳过已完成的文件）|
| 端口被占用 | 换 `--port`，或先停掉旧服务 |
| 重启容器后服务没了 | `vllm serve` 是前台进程；建议在 tmux/screen 里跑，或用 `docker exec -d` |
| 想跑 256K 长上下文 | 本 README 验证的是 32768；评测中曾以 `--max-model-len 100000` 稳定运行（KV cache 795,329 tokens），更长需自行评估显存 |

---

## 7. 评测结果

| 指标 | 结果 | 说明 |
|---|---|---|
| MATH-500 | **92.60%**（463/500）| evalscope 口径，`temperature=0`，`max_tokens=24576`，并发 16，TP=8 graph |
| MATH-500 | **83.80%**（419/500）| FlagEval / lm_eval 0.4.8 口径，采样（temp=1.0），跨平台可比；有效作答口径 84.99% |
| GPQA-Diamond | 60.61%（120/198）| 未完成全量；约 46 题撞 57K 输出上限，真实水平约 74% |

> 两个 MATH-500 数字口径不同（贪心 vs 采样、打分器不同），**不可直接比较**，均已在
> 适配记录中留存原始产物。

---

## 8. 适配说明

- 参考分支：`vllm-plugin-FL` 的 `support-Xing4.0-metax` @ `ddc8ea6`
  （相对 `support-Xing4.0` 的 4 处 MetaX fix：`ModelRegistry` import 路径、
  `flashmla` 的 `forward_mha/forward_mqa`、`dcp_world_size` 初值、去掉 `fa_version` partial 注入）
- PR：https://github.com/flagos-day0/vllm-plugin-FL/pull/5
- 适配记录（逐轮命令、日志、评测产物）：`auto-day0/models/metax/Xing4.0/log.md`

## 9. 技术栈

**FlagOS** 统一"模型–系统–芯片"三层：FlagScale（分布式推理）、vllm-plugin-fl（vLLM 多芯片插件）、
FlagGems（Triton 通用算子库）、FlagTree（统一编译器）、FlagCX（跨芯片通信库）。
本模型即 FlagOS 在 MetaX C550 上 Day-0 适配的产物。

## 10. License

模型权重源自 `XingChen-AGI/Xing4.0-29B-A4B`，以 Apache License 2.0 开源：
https://www.apache.org/licenses/LICENSE-2.0.txt
