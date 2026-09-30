# FlagScale Overview

FlagScale is a core component of [FlagOS](https://flagos.io/) — a unified, open-source AI system software stack that fosters an open technology ecosystem by seamlessly integrating various models, systems, and chips. Following the principle of "develop once, migrate across various chips", FlagOS aims to unlock the full computational potential of hardware, break down barriers between different chip software stacks, and effectively reduce migration costs.

As the central toolkit of this ecosystem, FlagScale provides a unified interface covering the complete lifecycle of large language models, multimodal models, and embodied AI models. It integrates multiple open-source backend engines under a single configuration and CLI interface, supporting key workflows including model training, reinforcement learning, and inference — with consistent operation across diverse chip vendors.

Within the FlagOS ecosystem, FlagScale works together with several other components:

- FlagOS Plugins – hardware-adapted integrations of upstream AI frameworks

- [FlagCX](https://docs.flagos.io/projects/FlagCX/en/latest/) – a scalable and adaptive cross-chip communication library

- [FlagOS-Robo](https://github.com/flagos-ai/FlagOS-Robo) – infrastructure for embodied AI workloads

FlagOS plugin projects are built on top of widely used upstream open-source frameworks and extend them to support multiple AI chips. These plugins provide hardware compatibility and runtime integration for training, reinforcement learning, and inference.

The following table lists the mapping between FlagOS plugins and their corresponding upstream projects.

| Task                    | FlagOS Plugin Projects                     | Upstream Projects             |
|-------------------------|--------------------------------------------|-------------------------------|
| Training                | [Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL)<br>[TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL) | [Megatron-LM](https://github.com/NVIDIA/Megatron-LM)<br>[TransformerEngine](https://github.com/NVIDIA/TransformerEngine) |
| Reinforcement Learning  | [VeRL-FL](https://github.com/flagos-ai/verl-FL)                                  | [veRL](https://github.com/verl-project/verl)                        |
| Serve / Inference       | [vllm-plugin-FL](https://github.com/flagos-ai/vllm-plugin-FL)                           | [vllm](https://github.com/vllm-project/vllm)                        |


```{toctree}

features.md
workflow.md

```
