---
orphan: true
---

# has_compatible_shallow_copy_type

**Kind:** Tensor | **Stage:** alpha | **Since:** 5.4

## Description

Metadata-only check that returns True when `self` can shallow-copy the
TensorImpl type of `from`. Compatibility is decided on the tensors'
DispatchKeySets: the sets are equal, or both are dense, both are sparse
COO, or both are sparse compressed. It is independent of dtype and shape,
and of device within a family, but opaque impls (meta, MKL-DNN, nested,
quantized) only match an identical key set even though some of them
report a strided layout.

## ATen Mapping

- `_has_compatible_shallow_copy_type`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/has_compatible_shallow_copy_type.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/has_compatible_shallow_copy_type.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_has_compatible_shallow_copy_type.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_has_compatible_shallow_copy_type.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_has_compatible_shallow_copy_type.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_has_compatible_shallow_copy_type.py)
