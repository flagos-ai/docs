---
base_model:
- ""
---
# Introduction
GLM‑5.3‑Flash is the first natively multimodal model in the GLM‑5 series. It has 320B total parameters with 18B activated per token. It outperforms GLM‑5.2 and scores 57 points on the globally‑recognized Artificial Analysis Composite Intelligence Index (AA Composite Intelligence Index), ranking among the world’s frontier models and matching the score of Claude Opus 4.8. In Z.ai’s internal Code‑Bench experiential evaluation, its coding performance is on par with Claude Opus 4.8.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Ascend** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.


# GLM-5.3-Flash-w8a8-mtp-FlagOS-Express

面向 Ascend 910B 的 GLM-5.3-Flash W8A8 推理镜像，提供 P/D 分离、MTP、INT8 KV cache、P 侧三级前缀缓存和 D 侧前缀缓存。默认开启 SGLang plugin、FlagTree 和 FlagGems。

本文中的 **1p1d** 是双机部署：一个逻辑 P 实例和一个逻辑 D 实例各占一台服务器。**2p2d** 是四机部署：一个逻辑 P 实例跨两台服务器，一个逻辑 D 实例跨两台服务器。每台服务器使用八张 910B；多机 rank 不是独立服务副本。

| 部署 | 服务器数 / NPU 总数 | P attention / MoE | D attention / MoE | 最大上下文 |
|---|---|---|---|---|
| 1p1d | 2 / 16 | TP8 / EP8 | DP2×TP4 / EP8 | 1,048,576 tokens |
| 2p2d | 4 / 32 | DP2×TP8 / EP16 | DP8×TP2 / EP16 | 1,048,576 tokens |

最大上下文包括输入与输出。开启 1M 上下文并不意味着所有并发请求都能同时达到 1M；实际准入受每个 attention DP 域的 KV 池和 Mamba 状态池容量共同约束。 本镜像的双机部署已经完成 **1,047,424 输入 + 1,024 输出 tokens** 的真实请求。

## 软件版本与代码身份

| 软件 | 版本 / 提交 | 安装与启用方式 |
|---|---|---|
| SGLang | `0.5.21.dev476+g4e60d70ba`（发行包元数据） | 镜像内冻结的 P/D 源码，见下方校验身份 |
| sglang-plugin-FL | `0.1.0` · `33b6cb0ccadd409d365b11a159e28674ea442bb2` | `/sgl-workspace/sglang-plugin-FL`，editable，`glm53flash-opt` |
| FlagGems | `0.0+g38e3fd945` · `38e3fd9450d42de16f970ab247febc6507bdf840` | `/sgl-workspace/FlagGems`，editable，`glm53flash-opt`，仅 `ones` |
| FlagTree | `0.7.0+ascend3.5` | 官方 ARM64 / Python 3.11 wheel，启用 |
| Triton | 模块版本 `3.5.1` | 由 FlagTree 提供，未另装同名发行包 |
| PyTorch | `2.10.0+cpu` | 配合 Torch-NPU 在 NPU 上推理 |
| Torch-NPU | `2.10.0` | 启用 |
| CANN | `9.0.0` | 镜像内工具链；驱动由宿主机提供 |
| Python | `3.11.15` | ARM64 |
| Native Gateway | `0.3.2` | 镜像内置 Rust 可执行程序 |


```text
P: 6714a5319c9854a088e9f390b1e520b9e3ffeb7ec1cbbb9f29c5807da6f8b74a
D: 16fcd72a0068301d32d5a8f5454150388e6f8b770b602c303876f44d98b98f8b
```

FlagTree wheel 的 SHA256：`bf3e8d213359ea03426a503b293db576480ca564c3b673eec9d6c1a476060915`。上述源码与依赖已经包含在镜像中，部署不需要重新拉取仓库。入口显式选择 ATB C++ ABI1，与本镜像的 PyTorch 二进制保持一致。镜像将 P/D 源码放在 `/sgl-workspace/roles/prefill/python` 和 `/sgl-workspace/roles/decode/python`，由角色入口选择。

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/glm-5.3-flash-w8a8-mtp-flagos-express:2026-10-28
```
镜像不包含模型权重。每台服务器需提供完整的 GLM-5.3-Flash-w8a8 模型目录（包括 tokenizer、配置、视觉模块、MTP 权重与 `chat_template.jinja`）、可工作的 Ascend 驱动、Docker 与 runc，以及节点间可互通的通信网络。下面通过特权容器和显式驱动挂载访问 NPU。主模型和 draft 使用同一目录，均以 ModelSlim W8A8 计算；KV 为 INT8，Mamba/SSM 状态为 FP32。

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/GLM-5.3-Flash-W8A8-ascend-FlagOS-W8A8-ascend-FlagOS-Express
```


## Start the Container
创建与启动 P/D 容器
先将所有尖括号占位符替换为实际值。P 与 D 服务器必须能互访 API、bootstrap、分布式初始化及 HCCL/Mooncake 通信端口；下列命令使用 host network、host IPC 和特权设备访问。每台机器只启动下面指定的一个模型 rank，避免同一组 NPU 被重复占用。

在每台服务器的同一个 shell 中设置公共变量：

