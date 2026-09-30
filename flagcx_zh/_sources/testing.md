# 测试

## 性能测试

性能测试位于 `test/perf/`，按 API 级别组织：

- **Host API 测试** (`test/perf/host_api/`) — 通过 FlagCX host API 进行高层集合操作
- **Device API 测试** (`test/perf/device_api/`) — 通过 FlagCX Device API 进行低层设备内核基准测试

### Host API 性能测试

```shell
cd test/perf/host_api
make [USE_NVIDIA | USE_ILUVATAR | USE_CAMBRICON | USE_METAX | USE_MUSA | USE_KUNLUNXIN | USE_DU | USE_ASCEND | USE_AMD | USE_TSM | USE_ENFLAME | USE_SUNRISE]=1
mpirun --allow-run-as-root -np 8 ./test_allreduce -b 128K -e 4G -f 2
```

注意，默认 MPI 安装路径设置为 `/usr/local/mpi`，您可以通过以下方式指定 MPI 路径：

```shell
make MPI_HOME=<MPI 路径>
```

所有测试支持相同的参数集：

- 大小扫描

  * `-b <min>` 起始最小大小（字节）。默认：1M。
  * `-e <max>` 结束最大大小（字节）。默认：1G。
  * `-f <增量因子>` 大小之间的乘法因子。默认：2。

- 性能参数

  * `-w, <预热迭代次数>` 预热迭代次数（不计入计时）。默认：5。
  * `-n, <迭代次数>` 迭代次数。默认：20。

- 测试操作

  * `-R, <0/1/2>` 在发送/接收缓冲区上启用本地缓冲区注册。默认：0。
  * `-s, <OCT/DEC/HEX>` 指定 MPI 通信拆分模式。默认：0

- 工具参数

  * `-p, <0/1>` 打印缓冲区信息。默认：0。
  * `-h` 打印帮助信息。默认：禁用。

## Device API 测试

Device API 测试组织在两个目录中：

### 性能测试 (`test/perf/device_api/`)

| 二进制文件 | 测试内容 |
|---|---|
| `perf_allreduce_intranode` | 通过 Device API 进行节点内 AllReduce |
| `perf_internode_twosided` | 节点间双边 AlltoAll（基于 FIFO） |
| `perf_internode_onesided` | 节点间单边 AlltoAll（put+signal+wait） |

### 正确性测试 (`test/unittest/device_api/`)

| 二进制文件 | 测试内容 |
|---|---|
| `test_device_api` | 单边 Device API 内核的正确性测试套件 |
| `test_device_api_intra` | 节点内 Device API 正确性测试 |
| `test_device_api_inter` | 节点间 Device API 正确性测试 |
| `test_device_ir_intra` | 节点内 Scalar IR 正确性测试 |
| `test_device_ir_inter` | 节点间 Scalar IR 正确性测试 |
| `test_device_ir_unified_intra` | 节点内 Unified IR 正确性测试 |
| `test_device_ir_unified_inter` | 节点间 Unified IR 正确性测试 |

构建：

```shell
# FlagCX 必须使用 COMPILE_KERNEL=1 构建（从项目根目录）
make USE_NVIDIA=1 COMPILE_KERNEL=1 -j$(nproc)

cd test/perf/device_api
make USE_NVIDIA=1
```

支持 `MPI_HOME=<path>`。

运行示例：

```shell
# 节点内 AllReduce（单节点，8 GPU）
mpirun --allow-run-as-root -np 8 -x FLAGCX_USE_HETERO_COMM=1 -x FLAGCX_MEM_ENABLE=1 ./perf_allreduce_intranode -b 1M -e 64M -f 2

# 节点间双边 AlltoAll（多节点）
mpirun --allow-run-as-root -np 16 -x FLAGCX_USE_HETERO_COMM=1 -x FLAGCX_MEM_ENABLE=1 ./perf_internode_twosided -b 1M -e 64M -f 2 -R 1

# 节点间单边 AlltoAll（需要 -R 1 或 -R 2）
mpirun --allow-run-as-root -np 16 -x FLAGCX_USE_HETERO_COMM=1 -x FLAGCX_MEM_ENABLE=1 ./perf_internode_onesided -b 1M -e 64M -f 2 -R 2

# Device API 正确性测试（需要 -R 1 或 -R 2）
mpirun --allow-run-as-root -np 8 -x FLAGCX_USE_HETERO_COMM=1 -x FLAGCX_MEM_ENABLE=1 ./test_device_api -b 1M -e 4M -f 2 -R 2
```

参数与性能测试相同（`-b`、`-e`、`-f`、`-w`、`-n`、`-R`、`-p`、`-s`）。

注册模式（`-R`）：

- `-R 0`：原始设备内存（默认）。无显式注册。
- `-R 1`：IPC 模式 — `flagcxMemAlloc` + `flagcxCommRegister`。
- `-R 2`：窗口模式 — `flagcxMemAlloc` + `flagcxCommWindowRegister`。

单边测试（`test_internode_onesided`、`test_device_api`）需要 `-R 1` 或 `-R 2`。
