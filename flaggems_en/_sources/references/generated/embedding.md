---
orphan: true
---

# embedding

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 2.1 | **C++:** 4.0

## Description

Generate a simple lookup table that looks up embeddings in a fixed dictionary and size.
Note that the parameter sequence differs from `torch.nn.functional.embedding`.

## ATen Mapping

- `embedding`

## Labels

`aten`, `nn.functional`

## Source Code

- [src/flag_gems/ops/embedding.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/embedding.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_embedding.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_embedding.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_embedding.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_embedding.py)