```bash
export IMAGE="${IMAGE:-harbor.baai.ac.cn/flagrelease-public/glm-5.3-flash-w8a8-mtp-flagos-express:2026-10-28}"
export P0_IP='<P_PRIMARY_IP>'
export D0_IP='<D_PRIMARY_IP>'
export NET_IFACE='<COMMUNICATION_INTERFACE>'
export MODEL_DIR='<MODEL_DIRECTORY>'
export DEPLOY_DIR='<WRITABLE_DEPLOYMENT_DIRECTORY>'
```

双机部署分别设置：

```bash
# P 服务器：
export LAYOUT=1p1d ROLE=prefill NODE_RANK=0
# D 服务器（在该服务器另开 shell，先设置上述公共变量）：
export LAYOUT=1p1d ROLE=decode NODE_RANK=0
```

四机部署还要在每台服务器设置 `P1_IP`、`D1_IP`，并按机器选择以下四行中的一行：

```bash
export P1_IP='<P_SECONDARY_IP>'
export D1_IP='<D_SECONDARY_IP>'
# P 主节点：
export LAYOUT=2p2d ROLE=prefill NODE_RANK=0
# P 从节点：
export LAYOUT=2p2d ROLE=prefill NODE_RANK=1
# D 主节点：
export LAYOUT=2p2d ROLE=decode NODE_RANK=0
# D 从节点：
export LAYOUT=2p2d ROLE=decode NODE_RANK=1
```

设置完该机器的变量后，在每台服务器完整执行以下代码。四机部署的两个 P rank 和两个 D rank 各自属于同一分布式实例，应在相近时间启动。所有优化依赖已经打入镜像，不需要挂载代码目录或额外安装 plugin。

