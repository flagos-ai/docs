# FlagFFT 用户指南

## 使用 C API

FlagFFT 在 `include/flagfft.h` 中提供与 cuFFT 兼容的 C API。

### 创建计划

```c
flagfftPlan1d(plan, nx, type, batch)
flagfftPlan2d(plan, nx, ny, type)
flagfftPlan3d(plan, nx, ny, nz, type)        // NOT_SUPPORTED
flagfftPlanMany(plan, rank, n, inembed, istride, idist,
                onembed, ostride, odist, type, batch)
```

### 执行变换

```c
// 复数到复数（单精度和双精度）
flagfftExecC2C(plan, idata, odata, direction)
flagfftExecZ2Z(plan, idata, odata, direction)

// 实数到复数（正向）
flagfftExecR2C(plan, idata, odata)
flagfftExecD2Z(plan, idata, odata)

// 复数到实数（逆向）
flagfftExecC2R(plan, idata, odata)
flagfftExecZ2D(plan, idata, odata)
```

### 管理计划

```c
flagfftSetStream(plan, stream)    // 附加 CUDA 流
flagfftDestroy(plan)              // 释放计划资源
flagfftGetPlanDescription(plan)   // 人类可读的计划摘要
```

### 数据类型

| FlagFFT 类型 | C 类型 | 描述 |
|---|---|---|
| `flagfftComplex` | `float2` | 单精度复数 |
| `flagfftDoubleComplex` | `double2` | 双精度复数 |
| `flagfftReal` | `float` | 单精度实数 |
| `flagfftDoubleReal` | `double` | 双精度实数 |

### 变换类型

| 类型常量 | 变换 |
|---|---|
| `FLAGFFT_C2C` | 复数 → 复数 |
| `FLAGFFT_Z2Z` | 双精度复数 → 双精度复数 |
| `FLAGFFT_R2C` | 实数 → 复数 |
| `FLAGFFT_D2Z` | 双精度实数 → 双精度复数 |
| `FLAGFFT_C2R` | 复数 → 实数 |
| `FLAGFFT_Z2D` | 双精度复数 → 双精度实数 |

### 支持的功能

| 功能 | 状态 |
|---|---|
| 一维任意长度 C2C、Z2Z | Cooley-Tukey + Bluestein/Rader |
| 一维任意长度 R2C、D2Z（正向） | 已支持 |
| 一维任意长度 C2R、Z2D（逆向） | 已支持 |
| 一维往返（R2C→C2R、D2Z→Z2D） | 已支持 |
| 二维连续行优先 C2C、Z2Z | RTRT 分解 |
| 二维连续行优先 R2C、D2Z、C2R、Z2D | 已支持 |
| 批量变换 | 已支持 |
| 原地和异地 | 已支持 |
| CUDA 流附加 | 已支持 |

### 计划中 / 尚未支持

| 功能 | 状态 |
|---|---|
| 三维变换（`flagfftPlan3d`） | 返回 `FLAGFFT_NOT_SUPPORTED` |
| 二维更多执行算法 | 目前仅支持 RTRT |

## 使用原生 CLI

`flagfft-cli` 是一个原生基准测试和验证工具。使用 `-DFLAGFFT_BUILD_CLI=ON` 构建。

### 基准测试 FFT 性能

```sh
flagfft-cli bench [OPTIONS]
```

| 选项 | 默认值 | 描述 |
|---|---|---|
| `--rank` | `1` | 变换秩：`1` 或 `2` |
| `--api` | `c2c` | 变换类型：`c2c`、`z2z`、`r2c`、`d2z`、`c2r`、`z2d` |
| `--shape` | 必填 | 变换尺寸，逗号分隔：`1024`、`256x256`、`1024,2048,4096` |
| `--batch` | `1` | 批量大小 |
| `--direction` | `forward` | `forward` 或 `inverse` |
| `--placement` | `out-of-place` | `out-of-place` 或 `in-place` |
| `--warmup` | `10` | 预热迭代次数 |
| `--iters` | `100` | 测量迭代次数 |
| `--json` | — | 以 JSON 格式输出结果 |
| `--print-path` | — | 打印执行计划分解路径（与 `--json` 一起使用） |

示例：

```sh
# 基准测试一维 C2C FFT，尺寸 4096，批量 256
flagfft-cli bench --api c2c --shape 4096 --batch 256

# 基准测试二维 Z2Z FFT
flagfft-cli bench --rank 2 --api z2z --shape 256x256

# 比较多种尺寸，JSON 输出
flagfft-cli bench --api r2c --shape 1024,2048,4096,8192 --json

# 打印内核执行计划
flagfft-cli bench --api c2c --shape 997 --print-path --json
```

### 自动调优（计划中）

```sh
flagfft-cli tune [OPTIONS]
```

目前为占位符；退出并返回 `FLAGFFT_NOT_SUPPORTED`。

### 退出码

| 码 | 含义 |
|---|---|
| `0` | 通过 |
| `1` | 失败 / 参数无效 |
| `2` | 运行时错误 |
| `77` | 跳过 / 不支持 |

## 运行测试

FlagFFT 有三层测试：统一的 Python 测试运行器、C++ 单元测试（Google Test）和 Python 代码生成测试（pytest）。

### 使用统一测试运行器

`tools/run_tests.py` 是运行完整测试套件的主要入口。它协调精度测试（C++ ctest 二进制文件，比较 FlagFFT 输出与 cuFFT）和性能基准测试（flagfft-cli bench）。

#### 用法

```sh
python tools/run_tests.py [OPTIONS]
```

