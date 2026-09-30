# FlagDNN Overview

FlagDNN is part of [FlagOS](https://flagos.io/). FlagDNN is a deep neural network computing library oriented towards multiple chip backends. It provides high-performance implementations of common deep learning operators, supporting efficient computation in fields such as deep learning, computer vision, natural language processing, and artificial intelligence.

FlagDNN is a high-performance deep learning operator library implemented using the [Triton programming language](https://github.com/openai/triton) launched by OpenAI.

## Features

- **Deep performance tuning** -- All operators have undergone extensive optimization for throughput and latency across supported backends.
- **Triton kernel call optimization** -- Kernel launch patterns are tuned to minimize overhead and maximize hardware utilization.
- **Flexible multi-backend support** -- A pluggable backend mechanism allows FlagDNN to target different chip vendors through a unified API.
- **Common deep learning operators** -- Includes implementations of widely-used operators such as ReLU, with more operators planned.

## Architecture

FlagDNN follows a layered architecture:

1. **Python API layer** -- User-facing interface (`flag_dnn.ops.*`) that integrates with PyTorch tensors.
2. **Triton kernel layer** -- Chip-agnostic kernel implementations written in Triton.
3. **Backend dispatch layer** -- Routes kernel execution to the appropriate hardware-specific runtime.

## Workflow

1. Install FlagDNN and its build dependencies.
2. Import `flag_dnn` in your Python code alongside PyTorch.
3. Call operators (e.g., `flag_dnn.ops.relu(x)`) on CUDA tensors.
4. FlagDNN dispatches the optimized Triton kernel to the active backend.