```bash
#!/usr/bin/env bash
set -euo pipefail
: "${IMAGE:?Set IMAGE}" "${LAYOUT:?Set LAYOUT}" "${ROLE:?Set ROLE}"
: "${NODE_RANK:?Set NODE_RANK}" "${P0_IP:?Set P0_IP}" "${D0_IP:?Set D0_IP}"
: "${NET_IFACE:?Set NET_IFACE}" "${MODEL_DIR:?Set MODEL_DIR}" "${DEPLOY_DIR:?Set DEPLOY_DIR}"
case "$LAYOUT" in 1p1d) NNODES=1;; 2p2d) NNODES=2;; *) exit 64;; esac
case "$ROLE" in prefill|decode) ;; *) exit 64;; esac
if [ "$NNODES" = 1 ]; then test "$NODE_RANK" = 0; else
  : "${P1_IP:?Set P1_IP}" "${D1_IP:?Set D1_IP}"
  case "$NODE_RANK" in 0|1) ;; *) exit 64;; esac
fi
if [ "$ROLE" = prefill ]; then
  LOCAL_IP="$P0_IP"; test "$NODE_RANK" != 1 || LOCAL_IP="$P1_IP"
  MASTER_IP="$P0_IP"; INIT_PORT=12681; PORT=31266
else
  LOCAL_IP="$D0_IP"; test "$NODE_RANK" != 1 || LOCAL_IP="$D1_IP"
  MASTER_IP="$D0_IP"; INIT_PORT=12682; PORT=32266
fi
for value in "$IMAGE" "$LOCAL_IP" "$P0_IP" "$D0_IP" "$NET_IFACE" "$MODEL_DIR" "$DEPLOY_DIR"; do
  case "$value" in *'<'*|*'>'*) echo 'Replace every placeholder before running'; exit 64;; esac
done
test -f "$MODEL_DIR/config.json"
test -f "$MODEL_DIR/chat_template.jinja"
mkdir -p "$DEPLOY_DIR/runtime" "$DEPLOY_DIR/prefix-ssd"
NAME="glm53-${LAYOUT}-${ROLE}-${NODE_RANK}"
ENV_FILE="$DEPLOY_DIR/runtime/${NAME}.env"
umask 077
cat > "$ENV_FILE" <<EOF
SGLANG_HOST_IP=$LOCAL_IP
HCCL_IF_IP=$LOCAL_IP
HCCL_SOCKET_IFNAME=$NET_IFACE
GLOO_SOCKET_IFNAME=$NET_IFACE
ASCEND_MF_STORE_URL=tcp://$P0_IP:26126
ASCEND_RT_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
SGLANG_ASCEND_TRANSFER_ENGINE=mooncake
ENABLE_ASCEND_TRANSFER_WITH_MOONCAKE=1
ASCEND_MF_TRANSFER_PROTOCOL=device_rdma
HYBM_RDMA_SWAP_SPACE_SIZE=0
SGLANG_DISAGGREGATION_BOOTSTRAP_TIMEOUT=7200
SGLANG_DISAGGREGATION_WAITING_TIMEOUT=7200
SGLANG_ZBAL_LOCAL_MEM_SIZE=0
SGLANG_ENABLE_TORCH_COMPILE=0
SGLANG_ENABLE_METRICS_DEVICE_TIMER=0
SGLANG_FC_OBSERVER_ENABLE=0
SGLANG_MAMBA_RESTORE_TRACE=0
OMP_NUM_THREADS=1
MKL_NUM_THREADS=1
OPENBLAS_NUM_THREADS=1
SGLANG_PD_METRICS=1
SGLANG_PD_METRICS_ROLE=$ROLE
SGLANG_PD_METRICS_SERVICE_ID=${ROLE}-0
SGLANG_PD_METRICS_NODE=${ROLE}-${NODE_RANK}
SGLANG_PD_METRICS_CLUSTER=glm53-flagos-express
TRITON_CACHE_DIR=/eval/triton-cache
ASCEND_CACHE_PATH=/eval/ascend-cache
SGLANG_FL_PROOF_DIR=/eval/flagos-proof
SGLANG_HICACHE_FILE_BACKEND_STORAGE_DIR=/prefix-ssd
EOF
case "$ROLE" in
  prefill)
    cat >> "$ENV_FILE" <<'EOF'
DEEP_NORMAL_MODE_USE_INT8_QUANT=0
GLM53_KDA_ENABLE_FUSED=0
HCCL_DETERMINISTIC=true
HCCL_INTRA_PCIE_ENABLE=1
HCCL_INTRA_ROCE_ENABLE=0
LCCL_DETERMINISTIC=0
LCCL_PARALLEL=0
SGLANG_CHAT_AFFINITY_CPU_WORKERS=8
SGLANG_GLM53_AUDIT_DIR=
SGLANG_GLM53_CACHE_AUDIT_DIR=
SGLANG_GLM53_CHAT_REUSE_PROMPT_IDS=1
SGLANG_GLM53_DECODE_BENCH_TRACE_DIR=
SGLANG_GLM53_INDEXER_FUSE=0
SGLANG_GLM53_INTERLEAVED_PREFILL=1
SGLANG_GLM53_KDA_PREFILL_PREPARE=1
SGLANG_GLM53_KDA_PREPARED_ASCENDC=1
SGLANG_GLM53_KDA_VARLEN_ASCENDC=1
SGLANG_GLM53_NORMAL_ALL_TO_ALL=0
SGLANG_GLM53_NORMAL_BATCH_SHAPE_AUDIT=1
SGLANG_GLM53_NORMAL_BATCH_SHAPE_AUDIT_SMALL=1
SGLANG_GLM53_NORMAL_COMBINE_DETERMINISTIC=1
SGLANG_GLM53_NORMAL_COMBINE_SKIP_EMPTY=1
SGLANG_GLM53_NORMAL_COMBINE_SKIP_EMPTY_MIN_TOKENS=4096
SGLANG_GLM53_NORMAL_DEVICE_ROUTING_MIN_TOKENS=512
SGLANG_GLM53_NORMAL_HCCL=1
SGLANG_GLM53_NORMAL_MEMORY_HEADROOM_MB=1024
SGLANG_GLM53_NORMAL_PREFILL_DRAFT_MIN_TOKENS=4096
SGLANG_GLM53_NORMAL_PREFILL_DRAFT_SCOPE=1
SGLANG_GLM53_NORMAL_REDUCE_SCATTER_CHECK=0
SGLANG_GLM53_NORMAL_SHAPE_CACHE=1
SGLANG_GLM53_NORMAL_SKIP_IDLE_ATTN=1
SGLANG_GLM53_NORMAL_SKIP_IDLE_DP=1
SGLANG_GLM53_PD_MAMBA_BRANCH_NATURAL_CHUNK=0
SGLANG_GLM53_PD_MAMBA_BRANCH_SPLIT=1
SGLANG_GLM53_PD_MAMBA_DEVICE_TRACK_INDICES=0
SGLANG_GLM53_PD_PREFILL_INDEX_TP=1
SGLANG_GLM53_PD_PREFILL_INDEX_TP_DP_PERFORMANCE=1
SGLANG_GLM53_PD_PREFILL_INDEX_TP_MODE=performance
SGLANG_GLM53_PD_PREFILL_JIT_PREFETCH=0
SGLANG_GLM53_PD_PREFILL_REUSABLE_CHECKPOINT=1
SGLANG_GLM53_PD_SINGLE_WRITER_DSA_TAIL=0
SGLANG_GLM53_PREFILL_HOT_LANE_TOKENS=0
SGLANG_GLM53_PREFILL_HOT_LANE_TRACE=0
SGLANG_GLM53_PREFILL_INDEX_TP=1
SGLANG_GLM53_PREFILL_INDEX_VERIFY_DIR=
SGLANG_GLM53_PREFILL_MHC_POST=1
SGLANG_GLM53_PREFILL_MHC_POST_DIAGNOSTIC=0
SGLANG_GLM53_PREFILL_MHC_POST_DIAGNOSTIC_DIR=
SGLANG_GLM53_PREFILL_MHC_PRE=1
SGLANG_GLM53_PREFILL_POOLED_POSTOP=auto
SGLANG_GLM53_PREFILL_POOLED_POSTOP_DIAGNOSTIC=0
SGLANG_GLM53_PREFILL_POOLED_POSTOP_DIAGNOSTIC_DIR=
SGLANG_GLM53_PREFILL_POOLED_SCORE=0
SGLANG_GLM53_PREFILL_TOPK_AUTO_FREE_MB=512
SGLANG_GLM53_PREFILL_TOPK_METADATA_REUSE=1
SGLANG_GLM53_PREFILL_TOPK_TILE_ROWS=auto
SGLANG_GLM53_P_GATED_RMS_LOOP_ROWS=8
EOF
    ;;
  decode)
    cat >> "$ENV_FILE" <<'EOF'
DEEP_NORMAL_MODE_USE_INT8_QUANT=0
HCCL_DETERMINISTIC=true
HCCL_INTRA_PCIE_ENABLE=1
HCCL_INTRA_ROCE_ENABLE=0
LCCL_DETERMINISTIC=0
LCCL_PARALLEL=0
SGLANG_GLM53_AUDIT_DIR=
SGLANG_GLM53_CACHE_AUDIT_DIR=
SGLANG_GLM53_CHECK_BLOCK_TABLE_UPDATE=0
SGLANG_GLM53_DECODE_BENCH_TRACE_DIR=
SGLANG_GLM53_D_GATED_RMS_LOOP_MIN_ROWS=1536
SGLANG_GLM53_D_GATED_RMS_LOOP_ROWS=8
SGLANG_GLM53_D_GATED_RMS_ROWS=0
SGLANG_GLM53_D_KDA_BHV=1
SGLANG_GLM53_FUSED_BLOCK_TABLE_UPDATE=1
SGLANG_GLM53_FUSED_KPOOL_TAIL_SCATTER=1
SGLANG_GLM53_FUSED_KPOOL_VERIFY_SNAPSHOT=1
SGLANG_GLM53_KDA_PREFILL_PREPARE=1
SGLANG_GLM53_KDA_PREPARED_ASCENDC=0
SGLANG_GLM53_KDA_VARLEN_ASCENDC=1
SGLANG_GLM53_MTP_FUSED_COMMIT=1
SGLANG_GLM53_NEXTN_COMPACT_MOE=0
SGLANG_GLM53_PD_MAMBA_BRANCH_SPLIT=0
SGLANG_GLM53_VERIFY_CONST_META=1
SGLANG_GLM53_VERIFY_EXPAND_BATCH=1
SGLANG_GLM53_VERIFY_INDEX_BATCH=1
SGLANG_GLM53_VERIFY_INDEX_MIN_BS=12
SGLANG_NPU_GRAPH_MEMORY_TRACE=0
SGLANG_NPU_GRAPH_RELEASE_WARMUP_CACHE=1
SGLANG_PD_STRICT_DECODE_KV_ADMISSION=1
SGLANG_PD_STRICT_KV_FAIR_SCAN=0
EOF
    ;;
esac
ARGS=(--model-path /models/GLM-5.3-Flash-w8a8 --trust-remote-code
  --quantization modelslim --dtype bfloat16 --kv-cache-dtype int8 --mamba-ssm-dtype float32
  --context-length 1048576 --page-size 64 --nnodes "$NNODES" --node-rank "$NODE_RANK"
  --dist-init-addr "$MASTER_IP:$INIT_PORT" --disable-custom-all-reduce --weight-loader-disable-mmap
  --watchdog-timeout 7200 --host 0.0.0.0 --port "$PORT" --decode-log-interval 32 --skip-server-warmup
  --speculative-algorithm EAGLE --speculative-num-steps 4 --speculative-eagle-topk 1
  --speculative-num-draft-tokens 5 --speculative-draft-model-path /models/GLM-5.3-Flash-w8a8
  --speculative-draft-model-quantization modelslim --speculative-draft-kv-cache-dtype int8
  --disable-overlap-schedule --enable-metrics --enable-cache-report --random-seed 1024
  --reasoning-parser glm45 --tool-call-parser glm47
  --chat-template /models/GLM-5.3-Flash-w8a8/chat_template.jinja --enable-multimodal)
if [ "$LAYOUT" = 1p1d ]; then
  TP=8; EP=8; TWO_NODE=0; HCCL_MB=128
  if [ "$ROLE" = prefill ]; then
    DP=1; RUNNING=8; MAMBA=32; FRACTION=0.92; KV_CAP=1114112; CHUNK=4096; PREFILL=4096; BASE_PORT=58000
    ARGS+=(--prefill-max-requests 1)
    cat >> "$ENV_FILE" <<EOF
SGLANG_GLM53_NORMAL_COMBINE_ORDERED=0
SGLANG_GLM53_NORMAL_REDUCE_SCATTER=0
SGLANG_GLM53_NORMAL_DEVICE_ROUTING=0
EOF
  else
    DP=2; RUNNING=16; MAMBA=16; FRACTION=0.985; KV_CAP=2652160; CHUNK=512; PREFILL=2048; BASE_PORT=59000
    GRAPHS=(1 2 4 8); GRAPH_MAX=8; EXEC_CAP=8; DEEPEP_MB=512
  fi
else
  TP=16; EP=16; TWO_NODE=1
  if [ "$ROLE" = prefill ]; then
    DP=2; RUNNING=16; MAMBA=132; FRACTION=0.90; KV_CAP=1048576; CHUNK=32768; PREFILL=32768; BASE_PORT=52000; HCCL_MB=1024
    cat >> "$ENV_FILE" <<'EOF'
SGLANG_GLM53_NORMAL_COMBINE_ORDERED=2node
SGLANG_GLM53_NORMAL_REDUCE_SCATTER=2node
SGLANG_GLM53_NORMAL_DEVICE_ROUTING=ordered
EOF
  else
    DP=8; RUNNING=112; MAMBA=112; FRACTION=0.94; KV_CAP=2652160; CHUNK=512; PREFILL=2048; BASE_PORT=57000; HCCL_MB=128
    GRAPHS=(1 2 4 8 14); GRAPH_MAX=14; EXEC_CAP=14; DEEPEP_MB=1280
  fi
fi
cat >> "$ENV_FILE" <<EOF
SGLANG_GLM53_2NODE_PD=$TWO_NODE
HCCL_BUFFSIZE=$HCCL_MB
HCCL_IF_BASE_PORT=$BASE_PORT
EOF
ARGS+=(--tp-size "$TP" --dp-size "$DP" --ep-size "$EP" --max-running-requests "$RUNNING"
  --max-mamba-cache-size "$MAMBA" --mem-fraction-static "$FRACTION" --max-total-tokens "$KV_CAP"
  --max-prefill-tokens "$PREFILL" --chunked-prefill-size "$CHUNK")
if [ "$ROLE" = prefill ]; then
  ARGS+=(--schedule-policy fcfs)
  if [ "$DP" != 1 ]; then ARGS+=(--enable-dp-attention --enable-dp-lm-head); fi
  ARGS+=(--moe-a2a-backend deepep --deepep-mode normal --disable-cuda-graph
    --mamba-radix-cache-strategy extra_buffer --mamba-track-interval 256
    --enable-hierarchical-cache --hicache-size 8 --hicache-io-backend kernel_ascend
    --hicache-mem-layout page_first_kv_split --hicache-write-policy write_through
    --hicache-storage-backend file --hicache-storage-prefetch-policy wait_complete
    --disaggregation-mode prefill --disaggregation-transfer-backend ascend --disaggregation-bootstrap-port 18986)
else
  cat >> "$ENV_FILE" <<EOF
DEEPEP_HCCL_BUFFSIZE=$DEEPEP_MB
SGLANG_PD_DECODE_EXEC_MAX_REQUESTS_PER_DP=$EXEC_CAP
SGLANG_DEEPEP_NUM_MAX_DISPATCH_TOKENS_PER_RANK=35
EOF
  ARGS+=(--enable-dp-attention --enable-dp-lm-head --moe-a2a-backend deepep --deepep-mode low_latency
    --cuda-graph-backend-decode full --cuda-graph-backend-prefill disabled
    --cuda-graph-bs-decode "${GRAPHS[@]}" --cuda-graph-max-bs-decode "$GRAPH_MAX"
    --disaggregation-mode decode --disaggregation-transfer-backend ascend --disaggregation-decode-polling-interval 1
    --disaggregation-decode-enable-radix-cache --disaggregation-decode-extra-slots 0 --pre-warm-nccl
    --stream-response-default-include-usage)
fi
docker create --name "$NAME" --runtime ascend --privileged --network host --ipc host \
  --cgroupns host --ulimit nofile=1024:1024 \
  --restart unless-stopped --stop-timeout 120 \
  --log-driver json-file --log-opt max-size=50m --log-opt max-file=3 \
  --env-file "$ENV_FILE" \
  -v "$MODEL_DIR:/models/GLM-5.3-Flash-w8a8:ro" \
  -v "$DEPLOY_DIR/runtime:/eval" -v "$DEPLOY_DIR/prefix-ssd:/prefix-ssd" \
  -v "${ASCEND_DRIVER_DIR:-/usr/local/Ascend/driver}:/usr/local/Ascend/driver:ro" \
  -v "${ASCEND_FIRMWARE_DIR:-/usr/local/Ascend/firmware}:/usr/local/Ascend/firmware:ro" \
  -v "${DCMI_DIR:-/usr/local/dcmi}:/usr/local/dcmi:ro" \
  -v "${HOST_SBIN_DIR:-/usr/local/sbin}:/usr/local/sbin:ro" \
  -v "${HCCN_CONF:-/etc/hccn.conf}:/etc/hccn.conf:ro" \
  -v "${ASCEND_INSTALL_INFO:-/etc/ascend_install.info}:/etc/ascend_install.info:ro" \
  "$IMAGE" "$ROLE" "${ARGS[@]}"
docker start "$NAME"
docker logs --tail 30 "$NAME"
```

