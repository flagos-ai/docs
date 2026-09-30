[<a href="../../../flagtree_en/getting_started/install-arm64-cpu.html">英文版</a>|中文版]

# 在 Arm64 CPU 上安装

在 Arm64 CPU 上安装 FlagTree 之前，请阅读以下注意事项：

- Triton 版本 3.3，基于 LLVM **a66376b0**，aarch64 平台
- 目标平台：支持 NEON / SVE2 + i8mm 的 AArch64 Linux（例如 Armv9-A Cortex-A720）
- ⚠️ CPU 后端的 C++ 扩展层（TritonCPU 方言 + NEON/SVE2 C 运行时）位于单独的 [flagtree-cpu](https://github.com/flagos-ai/flagtree-cpu) 仓库中。辅助脚本 `python/scripts/link_flagtree_cpu.sh`（从 FlagTree 根目录运行）会将其克隆到 `third_party/triton-cpu/` 并创建构建所需的符号链接。TLE 操作由 `third_party/tle_arm64` 插件作为 `create_cpu_*` 构建器方法注入。
- 目前尚未提供 Docker 镜像；请按以下方式从源码安装。

## 1. 构建和运行环境

### 1.1 系统依赖

```shell
sudo apt-get update && sudo apt-get install -y \
    build-essential cmake ninja-build git ccache pkg-config \
    libomp-dev libjemalloc2 zlib1g zlib1g-dev libxml2 libxml2-dev nlohmann-json3-dev \
    ca-certificates curl wget numactl python3-dev python3-pip python3-venv
```

### 1.2 创建虚拟环境并安装 PyTorch

```shell
python3 -m venv ~/venv-flagtree
source ~/venv-flagtree/bin/activate
pip install --upgrade pip setuptools wheel
# 构建依赖 — 使用 --no-build-isolation（步骤 2.2 第 3 步）时，pyproject
# 构建要求不会自动安装，必须预先安装：
pip install pybind11
# 首先安装 PyTorch（aarch64 CPU 构建）
pip install torch==2.10.0+cpu --index-url https://download.pytorch.org/whl/cpu
```

### 1.3 LLVM 工具链

如果 `oaitriton.blob.core.windows.net` 可访问，LLVM 工具链会在首次构建时（步骤 2.2 第 3 步）根据 `cmake/llvm-hash.txt`（a66376b0）自动获取并缓存到 `~/.triton/llvm/` — **无需手动操作**。

对于受限网络环境，请手动下载（注意是 **arm64** 包，适用于 Triton 3.3）：

```shell
mkdir -p ~/.triton/llvm && cd ~/.triton/llvm
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-a66376b0-ubuntu-arm64.tar.gz
tar zxvf llvm-a66376b0-ubuntu-arm64.tar.gz
export LLVM_SYSPATH=~/.triton/llvm/llvm-a66376b0-ubuntu-arm64
export LLVM_INCLUDE_DIRS=$LLVM_SYSPATH/include
export LLVM_LIBRARY_DIR=$LLVM_SYSPATH/lib
```

## 2. 安装命令

### 2.1 免源码安装

⚠️ ARM64 CPU 后端目前尚无预构建的 wheel；请按照下方 2.2 节从源码构建。

### 2.2 从源码构建

三个步骤：**克隆 FlagTree → 通过辅助脚本连接 flagtree-cpu → 构建 FlagTree**。

> 注意：以下命令使用**合并后**的仓库/分支（flagos-ai）。如需在合并前自测，请将未合并的 PR 仓库/分支替换为 `flagos-ai/flagtree-cpu`（main）和 `flagos-ai/FlagTree`（`triton_v3.3.x`）。辅助脚本接受 `--flagtree-cpu-url` 和 `--flagtree-cpu-ref` 来覆盖其默认值。

**第 1 步 — 克隆 FlagTree 并检出 cpu 后端分支**

```shell
cd ${YOUR_CODE_DIR}
git clone https://github.com/flagos-ai/FlagTree.git
cd FlagTree
git checkout -b triton_v3.3.x origin/triton_v3.3.x   # FlagTree 的 3.3.x 分支（包含 cpu 后端）
```

**第 2 步 — 连接 flagtree-cpu（克隆 + 符号链接）**

C++ 扩展层（TritonCPU MLIR 方言 + NEON/SVE2 C 运行时 + Python TLE 内置函数）位于 `flagos-ai/flagtree-cpu` 中。一个辅助脚本将其克隆到 `third_party/triton-cpu/` 并创建 CPU 后端构建所需的 12 个符号链接（TritonCPU 方言头文件、`third_party/cpu/*`、sleef、`third_party/cpu/language/cpu/` 下的 Python TLE 内置函数，以及 `python/triton/language/extra/cpu`，以便 `triton.language.extra.cpu` 导入正常工作）：

```shell
bash python/scripts/link_flagtree_cpu.sh
```

如果您已有本地 flagtree-cpu 克隆，可以复用它而不是重新克隆：

```shell
bash python/scripts/link_flagtree_cpu.sh --flagtree-cpu-path /path/to/flagtree-cpu
```

所有生成的符号链接都是相对路径 — 工作树可以移动而不会破坏链接。重新运行脚本是安全的（已存在/正确的符号链接会被跳过；如果任何预期的符号链接路径被普通文件占用，脚本会以非零退出码退出并给出明确消息）。

**第 3 步 — 构建 FlagTree（cpu 后端）**

```shell
FLAGTREE_BACKEND=cpu TRITON_BUILD_PROTON=OFF MAX_JOBS=$(nproc) \
TRITON_APPEND_CMAKE_ARGS="-DCMAKE_INSTALL_PREFIX=/tmp/flagtree_install" \
    pip install -e python/ --no-build-isolation -v
```

`TRITON_APPEND_CMAKE_ARGS` 重定向了 `cmake --install` 步骤：如果不使用此参数，sleef 子项目会尝试将 `libsleef.so` 复制到 `/usr/local/lib`，非 root 用户构建会因*权限被拒绝*而失败。内核可见的副本位于 `python/triton/_C/` 下，无论哪种方式都会被安装。

如果您执行了 §1.3 的手动 LLVM 下载，您导出的 `LLVM_SYSPATH` 会被自动识别；如果您想确保不使用网络访问，可以额外传递 `TRITON_OFFLINE_BUILD=1`。

> 如果您之后在同一 shell 中构建其他后端，请先清除 LLVM 相关的环境变量：`unset LLVM_SYSPATH LLVM_INCLUDE_DIRS LLVM_LIBRARY_DIR FLAGTREE_BACKEND`

## 3. 测试和验证

⚠️ 在运行任何 JIT 编译内核的操作之前（包括下面的验证脚本以及一般的模型推理），请导出 `FLAGTREE_BACKEND=cpu` — 在运行时，它启用了 ARM `-march` 标志、OpenMP 链接以及针对生成 `kernel.s` 的 GCC 汇编器兼容性处理：

```shell
export FLAGTREE_BACKEND=cpu
```

确认 CPU 后端已注册，并且由 tle_arm64 插件注入的 `create_cpu_*` TLE 构建器方法可见：

```python
import triton
from triton.backends import backends
print(f"triton {triton.__version__}, cpu backend: {'cpu' in backends}")

import triton._C.libtriton as lt
b = lt.ir.builder(lt.ir.context())
cpu_ops = sorted(m for m in dir(b) if m.startswith("create_cpu_"))
print(f"TLE ARM64 ops ({len(cpu_ops)}): {cpu_ops}")
```

预期输出：

```
triton 3.3.0, cpu backend: True
TLE ARM64 ops (10): ['create_cpu_flash_attn_decode', 'create_cpu_fused_decode_step',
 'create_cpu_fused_mlp', 'create_cpu_fused_transformer_layer', 'create_cpu_neon_sdot',
 'create_cpu_rms_norm', 'create_cpu_sdot_gemv', 'create_cpu_sdot_gemv_fused_bf16',
 'create_cpu_sdot_pack_weights', 'create_cpu_swiglu']
```

端到端运行 TLE 操作（@triton.jit → `create_cpu_rms_norm` → TritonCPU 方言 → NEON/SVE2 C 运行时）：

```python
import torch, triton, triton.language as tl
from triton.language.extra.cpu import tle_ops as tle_cpu

@triton.jit
def rms_kernel(x_ptr, w_ptr, out_ptr, D: tl.constexpr, eps: tl.constexpr):
    tle_cpu.rms_norm(x_ptr, w_ptr, out_ptr, D, eps)

D = 128
x = torch.randn(D, dtype=torch.bfloat16)
w = torch.randn(D, dtype=torch.bfloat16)
out = torch.empty(D, dtype=torch.bfloat16)
rms_kernel[(1,)](x, w, out, D, 1e-6)

ref = (x.float() / torch.sqrt((x.float()**2).mean() + 1e-6)) * w.float()
print("max err:", (out.float() - ref).abs().max().item(), "-> OK")
```

关于如何使用 TLE-CPU，请参见 [TLE-CPU](/user_guide/use-tle-cpu.md)。

## 常见问题

### 问：在 big.LITTLE SoC 上性能只有一半？

答：在异构 SoC 上（例如 Cortex-A720 大核 + A520 小核），始终使用 `taskset` 将进程绑定到**仅大核** — 小核进入 OMP 线程池会在屏障处停滞，导致整体性能损失约 2 倍。同时将调度器设置为 performance 模式：

```shell
for c in $(seq 0 $(($(nproc)-1))); do
    echo performance | sudo tee /sys/devices/system/cpu/cpu$c/cpufreq/scaling_governor >/dev/null
done
# 仅绑定大核（根据您的 SoC 拓扑调整核心 ID）
taskset -c 0,1,6,7,8,9,10,11 python your_inference.py ...
```

### 问：运行时报告找不到 GLIBC / GLIBCXX 版本？

答：检查您环境支持的版本，并在需要时使用 LD_PRELOAD（aarch64 路径）：

```shell
strings /lib/aarch64-linux-gnu/libc.so.6 | grep GLIBC
strings /usr/lib/aarch64-linux-gnu/libstdc++.so.6 | grep GLIBCXX
export LD_PRELOAD=/lib/aarch64-linux-gnu/libc.so.6           # 如果找不到 GLIBC
export LD_PRELOAD=/usr/lib/aarch64-linux-gnu/libstdc++.so.6  # 如果找不到 GLIBCXX
```

### 问：内核编译失败，报错 `kernel.s: Error: junk at end of line, first unrecognized character is \`"\``？

答：当前 shell 中未导出 `FLAGTREE_BACKEND=cpu`。这不仅是构建时的开关 — `kernel.s` 的运行时 JIT 编译也依赖它（它启用了 GNU 汇编器拒绝的 LLVM `.file`/`.loc` 调试指令的剥离，以及 ARM `-march` 标志）。导出后重新运行。

### 问：`import triton.language.extra.cpu.tle_ops` 失败，报错 "No module named ..."？

答：第 2 步的符号链接不完整。重新运行 `bash python/scripts/link_flagtree_cpu.sh` — 它是幂等的，如果任何预期的符号链接无法解析，会以非零退出码退出。
