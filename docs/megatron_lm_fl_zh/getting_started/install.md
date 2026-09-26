# 安装 Megatron-LM-FL

您可以通过以下方法之一安装 Megatron-LM-FL：

## Docker（推荐）

Megatron-LM-FL 通过预构建的 Docker 镜像运行。打开 [FlagOS 主页面](https://flagos.io/Home)，在页面正中间的下载列表中选择与你的硬件对应的镜像，按页面上的说明拉取镜像、进入容器并启动。

### CUDA

进入容器后，激活环境并安装 FlashAttention：

```bash
conda activate flagscale-train
pip install flash-attn==2.8.3 --no-build-isolation
```

## 从源码安装

```bash
git clone https://github.com/flagos-ai/Megatron-LM-FL.git
cd Megatron-LM-FL
git checkout <tag number>
pip install . --no-build-isolation --root-user-action=ignore
```

## 非 NVIDIA 平台

Megatron-LM-FL v0.3.0 已在沐曦、海光、昇腾与平头哥 PPU 上完成验证。请从 [FlagOS 主页面](https://flagos.io/Home)的下载列表安装对应平台的镜像，再按对应标签从源码安装：

| 平台 | 设备检查命令 | 可见设备环境变量 | FlagTree 后端 |
|------|--------------|------------------|---------------|
| 沐曦 MetaX | `mx-smi` | `MACA_VISIBLE_DEVICES` | `metax` |
| 海光 Hygon | `hy-smi` | `HIP_VISIBLE_DEVICES` | `hcu` |
| 昇腾 Ascend | `npu-smi info` | `ASCEND_RT_VISIBLE_DEVICES` | `ascend` |
| 平头哥 PPU | `ppu-smi` | `CUDA_VISIBLE_DEVICES` | `ppu` |

```bash
cd /workspace/Megatron-LM-FL
git checkout v0.3.0
pip install . --no-build-isolation --root-user-action=ignore

pip list | grep megatron
megatron-core                            0.18.2+c8fa61f2e
```

```{note}
海光平台在安装或运行前需要先 `source /opt/dtk/env.sh`。
```

有关使用 Megatron-LM-FL、TransformerEngine-FL 和 FlagScale 的端到端训练工作流，请参见[端到端用例](https://docs.flagos.io/projects/TransformerEngine-FL/zh-cn/latest/user_guide/e2e-use-case.html)与[多平台训练与测试](../user_guide/multi-platform-training.md)。