## 启动统一 API Gateway

在 P 主节点执行。双机和四机都只注册逻辑 P/D 主节点；不要把四机的 rank 1 当成独立实例注册。Gateway 使用 CPU，不占用 NPU。

先在 P 主节点等待两个实例的原生 health 接口都返回成功，再创建 Gateway。首次请求可能触发尚未覆盖的小形状编译；仅看到容器 `running` 不代表已经可以评测。

```bash
export P0_IP='<P_PRIMARY_IP>' D0_IP='<D_PRIMARY_IP>'
python3 - <<'PYREADY'
import os, time, urllib.request
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
for ip, port in [(os.environ['P0_IP'],31266),(os.environ['D0_IP'],32266)]:
    url=f'http://{ip}:{port}/health'; deadline=time.monotonic()+1800
    while True:
        try:
            with opener.open(url,timeout=30) as response:
                assert response.status==200
            print('Ready:',url); break
        except Exception:
            if time.monotonic()>deadline:
                raise RuntimeError('Initialization timeout: '+url)
            time.sleep(5)
PYREADY
```


```bash
: "${IMAGE:?}" "${P0_IP:?}" "${D0_IP:?}" "${MODEL_DIR:?}" "${LAYOUT:?}"
case "$LAYOUT" in 1p1d) D_LOCAL_CAP=8;; 2p2d) D_LOCAL_CAP=14;; *) exit 64;; esac
docker create --name glm53-gateway --runtime runc --network host --ipc host \
  --cgroupns host --ulimit nofile=1024:1024 \
  --security-opt seccomp=unconfined \
  -e SGLANG_GATEWAY_PD_AFFINITY_PREFIX_TOKENS=5632 \
  -e SGLANG_GATEWAY_PD_CHAT_EARLY_STREAM=1 \
  -e SGLANG_GATEWAY_PD_CHAT_REUSE_TOKEN_IDS=1 \
  -e SGLANG_GATEWAY_PD_CHAT_TOKEN_AFFINITY=1 \
  -e SGLANG_GATEWAY_PD_DECODE_INFLIGHT_CAP="$D_LOCAL_CAP" \
  -e SGLANG_GATEWAY_PD_PREFILL_CACHE_CAPACITY=1 \
  -e SGLANG_GATEWAY_PD_PREFILL_STAGE_RESERVATION=1 \
  -e SGLANG_GATEWAY_PD_TOKEN_AFFINITY=1 \
  -e SGLANG_GATEWAY_PD_METRICS=1 \
  -e SGLANG_GATEWAY_PD_METRICS_MODEL=GLM-5.3-Flash-w8a8 \
  --restart unless-stopped --stop-timeout 30 \
  --log-driver json-file --log-opt max-size=50m --log-opt max-file=3 \
  -v "$MODEL_DIR:/models/GLM-5.3-Flash-w8a8:ro" \
  "$IMAGE" gateway \
  --pd-disaggregation --dp-aware \
  --prefill "http://$P0_IP:31266" 18986 --decode "http://$D0_IP:32266" \
  --policy prefix_hash --prefill-policy prefix_hash --decode-policy prefix_hash \
  --disable-health-check --disable-retries --request-timeout-secs 7200 \
  --host 0.0.0.0 --port 30266 --prometheus-port 29266 \
  --model-path /models/GLM-5.3-Flash-w8a8 \
  --tokenizer-path /models/GLM-5.3-Flash-w8a8
docker start glm53-gateway
docker logs --tail 30 glm53-gateway
```

