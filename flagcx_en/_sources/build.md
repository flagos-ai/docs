# Build and Installation

## Obtain Source Code

```shell
git clone https://github.com/flagos-ai/FlagCX.git
cd FlagCX
git submodule update --init --recursive
```

## Installation

**Option A — Pythonic Installation (pip install):**

```shell
pip install . -v --no-build-isolation
```

**Option B — C++ library (make):**

```shell
make <backend>=1 -j$(nproc)
```

where `<backend>` is one of:
- `USE_NVIDIA`: NVIDIA GPU support
- `USE_ILUVATAR`: Iluvatar GPU support
- `USE_ILUVATAR_COREX`: deprecated compatibility alias for `USE_ILUVATAR`
- `USE_CAMBRICON`: Cambricon support
- `USE_METAX`: MetaX support
- `USE_MUSA`: Moore Threads support
- `USE_KUNLUNXIN`: Kunlunxin support
- `USE_DU`: Hygon support
- `USE_ASCEND`: Huawei Ascend support
- `USE_AMD`: AMD support
- `USE_TSM`: TsingMicro support
- `USE_ENFLAME`: Enflame support
- `USE_SUNRISE`: Sunrise AI support
- `USE_PPU`: PPU backend support
- `USE_GLOO`: GLOO support
- `USE_MPI`: MPI support

Device API and integration build controls include:

- `USE_SHMEM=1`: enable the SHMEM Device API adaptor.
- `SHMEM_HOME`: SHMEM installation path; defaults to `/usr/local/nvshmem`.
- `USE_ACCL_BAREX=1`: enable the ACCL/Barex network adaptor.
- `COMPILE_KERNEL=1`: compile kernel-enabled Device API components and tests.
- `HOST_CXX_STANDARD`: override the host C++ language standard when required by the build environment.
- `HOST_CXXFLAGS`: add host compiler flags.
- `JSON_INCLUDE_DIR`: override the JSON header include directory.

The PPU integration commonly uses `USE_PPU=1 USE_ACCL_BAREX=1`; vendor runtime and transport settings are integration-specific and are not universal defaults.

Option A also supports `<backend>=1`, allowing users to explicitly specify the backend. Otherwise, it will be selected automatically.

The default installation path is set to `build/`; you can manually set the `BUILDDIR` environment variable to customize the build path.
You may also specify `DEVICE_HOME` and/or `CCL_HOME` to indicate the installation paths of the device runtime and communication libraries, respectively.
