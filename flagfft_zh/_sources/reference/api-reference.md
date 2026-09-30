# FlagFFT C API 参考

## 计划创建

| 函数 | 描述 |
|----------|-------------|
| `flagfftPlan1d` | 创建一维 FFT 计划 |
| `flagfftPlan2d` | 创建二维 FFT 计划（目前返回 `FLAGFFT_NOT_SUPPORTED`） |
| `flagfftPlan3d` | 创建三维 FFT 计划（目前返回 `FLAGFFT_NOT_SUPPORTED`） |
| `flagfftPlanMany` | 创建具有自定义布局的批量 FFT 计划 |

## 执行

| 函数 | 描述 |
|----------|-------------|
| `flagfftExecC2C` | 复数到复数变换（complex64） |
| `flagfftExecZ2Z` | 复数到复数变换（complex128） |
| `flagfftExecR2C` | 实数到复数变换（float） |
| `flagfftExecD2Z` | 实数到复数变换（double） |
| `flagfftExecC2R` | 复数到实数变换（float） |
| `flagfftExecZ2D` | 复数到实数变换（double） |

## 流和生命周期

| 函数 | 描述 |
|----------|-------------|
| `flagfftSetStream` | 将 CUDA 流附加到计划 |
| `flagfftDestroy` | 销毁计划并释放资源 |
| `flagfftGetPlanDescription` | 获取人类可读的计划描述 |

## 类型

| 类型 | 描述 |
|------|-------------|
| `flagfftHandle` | 不透明计划句柄 |
| `flagfftResult` | 返回状态码 |
| `flagfftStream_t` | 后端中立的不透明流类型 |
| `flagfftComplex` | 单精度复数 |
| `flagfftDoubleComplex` | 双精度复数 |

## 变换类型

| 常量 | 描述 |
|----------|-------------|
| `FLAGFFT_C2C` | 复数到复数（complex64） |
| `FLAGFFT_Z2Z` | 复数到复数（complex128） |
| `FLAGFFT_R2C` | 实数到复数（float） |
| `FLAGFFT_D2Z` | 实数到复数（double） |
| `FLAGFFT_C2R` | 复数到实数（float） |
| `FLAGFFT_Z2D` | 复数到实数（double） |

## 状态码

| 常量 | 描述 |
|----------|-------------|
| `FLAGFFT_SUCCESS` | 操作成功完成 |
| `FLAGFFT_NOT_SUPPORTED` | 请求的操作不受支持 |
