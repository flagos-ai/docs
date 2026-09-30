# 安装要求

## 硬件

- 支持 CUDA 的 NVIDIA GPU。

## 依赖

您可以准备一个包含以下依赖的 Docker 环境。更多信息请参见[快速开始](/getting_started/install.md)。

### 必需依赖

| 依赖 | 最低版本 | 说明 |
|---|---|---|
| CMake | 3.18 | 构建系统 |
| C++ 编译器 | C++20 支持 | GCC 11+、Clang 14+ |
| Python | 3.12 | JIT 代码生成 + 测试运行器 |
| flagtree | 0.5.0 | Triton TLE 支持 |
| SQLite3 | — | 调优数据库 |
| CUDA Toolkit | 12.x | cudart、cuFFT（用于测试适配器/基准测试） |
| libtriton_jit | 子模块 | Triton JIT 编译器（`deps/libtriton_jit`） |
| PyYAML | — | 测试运行器（`pip install pyyaml`） |

### 可选依赖

| 依赖 | 用途 |
|---|---|
| Google Test | C++ 单元测试（当 `FLAGFFT_BUILD_TESTS=ON` 时通过 FetchContent 自动获取） |
| Ninja | 更快的构建后端（`cmake -G Ninja`） |
| pytest | Python 代码生成测试 |

## 子模块

```bash
git submodule update --init --recursive
```

这将拉取 `deps/libtriton_jit`，提供 Triton JIT 编译器和 `nlohmann_json`。更多信息请参见[快速开始](/getting_started/install.md)。
