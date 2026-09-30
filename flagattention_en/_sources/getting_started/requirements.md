# Requirements

### Hardware

- An accelerator supported by the runtime in use. Attention kernels require a GPU or AI accelerator; CPU-only hosts can inspect package metadata but cannot run the kernels.

### Software

- Python 3.10 or later
- A PyTorch build for the target accelerator
- Triton 2.2 or later, or a vendor runtime that provides compatible Triton APIs
- PyYAML and pytest (loaded during package initialization)

PyTorch and the accelerator runtime are intentionally not hard dependencies, because the correct packages depend on the device and driver stack. Install them before FlagAttention.