| 标志 | 默认值 | 描述 |
|---|---|---|
| `--ops` | — | 要测试的算子 ID，逗号分隔 |
| `--op-list-file` | — | 每行一个算子 ID 的文件路径 |
| `--start` | — | 按字典序跳过此值之前的算子 |
| `--stages` | `stable` | 要包含的阶段，逗号分隔（`stable`、`alpha`、`beta`） |
| `--combination` | `ct` | 测试组合：`ct`、`bs`、`full`、`2d`、`2d_full` |
| `--gpus` | `0` | GPU ID，逗号分隔，或 `all` |
| `--output-dir` | `results` | 摘要和每个算子结果文件的目录 |
| `--build-dir` | `build` | CMake 构建目录路径 |
| `--accuracy-only` | — | 仅运行精度测试 |
| `--performance-only` | — | 仅运行性能（基准测试）测试 |
| `--timeout` | `600` | 每个测试的子进程超时秒数 |
| `--warmup` | `10` | 基准测试预热迭代次数 |
| `--iters` | `100` | 基准测试测量迭代次数 |
| `--dump-output` | — | 将每个测试的 stdout/stderr 保存到日志文件 |
| `--color` | `auto` | 颜色模式：`auto`、`always`、`never` |
| `-v, --verbose` | — | 详细输出 |

#### 组合预设

| 预设 | 描述 |
|---|---|
| `ct` | 快速冒烟测试 —— Cooley-Tukey 尺寸，批量 1，缩放 1.0 |
| `bs` | 快速冒烟测试 —— Bluestein/Rader 尺寸，批量 1，缩放 1.0 |
| `full` | 完整一维 —— 所有 CT 尺寸 × 所有批量 × 所有缩放 |
| `2d` | 快速二维 —— 选定的二维尺寸，批量 {1,4}，缩放 1.0 |
| `2d_full` | 完整二维 —— 选定的二维尺寸 × 所有批量 × 所有缩放 |

#### 示例

```sh
# 快速冒烟测试（默认）
python tools/run_tests.py

# GPU 0 上的完整测试套件
python tools/run_tests.py --combination full --gpus 0

# 跨 4 个 GPU 的完整套件
python tools/run_tests.py --combination full --gpus 0,1,2,3

# 仅精度测试，特定算子
python tools/run_tests.py --combination full --ops c2c_1d,r2c_1d --accuracy-only

# 仅性能基准测试
python tools/run_tests.py --combination full --performance-only
```

#### 输出

- 控制台：实时进度，每个 GPU 状态
- `results/summary.json` —— 顶层摘要，包含 `timestamp`、`env`、`config`、`result` 和 `summary` 部分
- `results/{op_id}/accuracy_result.json` —— 每个算子的精度详情
- `results/{op_id}/performance_result.json` —— 每个算子的基准测试详情

如果所有精度测试通过，退出码为 `0`，任何失败则为 `1`。

### 运行 C++ 测试

使用 `-DFLAGFFT_BUILD_TESTS=ON` 构建。每个测试二进制文件使用范数相对误差指标（`rel_l2`、`rel_linf`）比较 FlagFFT 输出与 cuFFT。

#### 测试结构

| 测试模式 | 覆盖范围 |
|---|---|
| `test_plan` | 计划生命周期、错误码、不支持的 API 合约 |
| `test_2d_correctness` | 二维 C2C/Z2Z 正确性 |
| `test_exec_c2c_{fwd,inv}_{ct,bs}_{s,b}` | C2C 正向/逆向，Cooley-Tukey/Bluestein，单/多批量 |
| `test_exec_z2z_{fwd,inv}_{ct,bs}_{s,b}` | 双精度复数 |
| `test_exec_r2c_{ct,bs}_{s,b}` | Float 实数 → 复数 |
| `test_exec_d2z_{ct,bs}_{s,b}` | Double 实数 → 复数 |
| `test_exec_c2r_{ct,bs}_{s,b}` | 复数 → float 实数 |
| `test_exec_z2d_{ct,bs}_{s,b}` | 双精度复数 → 双精度实数 |
| `test_exec_r2c_c2r_{ct,bs}_{s,b}` | 实数往返验证 |
| `test_exec_d2z_z2d_{ct,bs}_{s,b}` | 双精度实数往返 |

后缀说明：`s` = 单批量，`b` = 多批量；`ct` = Cooley-Tukey，`bs` = Bluestein/Rader。

#### 运行单个测试

```sh
# 运行特定测试
./build/ctest/test_exec_c2c_fwd_ct_s

# 使用自定义参数
./build/ctest/test_exec_c2c_fwd_ct_s --nx 4096 --batch 64 --direction forward

# 运行所有 ctest 测试
cd build && ctest --output-on-failure
```

每个测试二进制文件接受：`--nx`、`--batch`、`--direction`、`--scale`、`--json-file`。

### 运行 Python 测试

针对 `flagfft_codegen` Python 包的测试。需要安装该包（`pip install .`）。

```sh
# 运行所有 Python 测试
pytest tests/python/ -v

# 仅运行标记为 codegen 的测试
pytest tests/python/ -v -m codegen
```

测试涵盖 codelet 结构、内核源码生成、JIT CSV 解析以及 Bluestein/reshape/R2C 元数据。需要 Triton/TLE 的测试在依赖不可用时自动跳过。

### 配置测试

测试参数空间在 `conf/` 中定义：

- `conf/operators.yaml` —— 14 个算子定义（一维/二维 × C2C/Z2Z/R2C/D2Z/C2R/Z2D，加上往返）
- `conf/test_matrix.yaml` —— 参数空间：11 个平滑尺寸（CT）、4 个质数/复合尺寸（Bluestein）、3 个批量大小、3 个缩放因子、6 个组合规则
