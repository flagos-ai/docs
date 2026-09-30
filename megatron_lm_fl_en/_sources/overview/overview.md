# Megatron-LM-FL Overview

Megatron-LM-FL is a fork of [NVIDIA Megatron-LM](https://github.com/NVIDIA/Megatron-LM) that introduces a **plugin-based architecture** for supporting diverse AI chips, built on top of [FlagOS](https://github.com/flagos-ai), a unified open-source AI system software stack.

While upstream Megatron-LM is optimized exclusively for NVIDIA GPUs, Megatron-LM-FL extends it with a hardware abstraction layer that enables training on multiple platforms — including NVIDIA (CUDA), MetaX, Moore Threads (MUSA), TXDA (Tsingmicro), and NPU (Ascend) — with minimal code intrusion to the core library.
