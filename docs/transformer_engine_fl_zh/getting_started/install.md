# 安装 TransformerEngine-FL

## Docker（推荐）

TransformerEngine-FL 运行在与 Megatron-LM-FL 共用的预构建 Docker 镜像中。打开 [FlagOS 主页面](https://flagos.io/Home)，在页面正中间的下载列表中选择与你的硬件对应的镜像，按页面上的说明拉取镜像、进入容器并启动。

适用于千亿参数模型预训练。

您可以通过以下方法之一安装 TransformerEngine-FL：

## 从 FlagOS 仓库直接安装

```bash
pip install transformer_engine==0.1.0+te2.9.0 --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

## 从源码安装

```bash
git clone https://github.com/flagos-ai/TransformerEngine-FL.git
cd TransformerEngine-FL
git checkout <tag number>
git submodule update --init --recursive
MAX_JOBS=xxx pip install .
```

## 非 NVIDIA 平台

TransformerEngine-FL v0.3.0 已在沐曦、海光、昇腾与平头哥 PPU 上完成验证。非 NVIDIA 平台构建时必须跳过 CUDA 扩展：

```bash
git clone https://github.com/flagos-ai/TransformerEngine-FL.git
cd TransformerEngine-FL
git checkout v0.3.0
git submodule update --init --recursive
TE_FL_SKIP_CUDA=1 MAX_JOBS=64 pip install -v . --no-build-isolation --root-user-action=ignore
```

```{note}
非 NVIDIA 平台必须加 `TE_FL_SKIP_CUDA=1`——不加会尝试编译 CUDA kernel 并失败。
```

FlagOS 算子层（`te_fl_prefer: flagos`）还需要 FlagTree 与 FlagGems。完整流程请参见[多平台构建与测试](../user_guide/multi-platform-testing.md)。

有关使用 TransformerEngine-FL、Megatron-LM-FL 和 FlagScale 的端到端训练工作流，请参见[端到端用例：TransformerEngine-FL + Megatron-LM-FL + FlagScale](../user_guide/e2e-use-case.md)。
