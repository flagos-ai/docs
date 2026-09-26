# 要求

## 支持的硬件

| 供应商 | 描述 |
|--------|------|
| Hygon | DCU 加速器支持，完整算子注册 |
| METAX | GPU 支持，注意力后端和 flash attention |
| KunlunXin | 百度昆仑芯片支持，flash attention |
| Iluvatar | Iluvatar Corex GPU 支持，完整算子集 |
| MUSA | Moore Threads S 系列 GPU 支持 |
| NPU | 昇腾 NPU 支持，依赖 `transformer_engine_npu` |
| ENFLAME | ENFLAME 芯片供应商支持，flash attention 和算子注册 |
| Tsingmicro | 清微 TXDA 支持 |

TransformerEngine-FL 训练已在沐曦、海光、昇腾与平头哥 PPU 上完成端到端验证。构建开关与操作步骤请参见[多平台构建与测试](../user_guide/multi-platform-testing.md)。

## 操作系统

Linux（官方），WSL2（有限支持）

## 软件

- CUDA：12.1+（Hopper/Ada/Ampere），12.8+（Blackwell），需兼容的 NVIDIA 驱动
- cuDNN：9.3+
- 编译器：GCC 9+ 或 Clang 10+，支持 C++17
- Python：推荐 3.12

## 源码构建要求

- CMake 3.18+
- Ninja
- Git 2.17+
- pybind11 2.6.0+
