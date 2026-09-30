# 安装 FlagSparse

## 克隆并安装

```bash
git clone https://github.com/flagos-ai/FlagSparse.git
cd FlagSparse
pip install . --no-deps --no-build-isolation
```

使用 `--no-build-isolation` 可避免在离线时下载构建依赖。

## 安装运行时依赖

```bash
pip install torch triton cupy-cuda12x
```

## 验证安装

```python
import flagsparse
print(flagsparse.__version__)
```
