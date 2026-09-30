# ARM CPU + empty vllm0.24.0+vllm-plugin-FL

本文说明如何在 ARM64 CPU 上从源码安装 vLLM 0.24.0、vllm-plugin-FL、FlagGems 和 flagtree-cpu，并使用 MiniCPM-2B 完成一次轻量文本推理验证。

vllm-plugin-FL 负责 vLLM 插件注册、ARM CPU platform 选择、packed checkpoint 接入以及 Qwen GDN 的 CPU 兼容处理；FlagGems 提供 W4A8-G128 权重打包和 Triton kernel；flagtree-cpu 将 Triton 程序编译到 ARM CPU。

MiniCPM-2B 使用 BF16 权重，不经过本 PR 新增的 packed W4A8 或 Qwen GDN 路径。因此，小模型用于验证安装、插件注册、CPU platform 和基础生成；W4A8 接口及 kernel 正确性由后文的专项测试验证。

## 环境配置

### 运行前检查

先确认主机架构为 `arm64` 或 `aarch64`：

```bash
uname -m
```

MiniCPM-2B 模型包含两个 safetensors 权重分片，下载量约 4 GB。运行时还需要额外内存加载权重并创建 KV cache；如果资源不足，应缩短本文的最大上下文长度，不要把模型加载失败解释为插件注册失败。

### macOS

macOS 需要 Apple Silicon、Xcode Command Line Tools、Homebrew 和 Python 3.11：

```bash
xcode-select --install
brew install python@3.11 cmake ninja libomp uv git

xcode-select -p
clang --version
brew --prefix libomp
```

如果 Command Line Tools 已安装，`xcode-select --install` 会提示无需重复安装。

### Linux ARM64

以下依赖命令适用于 Debian/Ubuntu。vLLM 0.24.0 的 ARM CPU 源码构建要求 NEON，并建议使用 GCC/G++ 12.3 或更高版本。

```bash
sudo apt-get update
sudo apt-get install -y --no-install-recommends \
  build-essential ccache cmake ninja-build git curl wget ca-certificates \
  gcc-12 g++-12 libtcmalloc-minimal4 libnuma-dev python3.11-dev \
  python3.11-venv ffmpeg libsm6 libxext6 libgl1 jq lsof

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 10 \
  --slave /usr/bin/g++ g++ /usr/bin/g++-12

uname -m
gcc --version
```

Linux 使用 vLLM CPU wheel 时通常还需要预加载 TCMalloc。本文后续采用源码构建；如果部署环境启用了 TCMalloc，应使用系统实际路径，不要把其他机器的绝对路径复制过来。与参考 GPU 接入文档不同，本文不提供 Docker 路径：vLLM 0.24.0 没有可直接用于本文的 macOS ARM64 CPU 镜像，现有 Linux ARM64 镜像也不包含这两个待合入 PR。当前可复现入口是下文的固定 commit 源码构建。

## 硬件环境

|项目|Mac |CIX P1 |
|---|---|---|
|芯片平台|Apple Silicon|CIX P1|
|CPU|Apple M5 Pro|CIX P1 ARM CPU|
|CPU 核数|18|12|
|内存|64 GiB|32G|
|操作系统|macOS 26.5.1|Debian 13|
|架构|arm64|aarch64|
|验证范围|W4A8 单测、插件单测、MiniCPM-2B 权重加载与 HTTP 短生成|W4A8 实际执行、构建与动态链接、插件注册和 CPU platform|

## 软件环境

|组件|版本或 commit|
|---|---|
|Python|3.11.16|
|PyTorch|2.11.0|
|vLLM|`v0.24.0` / `ee0da84ab9e04ac7610e28580af62c365e898389`|
|transformers|5.15.1|
|compressed-tensors|0.17.0|
|flagtree-cpu|<https://github.com/flagos-ai/flagtree-cpu/tree/triton_v3.7.x>|
|FlagGems|`1fda4b11ae528c02ae5187cda551af4a61a514c5`|
|vllm-plugin-FL|`58a690b2ac03af5fb26c1dc37533212ed8ef6976`|

相关评审链接：

