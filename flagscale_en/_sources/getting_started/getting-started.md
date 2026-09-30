# Getting Started

## Overview

FlagScale leverages [Hydra](https://github.com/facebookresearch/hydra) for configuration management. The configurations are organized into two levels: an outer experiment-level YAML file and an inner task-level YAML file.

- The experiment-level YAML file defines the experiment directory, backend engine, task type, and other related environmental configurations.

- The task-level YAML file specifies the model, dataset, and parameters for specific tasks such as training or inference.

All valid configurations in the task-level YAML file correspond to the arguments used in backend engines such as Megatron-LM and vllm, with hyphens (`-`) replaced by underscores (`_`). For a complete list of available configurations, please refer to the backend engine documentation. You can simply copy and modify the existing YAML files in the [examples](https://github.com/flagos-ai/FlagScale/tree/main/examples) folder to get started.

This section covers the requirements for installing and running FlagScale, guides you through installing FlagScale, and shows how to run training, inference, serving, and reinforcement learning tasks.

```{toctree}
:maxdepth: 2
  
requirements.md
install.md
user-guide.md
```
