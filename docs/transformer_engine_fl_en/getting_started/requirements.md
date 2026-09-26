# Requirements

## Supported hardwares

| Vendor | Description |
|--------|-------------|
| Hygon | DCU accelerator support with full op registration |
| METAX | GPU support with attention backend and flash attention |
| KunlunXin | Baidu Kunlun chip support with flash attention |
| Iluvatar | Iluvatar Corex GPU support with full op set |
| MUSA | Moore Threads S-series GPU support |
| NPU | Ascend NPU support, requires `transformer_engine_npu` |
| ENFLAME | ENFLAME chip vendor support with flash attention and operator registration |
| Tsingmicro | Tsingmicro TXDA support |

Training with TransformerEngine-FL has been validated end to end on MetaX, Hygon, Ascend, and T-Head PPU. See [Multi-Platform Build and Testing](../user_guide/multi-platform-testing.md) for the build flags and the procedure.

## Operating system

Linux (official), WSL2 (limited support)

## Software

- CUDA: 12.1+ (Hopper/Ada/Ampere), 12.8+ (Blackwell) with compatible NVIDIA drivers
- cuDNN: 9.3+
- Compiler: GCC 9+ or Clang 10+ with C++17 support
- Python: 3.12 recommended

## Source Build Requirements

- CMake 3.18+
- Ninja
- Git 2.17+
- pybind11 2.6.0+
