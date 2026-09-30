# 要求

## 支持的硬件

| 供应商 | 描述 |
|--------|------|
| Hygon | DCU 加速器支持，完整算子注册 |
| METAX | GPU 支持，注意力后端和 flash attention |
| KunlunXin | 百度昆仑芯片支持，flash attention |
| Iluvatar | Iluvatar Corex GPU 支持，完整算子集 |
| MUSA | 摩尔线程 S 系列 GPU 支持 |
| NPU | 昇腾 NPU 支持，依赖 `transformer_engine_npu` |
| ENFLAME | ENFLAME 芯片供应商支持，flash attention 和算子注册 |
| Tsingmicro | 清微 TXDA 支持 |

TransformerEngine-FL 训练已在沐曦、海光、昇腾与平头哥 PPU 上完成端到端验证。完整流程请参见[安装](../getting_started/install.md)。

## 操作系统

Linux（官方），WSL2（有限支持）

## FlagOS 组件及版本

与 TransformerEngine-FL 配套使用的完整 FlagOS 软件栈，以及各平台验证通过的版本：

| 组件 | 角色 | 沐曦 MetaX | 海光 Hygon | 昇腾 Ascend | 平头哥 PPU |
|------|------|-----------|-----------|------------|-----------|
| TransformerEngine-FL | Transformer 算子层（本组件） | `0.3.0` | `0.3.0` | `0.3.0` | `0.3.0` |
| Megatron-LM-FL | 训练引擎 | `0.3.0` | `0.3.0` | `0.3.0` | `0.3.0` |
| FlagScale | 编排与配置层 | `2.1.0` | `2.1.0` | `2.1.0` | `2.1.0` |
| FlagTree | FlagOS 编译器（替换 Triton） | `0.7.0+triton3.6` | `0.7.0+triton3.6` | `0.7.0+triton3.5` | `0.7.0+triton3.6` |
| FlagGems | 基于 Triton 的算子库 | `5.4.0` | `5.4.0` | `5.4.0` | `5.4.0` |

FlagTree 与 FlagGems 仅在 FlagOS 算子层（`te_fl_prefer: flagos`）下需要；厂商算子层不需要二者。