等待各 P/D 节点完成权重加载、通信初始化、allocator 预热及 D graph capture。首次启动会产生编译缓存，未 ready 前不要发送长请求。

## 简单测试

在能访问 Gateway 的机器上执行以下 Python 3 标准库脚本，不需要 OpenAI SDK。API 模型名固定为 `/models/GLM-5.3-Flash-w8a8`。

```bash
export BASE_URL='http://<GATEWAY_HOST>:30266'
python3 - <<'PYTEST'
import json, os, time, urllib.request
base = os.environ['BASE_URL'].rstrip('/')
deadline = time.monotonic()+600
while True:
    try:
        with urllib.request.urlopen(base+'/workers', timeout=30) as response:
            workers=json.load(response)['workers']
        ready={w['worker_type'] for w in workers if w['is_healthy']}
        if {'prefill','decode'} <= ready:
            break
    except Exception:
        pass
    if time.monotonic()>deadline:
        raise RuntimeError('Gateway has not registered healthy P/D workers')
    time.sleep(2)
with urllib.request.urlopen(base + '/v1/models', timeout=30) as response:
    print(response.read().decode())
body = dict(model='/models/GLM-5.3-Flash-w8a8', stream=True,
            messages=[dict(role='user', content='Write a Python function that returns the square of an integer.')],
            temperature=0, max_tokens=1024,
            stream_options=dict(include_usage=True))
request = urllib.request.Request(base + '/v1/chat/completions',
    json.dumps(body).encode(), {'Content-Type':'application/json'})
start = time.monotonic(); first = None
with urllib.request.urlopen(request, timeout=1800) as response:
    for line in response:
        if not line.startswith(b'data: '):
            continue
        payload = line[6:].strip()
        if payload == b'[DONE]':
            break
        event = json.loads(payload)
        for choice in event.get('choices', []):
            delta = choice.get('delta', {})
            text = delta.get('content') or delta.get('reasoning_content')
            if text:
                if first is None:
                    first = time.monotonic()
                    print('TTFT(s):', round(first-start, 3))
                print(text, end='', flush=True)
        if event.get('usage'):
            print('\nusage:', event['usage'])
print('\nElapsed(s):', round(time.monotonic()-start, 3))
PYTEST
```

