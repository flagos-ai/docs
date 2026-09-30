# 安装 FlagFFT

## 快速开始

克隆、构建并一步验证：

```sh
# 1. 克隆
git clone https://github.com/flagos-ai/FlagFFT.git
cd FlagFFT

# 2. 初始化子模块
git submodule update --init --recursive

# 3. 构建库、CLI 和测试二进制文件
cmake -B build -DCMAKE_BUILD_TYPE=Release \
      -DFLAGFFT_BUILD_CLI=ON \
      -DFLAGFFT_BUILD_TESTS=ON
cmake --build build -j$(nproc)

# 4. 安装 Python 代码生成包（JIT 内核生成所需）
pip install .

# 5. 运行完整的精度 + 性能测试套件
python tools/run_tests.py --combination full --gpus 0
```

运行器会打印实时进度表，并写入 `summary.json`，其中包含每个算子的精度（通过/失败）和性能（相对于 cuFFT 的几何平均加速比）结果。

## 构建选项

| 选项 | 默认值 | 描述 |
|---|---|---|
| `FLAGFFT_BUILD_CLI` | `OFF` | 构建 `flagfft-cli` 基准测试/验证工具 |
| `FLAGFFT_BUILD_TESTS` | `OFF` | 构建 C++ 测试套件（需要 Google Test + CUDA） |
| `BACKEND` | `CUDA` | GPU 后端选择器（目前仅支持 `CUDA`） |
| `CMAKE_BUILD_TYPE` | — | `Release`、`Debug`、`RelWithDebInfo` |

### 仅构建库

```sh
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)
```

这将生成 `build/libflagfft.so`。

### 构建库 + CLI + 测试

```sh
cmake -B build -DCMAKE_BUILD_TYPE=Release \
      -DFLAGFFT_BUILD_CLI=ON \
      -DFLAGFFT_BUILD_TESTS=ON
cmake --build build -j$(nproc)
```

## 安装到系统（可选）

构建后，将库和工具安装到系统范围：

```sh
cmake --install build --prefix /usr/local
```

将 `libflagfft.so` 安装到 `lib/`，公共头文件 `flagfft.h` 安装到 `include/`，`flagfft-cli` 安装到 `bin/`（如果使用 `-DFLAGFFT_BUILD_CLI=ON` 构建）。

## 使用 Docker

预构建的包含所有依赖的环境可作为手动设置的替代方案：

```sh
docker build -t flagfft-dev -f docker/Dockerfile .
docker run --gpus all -v $(pwd):/workspace/FlagFFT -it flagfft-dev
# 在容器内，运行快速开始中的构建和测试步骤。
```

## 设置环境变量

| 变量 | 描述 |
|---|---|
| `FLAGFFT_PYTHON` | JIT 代码生成使用的 Python 解释器路径（默认：PATH 中的 `python3`） |
| `FLAGFFT_TUNE_DB` | SQLite 调优数据库路径（默认：`~/.flagfft/tune.db`） |
| `FLAGFFT_TUNE_DISABLE` | 设置为 `1` 以禁用调优计划查找，始终使用自动选择的计划 |
