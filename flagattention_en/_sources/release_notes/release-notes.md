# FlagAttention Release Notes

## v0.4.0

- **Added Features**

  - Recurrent and linear attention operators: Chunk GLA, Chunk Gated Delta Rule, GDN2 and Kimi Delta Attention.
  - MiniMax M3 sparse attention, SageAttention (per-block INT8 Q/K quantization) and Parallel NSA (native sparse attention and compression).
  - Device detection with per-operator routing to vendor backends — NVIDIA, AMD, Hygon, Iluvatar, MetaX, Enflame, Ascend, Cambricon, Moore Threads, Intel and CPU — plus the `FLAG_ATTN_BACKEND` override.
  - Operator inventory (`conf/operators.yaml`) and a multi-device test scheduler with FlagGems-compatible JSON recording.

- **Enhanced Features**

  - Dense attention occupancy handling and auxiliary outputs.

## v0.3.0

- **Added Features**

  - Split-KV flash decoding for long KV sequences, and paged attention for paged KV caches.
  - FlashAttention extended with MQA/GQA, dropout and auxiliary outputs.
  - Device metadata exposed by the package (`vendor_name`, `device`, `backend_info`).

- **Enhanced Features**

  - Piecewise Attention rewritten with the same tiled online-softmax strategy as FlashAttention.

## v0.2.0

- **Enhanced Features**

  - Attention mask applied only when needed.
  - A separate kernel computes the query gradient instead of atomic read-modify-write to global memory.

## v0.1.0

Initial release of FlagAttention.

- **Added Features**

  - FlashAttention and Piecewise Attention operators implemented in Triton.