- FlagGems：<https://github.com/flagos-ai/FlagGems/pull/5904> 已经合入

- vllm-plugin-FL：<https://github.com/flagos-ai/vllm-plugin-FL/pull/433>

当前插件加载依赖 FlagGems；其中 Qwen packed W4A8 adapter 会直接调用 FlagGems 的 `pack_rhs_qsi4c128p()` 和 `w4a8_g128_linear()`。因此，本文路径必须先安装包含 `724a6276` 的 FlagGems 版本，再安装 vllm-plugin-FL。

## 安装流程

以下命令使用一个全新的工作目录，避免加载系统中已有的 vLLM、Triton、FlagGems 或插件。

### 1. 创建 Python 环境

```bash
export WORK_DIR="$PWD/arm64-vllm024"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# macOS
uv venv --python "$(brew --prefix python@3.11)/bin/python3.11" .venv

# Linux ARM64 使用下面一行替代上一行
# uv venv --python python3.11 .venv

source "$WORK_DIR/.venv/bin/activate"
python -VV
python -c 'import platform; print(platform.machine())'
```

预期 Python 为 3.11，架构为 `arm64` 或 `aarch64`。

### 2. 下载并固定源码版本

```bash
cd "$WORK_DIR"

git clone --branch v0.24.0 --depth 1 \
  https://github.com/vllm-project/vllm.git
git -C vllm checkout ee0da84ab9e04ac7610e28580af62c365e898389

git clone --branch triton_v3.7.x --depth 1 \
  https://github.com/flagos-ai/flagtree-cpu.git
git -C flagtree-cpu checkout 77433cf0534d0cddf8717da654628f3f9e48cea9

git clone --branch arm64-cpu-upstream --depth 1 \
  https://github.com/kevinzs2048/FlagGems.git
git -C FlagGems checkout 1fda4b11ae528c02ae5187cda551af4a61a514c5

git clone --branch arm64-cpu-upstream --depth 1 \
  https://github.com/kevinzs2048/vllm-plugin-FL.git
git -C vllm-plugin-FL checkout 58a690b2ac03af5fb26c1dc37533212ed8ef6976
```

逐项确认实际 checkout：

```bash
git -C vllm rev-parse HEAD
git -C flagtree-cpu rev-parse HEAD
git -C FlagGems rev-parse HEAD
git -C vllm-plugin-FL rev-parse HEAD
```

四行输出应分别等于上面固定的四个完整 commit ID。PR 合入后，社区可以改用官方仓库的合入 commit；在此之前，不应把浮动的 `master` 或 `main` 当作本文验证版本。

### 3. 安装 Python 依赖

建立约束文件：

```bash
cat > "$WORK_DIR/constraints.txt" <<'EOF'
torch==2.11.0
torchaudio==2.11.0
torchvision==0.26.0
transformers==5.15.1
tokenizers==0.22.2
compressed-tensors==0.17.0
numpy==2.3.5
numba==0.65.0
llvmlite==0.47.0
safetensors==0.8.0
sqlalchemy==2.0.48
EOF
```

安装 vLLM CPU 依赖和构建工具：

```bash
cd "$WORK_DIR"

uv pip install \
  -r vllm/requirements/cpu.txt \
  --constraint constraints.txt \
  --index-strategy unsafe-best-match

uv pip install \
  'cmake==4.4.2' 'ninja==1.13.0' 'pybind11==3.0.3' \
  'setuptools==77.0.3' 'setuptools-scm==9.2.0' \
  'setuptools-rust==1.13.0' 'scikit-build-core==0.12.2' \
  'sqlalchemy==2.0.48' pytest openai \
  --constraint constraints.txt
```

### 4. 构建 flagtree-cpu / Triton 3.7.2

```bash
cd "$WORK_DIR"

if [ "$(uname -s)" = "Darwin" ]; then
  export BUILD_JOBS="$(sysctl -n hw.ncpu)"
  export TRITON_LOCAL_LIBOMP_PATH="$(brew --prefix libomp)"
else
  export BUILD_JOBS="$(nproc)"
fi

TRITON_HOME="$WORK_DIR/.triton-build" \
TRITON_BUILD_PROTON=OFF \
MAX_JOBS="$BUILD_JOBS" \
uv pip install --no-build-isolation \
  --constraint constraints.txt \
  --editable "$WORK_DIR/flagtree-cpu"
```

