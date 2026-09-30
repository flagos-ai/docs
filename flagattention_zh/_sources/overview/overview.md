# FlagAttention 概览

FlagAttention 是 [FlagOS](https://flagos.io/) 的组成部分。它是一组使用 [Triton 语言](https://github.com/triton-lang/triton) 实现的内存高效 attention 算子，面向需要自定义 attention score 变换、paged/sparse KV cache 布局或递归线性注意力 kernel 的训练与推理任务。

与 [FlashAttention](https://arxiv.org/abs/2205.14135) 类似，稠密算子通过分块和重计算避免实体化完整的 attention matrix。仓库还包含解码、块稀疏、量化和递归算子，它们并不局限于标准 scaled dot-product attention 接口。

```{note}
各算子族成熟度不同。目前只有 FlashAttention 与 Piecewise Attention 标记为 `stable`，其余算子族均为 `alpha`。
```

## 特性

- **稠密注意力** —— 支持 MQA/GQA、dropout 与辅助输出的 FlashAttention，以及根据 token 距离在两套 Q/K 之间选择的 Piecewise Attention。
- **推理与稀疏注意力** —— Split-KV、paged KV cache attention、MiniMax M3 稀疏注意力，以及按 block 进行 INT8 Q/K 量化的 SageAttention。
- **递归线性注意力** —— Chunk GLA、Chunk Gated Delta Rule、GDN2 与 Kimi Delta Attention。
- **厂商后端** —— 识别并提供按算子路由的 NVIDIA、AMD、海光、天数智芯、MetaX、燧原、昇腾、寒武纪、摩尔线程、Intel 与 CPU 后端，可用环境变量覆盖。
- **算子清单** —— 每个算子族的公开入口、阶段、测试与 benchmark 入口均记录在 `conf/operators.yaml`。
- **测试与基准工具** —— 多设备测试调度器、FlagGems 兼容的 JSON 记录，以及逐算子的 benchmark 入口。

## 架构

```text
FlagAttention
├── src/flag_attn/
│   ├── flash.py, piecewise.py, split_kv.py, paged.py
│   ├── minimax_sparse_attention/   # MiniMax M3 打分与稀疏注意力
│   ├── sage_attention/             # INT8 Q/K 量化与注意力
│   ├── parallel_nsa/               # NSA 选择与压缩
│   ├── FLA/                        # GLA、Gated Delta Rule、KDA 辅助实现
│   ├── gdn2/                       # 通用 GDN2 实现
│   ├── runtime/backend/            # 设备探测与厂商后端
│   └── testing/                    # PyTorch 参考实现
├── tests/                          # 精度与分派测试
├── benchmark/                      # 性能测试入口
├── examples/                       # 小型示例程序
├── conf/operators.yaml             # 算子阶段/测试/benchmark 清单
├── tools/run_tests.py              # 多设备测试调度器
└── packaging/                      # Debian/RPM 打包
```

设备元数据遵循 FlagGems/FlagGems-vLLM 的约定；顶层包导出了稠密、paged、递归、KDA/GDN2 与 MiniMax API；SageAttention 与 Parallel NSA 使用子模块入口。厂商开发接口位于 `flag_attn.runtime.backend._<vendor>`，不视为稳定的公开 API。

## 工作流程

1. 针对目标加速器的 PyTorch build 安装 FlagAttention。
2. 导入所需算子，例如 `from flag_attn import flash_attention`。
3. 按算子族要求的布局在张量上调用；运行时会将算子路由到探测到的厂商后端。
4. 使用 `flag_attn.testing` 中暴露的 PyTorch 参考实现验证精度，并通过 benchmark 入口测量性能。
