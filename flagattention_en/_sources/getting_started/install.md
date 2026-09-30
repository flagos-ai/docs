# Install FlagAttention

## Clone and Install

Clone the repository and install FlagAttention with the Triton development extra:

```sh
git clone https://github.com/flagos-ai/FlagAttention.git
cd FlagAttention
pip install -e ".[triton,test]"
```

If the environment already supplies Triton or a compatible vendor fork, do not install the `triton` extra:

```sh
pip install -e ".[test]"
```

## Build a Wheel

Packaging uses PEP 517 and setuptools-scm; there is no `setup.py`:

```sh
pip install -U build setuptools setuptools-scm
python -m build --no-isolation
pip install dist/flag_attn-*.whl
```

## Verify the Installation

```python
import flag_attn

print(flag_attn.__version__)
print(flag_attn.vendor_name)   # for example: "nvidia", "metax", "enflame"
print(flag_attn.device)        # for example: "cuda", "gcu", "npu"
```

Device detection uses the available PyTorch device and Triton target. It can be overridden before importing the package:

```sh
FLAG_ATTN_BACKEND=metax python your_program.py
```
