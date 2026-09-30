# 应用集成

FlagCX 与上层应用如 [PyTorch](https://pytorch.org/) 和 [PaddlePaddle](https://github.com/PaddlePaddle/) 集成。
下表列出了 FlagCX 支持的框架及其相关通信操作，其中 `batch_XXX` 和 `XXX_coalesced` 操作指的是使用组原语。

| Framework                        | PyTorch                      | PaddlePaddle |
| :------------------------------- | :--------------------------- | :----------- |
| send                             | ✓                            | ✓            |
| recv                             | ✓                            | ✓            |
| all_gather                       | ✓                            | ✓            |
| all_gather_into_tensor_coalesced | ✓ (按顺序，无聚合) | ☓            |
| all_reduce                       | ✓                            | ✓            |
| all_reduce_coalesced             | ✓ (按顺序，无聚合) | ☓            |
| all_to_all                       | ✓                            | ✓            |
| all_to_all_single                | ✓                            | ✓            |
| barrier                          | ✓                            | ✓            |
| batch_isend_irecv                | ✓                            | ✓            |
| broadcast                        | ✓                            | ✓            |
| gather                           | ✓                            | ✓            |
| reduce                           | ✓                            | ✓            |
| reduce_scatter                   | ✓                            | ✓            |
| reduce_scatter_tensor_coalesced  | ✓ (按顺序，无聚合) | ☓            |
| scatter                          | ✓                            | ✓            |

注意，PyTorch 支持通过 FlagCX Torch 插件启用，该插件提供与 PyTorch 分布式后端的原生集成。
该插件已在多种通信后端和硬件平台上进行了全面验证，
确保在多芯片异构环境中具有稳健的功能、一致的性能和兼容性。

| FlagCX Backend  | NCCL | IXCCL | CNCL | MCCL | XCCL | DUCCL | HCCL | MUSACCL | RCCL | TCCL | ECCL | PCCL |
| :-------------- | :--- | :---- | :--- | :--- | :--- | :---- | :--- | :------ | :--- | :--- | :--- | :--- |
| PyTorch Support | ✓    | ✓     | ✓    | ✓    | ✓    | ✓     | ✓    | ✓       | ✓    | ✓    | ✓    | ✓    |


```{tip}
要使用 PyTorch DDP FlagCX 后端启用异构跨芯片通信，
建议在所有节点上使用相同的 PyTorch 版本。
版本不匹配可能导致进程组设置期间初始化失败。
```