工具调用通过 OpenAI Chat Completions 的 `tools` / `tool_choice` 字段使用；多模态请求通过消息中的 `image_url` 内容项传入。镜像启动命令已开启视觉、`glm47` 工具解析和 `glm45` 推理解析，模型目录必须包含相应视觉权重和 processor 配置。

## 128K 输入 / 1K 输出的解码性能

![128K input / 1K output — client TPOT versus actual decode concurrency](figures/concurrency-tpot.png)

| 部署 | 实际 D 并发 | 请求样本数 | mean TPOT | p50 TPOT | p75 TPOT | p90 TPOT | p99 TPOT |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1p1d · 双机 | 1 | 8 | 18.506 | 18.539 | 18.634 | 18.688 | 18.723 |
| 1p1d · 双机 | 10 | 30 | 21.012 | 20.946 | 21.131 | 21.316 | 21.397 |
| 1p1d · 双机 | 16 | 48 | 20.437 | 20.432 | 20.610 | 20.708 | 20.845 |
| 2p2d · 四机 | 1 | 8 | 16.683 | 16.643 | 16.837 | 16.920 | 17.018 |
| 2p2d · 四机 | 10 | 30 | 16.995 | 16.996 | 17.372 | 17.376 | 17.380 |
| 2p2d · 四机 | 20 | 60 | 19.513 | 19.517 | 19.600 | 19.605 | 19.609 |
| 2p2d · 四机 | 30 | 90 | 19.071 | 19.181 | 19.346 | 19.356 | 19.360 |
| 2p2d · 四机 | 40 | 120 | 22.871 | 22.802 | 23.148 | 23.163 | 23.166 |
| 2p2d · 四机 | 50 | 150 | 22.610 | 22.634 | 22.682 | 22.690 | 22.695 |
| 2p2d · 四机 | 60 | 180 | 22.674 | 22.653 | 22.795 | 22.802 | 22.807 |
| 2p2d · 四机 | 80 | 240 | 27.458 | 27.439 | 27.542 | 27.674 | 27.725 |
| 2p2d · 四机 | 100 | 300 | 27.980 | 27.964 | 28.073 | 28.153 | 28.221 |

