# FlagFFT C API Reference

## Plan Creation

| Function | Description |
|----------|-------------|
| `flagfftPlan1d` | Create a 1D FFT plan |
| `flagfftPlan2d` | Create a 2D FFT plan (currently returns `FLAGFFT_NOT_SUPPORTED`) |
| `flagfftPlan3d` | Create a 3D FFT plan (currently returns `FLAGFFT_NOT_SUPPORTED`) |
| `flagfftPlanMany` | Create a batched FFT plan with custom layouts |

## Execution

| Function | Description |
|----------|-------------|
| `flagfftExecC2C` | Complex-to-complex transform (complex64) |
| `flagfftExecZ2Z` | Complex-to-complex transform (complex128) |
| `flagfftExecR2C` | Real-to-complex transform (float) |
| `flagfftExecD2Z` | Real-to-complex transform (double) |
| `flagfftExecC2R` | Complex-to-real transform (float) |
| `flagfftExecZ2D` | Complex-to-real transform (double) |

## Stream and Lifecycle

| Function | Description |
|----------|-------------|
| `flagfftSetStream` | Attach a CUDA stream to a plan |
| `flagfftDestroy` | Destroy a plan and free resources |
| `flagfftGetPlanDescription` | Get human-readable plan description |

## Types

| Type | Description |
|------|-------------|
| `flagfftHandle` | Opaque plan handle |
| `flagfftResult` | Return status code |
| `flagfftStream_t` | Backend-neutral opaque stream type |
| `flagfftComplex` | Single-precision complex number |
| `flagfftDoubleComplex` | Double-precision complex number |

## Transform Types

| Constant | Description |
|----------|-------------|
| `FLAGFFT_C2C` | Complex-to-complex (complex64) |
| `FLAGFFT_Z2Z` | Complex-to-complex (complex128) |
| `FLAGFFT_R2C` | Real-to-complex (float) |
| `FLAGFFT_D2Z` | Real-to-complex (double) |
| `FLAGFFT_C2R` | Complex-to-real (float) |
| `FLAGFFT_Z2D` | Complex-to-real (double) |

## Status Codes

| Constant | Description |
|----------|-------------|
| `FLAGFFT_SUCCESS` | Operation completed successfully |
| `FLAGFFT_NOT_SUPPORTED` | Requested operation is not supported |
