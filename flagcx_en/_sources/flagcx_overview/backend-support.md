# Backend support

The following table summarizes the currently supported communication backends and their corresponding capabilities.

| Backend       | NCCL        | IXCCL       | CNCL        | MCCL        | XCCL        | DUCCL       | HCCL        | MUSACCL     | RCCL        | TCCL        | ECCL        |
|:--------------|:------------|:------------|:------------|:------------|:------------|:------------|:------------|:------------|:------------|:------------|:------------|
| Mode          | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero | Homo/Hetero |
| send          | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| recv          | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| broadcast     | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| gather        | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ☓/☓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| scatter       | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| reduce        | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| allreduce     | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| allgather     | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| reducescatter | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| alltoall      | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| alltoallv     | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |
| group ops     | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/☓         | ✓/✓         | ✓/✓         | ✓/✓         | ✓/✓         |

Note that *Homo* and *Hetero* modes refer to communications among homogeneous and heterogeneous clusters.
All native collective communications libraries can be referenced through the links below (in alphabetic order):

- [CNCL](https://www.cambricon.com/docs/sdk_1.7.0/cncl_1.2.1/user_guide/index.html#), Cambricon Communications Library.
- [DUCCL](https://developer.sourcefind.cn), DU Collective Communications Library.
- [ECCL](https://www.enflame-tech.com), Enflame Collective Communications Library.
- [HCCL](https://www.hiascend.com/document/detail/zh/CANNCommunityEdition/82RC1alpha003/hccl/hcclug/hcclug_000001.html), Ascend Communications Library.
- [IXCCL](https://www.iluvatar.com/software?fullCode=cpjs-rj-rjz), Iluvatar Corex Collective Communications Library.
- [MCCL](https://developer.metax-tech.com/softnova/metax), Metax Collective Communications Library.
- [MUSACCL](https://docs.mthreads.com/musa-sdk/musa-sdk-doc-online/programming_guide/Chapter08/), Musa Collective Communications Library.
- [NCCL](https://github.com/NVIDIA/nccl), NVIDIA Collective Communications Library.
- [RCCL](https://github.com/ROCm/rccl), ROCm Communication Collectives Library.
- [TCCL](http://www.tsingmicro.com), TsingMicro Communication Collectives Library.
- [XCCL](WIP), Kunlunxin XPU Collective Communications Library.

Additionally, FlagCX supports three collective communication libraries for host-side communication:

- BOOTSTRAP: Host-side communication library built using the FlagCX `bootstrap` component.
- [GLOO](https://github.com/facebookincubator/gloo): Gloo Collective Communications Library.
- [MPI](https://www.mpich.org): Message Passing Interface (MPI) standard.
