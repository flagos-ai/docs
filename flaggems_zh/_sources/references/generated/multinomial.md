---
orphan: true
---

# multinomial

**Kind:** Distribution | **Stage:** stable | **Since:** 2.1

## Description

Returns a tensor where each row contains `num_samples` indices sampled
from the multinomial probability distribution located in the corresponding row
of tensor `input`.

## ATen Mapping

- `multinomial`

## Labels

`aten`, `skip_precision_check`

## Source Code

- [src/flag_gems/ops/multinomial.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/multinomial.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_multinomial.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_multinomial.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_multinomial.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_multinomial.py)
