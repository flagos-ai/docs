# 数据类型支持

Torch-FL 会为张量**存储**保留请求的数据类型，并对张量间运算遵循 PyTorch 的提升（promotion）规则。计算覆盖范围受各后端所用厂商库限制；此外，AMP 目标支持与 eager 类型支持是两个独立问题：存储层接受的类型，并不意味着每个算子都接受。

## 存储与计算

| 后端 | 存储与拷贝 | eager 逐元素 | 矩阵乘族 |
|---|---|---|---|
| NVIDIA CUDA | PyTorch CUDA 原生类型支持 | CUDA 原生覆盖 | CUDA 原生覆盖 |
| MetaX（boxing） | MACA libtorch 的 CUDA 兼容覆盖；支持 FP8 与 packed FP4 存储 | MACA libtorch 的 CUDA 兼容覆盖 | MACA 覆盖，外加软件模拟的 FP8 / packed FP4 `mm`/`bmm`/`addmm` |
| 海光 DCU | 厂商库覆盖 | 厂商库覆盖 | 厂商库覆盖 |
| Ascend | float16、bfloat16、float32、float64、整型、uint8、bool | 厂商覆盖；不支持的 ACLNN 组合走 CPU 回退 | 原生支持 float16、bfloat16、float32；float64 与不支持类型走 CPU 回退 |
| 燧原 GCU | float16、bfloat16、float32、float64、整型、bool | topsaten 覆盖；int64、float64 与未路由算子走 CPU 回退 | float16、bfloat16、float32 |
| 摩尔线程 MUSA | float16、bfloat16、float32、float64、整型、bool | mudnn 覆盖；未路由算子走 CPU 回退 | float16、bfloat16、float32 |

## AMP 目标类型

`torch.autocast("flagos")` 支持 `torch.float16` 与 `torch.bfloat16` 作为低精度目标，采用 PyTorch 标准 autocast 策略组：矩阵乘与卷积优先使用所选低精度类型，数值敏感算子（对数、归一化）使用 float32，混合输入遵循 promote 策略。**float32 与 float64 不是合法的 autocast 目标。**

| 后端 | AMP 目标 | 说明 |
|---|---|---|
| NVIDIA CUDA | float16、bfloat16 | |
| MetaX（boxing） | float16、bfloat16 | 在 CUDA-boxing 模式下测量；不覆盖旧版手写内核模式 |
| 海光 DCU | 因后端而异 | |
| Ascend | float16、bfloat16 | float64 可存储且逐元素可用，但既不是 AMP 目标，也不被原生矩阵乘 API 接受 |
| 燧原 GCU | float16、bfloat16 | |
| 摩尔线程 MUSA | float16、bfloat16 | |

## 边界

当厂商算子不接受某类型时，该算子由以实现正确性为先的 CPU 回退承接：在主机上计算，再把类型正确的结果拷回设备。该回退以正确性为目标，可能慢于原生内核 —— 这是成文的覆盖边界，而非故障。

- **Ascend** — `aclnnMatmul`、`aclnnMm`、`aclnnBatchMatMul` 拒绝 float64 与整型输入（走回退）；`aclnnNeg` 拒绝 int16、uint8 与 bool。float64 的存储、设备拷贝、类型转换与逐元素运算全程保持 float64。复数与量化类型不在支持范围内。
- **燧原 GCU** — topsaten 没有 float64 与 int64 内核，两者可原生存储但在 CPU 上计算。`topsatenNeg` 另外拒绝 uint8 与 bool。卷积前向走原生 topsaten 路径，反向走 CPU 回退。
- **摩尔线程 MUSA** — `GradScaler` 的 unscale 使用以实现正确性为先的回退（列表与标量操作数搬到 CPU，执行参考实现，再把变更后的数值与 `found_inf` 拷回），而非原生 foreach 内核。
- **MetaX** — 低精度矩阵路径是**标量** FP8（`float8_e4m3fn`、`float8_e5m2`、`float8_e4m3fnuz`、`float8_e5m2fnuz`、`float8_e8m0fnu`）与 packed FP4（`float4_e2m1fn_x2`）在 `mm`、`bmm`、`addmm`（含 `dtype`/`out` 变体）上的软件模拟。数值以 BF16 解码并累加，因此未指定输出类型时默认 BF16，显式指定则遵循。块缩放元数据格式（MXFP4、NVFP4、block FP4）与 `_scaled_mm` 系列**不在**其中。

## 通过测试意味着什么

在缺少原生内核时，集成测试套件会将结果与 CPU 参考实现对比；因此测试通过意味着该算子遵循成文的 PyTorch 契约 —— 而**不一定**意味着它使用了厂商原生内核。
