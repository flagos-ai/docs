# 后端支持

下表总结了当前支持的通信后端及其对应的功能。

| Backend       | NCCL        | IXCCL       | CNCL        | MCCL        | XCCL        | DUCCL       | HCCL        | MUSACCL     | RCCL        | TCCL        | ECCL        | PCCL        |
|:--------------|:------------|:------------|:------------|:------------|:------------|:------------|:------------|:------------|:------------|:------------|:------------|:------------|
| Mode          | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero |
| send          | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| recv          | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| broadcast     | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| gather        | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ☓/☓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ☓/☓         |
| scatter       | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ☓/☓         |
| reduce        | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| allreduce     | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| allgather     | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| reducescatter | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| alltoall      | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ☓/☓         |
| alltoallv     | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ☓/☓         |
| group ops     | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |

注意 *Homo* 和 *Hetero* 模式分别指同构集群和异构集群之间的通信。
所有原生集合通信库可通过以下链接查看（按字母顺序排列）：

- [CNCL](https://www.cambricon.com/docs/sdk_1.7.0/cncl_1.2.1/user_guide/index.html#)，寒武纪通信库。
- [DUCCL](https://developer.sourcefind.cn)，DU 集合通信库。
- [ECCL](https://www.enflame-tech.com)，燧原集合通信库。
- [HCCL](https://www.hiascend.com/document/detail/zh/CANNCommunityEdition/82RC1alpha003/hccl/hcclug/hcclug_000001.html)，昇腾通信库。
- [IXCCL](https://www.iluvatar.com/software?fullCode=cpjs-rj-rjz)，天数智芯 Corex 集合通信库。
- [MCCL](https://developer.metax-tech.com/softnova/metax)，MetaX 集合通信库。
- [MUSACCL](https://docs.mthreads.com/musa-sdk/musa-sdk-doc-online/programming_guide/Chapter08/)，摩尔线程集合通信库。
- [NCCL](https://github.com/NVIDIA/nccl)，NVIDIA 集合通信库。
- [PCCL](https://www.sunrise-ai.com/)，Sunrise 集合通信库。
- [RCCL](https://github.com/ROCm/rccl)，ROCm 集合通信库。
- [TCCL](http://www.tsingmicro.com)，清微智能集合通信库。
- [XCCL](WIP)，昆仑芯 XPU 集合通信库。

此外，FlagCX 支持三种用于主机端通信的集合通信库：

- BOOTSTRAP：使用 FlagCX `bootstrap` 组件构建的主机端通信库。
- [GLOO](https://github.com/facebookincubator/gloo)：Gloo 集合通信库。
- [MPI](https://www.mpich.org)：消息传递接口（MPI）标准。