表内 TPOT 单位均为 **ms/token**。两种部署均使用 1M 最大上下文、W8A8 权重、C8 KV、FP32 SSM 和相同的 MTP steps=4 / draft=5 / topk=1。

双机在当前配置下已验证最大实际并发为 16；20/30/40/50 均在提交请求前因 KV/状态池容量不足而被拒绝。四机表中的最高点是本轮实际测试到的并发，不能等同于硬件理论上限。


指标使用完整输出阶段的 **client TPOT**：`(最后一次新增 token 的 SSE 到达时刻 - 第一次新增 token 的 SSE 到达时刻) / 1023`，单位为 ms/token。它包含客户端可观测的流式传输影响，并与内部 verify ITL 区分；没有把一次 MTP 返回的多个 token 人工展开成多个到达时刻。

每个并发档位预先指定三轮资格验证和三轮独立性能波次。单并发另补五轮性能波次，共八个请求；其他档位为 `3×并发数` 个性能样本。分位数从全部有效请求样本直接计算，不平均各轮分位数。单并发的 p99 只作描述，不能据八个请求推断稳定尾时延。

P 复用同一个已预热前缀；D 的每个请求采用不同的 cache salt，并验证其独立完整 KV 占用，避免用前缀共享节省的容量冒充最大实际并发。正式计时前完成全部 KV 交付，再释放 D 请求池。资格波在共同解码区间用有限的 CPU 状态快照确认每个 DP 域的实际 running 数和零等待；陈旧快照不算当前证据。独立性能波在释放请求后到所有 HTTP 请求结束前不再调用观测 API。未启用 profiler 或额外的高频 NPU 采样。

发布回归验证：双机部署使用 GSM8K 固定前 64 题，正确 63 题（98.44%），无 HTTP、传输、解析或截断失败。该小样本用于检查集成回归，不等同于完整 GSM8K 测试集准确率。

这些是固定长度、预装载 KV 后的解码曲线，用于评价 D 的满载性能；它们不能单独代表冷启动 TTFT、P 的持续供给能力或真实 coding workload 的端到端吞吐。

## 复现并发曲线

镜像自带 Python 标准库测试程序和合成 131,072-token 输入，不需要下载数据集或另备测试文件。测试使用两个 CPU 核、最多 4 GiB 地址空间和 2 GiB 原始捕获预算，不使用客户端 NPU/GPU。测试会控制 D 准入，必须在没有其他推理流量的独占测试窗口运行。

在可访问 P/D 原生接口的机器执行下面代码。`BENCH_CPUS` 填该机器上两个可用 CPU 编号，`BENCH_RESULTS` 填空闲磁盘目录。每轮 tag 必须唯一，旧结果不会覆盖。

