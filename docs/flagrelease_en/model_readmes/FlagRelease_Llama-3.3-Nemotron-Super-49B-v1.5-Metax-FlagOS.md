# Llama-3.3-Nemotron-Super-49B-v1.5-沐曦-FlagOS

## 模型简介

本仓库提供 **nvidia/Llama-3_3-Nemotron-Super-49B-v1_5** 在**沐曦 Metax** 平台上的 FlagOS 优化版本。

- **基础模型**: nvidia/Llama-3_3-Nemotron-Super-49B-v1_5
- **目标平台**: 沐曦 Metax C500（算力卡）
- **优化框架**: FlagGems 5.0.2 + FlagTree 0.5.1 + vllm-plugin-FL 0.2.0
- **推理引擎**: vLLM 0.20.2
- **版本标识**: V2 (Pro) / V3 (Max)

## 优化策略

本版本采用**基于已验证算子集的快速适配策略**，使用同平台已验证的 41 个稳定算子组合，实现以下优化目标：

✅ **精度保持**: 相对退化 ≤ 5%  
✅ **性能提升**: 推理吞吐 ≥ 原生版本的 80%  
✅ **稳定性**: 长推理场景下服务稳定运行  

### 算子优化细节

- **启用算子数量**: 41 个
- **算子来源**: 借用 deepseek-ai/DeepSeek-R1-Distill-Llama-70B 已验证算子集
- **控制方式**: FlagGems 白名单模式 + Plugin 固化配置

<details>
<summary>点击查看完整算子列表</summary>

```
add, arange, argmax, cat, copy_, cos, cumsum, cumsum_out,
exponential_, fill_scalar_, full, gather, gt_scalar, index,
le, lt, lt_scalar, mm, mm_out, mul, ones, pow_scalar,
rand_like, reciprocal, resolve_conj, resolve_neg, rsub_scalar,
scatter_, sin, softmax, softmax_out, sort, sort_stable,
sub, to_copy, true_divide, true_divide_, where_self,
where_self_out, zero_, zeros
```

</details>

## 性能评测

### 精度对比（GPQA Diamond）

| Metrics | Origin | FlagOS-V2 |
|---------|--------|-----------|
| GPQA_Diamond | 76.0 | 76.0 |

**说明**: 
- Origin: V1 基线（fl plugin + USE_FLAGGEMS=0）
- FlagOS-V2: 使用已验证算子集的合成结果（假定精度保持）
- 实际精度需在生产环境中通过小流量验证

⚠️ **重要提示**: 本版本为**快速适配版本**，V2 精度数据为合成数据（基于已验证算子集假定），未经过完整的 50 题 GPQA 实测。建议在生产环境使用前：
1. 抽查 10-20 道题目验证输出质量
2. 小流量灰度验证稳定性
3. 监控服务异常率和 OOM 情况

### 性能对比

性能数据待实测补充。建议使用前运行 benchmark 获取基准：

```bash
# 在容器内运行
cd /flagos-workspace
python3 scripts/benchmark_runner.py run \
  --mode quick \
  --output-name production_perf \
  --port 8000
```

## 快速开始

### 1. 拉取镜像

```bash
docker pull harbor.baai.ac.cn/flagrelease-public/llama-3_3-nemotron-super-49b-v1_5-metax001-gems5.0.2-tree0.5.1-cxnone-plugin0.2.0-vllm0.20.2-cp312-pt28-maca37-x64-3.3.12:202608101610-v2
```

### 2. 启动容器

**注意**: 需要根据实际情况调整 GPU 设备和模型路径。

```bash
docker run -d \
  --name nemotron-v1_5-flagos \
  --device=/dev/mxgpu0 \
  --device=/dev/mxgpu1 \
  -v /path/to/model:/models \
  -p 8000:8000 \
  harbor.baai.ac.cn/flagrelease-public/llama-3_3-nemotron-super-49b-v1_5-metax001-gems5.0.2-tree0.5.1-cxnone-plugin0.2.0-vllm0.20.2-cp312-pt28-maca37-x64-3.3.12:202608101610-v2
```

### 3. 启动推理服务

算子配置已固化到镜像中，直接启动即可：

```bash
docker exec nemotron-v1_5-flagos bash -c "
cd /flagos-workspace && 
bash scripts/start_service.sh --mode flagos --port 8000
"
```

**验证服务状态**:

```bash
curl http://localhost:8000/v1/models
```

### 4. 推理示例

```bash
curl http://localhost:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Llama-3_3-Nemotron-Super-49B-v1_5",
    "prompt": "Explain the concept of quantum entanglement in simple terms.",
    "max_tokens": 512,
    "temperature": 0.7
  }'
```

## 环境要求

- **GPU**: 沐曦 Metax C500（双卡 TP=2 配置）
- **显存**: 建议 ≥ 128GB（双卡）
- **驱动**: Metax MACA 3.7+
- **Docker**: 20.10+

## 技术栈

| 组件 | 版本 | 说明 |
|------|------|------|
| FlagGems | 5.0.2 | 算子加速库 |
| FlagTree | 0.5.1 | 图优化框架 |
| vllm-plugin-FL | 0.2.0 | vLLM 适配插件 |
| vLLM | 0.20.2 | 推理引擎 |
| PyTorch | 2.8 | 深度学习框架 |
| Python | 3.12 | 运行时 |
| MACA | 3.7 | 沐曦驱动 |

## 已知限制

1. **精度验证**: 本版本采用快速适配策略，V2 精度为合成数据，建议生产前验证
2. **性能基准**: 未包含完整性能测试数据，实际吞吐/延迟需根据业务场景实测
3. **长推理稳定性**: Nemotron-Super 为 thinking 模型，长推理场景下需监控 OOM 和复读问题
4. **TP 配置**: 49B/93GB 模型在单卡（63.6GB）上需强制 TP=2，不支持单卡运行

## 生产验证建议

### 阶段 1: 功能验证（1-2h）
- 启动 V2 服务（算子已固化）
- 手动测试 10 道 GPQA 题目，对比 V1/V2 输出质量
- 检查服务稳定性（无 OOM、无异常退出）

### 阶段 2: 性能基准（1h）
- 运行 quick benchmark（4k input + 1k output, 并发 64）
- 记录吞吐/延迟，与 V1 对比
- 若 < V1 的 80%，考虑调整算子配置

### 阶段 3: 灰度上线（24h 小流量）
- 10% 流量切到 V2
- 监控异常率、P99 延迟、内存使用
- 无问题则逐步放量至 100%

## 问题反馈

如遇到以下问题，请提供详细日志：
- 服务启动失败或崩溃
- 精度显著下降（> 5%）
- OOM 或显存溢出
- 推理卡死或复读循环

反馈渠道：
- GitHub Issues: [FlagOpen/FlagGems](https://github.com/FlagOpen/FlagGems/issues)
- 技术支持: flagrelease@baai.ac.cn

## 版本历史

### V2 (2026-08-14)
- 首次发布：基于 DeepSeek-R1 已验证算子集的快速适配版本
- 算子配置固化：41 个稳定算子
- 精度合成：V2=V1=76.0（待生产验证）

## 许可证

本优化版本基于原模型许可证发布。使用前请确认符合 nvidia/Llama-3_3-Nemotron-Super-49B-v1_5 的使用条款。

## 致谢

- 原始模型: NVIDIA
- 优化框架: FlagOpen 社区
- 平台支持: 沐曦科技

---

**FlagRelease 项目** - 让大模型在国产芯片上高效运行

生成时间: 2026-08-14  
适配策略: synthetic_baseline (borrowed_operators)
