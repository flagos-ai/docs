# ARM CPU + empty vLLM 0.24.0 + vllm-plugin-FL

This document explains how to install vLLM 0.24.0, vllm-plugin-FL, FlagGems and flagtree-cpu from source on an ARM64 CPU, and how to complete a lightweight text inference validation with MiniCPM-2B.

vllm-plugin-FL handles vLLM plugin registration, ARM CPU platform selection, packed checkpoint integration and the CPU compatibility handling for Qwen GDN; FlagGems provides W4A8-G128 weight packing and the Triton kernel; flagtree-cpu compiles Triton programs to the ARM CPU.

MiniCPM-2B uses BF16 weights and does not go through the packed W4A8 or Qwen GDN paths added by this PR. The small model is therefore used to validate the installation, plugin registration, CPU platform and basic generation; W4A8 interface and kernel correctness are validated by the dedicated tests later in this document.

## Environment setup

### Pre-run checks

First confirm that the host architecture is `arm64` or `aarch64`:

```bash
uname -m
```

The MiniCPM-2B model contains two safetensors weight shards, about 4 GB of downloads. Loading the weights and creating the KV cache require additional memory at runtime; if resources are insufficient, shorten the maximum context length used in this document instead of interpreting a model loading failure as a plugin registration failure.

### macOS

macOS requires Apple Silicon, Xcode Command Line Tools, Homebrew and Python 3.11:

```bash
xcode-select --install
brew install python@3.11 cmake ninja libomp uv git

xcode-select -p
clang --version
brew --prefix libomp
```

If the Command Line Tools are already installed, `xcode-select --install` reports that no installation is needed.

### Linux ARM64

The dependency commands below apply to Debian/Ubuntu. Building vLLM 0.24.0 for ARM CPU requires NEON, and GCC/G++ 12.3 or later is recommended.

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

Using the vLLM CPU wheel on Linux usually also requires preloading TCMalloc. This document builds from source instead; if the deployment environment uses TCMalloc, use the actual system path rather than copying an absolute path from another machine. Unlike the reference GPU integration documents, this document provides no Docker path: there is no macOS ARM64 CPU image of vLLM 0.24.0 usable for this document, and the existing Linux ARM64 images do not contain the two PRs waiting to be merged. The reproducible entry point today is the fixed-commit source build below.

## Hardware environment

|Item|Mac |CIX P1 |
|---|---|---|
|Chip platform|Apple Silicon|CIX P1|
|CPU|Apple M5 Pro|CIX P1 ARM CPU|
|CPU cores|18|12|
|Memory|64 GiB|32G|
|Operating system|macOS 26.5.1|Debian 13|
|Architecture|arm64|aarch64|
|Validation scope|W4A8 unit tests, plugin unit tests, MiniCPM-2B weight loading and short HTTP generation|Actual W4A8 execution, build and dynamic linking, plugin registration and CPU platform|

## Software environment

|Component|Version or commit|
|---|---|
|Python|3.11.16|
|PyTorch|2.11.0|
|vLLM|`v0.24.0` / `ee0da84ab9e04ac7610e28580af62c365e898389`|
|transformers|5.15.1|
|compressed-tensors|0.17.0|
|flagtree-cpu|<https://github.com/flagos-ai/flagtree-cpu/tree/triton_v3.7.x>|
|FlagGems|`1fda4b11ae528c02ae5187cda551af4a61a514c5`|
|vllm-plugin-FL|`58a690b2ac03af5fb26c1dc37533212ed8ef6976`|

Related review links:

- FlagGems: <https://github.com/flagos-ai/FlagGems/pull/5904>, already merged

- vllm-plugin-FL: <https://github.com/flagos-ai/vllm-plugin-FL/pull/433>

Loading the plugin depends on FlagGems; the Qwen packed W4A8 adapter calls FlagGems' `pack_rhs_qsi4c128p()` and `w4a8_g128_linear()` directly. The path in this document therefore requires installing a FlagGems version that contains `724a6276` before installing vllm-plugin-FL.

## Installation procedure

The commands below use a fresh working directory, so that an existing vLLM, Triton, FlagGems or plugin installation is not loaded.

### 1. Create the Python environment

```bash
export WORK_DIR="$PWD/arm64-vllm024"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# macOS
uv venv --python "$(brew --prefix python@3.11)/bin/python3.11" .venv

# Linux ARM64: use the following line instead of the line above
# uv venv --python python3.11 .venv

source "$WORK_DIR/.venv/bin/activate"
python -VV
python -c 'import platform; print(platform.machine())'
```

The expected Python version is 3.11 and the architecture is `arm64` or `aarch64`.

### 2. Download and pin the source versions

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

Confirm each checkout:

