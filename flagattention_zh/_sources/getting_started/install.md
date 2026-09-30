# 安装 FlagAttention

## 克隆并安装

克隆仓库并使用 Triton 开发依赖安装 FlagAttention：

```sh
git clone https://github.com/flagos-ai/FlagAttention.git
cd FlagAttention
pip install -e ".[triton,test]"
```

如果环境中已经提供 Triton 或兼容的厂商分支，则不要安装 `triton` 额外依赖：

```sh
pip install -e ".[test]"
```

## 构建 wheel

打包使用 PEP 517 与 setuptools-scm，不提供 `setup.py`：

```sh
pip install -U build setuptools setuptools-scm
python -m build --no-isolation
pip install dist/flag_attn-*.whl
```

## 验证安装

```python
import flag_attn

print(flag_attn.__version__)
print(flag_attn.vendor_name)   # 例如 "nvidia"、"metax"、"enflame"
print(flag_attn.device)        # 例如 "cuda"、"gcu"、"npu"
```

设备探测使用当前可用的 PyTorch 设备和 Triton target，也可以在导入包之前通过环境变量覆盖：

```sh
FLAG_ATTN_BACKEND=metax python your_program.py
```
