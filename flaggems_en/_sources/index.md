# FlagGems Overview

[![GitHub](https://img.shields.io/badge/GitHub-flagos--ai/FlagGems-blue)](https://github.com/flagos-ai/FlagGems)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](https://github.com/flagos-ai/FlagGems/blob/master/LICENSE)

## About FlagGems

*FlagGems* is a high-performance general operator library implemented in the [Triton](https://github.com/openai/triton) language. It aims to provide a suite of kernel functions to accelerate LLM training and inference.

By registering with the ATen backend of PyTorch, *FlagGems* facilitates a seamless transition, allowing users to switch to the Triton function library without the need to modify their model code.

FlagGems is supported by the OpenAI Triton compiler (for NVIDIA and AMD) and [FlagTree compiler](https://github.com/flagos-ai/flagtree/) for different AI hardware platforms. Users can continue to use the ATen backend as usual while enjoying significant performance enhancement. The Triton language offers benefits in readability, user-friendliness and performance comparable to CUDA. This convenience allows developers to engage in the development of *FlagGems* with minimal learning effort.

## Next Step

- Review [features highlighted](overview/features)
- Review [platforms supported](overview/platforms)
- [Getting started with FlagGems](getting-started/install)
- Check the project [changelog](references/changelog)
- Review the list of [operators supported](references/operators)

```{toctree}
:hidden:
:caption: Getting Started
:maxdepth: 2

getting-started/install
```

```{toctree}
:hidden:
:caption: Overview
:maxdepth: 2

overview/features
overview/platforms
overview/pointwise-dynamic
```

```{toctree}
:hidden:
:caption: Usage
:maxdepth: 2

usage/overview
usage/basic
usage/selective
usage/debugging
usage/experimental
usage/non-nvidia
usage/distributed
usage/frameworks
usage/modules
usage/tuning
usage/cpp
usage/precision
```

```{toctree}
:hidden:
:caption: Performance
:maxdepth: 2

performance/overview
performance/benchmark
performance/results
performance/database
```

```{toctree}
:hidden:
:caption: Testing
:maxdepth: 2

testing/unittest
testing/coverage
```

```{toctree}
:hidden:
:caption: References
:maxdepth: 2

references/operators
references/operators-search
references/changelog
references/experimental
references/project_structure
references/release
references/test/index
```

```{toctree}
:hidden:
:caption: Contribution
:maxdepth: 2

contribution/overview
contribution/backend
contribution/cpp-wrapper
```

## Supported Models

- Bert-base-uncased
- Llama-2-7b
- Llava-1.5-7b

## Contribution

If you are interested in contributing to the FlagGems project, please refer to the [contributing guide](contribution/overview) page. Any kind of contributions would be highly appreciated.

## Contact Us

If you have any questions about our project, please submit an issue, or contact us through <flaggems@baai.ac.cn>.

We also created WeChat group for FlagGems. Scan the QR code to join the group chat! To get the first hand message about our updates and new release, or having any questions or ideas, join us now!

```{raw} html
<img src="https://github.com/user-attachments/assets/69019a23-0550-44b1-ac42-e73f06cb55d6" alt="WeChat Group" width="200">
```
