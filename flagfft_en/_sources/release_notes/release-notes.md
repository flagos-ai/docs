# FlagFFT Release Notes

## v0.2.0

- **Added Features**

  - Rank-2 and rank-3 transforms for all six transform types (C2C, Z2Z, R2C, D2Z, C2R, Z2D).
  - Prime-length and large rank-1 transform acceleration.
  - MUSA and PPU backends, selected in the build with `-DBACKEND=MUSA|PPU`.
  - `flagfft-cli` benchmark and plan-inspection tool.

- **Enhanced Features**

  - Plan selection and mixed-radix/four-step routes for large rank-1 transforms.

## v0.1.0

Initial release of FlagFFT.

- **Added Features**

  - Experimental C++ FFT library with cuFFT-style C API.
  - Triton/TLE-generated CUDA kernels with JIT compilation at plan creation time.
  - **1D Complex-to-Complex** — C2C, Z2Z (complex64 and complex128).
  - **1D Real-to-Complex** — R2C, D2Z (float and double).
  - **1D Complex-to-Real** — C2R, Z2D (float and double).
  - **1D Roundtrip** — R2C+C2R, D2Z+Z2D roundtrip transforms.
  - **2D FFT** — C2C, Z2Z, R2C, D2Z, C2R, Z2D for 2D transforms.
  - Arbitrary-length contiguous rank-1 batched transforms.
  - Fused four-step route support for very large composite lengths.
  - Bluestein fallback for arbitrary 1D complex lengths.
  - Native CLI (`flagfft-cli`) for benchmark measurement and plan inspection.
  - C++ test suite with Google Test and cuFFT reference comparison.
  - Python benchmark suite with pytest-based performance measurement.
  - Unified test runner (`tools/run_tests.py`) with accuracy and performance reporting.
  - Plan description API (`flagfftGetPlanDescription`) for performance debugging.
  - Docker development environment with pre-built dependencies.
  - Operator registry (`conf/operators.yaml`) with full operator metadata.
