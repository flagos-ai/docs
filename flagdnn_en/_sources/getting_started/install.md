# Install FlagDNN

## Install Build Dependencies

```shell
pip install -U scikit-build-core>=0.11 pybind11 ninja cmake
```

## Clone and Install FlagDNN

```shell
git clone https://github.com/flagos-ai/FlagDNN.git
cd FlagDNN
pip install .
```

## Verify Installation

After installation, verify that FlagDNN is importable:

```python
import flag_dnn
print(flag_dnn.__version__)
```
