# Use TLE-Raw

This section introduces how to use TLE-Raw. TLE-Raw is available on trition_3.6.x branch.

TLE Raw provides a low-level extension interface for Triton, allowing users to fill capability gaps and gain fine-grained control via third-party dialects and languages (for example, using CUDA for thread-level scheduling, synchronization, and memory access). Users can choose between portability and composable optimization (via MLIR dialect integration) and maximum fine-grained control (via CUDA  integration) based on the target hardware and toolchain maturity.

## Integrate MLIR dialect into LLVM for portability and composable optimization

The following is an example of MLIR (Multi-Level Intermediate Representation).

```{code-block} python
from typing_extensions import Literal as L

from mlir import ir
from mlir.dialects import arith, llvm, nvvm, scf
import torch
import triton
import triton.language as tl
from triton.experimental.tle.raw import dialect, Input
import triton.experimental.tle.language.raw as tle_raw

DEVICE = triton.runtime.driver.active.get_active_torch_device()

@dialect(name="mlir")
def vector_add_tile(
    output: Input[L["!llvm.ptr<1>"]],
    x: Input[L["!llvm.ptr<1>"]],
    y: Input[L["!llvm.ptr<1>"]],
    n_elements: Input[L["i32"]],
):
    tidx = nvvm.read_ptx_sreg_tid_x(ir.IntegerType.get_signless(32))
    bdimx = nvvm.read_ptx_sreg_ntid_x(ir.IntegerType.get_signless(32))
    gdimx = nvvm.read_ptx_sreg_nctaid_x(ir.IntegerType.get_signless(32))
    bidx = nvvm.read_ptx_sreg_ctaid_x(ir.IntegerType.get_signless(32))
    tidx = arith.index_cast(ir.IndexType.get(), tidx)
    bdimx = arith.index_cast(ir.IndexType.get(), bdimx)
    gdimx = arith.index_cast(ir.IndexType.get(), gdimx)
    bidx = arith.index_cast(ir.IndexType.get(), bidx)
    idx = arith.addi(arith.muli(bidx, bdimx), tidx)
    step = arith.muli(bdimx, gdimx)
    n_elements = arith.index_cast(ir.IndexType.get(), n_elements)
    for i in scf.for_(idx, n_elements, step):
        i = arith.index_cast(ir.IntegerType.get_signless(32), i)
        ptrty = ir.Type.parse("!llvm.ptr<1>")
        f32ty = ir.Type.parse("f32")
        xptr = llvm.getelementptr(ptrty, x, [i], [-2147483648], f32ty, 0)
        yptr = llvm.getelementptr(ptrty, y, [i], [-2147483648], f32ty, 0)
        xval = llvm.load(f32ty, xptr)
        yval = llvm.load(f32ty, yptr)
        outval = arith.addf(xval, yval)
        outptr = llvm.getelementptr(ptrty, output, [i], [-2147483648], f32ty, 0)
        llvm.store(outval, outptr)
        scf.yield_([])

@triton.jit
def add_kernel(
    x_ptr,
    y_ptr,
    output_ptr,
    n_elements,
    BLOCK_SIZE: tl.constexpr,
):
    tle_raw.call(vector_add_tile, [output_ptr, x_ptr, y_ptr, n_elements])

def add(x: torch.Tensor, y: torch.Tensor):
    output = torch.empty_like(x)
    assert x.device == DEVICE and y.device == DEVICE and output.device == DEVICE
    n_elements = output.numel()
    grid = lambda meta: (triton.cdiv(n_elements, meta["BLOCK_SIZE"]), )
    add_kernel[grid](x, y, output, n_elements, BLOCK_SIZE=1024)
    return output

if __name__ == "__main__":
    x = torch.randn(2048, device=DEVICE)
    y = torch.randn(2048, device=DEVICE)
    z = add(x, y)
    assert torch.allclose(x + y, z), (x + y, z)
```

TLE-raw consists of the following parts:

- Dialect declaration (decorator)
  - Decorator: @tle.raw.language(name="mlir")
  - Explanation: This decorator marks the function vector_add_tile as a block of code written directly in the MLIR dialect. It tells the compiler, specifically through the FlagTree EDSL (Embedded Domain Specific Language), that the body of this function should be interpreted and lowered using MLIR operations (such as nvvm, arith, and tensor), rather than standard Python or Triton operations.
- Function implementation
  - Function: vector_add_tile(...)
  - Explanation: This is the actual implementation of the computation kernel written using low-level MLIR Python bindings. It defines the specific operations (thread indexing, memory loading, floating-point addition, and memory storing) that will be executed by the hardware. 
- Function call
  - Invocation: tle_raw.call(vector_add_tile, args=[x, y, output])
  - Explanation: This line invokes the declared MLIR function (vector_add_tile) from within the high-level Triton kernel (add_kernel). It passes the input tensors x, y, and the output buffer. Crucially, it provides hardware mapping hints (defining the number of threads) and memory layout specifications (defining the tensors as residing in "shared" memory with a specific order). This allows the compiler to bridge the gap between the high-level tl.load/tl.store operations and the low-level MLIR IR generation.

