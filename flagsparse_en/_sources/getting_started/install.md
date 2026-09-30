# Install FlagSparse

## Clone and Install

```bash
git clone https://github.com/flagos-ai/FlagSparse.git
cd FlagSparse
pip install . --no-deps --no-build-isolation
```

Use `--no-build-isolation` to avoid downloading build deps when offline.

## Install Runtime Dependencies

```bash
pip install torch triton cupy-cuda12x
```

## Verify Installation

```python
import flagsparse
print(flagsparse.__version__)
```