验证当前 Python 加载的是刚安装的 flagtree-cpu：

```bash
python - <<'PY'
from pathlib import Path
import triton

print("Triton version:", triton.__version__)
print("Triton path:", Path(triton.__file__).resolve())
assert triton.__version__ == "3.7.2"
assert "flagtree-cpu" in str(Path(triton.__file__).resolve())
PY
```

### 5. 构建 vLLM 0.24.0 CPU

```bash
cd "$WORK_DIR"

VLLM_TARGET_DEVICE=cpu \
VLLM_VERSION_OVERRIDE=0.24.0+cpu \
MAX_JOBS="$BUILD_JOBS" \
uv pip install --no-build-isolation \
  --constraint constraints.txt \
  --editable "$WORK_DIR/vllm"
```

验证版本与构建类型：

```bash
python - <<'PY'
import vllm

print(vllm.__version__)
print(vllm.__file__)
assert vllm.__version__ == "0.24.0+cpu"
PY
```

### 6. 安装 FlagGems 和 vllm-plugin-FL

ARM CPU 接入是 Python 路径，不需要设置 `VLLM_VENDOR=arm`。如果当前 shell 继承过其他硬件后端的配置，应先清除它。

```bash
cd "$WORK_DIR"
unset VLLM_VENDOR

FLAGGEMS_VENDOR=arm uv pip install --no-build-isolation \
  --constraint constraints.txt \
  --editable "$WORK_DIR/FlagGems"

uv pip install --no-build-isolation \
  --constraint constraints.txt \
  --editable "$WORK_DIR/vllm-plugin-FL"
```

### 7. 验证插件和 CPU platform

`VLLM_PLUGINS` 是 vLLM 官方提供的插件过滤变量。`VLLM_PLUGINS=fl` 表示只加载名为 `fl` 的已安装插件；它不负责识别 ARM，也不能替代 `FLAGGEMS_VENDOR=arm`。

`FLAGGEMS_VENDOR=arm` 必须在当前进程第一次导入 `flag_gems`、`vllm_fl` 或 `vllm` 之前设置：

```bash
export FLAGGEMS_VENDOR=arm
export VLLM_PLUGINS=fl

python - <<'PY'
from pathlib import Path
import platform
import flag_gems
import vllm
import vllm_fl
from vllm.platforms import current_platform

print("machine:", platform.machine())
print("platform:", type(current_platform).__module__ + "." +
      type(current_platform).__name__)
print("device_type:", current_platform.device_type)
print("FlagGems vendor:", flag_gems.vendor_name)
print("vLLM:", Path(vllm.__file__).resolve())
print("vllm-plugin-FL:", Path(vllm_fl.__file__).resolve())
print("FlagGems:", Path(flag_gems.__file__).resolve())

assert platform.machine().lower() in {"arm64", "aarch64"}
assert current_platform.device_type == "cpu"
assert flag_gems.vendor_name == "arm"
PY
```

预期关键结果为：

```text
machine: arm64 或 aarch64
platform: vllm.platforms.cpu.CpuPlatform
device_type: cpu
FlagGems vendor: arm
```

三个模块路径都应指向当前 `WORK_DIR` 下的源码目录。如果路径指向另一个虚拟环境或旧 checkout，应先解决环境污染，再继续测试。

## 模型准备

本文使用 ModelScope 上的 MiniCPM-2B。下载命令使用 ModelScope 1.39.1 CLI：

```bash
export MODEL_DIR="$WORK_DIR/models/Qwen3-1.7B"
mkdir -p "$MODEL_DIR"

uv tool run --from 'modelscope==1.39.1' modelscope download \
  Qwen/Qwen3-1.7B \
  --revision master \
  --local-dir "$MODEL_DIR"
```

下载完成后确认模型配置及 index 引用的权重分片完整：

