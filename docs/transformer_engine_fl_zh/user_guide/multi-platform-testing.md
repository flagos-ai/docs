# 多平台构建与测试

本指南介绍如何在四类非 NVIDIA 平台上构建并验证 TransformerEngine-FL：沐曦（MetaX）、海光（Hygon）、昇腾（Ascend）、平头哥（T-Head PPU）。重点放在本组件特有的部分——算子后端分层、厂商后端与注意力后端——以及如何区分构建成功与失败。

其外层的训练编排请参见 [Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL) 与 [FlagScale](https://github.com/flagos-ai/FlagScale)。

---

## 1. 后端分层

TransformerEngine-FL 的每个算子都通过三层后端分派。判断故障来自哪一层，是最快的定位方式。

| 层级 | 包路径 | 用途 |
|------|--------|------|
| FlagOS | `transformer_engine/plugin/core/backends/flagos` | 默认 Triton 实现，基于 FlagGems |
| Vendor | `transformer_engine/plugin/core/backends/vendor/<vendor>` | 硬件特定实现 |
| Reference | `transformer_engine/plugin/core/backends/reference` | 纯 PyTorch 回退 |

v0.3.0 提供的厂商后端：

| 厂商 | 目录 | 说明 |
|------|------|------|
| CUDA | `vendor/cuda` | NVIDIA GPU |
| MetaX | `vendor/metax` | 含 flash attention |
| Hygon | `vendor/hygon` | DCU，含 flash attention |
| Ascend NPU | `vendor/npu` | 依赖 `transformer_engine_npu` |
| KunlunXin | `vendor/kunlunxin` | 含 flash attention |
| Iluvatar | `vendor/iluvatar` | Corex GPU |
| MUSA | `vendor/musa` | 摩尔线程 S 系列 |
| ENFLAME | `vendor/enflame` | 含 flash attention |
| Tsingmicro | `vendor/tsingmicro` | TXDA |

---

## 2. 平台前置条件

| 平台 | 设备检查命令 | FlagTree 后端 | 可见设备环境变量 |
|------|--------------|---------------|------------------|
| 沐曦 MetaX | `mx-smi` | `metax` | `MACA_VISIBLE_DEVICES` |
| 海光 Hygon | `hy-smi` | `hcu` | `HIP_VISIBLE_DEVICES` |
| 昇腾 Ascend | `npu-smi info` | `ascend` | `ASCEND_RT_VISIBLE_DEVICES` |
| 平头哥 PPU | `ppu-smi` | `ppu` | `CUDA_VISIBLE_DEVICES` |

```{note}
海光平台在执行任何构建或运行命令前，都需要先 `source /opt/dtk/env.sh`。
```

---

## 3. 从源码构建

```bash
git clone https://github.com/flagos-ai/TransformerEngine-FL.git
cd TransformerEngine-FL
git checkout v0.3.0
git submodule update --init --recursive
```

NVIDIA 平台按 CUDA 工具链构建：

```bash
MAX_JOBS=64 pip install -v . --no-build-isolation --root-user-action=ignore
```

所有非 NVIDIA 平台都跳过 CUDA 扩展，只构建插件层：

```bash
TE_FL_SKIP_CUDA=1 MAX_JOBS=64 pip install -v . --no-build-isolation --root-user-action=ignore
```

确认安装版本：

```bash
pip list | grep transformer
transformer_engine                       2.17.0+69cf722e
transformers                             5.8.1
```

```{note}
非 NVIDIA 平台必须加 `TE_FL_SKIP_CUDA=1`。不加会尝试编译 CUDA kernel 并失败。
```

沐曦平台上报的版本形式为：

```text
transformer_engine                       2.17.0+f247b9fe
transformer_engine_metax                 2.9.0
transformers                             4.51.0
```

---

## 4. 安装 FlagOS 编译器与算子库

TransformerEngine-FL 的 FlagOS 层基于 FlagGems，而 FlagGems 又需要 FlagTree 作为编译器。启用 `te_fl_prefer: flagos` 前请先装好两者。

```bash
python -m pip uninstall -y triton
cd /workspace/FlagTree
git checkout 0.7.0+triton3.6

pip install "nanobind>=2.4,<3"
pip install -U scikit-build-core==0.11 pybind11 ninja cmake
# 仅昇腾
pip install -r /workspace/FlagTree/python/requirements-ascend.txt
unset LLVM_SYSPATH LLVM_INCLUDE_DIRS LLVM_LIBRARY_DIR

export FLAGTREE_BACKEND=metax        # metax | hcu | ascend | ppu
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v

python -c "import triton; print('Triton:', triton.__version__)"
```

```bash
cd /workspace/FlagGems
git checkout v5.4.0
pip install --no-build-isolation -e .
python -c "import flag_gems; print(flag_gems.__version__)"
```

```{note}
平头哥 PPU 上 `/workspace` 是 OSS 对象存储 FUSE 挂载（`ossfs2`），无法就地写入 ELF（汇编器报 `file truncated`）。请在本地磁盘编译 FlagTree 与 FlagGems，并保留 `.git` 以便 `setuptools_scm` 解析版本号。
```

---

## 5. 算子选择

算子选择由任务级 YAML 中的三个模型参数控制：

| 参数 | 含义 | 示例 |
|------|------|------|
| `te_fl_prefer` | 所有算子的首选层级 | `flagos`、`vendor`、`reference` |
| `te_fl_per_op` | 逐算子覆盖，格式 `op=backend\|backend` | `rmsnorm_fwd=vendor:acme\|flagos;rope_fwd=flagos\|reference` |
| `te_fl_allow_vendors` / `te_fl_deny_vendors` | 厂商允许/拒绝列表 | `vendor_a` |

```yaml
model:
  transformer_impl: transformer_engine
  te_fl_prefer: flagos
  te_fl_per_op: "rmsnorm_fwd=vendor:acme|flagos;rope_fwd=flagos|reference"
  te_fl_allow_vendors: "vendor_a"
  te_fl_deny_vendors: "vendor_b"
  enable_flag_gems: True
  flag_gems_log_path: ${experiment.exp_name}
```

回退顺序为：首选后端 → 逐算子列表 → 默认厂商后端 → 唯一注册厂商 → Reference。

---

## 6. 运行训练测试

测试任务是一次由 FlagScale 驱动的 Qwen3 训练，Transformer 算子由 TransformerEngine-FL 提供。

```bash
cd /workspace/FlagScale
flagscale train qwen3 --config ./examples/qwen3/conf/train_te_fl.yaml
```

任务配置 `./examples/qwen3/conf/train/te_fl.yaml` 用于选择引擎：

```yaml
model:
  transformer_impl: transformer_engine
  te_fl_prefer: flagos
  enable_flag_gems: True
  distributed_backend: flagcx
```

在 `train_te_fl.yaml` 中设置当前平台的可见设备变量：

```yaml
experiment:
  envs:
    LOGLEVEL: "INFO"
    CUDA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"
    CUDA_DEVICE_MAX_CONNECTIONS: 1
    MACA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"   # 沐曦
```

| 平台 | 需设置的变量 |
|------|--------------|
| 沐曦 MetaX | `MACA_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"` |
| 海光 Hygon | `HIP_VISIBLE_DEVICES: "0,1,2,3,4,5,6,7"` |
| 昇腾 Ascend | `ASCEND_RT_VISIBLE_DEVICES: "0,1,2,3"` |
| 平头哥 PPU | `CUDA_VISIBLE_DEVICES: "8,9,10,11,12,13,14,15"` |

### 正常输出

平头哥 PPU 选择 FlagOS 层后的正常日志（`te_fl_prefer: flagos`、`enable_flag_gems: true`、`global_batch_size: 8`）：

```text
[default7]: [2026-09-14 15:08:27.273656] iteration       44/  102400 | consumed samples:          352 | elapsed time per iteration (ms): 6922.3 | throughput per GPU (TFLOP/s/GPU): 62.0 | learning rate: 1.289062E-04 | global batch size:     8 | lm loss: 6.457796E+00 | loss scale: 1.0 | grad norm: 4.096 | num zeros: 760881152.0 | params norm: 2241.466 | number of skipped iterations:   0 | number of nan iterations:   0 |
[default7]: [2026-09-14 15:08:34.201805] iteration       45/  102400 | consumed samples:          360 | elapsed time per iteration (ms): 6928.0 | throughput per GPU (TFLOP/s/GPU): 61.9 | learning rate: 1.318359E-04 | global batch size:     8 | lm loss: 6.415310E+00 | loss scale: 1.0 | grad norm: 4.814 | num zeros: 759052800.0 | params norm: 2241.458 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

沐曦平台使用厂商层的正常日志（未设置 `te_fl_prefer: flagos`，`global_batch_size: 32`）：

```text
[default7]: [2026-09-08 20:31:37.112485] iteration      561/ 7629408 | consumed samples:        17952 | elapsed time per iteration (ms): 1510.4 | throughput per GPU (TFLOP/s/GPU): 54.1 | learning rate: 3.000000E-03 | global batch size:    32 | lm loss: 4.858129E-02 | loss scale: 1.0 | grad norm: 0.027 | num zeros: 3.0 | params norm: 967.809 | number of skipped iterations:   0 | number of nan iterations:   0 |
```

停止训练：

```bash
flagscale train qwen3 --stop
```

---

## 7. 已知问题与规避方式

### 7.1 沐曦 MetaX

**选择 FlagOS 层后多卡训练失败** —— 沐曦后端的 C++ 绑定与 Triton 3.6.0 的 Python API 不兼容。`metax.passes.ttgpuir.add_accelerate_matmul()` 期望 C++ 的 `mlir::PassManager`，实际收到的是 Python 包装的 `triton._C.libtriton.ir.pass_manager`。

**设备不是 CUDA，却仍需设置 `CUDA_DEVICE_MAX_CONNECTIONS`** —— 只要启用多卡并行，训练引擎的参数校验就仍要求该变量。

### 7.2 海光 Hygon

**`AssertionError: Unknown c10d backend type FLAGCX`** —— 该平台未注册 FlagCX 后端。把分布式后端改回厂商集合通信库：

```yaml
system:
  distributed_backend: nccl
```

**`NotImplementedError: the derivative for 'chunk' is not implemented`** —— FlagGems 的 `chunk` 算子暂无反向实现。将其排除：

```yaml
model:
  flag_gems_unused: ["chunk", "conv3d", "mul", "mul_", "index_put", "index_put_", "_index_put_impl_", "baddbmm", "mm", "normal_", "sum_dim", "gather_backward", "index_add_", "slice_backward", "slice"]
```

**`FlagTune ManifestFetchError: FLAGTUNE_MANIFEST_URL is not configured`** —— 没有可用的 FlagTune 代价模型缓存。

**`ValueError: Invalid entry in hostfile`** —— `flag_gems_log_path` 指向 runner 的 hostfile 时，FlagGems 会将其覆盖。请把该参数指向专用日志文件。

### 7.3 昇腾 Ascend

**FlagGems attention 反向 kernel 报 `MLIRCompilationError: ub overflow`** —— attention 反向 kernel 所需的 unified buffer 超出 NPU 可用容量。可降低 `seq_length`（如 4096 → 1024），或改用原生 TransformerEngine 后端而不走 FlagOS 层。编译器默认开启多缓冲（`--enable-auto-multi-buffer=True`），会使需求翻倍；`num_stages=1` 可关闭。

**Python 3.10 环境** —— 镜像内为 Python 3.10，训练引擎的 `models/hybrid.py` 需要改用 `typing_extensions` 导入路径。

### 7.4 平头哥 PPU

**FlagTree 与 FlagGems 无法在 `/workspace` 编译** —— 见第 4 节说明。

**FlagCX 未启用** —— 该平台打开 FlagCX 会出问题，`distributed_backend` 请保持使用厂商集合通信库。

---

## 8. 注意事项

- 非 NVIDIA 平台务必加 `TE_FL_SKIP_CUDA=1`。
- `te_fl_prefer: flagos` 需先安装 FlagTree 与 FlagGems，否则分派会落到厂商层或 Reference 层。
- 单个算子失败时可用 `te_fl_per_op` 单独绕过，而不必放弃整个 FlagOS 层。
- 算子级 API 细节请参见[参考](../references/reference.md)页面。