```bash
git -C vllm rev-parse HEAD
git -C flagtree-cpu rev-parse HEAD
git -C FlagGems rev-parse HEAD
git -C vllm-plugin-FL rev-parse HEAD
```

The four lines must each equal the four full commit IDs pinned above. After the PRs are merged, the community can switch to the merged commit in the official repositories; until then, do not treat a moving `master` or `main` as the version validated by this document.

### 3. Install the Python dependencies

Create the constraints file:

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

Install the vLLM CPU dependencies and the build tools:

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

### 4. Build flagtree-cpu / Triton 3.7.2

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

Verify that the current Python loads the flagtree-cpu just installed:

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

### 5. Build vLLM 0.24.0 for CPU

```bash
cd "$WORK_DIR"

VLLM_TARGET_DEVICE=cpu \
VLLM_VERSION_OVERRIDE=0.24.0+cpu \
MAX_JOBS="$BUILD_JOBS" \
uv pip install --no-build-isolation \
  --constraint constraints.txt \
  --editable "$WORK_DIR/vllm"
```

Verify the version and the build type:

```bash
python - <<'PY'
import vllm

print(vllm.__version__)
print(vllm.__file__)
assert vllm.__version__ == "0.24.0+cpu"
PY
```

### 6. Install FlagGems and vllm-plugin-FL

The ARM CPU integration is a Python path and does not require `VLLM_VENDOR=arm`. If the current shell inherited configuration for another hardware backend, clear it first.

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

### 7. Verify the plugin and the CPU platform

`VLLM_PLUGINS` is the plugin filter variable provided by vLLM. `VLLM_PLUGINS=fl` loads only the installed plugin named `fl`; it does not detect ARM and cannot replace `FLAGGEMS_VENDOR=arm`.

`FLAGGEMS_VENDOR=arm` must be set before the current process first imports `flag_gems`, `vllm_fl` or `vllm`:

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

The expected key results are:

```text
machine: arm64 or aarch64
platform: vllm.platforms.cpu.CpuPlatform
device_type: cpu
FlagGems vendor: arm
```

All three module paths must point to the source directories under the current `WORK_DIR`. If a path points to another virtual environment or an old checkout, resolve the environment contamination before continuing the tests.

## Model preparation

This document uses MiniCPM-2B from ModelScope. The download command uses the ModelScope 1.39.1 CLI:

```bash
export MODEL_DIR="$WORK_DIR/models/Qwen3-1.7B"
mkdir -p "$MODEL_DIR"

uv tool run --from 'modelscope==1.39.1' modelscope download \
  Qwen/Qwen3-1.7B \
  --revision master \
  --local-dir "$MODEL_DIR"
```

After the download completes, check the model configuration and that every weight shard referenced by the index is complete:

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

## Test procedure

Run the tests in the following order. The first two steps confirm the kernel and the plugin interface and cannot be replaced by a single model generation.

### 1. Run the FlagGems W4A8 numerical tests

```bash
cd "$WORK_DIR/FlagGems"
FLAGGEMS_VENDOR=arm python -m pytest -ra tests/test_arm_w4a8_g128.py
```

For the commit used in this document the result on a Mac M5 Pro is `7 passed`, `0 skipped`. The tests execute the Triton W4A8-G128 kernel and compare it against the PyTorch reference implementation; if all tests are skipped, that does not count as passing.

### 2. Run the vllm-plugin-FL ARM interface tests

```bash
cd "$WORK_DIR/vllm-plugin-FL"
FLAGGEMS_VENDOR=arm VLLM_PLUGINS=fl python -m pytest -ra \
  tests/unit_tests/test_arm_cpu_registration.py \
  tests/unit_tests/patches/test_arm_cpu_gdn.py \
  tests/unit_tests/quantization/test_arm_cpu_w4a8.py
```

For the commit used in this document the result on a Mac M5 Pro is `16 passed`, `0 skipped`. This covers ARM CPU platform registration, GPU backend isolation on an ARM host, GDN patch idempotency and the packed W4A8 parameter contract.

### 3. Start the text service

In terminal A:

