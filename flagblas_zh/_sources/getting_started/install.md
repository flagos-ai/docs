# 安装 FlagBLAS

## 安装构建依赖

```shell
pip install -U scikit-build-core>=0.11 pybind11 ninja cmake
```

## 克隆并安装 FlagBLAS

```shell
git clone https://github.com/flagos-ai/FlagBLAS.git
cd FlagBLAS
pip install .
```

## 验证安装

```python
import flag_blas
print(flag_blas.__version__)
```
