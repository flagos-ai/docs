[<a href="../../../flagtree_zh/getting_started/flagtree-cpu.html">中文版</a>|English]

# Enable FlagTree CPU on Arm64

[FlagTree CPU](https://github.com/flagos-ai/flagtree-cpu/tree/triton_v3.7.x) provides a CPU backend for Triton, allowing kernels written with Triton's Python API to compile and run on CPUs. Its compiler lowers Triton kernels through MLIR/LLVM into native CPU code, while its runtime handles CPU target selection, kernel launches, and compilation caching. This guide covers the Triton 3.7.2 implementation on Linux Arm64 and validates it with a vector-add kernel and FlagGems W4A8 operator tests.

Build and validate the Triton 3.7.2 CPU backend using the scripts in [flagos-ai/community](https://github.com/flagos-ai/community/tree/main/fep/sig-edge/scripts/flagtree-cpu37). Follow these steps in the same shell.

## Step 1 Prepare the host

Use **Debian 13 on Linux Arm64 (`aarch64`)**, with Git installed, sudo access (or root), and at least **25 GiB free disk space**. Ensure the host can reach the source repositories and dependency download services.

## Step 2 Get the scripts

```bash
git clone --single-branch --branch main \
  https://github.com/flagos-ai/community.git community-flagtree
cd community-flagtree

RUN=fep/sig-edge/scripts/flagtree-cpu37/run.sh
export WORK_DIR="$HOME/flagtree-cpu-3.7-test"
export BUILD_JOBS=4
```

The dedicated work directory separates the compiler, Python environment, and caches from other installations. Keep the full script directory; `run.sh` depends on its companion files.

## Step 3 Build and install

```bash
bash "$RUN" setup
```

Setup installs system dependencies, creates a Python 3.11 environment, fetches pinned FlagTree CPU and FlagGems revisions, initializes submodules, and builds Triton 3.7.2. Pinned LLVM and SLEEF versions make the build reproducible. The installed package imports as `triton`.

## Step 4 Validate CPU execution

```bash
bash "$RUN" test
```

Tests check source/toolchain revisions and the CPU target, execute a real vector-add kernel with fresh and reused caches, and compare FlagGems W4A8 results against PyTorch. Acceptance requires **7 passed, 0 skipped**. Logs and test reports are saved under `$WORK_DIR/logs/`.

## Step 5 Enable the backend for your application

```bash
source "$WORK_DIR/.venv/bin/activate"
export TRITON_CPU_BACKEND=1
export FLAGGEMS_VENDOR=arm
export TRITON_CACHE_DIR="$WORK_DIR/triton-runtime-cache"
mkdir -p "$TRITON_CACHE_DIR"

python your_program.py
```

Replace `your_program.py` with your application. `TRITON_CPU_BACKEND=1` selects CPU execution; `FLAGGEMS_VENDOR=arm` selects the FlagGems Arm implementation. A persistent cache lets compatible kernel specializations reuse compiled code. These variables must be exported in your application shell because the setup/test scripts run in separate Bash processes.

Passing these checks validates the compiler and tested operators; model integration and model cold-start performance require separate validation.

Reference: [FEP-0082](https://github.com/flagos-ai/community/blob/main/fep/sig-edge/0082-flagtree-cpu-bump-to-triton-3_7.md).
