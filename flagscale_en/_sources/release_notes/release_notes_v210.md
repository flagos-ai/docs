# FlagScale v2.1.0 Release Notes

## Highlights

- **New model support** — training support for GLM5 and the Qwen36 LLM backbone (with checkpoint conversion), KERV training and inference integration, new Orca model features in qwen_gr00t, and TFLOPs reporting for DeepSeek-V4.
- **Multi-platform training** — native integration of the MegatronAdaptor FlagScale module on Ascend, plus a new Tsingmicro TXDA backend. Qwen3 training is validated end-to-end on the platforms listed below.
- **Observability** — performance monitor integration, straggler detection, low-overhead GPU progress heartbeat monitoring, and profiler kernel reports.
- **Training engine upgrade** — upgraded to Megatron v0.18.2 with the new Override mechanism.

## Multi-platform validation

Validated end-to-end together with Megatron-LM-FL v0.3.0 and TransformerEngine-FL v0.3.0:

| Platform | FlagTree backend | Visible-devices env | Verified |
|----------|------------------|---------------------|----------|
| MetaX | `metax` | `MACA_VISIBLE_DEVICES` | Qwen3 training, 8 cards |
| Hygon | `hcu` | `HIP_VISIBLE_DEVICES` | Qwen3 training, single node |
| Ascend | `ascend` | `ASCEND_RT_VISIBLE_DEVICES` | Qwen3 training, single card and multi-card |
| T-Head PPU | `ppu` | `CUDA_VISIBLE_DEVICES` | Qwen3 training, 8 cards, FlagOS operator stack enabled |

For the step-by-step procedure, see [Multi-Platform Training and Testing](../getting_started/multi-platform-training.md).