## Integrate CUDA into LLVM for maximum fine-grained control

This section only covers how to integrate CUDA kernel into LLVM inline path. Integrating other vendors into LLVM inline path can follow similar steps.

TLE-Raw supports CUDA kernel integration via the LLVM inline path. Vendors integrating TLE-Raw on the CUDA side should evaluate:

- Whether clang can generate LLVM IR and serialize it as text
- Whether TTGIR-related pass operations can be reused or adapted


### LLVM route

Basic flow: use clang to translate CUDA code into LLVM IR, then apply the existing LLVM inline pass.

![alt text](../assets/images/cuda-to-vllm-line-pass.png)

### Usage example

- Reference: `python/tutorials/tle/raw/cuda/01-vector-add.py`

- Triton side: provide the CUDA file path and function declaration. Other vendors could register your own language name as the value of the `name` parameter.
 ![alt text](../assets/images/triton-side.png)


- CUDA side: implement the CUDA kernel. LLVM struct parameter declarations are still retained (because subsequent inlining requires handling the Triton ptr-to-LLVM conversion, which is currently left to the user for one-to-one mapping). Other vendors should customize the mapping based on your own language. 

 ![alt text](../assets/images/cuda-side.PNG)


### Multi-GPU communication with NVSHMEM

NVSHMEM is NVIDIA's PGAS (Partitioned Global Address Space) communication library for multi-GPU and multi-node programs. It gives every rank a unified address space: a region of memory on each GPU (symmetric memory) is reachable both from the local GPU and directly from other GPUs, so cross-GPU communication can be expressed with ordinary load/store or put/get semantics instead of hand-written point-to-point send/receive logic. It provides both host-side and device-side APIs, and the device-side interfaces can be called from inside a kernel, which makes it a natural fit for all-gather, all-reduce, and fused GEMM-plus-communication patterns. NVSHMEM is used only for NVIDIA GPUs; the distributed primitives of TLE-Lite and TLE-Struct use FlagCX instead of NVSHMEM.

On top of the CUDA integration, `@dialect` adds the `library` and `compiler` parameters so that NVSHMEM device-side interfaces can be inlined directly into a TLE-Raw kernel:

```{code-block} python
@dialect(
    name="cuda",
    library="nvshmem",
    compiler="clang",
    file=(Path(__file__).parent / "simple-shift-device.cu"),
    extern_func_name="simple_shift",
)
def simple_shift(*args, **kwargs):
    ...
```

- `library="nvshmem"`: enables linking of the NVSHMEM device bitcode (`libnvshmem_device.bc`; for NVSHMEM 3.7 and later with per-SM bitcode the matching `.bc` is selected automatically) and registers the NVSHMEM cumodule init hook on the kernel so that device-side NVSHMEM calls initialize correctly.
- `compiler="clang"`: compiles the `.cu` source given by `file` with clang using `--cuda-device-only`.
- `file` / `extern_func_name`: the same as in the CUDA integration — the device-side source file and the function symbol inside it.

Calling follows the CUDA integration, using `tle_raw.call` from a Triton kernel:

```{code-block} python
@triton.jit
def simple_shift_kernel(destination_ptr):
    tle_raw.call(simple_shift, [destination_ptr])
```

The NVSHMEM-related host-side setup is provided by `triton.experimental.tle.raw.nvshmem.utils`:

- `init_torch_distributed()` / `init_nvshmem_by_torch_pg(common, group)`: initialize torch.distributed and NVSHMEM from a PyTorch process group.
- `load_host(source)` / `load_common_host(source=None)`: compile and load a host-side `.cu` (with `nvshmem.h` and `nvshmemx.h`) and return a library object whose `extern "C"` functions can be called directly.
- `tensor_from_pointer(pointer, shape, dtype, device)`: create a non-owning Torch tensor view over CUDA memory.
- `copy_on_stream(dst_ptr, src_ptr, nbytes, stream)` and `set_signal_cuda_ptr(signal_ptr, signal, stream)`: on-stream copies and signal pointer setup.
- `print_perf(...)` / `print_perf_mean(...)`: aggregate and print performance data per rank.
- `enable_nvshmem_device_bc(enabled=True)` / `is_nvshmem_device_bc_enabled()` / `get_nvshmem_extern_libs(arch=None)`: device bitcode linking switch and external-library query (`library="nvshmem"` enables it automatically).

Prerequisites:

- Set the `NVSHMEM_HOME` environment variable (or `triton.knobs.nvidia.nvshmem_home`) so that `libnvshmem_host.so` and the device bitcode can be resolved.
- The examples target sm90 and newer and require `world_size >= 2`; multi-GPU launches pass the topology through `RANK`, `LOCAL_RANK`, `WORLD_SIZE`, and `LOCAL_WORLD_SIZE`.

Full examples are in `python/tutorials/tle/raw/nvshmem/`:

