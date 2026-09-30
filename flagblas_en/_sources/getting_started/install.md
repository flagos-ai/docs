# Install FlagBLAS

## Install Build Dependencies

```shell
pip install -U scikit-build-core>=0.11 pybind11 ninja cmake
```

## Clone and Install FlagBLAS

```shell
git clone https://github.com/flagos-ai/FlagBLAS.git
cd FlagBLAS
pip install .
```

## Verify Installation

```python
import flag_blas
print(flag_blas.__version__)
```
