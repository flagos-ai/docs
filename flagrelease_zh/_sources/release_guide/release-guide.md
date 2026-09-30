# FlagRelease 发布指南

## 什么是 FlagRelease

FlagRelease 是一套自动化模型评测与发布流水线，可在 NVIDIA、昇腾、沐曦、海光等 GPU 平台上完成：

* 模型环境验证

* 精度评测

* 性能评测

* 自动发布

适用于模型适配完成后的验证与发布流程。

---

# 环境准备

## 操作系统要求

* **操作系统**：Ubuntu 20.04+ 或 CentOS 7+（Linux 环境）

* **GPU 驱动**：已安装目标厂商的 GPU 驱动

* **网络**：可访问 Docker Hub、ModelScope、HuggingFace、GitHub

* **Docker 环境**：确保 Docker 已安装并正在运行

* **模型建议**：opus4.6

## 安装 Node.js

```bash
sudo apt remove libnode-dev nodejs
apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

---

## 安装 Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

---

## 配置 Claude Code

编辑：

```bash
~/.claude/settings.json
```

填写：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "<URL>",
    "ANTHROPIC_AUTH_TOKEN": "<TOKEN>",
    "ANTHROPIC_MODEL": "<MODEL>"
  }
}
```

---

# 获取代码

```bash
git clone https://github.com/Lxiparer/FlagRelease.git
cd FlagRelease
```

---

# 运行流水线

## 命令格式

```bash
bash prompts/run_pipeline.sh \
    <IMAGE> \
    <MODEL_NAME> \
    <MODELSCOPE_TOKEN> \
    <HF_TOKEN> \
    <GITHUB_TOKEN> \
    <HARBOR_USER> \
    <HARBOR_PASSWORD> \
    [--model-path PATH] \
    [--flagrelease-token TOKEN]
```

---

## 需要修改的参数

通常只需要关注以下三项：

### 镜像

根据硬件选择对应镜像。

| 平台 | 镜像 |
| --- | --- |
| NVIDIA(vLLM 0.20.2) | `harbor.baai.ac.cn/flagrelease-public/nv_vllm-0.20.2_gems_tree:202605131138` |
| 昇腾（vLLM 0.13.0） | `harbor.baai.ac.cn/flagrelease-public/hw_gems_5.0.2_tree_0.5.0-ascend3.2:2605131051` |
| 沐曦（vLLM 0.13.0） | `harbor.baai.ac.cn/flagrelease-public/metax_gems_tree:2605061746` |
| 海光（vLLM 0.13.0） | `harbor.baai.ac.cn/flagrelease-public/hy_gems_tree:2605111710` |
| 天数（vLLM 0.13.0） | `harbor.baai.ac.cn/flagrelease-public/tianshu_gems_5.0.2_0.5.1-iluvatar3.1_vllm_fl_0.0.0:2605201817` |
| 摩尔（vLLM 0.13.0） | `harbor.baai.ac.cn/flagrelease-public/mthreads_gt_gems_5.0.1rc0_tree_0.5.0-mthreads3.1:2605151801` |

---

### 模型名称

需与 HuggingFace 或 ModelScope 保持一致。

例如：

```bash
Qwen/Qwen2-7B-Instruct
HY/Hy-MT2-7B
meta-llama/Llama-3.1-8B
```

---

### 模型路径（可选）

如果本地已有模型：

```bash
--model-path /mnt/workspace/models/Qwen/Qwen2-7B-Instruct
```

未指定时会自动搜索或下载。

---

# 运行示例

```bash
bash prompts/run_pipeline.sh \
    harbor.baai.ac.cn/flagrelease-public/nv_gems_tree:04081426 \
    Qwen/Qwen2-7B-Instruct \
    <MODELSCOPE_TOKEN> \
    <HF_TOKEN> \
    <GITHUB_TOKEN> \
    <HARBOR_USER> \
    <HARBOR_PASSWORD> \
    <--model-path /mnt/workspace/models/Qwen/Qwen2-7B-Instruct>
```

---

## 后台运行

推荐使用：

```bash
nohup bash prompts/run_pipeline.sh ... \
    > pipeline.log 2>&1 &
```

查看日志：

```bash
tail -f pipeline.log
```

查看进程：

```bash
ps -ef | grep run_pipeline
```

---

# 评测结果

流水线完成后，结果保存在：

```bash
/data/flagos-workspace/<MODEL_NAME>/
```

目录结构：

```bash
results/    评测结果
traces/     推理轨迹
logs/       日志
config/     配置备份
```

---

# 常见问题

## Docker 无法连接

```bash
Cannot connect to the Docker daemon
```

启动 Docker：

```bash
sudo systemctl start docker
```

---

## 模型下载失败

检查：

* 模型名称是否正确

* 网络是否可访问 ModelScope/HuggingFace

* `--model-path` 是否填写正确

---

## Claude Code 鉴权失败

检查：

```bash
~/.claude/settings.json
```

中的：

```bash
ANTHROPIC_BASE_URL
ANTHROPIC_AUTH_TOKEN
ANTHROPIC_MODEL
```

配置是否正确。

---

## 查看详细日志

```bash
tail -f pipeline.log
```

或：

```bash
tail -f /data/flagos-workspace/<MODEL_NAME>/logs/pipeline.log
```

---

# 支持平台

| 平台 | 状态 |
| --- | --- |
| NVIDIA | ✅ |
| 昇腾 | ✅ |
| 沐曦 | ✅ |
| 海光 | ✅ |
| 天数智芯 | 开发中 |
| 昆仑芯 | 开发中 |
| 摩尔线程 | 开发中 |