```bash
cd "$MODEL_DIR"
python - <<'PY'
import json
from pathlib import Path

root = Path.cwd()
config = json.loads((root / "config.json").read_text())
index = json.loads((root / "model.safetensors.index.json").read_text())
files = sorted(set(index["weight_map"].values()))
missing = [
    name for name in files
    if not (root / name).is_file() or (root / name).stat().st_size == 0
]

print("architecture:", config["architectures"])
print("dtype:", config["torch_dtype"])
print("weight files:", len(files))
print("missing files:", missing)

assert config["model_type"] == "qwen3"
assert config["architectures"] == ["Qwen3ForCausalLM"]
assert config["torch_dtype"] == "bfloat16"
assert "quantization_config" not in config
assert not missing
PY
```

## 测试执行流程

建议按以下顺序测试。前两步用于确认 kernel 和插件接口，不能只用一次模型生成替代。

### 1. 执行 FlagGems W4A8 数值测试

```bash
cd "$WORK_DIR/FlagGems"
FLAGGEMS_VENDOR=arm python -m pytest -ra tests/test_arm_w4a8_g128.py
```

本文对应 commit 在 Mac M5 Pro 上的结果为 `7 passed`、`0 skipped`。测试会执行 Triton W4A8-G128 kernel，并与 PyTorch 参考实现比较；如果全部 skip，不能算通过。

### 2. 执行 vllm-plugin-FL ARM 接口测试

```bash
cd "$WORK_DIR/vllm-plugin-FL"
FLAGGEMS_VENDOR=arm VLLM_PLUGINS=fl python -m pytest -ra \
  tests/unit_tests/test_arm_cpu_registration.py \
  tests/unit_tests/patches/test_arm_cpu_gdn.py \
  tests/unit_tests/quantization/test_arm_cpu_w4a8.py
```

本文对应 commit 在 Mac M5 Pro 上的结果为 `16 passed`、`0 skipped`。其中包括 ARM CPU platform 注册、ARM 主机上 GPU backend 隔离、GDN patch 幂等性以及 packed W4A8 参数契约。

### 3. 启动文本服务

在终端 A 执行：

```bash
# 将下面路径替换为第 1 步创建的实际目录。
cd /path/to/arm64-vllm024
export WORK_DIR="$PWD"
export MODEL_DIR="$WORK_DIR/models/Qwen3-1.7B"
source "$WORK_DIR/.venv/bin/activate"

export FLAGGEMS_VENDOR=arm
export VLLM_PLUGINS=fl
export OMP_NUM_THREADS=10
export MKL_NUM_THREADS=10
export VLLM_CPU_KVCACHE_SPACE=1

# 仅 macOS 需要这一行
export TRITON_LOCAL_LIBOMP_PATH="$(brew --prefix libomp)"

vllm serve "$MODEL_DIR" \
  --host 127.0.0.1 \
  --port 8000 \
  --served-model-name qwen3-1.7b \
  --dtype bfloat16 \
  --enforce-eager \
  --max-model-len 512 \
  --max-num-seqs 1 \
  --max-num-batched-tokens 512 \
  --generation-config vllm \
  --distributed-executor-backend uni \
  --disable-log-stats
```

上述参数用于最小功能验证，不是通用性能配置。`VLLM_CPU_KVCACHE_SPACE=1` 将 CPU KV cache 固定为 1 GiB，避免按整机内存比例为一次短请求预留过大空间。

服务日志至少应出现：

```text
Platform plugin fl is activated
device_config=cpu
Resolved architecture: Qwen3ForCausalLM
Application startup complete
```

这些日志用于确认插件已经加载且 vLLM 选择了 CPU platform。Qwen3-1.7B 不会触发 packed W4A8 adapter；必须结合前两步的专项测试判断 W4A8 kernel 和插件接口是否正常。

### 4. 执行文本请求

在终端 B 先检查健康状态和模型名：

```bash
curl -fsS http://127.0.0.1:8000/health
curl -fsS http://127.0.0.1:8000/v1/models
```

然后运行客户端脚本（文本请求的客户端示例见[运行推理任务](run-inference-task.md)）：

