# Tests

## Performance Test

Performance tests are maintained in `test/perf/`, organized by API level:

- **Host API tests** (`test/perf/host_api/`) — high-level collective operations via FlagCX host API
- **Device API tests** (`test/perf/device_api/`) — low-level device kernel benchmarks via FlagCX Device API

### Host API Performance Test

```shell
cd test/perf/host_api
make [USE_NVIDIA | USE_ILUVATAR | USE_CAMBRICON | USE_METAX | USE_MUSA | USE_KUNLUNXIN | USE_DU | USE_ASCEND | USE_AMD | USE_TSM | USE_ENFLAME | USE_SUNRISE]=1
mpirun --allow-run-as-root -np 8 ./test_allreduce -b 128K -e 4G -f 2
```

Note that the default MPI install path is set to `/usr/local/mpi`, you may specify the MPI path with:

```shell
make MPI_HOME=<MPI path>
```

All tests support the same set of arguments:

- Sizes to scan

  * `-b <min>` minimum size in bytes to start with. Default: 1M.
  * `-e <max>` maximum size in bytes to end at. Default: 1G.
  * `-f <increment factor>` multiplication factor between sizes. Default: 2.

- Performance

  * `-w, <warmup iterations >` number of warmup iterations (not timed). Default: 5.
  * `-n, <iterations >` number of iterations. Default: 20.

- Test operation

  * `-R, <0/1/2>` enable local buffer registration on send/recv buffers. Default: 0.
  * `-s, <OCT/DEC/HEX>` specify MPI communication split mode. Default: 0

- Utils

  * `-p, <0/1>` print buffer info. Default: 0.
  * `-h` print help message. Default: disabled.

## Device API Test

Device API tests are organized in two directories:

### Performance Tests (`test/perf/device_api/`)

| Binary | What it tests |
|---|---|
| `perf_allreduce_intranode` | Intra-node AllReduce via Device API |
| `perf_internode_twosided` | Inter-node two-sided AlltoAll (FIFO-based) |
| `perf_internode_onesided` | Inter-node one-sided AlltoAll (put+signal+wait) |

### Correctness Tests (`test/unittest/device_api/`)

| Binary | What it tests |
|---|---|
| `test_device_api` | Correctness suite for one-sided Device API kernels |
| `test_device_api_intra` | Intra-node Device API correctness |
| `test_device_api_inter` | Inter-node Device API correctness |
| `test_device_ir_intra` | Intra-node Scalar IR correctness |
| `test_device_ir_inter` | Inter-node Scalar IR correctness |
| `test_device_ir_unified_intra` | Intra-node Unified IR correctness |
| `test_device_ir_unified_inter` | Inter-node Unified IR correctness |

Build:

```shell
# FlagCX must be built with COMPILE_KERNEL=1 (from project root)
make USE_NVIDIA=1 COMPILE_KERNEL=1 -j$(nproc)

cd test/perf/device_api
make USE_NVIDIA=1
```

Supports `MPI_HOME=<path>`.

Run examples:

```shell
# Intra-node AllReduce (single node, 8 GPUs)
mpirun --allow-run-as-root -np 8 -x FLAGCX_USE_HETERO_COMM=1 -x FLAGCX_MEM_ENABLE=1 ./perf_allreduce_intranode -b 1M -e 64M -f 2

# Inter-node two-sided AlltoAll (multi-node)
mpirun --allow-run-as-root -np 16 -x FLAGCX_USE_HETERO_COMM=1 -x FLAGCX_MEM_ENABLE=1 ./perf_internode_twosided -b 1M -e 64M -f 2 -R 1

# Inter-node one-sided AlltoAll (requires -R 1 or -R 2)
mpirun --allow-run-as-root -np 16 -x FLAGCX_USE_HETERO_COMM=1 -x FLAGCX_MEM_ENABLE=1 ./perf_internode_onesided -b 1M -e 64M -f 2 -R 2

# Device API correctness test (requires -R 1 or -R 2)
mpirun --allow-run-as-root -np 8 -x FLAGCX_USE_HETERO_COMM=1 -x FLAGCX_MEM_ENABLE=1 ./test_device_api -b 1M -e 4M -f 2 -R 2
```

Arguments are the same as Performance Test (`-b`, `-e`, `-f`, `-w`, `-n`, `-R`, `-p`, `-s`).

Registration modes (`-R`):

- `-R 0`: Raw device memory (default). No explicit registration.
- `-R 1`: IPC mode — `flagcxMemAlloc` + `flagcxCommRegister`.
- `-R 2`: Window mode — `flagcxMemAlloc` + `flagcxCommWindowRegister`.

One-sided tests (`test_internode_onesided`, `test_device_api`) require `-R 1` or `-R 2`.