```bash
set -euo pipefail
export IMAGE="${IMAGE:-harbor.baai.ac.cn/flagrelease-public/glm-5.3-flash-w8a8-mtp-flagos-express:2026-10-28}"
export P0_IP='<P_PRIMARY_IP>'
export D0_IP='<D_PRIMARY_IP>'
export LAYOUT=1p1d   # 四机改为 2p2d
export BENCH_CPUS='<CPU_A>,<CPU_B>'
export BENCH_RESULTS='<WRITABLE_RESULTS_DIRECTORY>'
TAG="glm53-${LAYOUT}-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$BENCH_RESULTS"
if [ "$LAYOUT" = 1p1d ]; then
  P_DP=1; D_DP=2; TP=8; EP=8; NNODES=1; LOCAL_CAP=8
  PHYSICAL_GRAPHS=4,8
  TARGETS=(1 10 16)
else
  test "$LAYOUT" = 2p2d
  P_DP=2; D_DP=8; TP=16; EP=16; NNODES=2; LOCAL_CAP=14
  PHYSICAL_GRAPHS=2,4,8,14
  TARGETS=(1 10 20 30 40 50 60 80 100)
fi
docker run --rm --name "$TAG" --runtime runc --network host \
  --cpuset-cpus "$BENCH_CPUS" --cpus 2 --memory 4g --pids-limit 512 \
  --security-opt seccomp=unconfined --cap-drop ALL \
  -e MALLOC_ARENA_MAX=2 -e OMP_NUM_THREADS=1 -e OPENBLAS_NUM_THREADS=1 \
  -e MKL_NUM_THREADS=1 -e TORCH_DEVICE_BACKEND_AUTOLOAD=0 \
  -e CUDA_VISIBLE_DEVICES= -e ASCEND_RT_VISIBLE_DEVICES= \
  -v "$BENCH_RESULTS:/results" \
  "$IMAGE" bench sequence --tag "$TAG" --output-root /results \
  --prefill "http://$P0_IP:31266/generate" --decode "http://$D0_IP:32266/generate" \
  --bootstrap-host "$P0_IP" --bootstrap-port 18986 \
  --p-domains "$P_DP" --d-domains "$D_DP" --p-tp-size "$TP" --d-tp-size "$TP" \
  --ep-size "$EP" --p-nnodes "$NNODES" --d-nnodes "$NNODES" \
  --logical-cap-per-dp "$LOCAL_CAP" --physical-graph-batches "$PHYSICAL_GRAPHS" \
  --p-inflight 1 --concurrency "${TARGETS[@]}" --waves 3 --lifecycle-id "$TAG"
```

若要与本文单并发八个样本的口径一致，保持服务、配置和上述 shell 变量不变，继续执行五轮 C1 性能波次；它们使用刚才的资格证据，并与前面三轮合并，不能覆盖或挑选旧结果：

```bash
EXTRA_TAG="${TAG}-c1-extra5"
docker run --rm --name "$EXTRA_TAG" --runtime runc --network host \
  --cpuset-cpus "$BENCH_CPUS" --cpus 2 --memory 4g --pids-limit 512 \
  --security-opt seccomp=unconfined --cap-drop ALL \
  -e MALLOC_ARENA_MAX=2 -e OMP_NUM_THREADS=1 -e OPENBLAS_NUM_THREADS=1 \
  -e MKL_NUM_THREADS=1 -e TORCH_DEVICE_BACKEND_AUTOLOAD=0 \
  -e CUDA_VISIBLE_DEVICES= -e ASCEND_RT_VISIBLE_DEVICES= \
  -v "$BENCH_RESULTS:/results" \
  "$IMAGE" bench perf --tag "$EXTRA_TAG" --output-root /results \
  --prefill "http://$P0_IP:31266/generate" --decode "http://$D0_IP:32266/generate" \
  --bootstrap-host "$P0_IP" --bootstrap-port 18986 \
  --p-domains "$P_DP" --d-domains "$D_DP" --p-tp-size "$TP" --d-tp-size "$TP" \
  --ep-size "$EP" --p-nnodes "$NNODES" --d-nnodes "$NNODES" \
  --logical-cap-per-dp "$LOCAL_CAP" --physical-graph-batches "$PHYSICAL_GRAPHS" \
  --p-inflight 1 --concurrency 1 --waves 5 --lifecycle-id "$TAG" \
  --probe-proof "/results/$TAG/probe/probe-proof.json" \
  --qualification-root "/results/$TAG/qualifications"
export TAG EXTRA_TAG BENCH_RESULTS
python3 - <<'PYSUMMARY'
import json, os, pathlib
root = pathlib.Path(os.environ['BENCH_RESULTS'])
values = []
for tag, expected in [(os.environ['TAG'], 3), (os.environ['EXTRA_TAG'], 5)]:
    paths = sorted((root / tag).glob('perf-C1-w*/summary.json'))
    assert len(paths) == expected
    for path in paths:
        summary = json.loads(path.read_text())
        assert summary['valid']
        rows = json.loads((path.parent / 'results.json').read_text())
        assert len(rows) == 1 and rows[0]['canary_pass'] and not rows[0]['validation_errors']
        values.append(rows[0]['client_tpot_ms'])
values.sort()
result = dict(n=len(values), mean=sum(values)/len(values))
for q in [50,75,90,99]:
    pos=(len(values)-1)*q/100; i=int(pos)
    result['p'+str(q)]=values[i]+(values[min(i+1,len(values)-1)]-values[i])*(pos-i)
print('C1 full client TPOT(ms):', json.dumps(result))
PYSUMMARY
```

结果中的 `curve.json` / `curve.csv` 的 `performance_full_client_tpot_ms` 为正式全程 client TPOT；资格验证的共同区间 TPOT 单独保留。原始请求、SSE、容量、语义 canary 和每轮验证证据都保存在结果目录。扩展并发目标时，工具会先检查每个 DP 的 KV/状态池容量；容量不足的档位记为拒绝，不会排队后作为“实际并发”上报。

启动命令按 `1,2,4,8,...,最大本地 batch` 指定 graph。SGLang 的参数名保留 `cuda-graph-*`，在此镜像中实际捕获 Ascend NPU graph；最终物理 batch 还会按 attention TP 对齐，不能用 padding 数量替代真实请求数。


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
The model weights are derived from ZhipuAI/GLM-5.3-Flash-BF16 and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