```bash
# 在新的终端中重新进入实际工作目录。
cd /path/to/arm64-vllm024
export WORK_DIR="$PWD"
source "$WORK_DIR/.venv/bin/activate"
python client_text.py
```

成功标准：HTTP 请求返回 200，客户端得到非空文本，服务端没有模型加载、ABI、undefined symbol 或动态库错误。

### 5. 停止服务

返回终端 A，按 `Ctrl-C`，等待 API server、EngineCore 和 worker 退出。

## 测试命令

### eager 模式（已验证）

本文“测试执行流程”中的 `vllm serve` 命令即为当前验证命令。2026-09-04 的 Mac 复验使用 vLLM 源码 commit `ee0da84a`、FlagGems `1fda4b11`、vllm-plugin-FL `58a690b`、Qwen3-1.7B BF16、Batch=1 和 `--enforce-eager`。服务加载 2 个 safetensors 分片，日志确认 CPU KV cache 固定为 1 GiB；`/health`、`/v1/models` 和流式 `/v1/chat/completions` 请求均返回 HTTP 200，客户端收到 16 个非空文本 token。

## ARM 主机同时安装 GPU 或 NPU 时的行为

CPU 架构是 ARM64，不代表 vLLM 一定选择 CPU backend。插件只在下列两个条件同时成立时注册 vLLM CPU platform，并安装 GDN 兼容处理：

1. `platform.machine()` 为 `arm64` 或 `aarch64`；

2. vLLM 选择的 platform 是 CPU。

packed W4A8 adapter 还会额外检查 FlagGems 的 `vendor_name` 是否为 `arm`；不满足时不会改写 vLLM 的 W4A8 kernel 路径。插件测试覆盖了“ARM64 主机使用 GPU build”场景：此时保留已有 GPU platform 注册，不导入 ARM CPU hook。因此，在 ARM+GPU/NPU 服务中不要全局设置 `FLAGGEMS_VENDOR=arm`；应为 CPU 服务单独设置环境变量，并通过前面的 platform 检查确认 `device_type`。

## 常见问题

### 插件没有加载

检查 entry point：

```bash
python - <<'PY'
from importlib.metadata import entry_points

for group in ("vllm.platform_plugins", "vllm.general_plugins"):
    print(group, [(ep.name, ep.value) for ep in entry_points(group=group)])
PY
```

两个 group 中都应出现名为 `fl` 的 entry point。若环境中安装了多个 vLLM 插件，设置 `VLLM_PLUGINS=fl` 后启动一个新进程。

### FlagGems 导入失败

当前插件的公共工具模块会导入 FlagGems。缺少 FlagGems 时，`fl` entry point 无法完整加载，本文的 W4A8 checkpoint 也无法运行。检查实际路径：

```bash
FLAGGEMS_VENDOR=arm python - <<'PY'
import flag_gems
print(flag_gems.__file__)
print(flag_gems.vendor_name)
PY
```

### 平台不是 CpuPlatform

Linux 上确认安装的是 vLLM CPU build；ARM+GPU/NPU 主机还应确认没有选择其他 device plugin。不要伪造 `platform.machine()` 或强制 monkey-patch `current_platform` 绕过检查。

### macOS 找不到 OpenMP

```bash
export TRITON_LOCAL_LIBOMP_PATH="$(brew --prefix libomp)"
test -f "$TRITON_LOCAL_LIBOMP_PATH/include/omp.h"
test -f "$TRITON_LOCAL_LIBOMP_PATH/lib/libomp.dylib"
```

### 首次请求长时间没有返回

先检查 worker 是否仍在运行和占用 CPU；首次 Triton/LLVM JIT 可能耗时数分钟。如果服务端已经输出异常，应以异常为准，不能将 ABI 不匹配、缺少动态库、undefined symbol 或架构错误解释为“仍在编译”。

### 内存不足

本文用 `VLLM_CPU_KVCACHE_SPACE=1` 为 512-token、Batch=1 smoke test 分配固定的 1 GiB KV cache。如果修改上下文长度或并发数，应根据启动日志重新调整；如果模型权重本身无法完整加载，增加 KV cache 不会解决问题。
