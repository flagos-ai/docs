# 安装 FlagDNN

## 安装构建依赖

```shell
pip install -U scikit-build-core>=0.11 pybind11 ninja cmake
```

## 克隆并安装 FlagDNN

```shell
git clone https://github.com/flagos-ai/FlagDNN.git
cd FlagDNN
pip install .
```

## 验证安装

安装完成后，验证 FlagDNN 是否可导入：

```python
import flag_dnn
print(flag_dnn.__version__)
```
