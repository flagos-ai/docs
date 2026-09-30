# Operator Registry

The complete registry, including stages, tests and benchmark entry points, is maintained at [FlagAttention conf/operators.yaml](https://github.com/flagos-ai/FlagAttention/blob/main/conf/operators.yaml).

| Operator family | Public import | Main layout / use | Gradient support | Stage |
| --- | --- | --- | --- | --- |
| FlashAttention | `flag_attn.flash_attention` | Dense attention; `q: [B,Hq,M,D]`, `k/v: [B,Hkv,N,D]`; MQA/GQA, dropout, auxiliary outputs | Forward + backward | Stable |
| Piecewise Attention | `flag_attn.piecewise_attention` | Dense attention with two Q/K pairs selected by token distance | Forward + backward | Stable |
| Split-KV FlashAttention | `flag_attn.flash_attention_split_kv` | Long-KV decoding and low-query-parallelism workloads | Forward | Alpha |
| Paged Attention | `flag_attn.paged_attention` | Single-token queries over a paged KV cache | Forward | Alpha |
| MiniMax M3 sparse attention | Six `flag_attn.minimax_m3_*` functions | 128-token page scoring, top-k selection, sparse prefill and decode | Inference | Alpha |
| Chunk GLA | `flag_attn.chunk_gla` | Recurrent gated linear attention; `[B,T,H,D]`, fixed or packed variable lengths | Forward + backward | Alpha |
| Chunk Gated Delta Rule | `flag_attn.chunk_gated_delta_rule` | Chunked delta-rule recurrence; head-first or sequence-first | Forward | Alpha |
| GDN2 | `flag_attn.chunk_gdn2` | Chunked GDN2 prefill with native Triton/TLE and vendor paths | Forward / inference | Alpha |
| Kimi Delta Attention | `flag_attn.chunk_kda` | Specialized chunked KDA inference; constraints depend on the active backend | Inference | Alpha |
| SageAttention | `flag_attn.sage_attention.forward`, `per_block_int8` | Per-block INT8 Q/K quantization and attention; HND or NHD layout | Forward | Alpha |
| Parallel NSA | `flag_attn.parallel_nsa.parallel_nsa`, `parallel_nsa_compression` | Native sparse attention and compression; fixed or packed variable lengths | Forward + backward | Alpha |