- `01-simple-shift`: the minimal NVSHMEM device-side put example, showing the dialect declaration and how host and device sides cooperate.
- `02-allgather-gemm`: all-gather GEMM over NVSHMEM (with a benchmark).
- `03-gemm-allreduce`: GEMM plus all-reduce over NVSHMEM multimem.
- `04-cuda-ipc-allreduce`: all-reduce over CUDA IPC (with a benchmark), using the CUDA dialect without `library="nvshmem"`.

### Processing flow

#### Frontend: CUDA-LLVM integration into Triton frontend and runtime

| Step | Module | Key Pass Development |
|---|---|---|
| Dialect registration entry (dialect decorator) | `python/triton/experimental/tle/raw/runtime.py` | - Maintains `registry = {"cuda": CUDAJITFunction, "mlir": MLIRJITFunction}`.<br>- `dialect(name="cuda", ...)` constructs a `CUDAJITFunction` object. |
| TTIR extension: `Tle_DSLRegionOp` | `FlagTree/third_party/tle/dialect/include/IR/TleOps.td` | - Accepts Triton parameters;<br>- Wraps LLVM IR into the region field. |
| CUDA runtime: where clang is actually invoked | `python/triton/experimental/tle/raw/cuda/runtime.py` | - `CUDAJITFunction` reads the `.cu` source text at initialization.<br>- `make_llvm()` directly calls `subprocess.run(clang ...)` to produce LLVM IR.<br>- `parse_llvm_ir(...)` converts the text into a module that can be plugged into the Triton builder.<br>![alt text](../assets/images/make_llvm.PNG) |


#### Middle-End: Python to C++, MLIR pass relationship and pass inheritance

| Step | Module | Key Pass Development |
|---|---|---|
| Attach LLVM function to `dsl_region` | `python/triton/experimental/tle/language/raw/core.py` | - `call()` obtains the builder context.<br>- Triggers `func.make_llvm(context)`.<br>- Calls `create_tle_raw_region_by_llvm_func(...)` to generate the `dsl_region` op.<br>![alt text](../assets/images/dsl_region_op.PNG) |
| C++ bridge: IR injection and type bridging | `third_party/tle/triton_tle.cc` | - `third_party/tle/triton_tle.cc` exposes Python bindings for `create_tle_raw_region_by_llvm_func` and raw passes.<br>- `third_party/tle/triton_tle_raw.cc` implements `createTLERawRegionByLLVMFunc`: parses the function, clones it into the current module, performs parameter/return type mapping, and creates `tle::DSLRegionOp` + `tle::YieldOp`. |


#### Backend: CUDA-LLVM IR conversion — parameter handling and Triton/TLE-Raw data bridging

| Step | Module | Key Pass Development |
|---|---|---|
| Backend pass registration | `third_party/nvidia/backend/compiler.py` | - `make_ttgir()` inserts `tle.raw_passes.add_tle_convert_arg_to_memdesc(pm)`, which converts `dsl_region` tensor parameters into memdesc form.<br>- `make_llir()` inserts `tle.raw_passes.add_tle_dsl_region_inline(pm)`, which inlines `dsl_region` into the main control flow before LLVM conversion.<br>![alt text](../assets/images/make_ttgir_and_make_llir.png) |
| Parameter bridging | `TleConvertArgToMemDesc` (TTGIR stage) | - Converts tensor parameters/results in `dsl_region` to memdesc semantics, adding local storage and synchronization.<br>- Key actions:<br>&nbsp;&nbsp;- tensor operand → `LocalAlloc` + `LocalStore`;<br>&nbsp;&nbsp;- `dsl_region` result tensor → `LocalLoad` readback;<br>&nbsp;&nbsp;- inserts `NVVM::Barrier0Op` when necessary;<br>&nbsp;&nbsp;- handles pack-related new types. |
| LLVM inline preparation | `TleDSLRegionInline` (LLIR stage) | - Inlines `tle.dsl_region` from a region op.<br>- Key actions:<br>&nbsp;&nbsp;- splits block, creates continuation;<br>&nbsp;&nbsp;- rewrites yield as a branch to continuation;<br>&nbsp;&nbsp;- replaces original `dsl_region` result uses;<br>&nbsp;&nbsp;- erases `dsl_region` op. |


#### Semantic object mapping

| Semantic Object | Triton Side | TLE-Raw Side | LLVM Side |
|---|---|---|---|
| Scalar parameter | `i32`/`f32`/... | Directly as `Tle_ArgType` | LLVM scalar parameter |
| Pointer parameter | `tt.ptr<T>` | Passed directly or extracted as LLVM ptr | `attribute((address_space(N))) T*` |
| Tensor input | `tensor<...>` | Converted to `ttg.memdesc` / `dsl_region` operand | Expanded to allocated/aligned/offset/sizes/strides |
| Tensor output | `tensor<...>` | `dsl_region` result + `tle.pack`/yield | LLVM struct or multi-return fields, then repacked |
