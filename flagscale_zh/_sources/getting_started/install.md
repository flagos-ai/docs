# 安装 FlagScale

安装前请先阅读[要求](requirements.md)。

## 安装步骤

### 1. 选择镜像

FlagScale 通过预构建的 Docker 镜像安装。支持的版本与硬件平台见[要求](requirements.md)。

前往 [FlagOS 主页](https://flagos.io/Home)，点击页面中部的 **Download**，按您的硬件与任务类型选择 Docker 镜像：

| 任务类型 | 镜像 |
|----------|------|
| 推理 / 服务 | flagscale-inference |
| 训练 | flagscale-train |
| 强化学习 | flagscale-train |

启动容器后，在容器内安装对应任务的组件。

### 2. 在容器内安装组件

#### 推理 / 服务后端

vLLM：

```{code-block} shell
pip install vllm==0.13.0
```

vLLM-plugin-FL：

```{code-block} shell
pip install vllm-plugin-fl==0.1.0+vllm0.13.0 --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

更多细节请参见 [vllm-plugin-FL](https://github.com/flagos-ai/vllm-plugin-FL)。

FlagGems：

```{code-block} shell
pip install -U scikit-build-core==0.11 pybind11 ninja cmake
git clone https://github.com/flagos-ai/FlagGems
cd FlagGems
pip install --no-build-isolation .
```

更多细节请参见 [FlagGems](https://github.com/flagos-ai/FlagGems)。

#### 训练后端

Megatron-LM-FL：

```{code-block} shell
pip install megatron_core==0.1.0+megatron0.15.0rc7 --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

更多细节请参见 [Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL)。

TransformerEngine-FL：

```{code-block} shell
pip install transformer_engine==0.1.0+te2.9.0 --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

更多细节请参见 [TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL)。

#### 强化学习后端

verl-FL：

```{code-block} shell
pip install verl==0.1.0+verl0.7.0 --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

更多细节请参见 [veRL-FL](https://github.com/flagos-ai/verl-FL.git) 获取完整安装说明。

### 3. 安装 FlagScale

**方式一：通过 pip 安装**

```{code-block} shell
pip install flagscale --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

**方式二：从源码安装**

```{code-block} shell
git clone https://github.com/flagos-ai/FlagScale.git
cd FlagScale
pip install .
```

### 4. 非 NVIDIA 平台

在沐曦、海光、昇腾与平头哥 PPU 上，请从 [FlagOS 主页](https://flagos.io/Home)选择对应平台的镜像，并从源码安装与之匹配的正式版本 Megatron-LM-FL 与 TransformerEngine-FL。

| 平台 | FlagTree 后端 | 可见设备环境变量 |
|------|---------------|------------------|
| 沐曦 MetaX | `metax` | `MACA_VISIBLE_DEVICES` |
| 海光 Hygon | `hcu` | `HIP_VISIBLE_DEVICES` |
| 昇腾 Ascend | `ascend` | `ASCEND_RT_VISIBLE_DEVICES` |
| 平头哥 PPU | `ppu` | `CUDA_VISIBLE_DEVICES` |

```{code-block} shell
cd /workspace/Megatron-LM-FL && git checkout v0.3.0 && pip install . --no-build-isolation --root-user-action=ignore
cd /workspace/TransformerEngine-FL && git checkout v0.3.0
TE_FL_SKIP_CUDA=1 MAX_JOBS=64 pip install -v . --no-build-isolation --root-user-action=ignore
cd /workspace/FlagScale && git checkout v2.1.0 && pip install . --no-build-isolation
```

```{note}
在非 NVIDIA 平台上 `TE_FL_SKIP_CUDA=1` 是必须的——否则构建会尝试编译 CUDA kernel 并失败。
```

完整流程（含 FlagTree 与 FlagGems 算子栈、各平台问题排查）请参见[多平台训练与测试](multi-platform-training.md)。
