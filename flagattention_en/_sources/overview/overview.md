# FlagAttention Overview

FlagAttention is part of [FlagOS](https://flagos.io/). It is a collection of memory-efficient attention operators implemented in the [Triton language](https://github.com/triton-lang/triton), targeting model training and inference workloads that need custom attention-score transformations, paged or sparse KV-cache layouts, or recurrent linear-attention kernels.

Like [FlashAttention](https://arxiv.org/abs/2205.14135), the dense kernels tile the computation and recompute intermediates instead of materializing the full attention matrix. The repository also contains decoding, block-sparse, quantized, and recurrent operators that do not fit the standard scaled-dot-product-attention interface.

```{note}
Operator families are at different maturity levels. Only FlashAttention and Piecewise Attention are currently marked `stable`; the remaining families are `alpha`.
```

## Features

- **Dense attention** — FlashAttention with MQA/GQA, dropout and auxiliary outputs, and Piecewise Attention that selects between two Q/K pairs by token distance.
- **Inference and sparse attention** — Split-KV, paged KV-cache attention, MiniMax M3 sparse attention and SageAttention with per-block INT8 Q/K quantization.
- **Recurrent linear attention** — Chunk GLA, Chunk Gated Delta Rule, GDN2 and Kimi Delta Attention.
- **Vendor backends** — Device recognition and per-operator routing for NVIDIA, AMD, Hygon, Iluvatar, MetaX, Enflame, Ascend, Cambricon, Moore Threads, Intel and CPU, with an environment-variable override.
- **Operator inventory** — Every operator family carries its public import, stage, tests and benchmark entry point in `conf/operators.yaml`.
- **Test and benchmark tooling** — A multi-device test scheduler, FlagGems-compatible JSON recording, and benchmark entry points per operator.

## Architecture

```text
FlagAttention
├── src/flag_attn/
│   ├── flash.py, piecewise.py, split_kv.py, paged.py
│   ├── minimax_sparse_attention/   # MiniMax M3 index + sparse attention
│   ├── sage_attention/             # INT8 Q/K quantization + attention
│   ├── parallel_nsa/               # NSA selection and compression
│   ├── FLA/                        # GLA, Gated Delta Rule, KDA helpers
│   ├── gdn2/                       # Generic GDN2 implementation
│   ├── runtime/backend/            # Device detection and vendor backends
│   └── testing/                    # PyTorch reference implementations
├── tests/                          # Accuracy and dispatch tests
├── benchmark/                      # Performance entry points
├── examples/                       # Small usage programs
├── conf/operators.yaml             # Operator stage/test/benchmark inventory
├── tools/run_tests.py              # Multi-device test scheduler
└── packaging/                      # Debian/RPM packaging
```

Device metadata follows the FlagGems/FlagGems-vLLM convention, and the top-level package exports the dense, paged, recurrent, KDA/GDN2 and MiniMax APIs. SageAttention and Parallel NSA are submodule APIs. Vendor-specific development interfaces live under `flag_attn.runtime.backend._<vendor>` and are not treated as stable public APIs.

## Workflow

1. Install FlagAttention against the PyTorch build for your accelerator.
2. Import the operator you need, for example `from flag_attn import flash_attention`.
3. Run the operator on tensors of the layout the operator family expects; the runtime routes it to the detected vendor backend.
4. Validate accuracy against the PyTorch reference implementations exposed as `flag_attn.testing`, and measure performance with the benchmark entry points.