```bash
# Replace the path below with the actual directory created in step 1.
cd /path/to/arm64-vllm024
export WORK_DIR="$PWD"
export MODEL_DIR="$WORK_DIR/models/Qwen3-1.7B"
source "$WORK_DIR/.venv/bin/activate"

export FLAGGEMS_VENDOR=arm
export VLLM_PLUGINS=fl
export OMP_NUM_THREADS=10
export MKL_NUM_THREADS=10
export VLLM_CPU_KVCACHE_SPACE=1

# only required on macOS
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

The parameters above are for minimal functional validation, not a general performance configuration. `VLLM_CPU_KVCACHE_SPACE=1` pins the CPU KV cache to 1 GiB, so that a single short request does not reserve a large fraction of the machine memory.

The service log must show at least:

```text
Platform plugin fl is activated
device_config=cpu
Resolved architecture: Qwen3ForCausalLM
Application startup complete
```

These log lines confirm that the plugin is loaded and that vLLM selected the CPU platform. Qwen3-1.7B does not trigger the packed W4A8 adapter; whether the W4A8 kernel and the plugin interface work must be judged together with the dedicated tests in the first two steps.

### 4. Send a text request

In terminal B, first check the health status and the model name:

```bash
curl -fsS http://127.0.0.1:8000/health
curl -fsS http://127.0.0.1:8000/v1/models
```

Then run the client script (a text-request client example is in [Run an inference task](run-inference-task.md)):

```bash
# In a new terminal, re-enter the actual working directory.
cd /path/to/arm64-vllm024
export WORK_DIR="$PWD"
source "$WORK_DIR/.venv/bin/activate"
python client_text.py
```

Success criteria: the HTTP requests return 200, the client receives non-empty text, and the server reports no model loading, ABI, undefined symbol or shared library errors.

### 5. Stop the service

Go back to terminal A, press `Ctrl-C`, and wait for the API server, EngineCore and worker to exit.

## Test command

### eager mode (validated)

The `vllm serve` command in the "Test procedure" section above is the validated command. The Mac re-validation on 2026-09-04 used vLLM source commit `ee0da84a`, FlagGems `1fda4b11`, vllm-plugin-FL `58a690b`, Qwen3-1.7B BF16, batch size 1 and `--enforce-eager`. The service loads 2 safetensors shards and the log confirms that the CPU KV cache is pinned to 1 GiB; `/health`, `/v1/models` and streaming `/v1/chat/completions` requests all return HTTP 200, and the client receives 16 non-empty text tokens.

## Behavior when a GPU or NPU is also installed on the ARM host

An ARM64 CPU architecture does not mean that vLLM necessarily selects the CPU backend. The plugin registers the vLLM CPU platform and installs the GDN compatibility handling only when both of the following conditions hold:

1. `platform.machine()` is `arm64` or `aarch64`;

2. the platform selected by vLLM is CPU.

The packed W4A8 adapter additionally checks whether FlagGems' `vendor_name` is `arm`; when it is not, the vLLM W4A8 kernel path is not rewritten. The plugin tests cover the "ARM64 host using a GPU build" case: the existing GPU platform registration is kept and the ARM CPU hook is not imported. In an ARM+GPU/NPU service, therefore, do not set `FLAGGEMS_VENDOR=arm` globally; set the environment variable for the CPU service only, and confirm `device_type` through the platform check above.

## FAQ

### The plugin is not loaded

Check the entry points:

```bash
python - <<'PY'
from importlib.metadata import entry_points

for group in ("vllm.platform_plugins", "vllm.general_plugins"):
    print(group, [(ep.name, ep.value) for ep in entry_points(group=group)])
PY
```

An entry point named `fl` must appear in both groups. If several vLLM plugins are installed in the environment, set `VLLM_PLUGINS=fl` and start a new process.

### FlagGems import fails

The plugin's shared utility module imports FlagGems. Without FlagGems the `fl` entry point cannot load completely, and the W4A8 checkpoint used in this document cannot run either. Check the actual path:

```bash
FLAGGEMS_VENDOR=arm python - <<'PY'
import flag_gems
print(flag_gems.__file__)
print(flag_gems.vendor_name)
PY
```

### The platform is not CpuPlatform

On Linux, confirm that the installed vLLM is a CPU build; on an ARM+GPU/NPU host, also confirm that no other device plugin was selected. Do not fake `platform.machine()` or force a monkey-patch of `current_platform` to bypass the check.

### OpenMP is not found on macOS

```bash
export TRITON_LOCAL_LIBOMP_PATH="$(brew --prefix libomp)"
test -f "$TRITON_LOCAL_LIBOMP_PATH/include/omp.h"
test -f "$TRITON_LOCAL_LIBOMP_PATH/lib/libomp.dylib"
```

### The first request does not return for a long time

First check whether the worker is still running and consuming CPU; the first Triton/LLVM JIT can take several minutes. If the server has already printed an exception, take the exception as authoritative: an ABI mismatch, a missing shared library, an undefined symbol or an architecture error must not be interpreted as "still compiling".

### Out of memory

This document uses `VLLM_CPU_KVCACHE_SPACE=1` to allocate a fixed 1 GiB KV cache for the 512-token, batch-size-1 smoke test. If the context length or the concurrency is changed, adjust it again based on the startup log; if the model weights themselves cannot be loaded completely, increasing the KV cache will not help.
