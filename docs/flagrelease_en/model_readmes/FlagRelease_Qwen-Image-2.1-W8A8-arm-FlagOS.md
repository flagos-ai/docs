---
frameworks:
- ""
tasks: []
---
# Qwen-Image-2.1 W8A8 — FlagOS for Mac

## Introduction
FlagOS is a fully open-source system software stack for heterogeneous AI chips. It unifies the model–system–chip layers to enable a "develop once, run anywhere" workflow, eliminating the fragmentation among vendor-specific software stacks and substantially lowering the cost of porting AI workloads across accelerators.
In this release, Qwen-Image-2.1 leverages the FlagOS software stack to provide direct multi-chip support. By integrating the Triton-based operator library FlagGems via the Torch-FL plugin, FlagOS enables seamless adaptation of the Diffusers library across chip platforms; the usage experience remains identical to that on NVIDIA, requiring zero code modifications. Inference accuracy across all platforms has been aligned with the official implementation.


This checkpoint provides **Qwen-Image-2.1 text-to-image inference on Apple M5 Pro
CPU**, using the September 20, 2026 source weights. It runs with **PyTorch CPU**,
Qwen's reference Diffusers implementation and FlagGems Arm operators.

The diffusion Transformer uses a mixed W8A8/BF16 configuration: 112 Linear
modules execute W8A8, while the remaining Transformer weights retain BF16.
The Text Encoder and VAE are not INT8-quantized. Text encoding, denoising and
image decoding all run on the CPU.

Model loading, CPU adaptation and image generation are provided by
[flagos-macos-runtime, branch `qwen_image`](https://github.com/kevinzs2048/flagos-macos-runtime/tree/qwen_image).
The measured execution path uses native SME2/KleidiAI operators owned by
[FlagGems, branch `qwen_image`](https://github.com/kevinzs2048/FlagGems/tree/qwen_image).
PyTorch itself is unmodified. vLLM, vLLM-Plugin-FL and Torch-FL are not required.

## Requirements

- Apple M5 Pro (Mac17,9), 18 CPU cores, 64 GiB memory, native macOS arm64.
- Validated on macOS 26.5.1 with Apple command-line developer tools.
- SME2 and BF16 matrix instructions, with the validated 512-bit streaming vector layout.
- A prepared Python/native dependency environment matching the following versions.

| Component | Validated version or revision |
| --- | --- |
| Python | 3.11.16 |
| PyTorch | 2.11.0 |
| Transformers | 4.57.6 |
| Hugging Face Hub | 0.36.2 |
| Accelerate / Safetensors | 1.15.0 / 0.8.0 |
| FlagGems | `4fe54663c8a70949ae2346d48a209bc49bedc1e9` |
| FlagTree-CPU | `de687051c74659546398840edde19dfb9bdda52c` |
| KleidiAI | 1.29.0, with `build-perf/libkleidiai.a` |
| Qwen-Image-2.1 reference Diffusers | `9511e982f22ea8fcc64faf277d90b3a21f8a83f6` |

The reference Diffusers source, compatible OpenMP libraries/headers and matching
FlagTree-CPU build are required. Other Mac processors have not been validated.
The complete dependency record is available in
[the source lock](https://github.com/kevinzs2048/flagos-macos-runtime/blob/qwen_image/qwen-image.sources.lock.json).

## Operation steps

### 1. Prepare the model weights

Use the complete W8A8 model directory, including the Transformer shards and
index, Text Encoder, VAE, processor, scheduler, `model_index.json` and
`EXPORT_COMPLETE`. The validated local checkpoint is:

```bash
export MODEL_DIR="$HOME/Qwen-Image-2.1-0920-W8A8-PerChannel-112"
```

Set `MODEL_DIR` to your checkpoint location. Model weights are separate from
runtime code. The loader reads local files; it does not download components
during image generation.

### 2. Prepare the Mac inference environment

The Qwen source integration is available on the `qwen_image` branches.
**A self-contained prebuilt Mac runtime installer for this Qwen profile has
not been published.** The following setup uses an existing compatible
Python/FlagTree-CPU/KleidiAI/OpenMP environment. The reference Diffusers source
must be supplied separately; a generic Diffusers installation does not include
this validated model implementation and W8 checkpoint loader.

Obtain the application and matching operator source:

```bash
git clone --single-branch --branch qwen_image \
  https://github.com/kevinzs2048/flagos-macos-runtime.git qwen-image-runtime
git clone --single-branch --branch qwen_image \
  https://github.com/kevinzs2048/FlagGems.git FlagGems-qwen-image
git -C FlagGems-qwen-image checkout 4fe54663c8a70949ae2346d48a209bc49bedc1e9

export QWEN_RUNTIME_DIR="$PWD/qwen-image-runtime"
export FLAGGEMS_DIR="$PWD/FlagGems-qwen-image"
```

Point the launcher to your prepared environment and dependencies:

```bash
export QWEN_IMAGE_PYTHON=/path/to/prepared/python3.11
export QWEN_IMAGE_DIFFUSERS_SRC=/path/to/Qwen-Image-2.1-reference/src
export FLAGGEMS_KLEIDIAI_ROOT=/path/to/KleidiAI-v1.29.0
export TRITON_LOCAL_LIBOMP_PATH=/path/to/compatible-openmp
export TRITON_SYS_PATH="$TRITON_LOCAL_LIBOMP_PATH"
export TRITON_BACKENDS_IN_TREE=1

"$QWEN_IMAGE_PYTHON" -m pip install --no-deps --no-build-isolation -e "$FLAGGEMS_DIR"
"$QWEN_IMAGE_PYTHON" -m pip install --no-deps --no-build-isolation -e "$QWEN_RUNTIME_DIR"
bash "$QWEN_RUNTIME_DIR/bin/qwen-image" --help
```

`--no-deps` preserves the prepared CPU dependencies; these commands install the
operator source package and model adapter, not the entire native toolchain.
See [integration setup](https://github.com/kevinzs2048/flagos-macos-runtime/blob/qwen_image/docs/qwen_image/INTEGRATION.md)
for repository ownership and developer details.

On the original validation Mac, the existing setup can be reused instead:

```bash
source "$HOME/qwen-image-2.1-repos/env-upstream.sh"
export QWEN_RUNTIME_DIR="$HOME/flagos-macos-runtime"
```

### 3. Generate an image with PyTorch CPU

```bash
bash "$QWEN_RUNTIME_DIR/bin/qwen-image" \
  --model "$MODEL_DIR" \
  --prompt 'A capybara reading a book by candlelight, watercolor painting' \
  --width 1024 --height 1024 \
  --steps 40 --seed 42 \
  --output result.png
```

The launcher loads the model, prepares the CPU operators, encodes the prompt,
performs denoising, decodes the image and saves:

- `result.png`: the generated image.
- `result.json`: generation settings, loading/prepacking time, resident inference
  time, image hashes and W8 operator coverage.

First startup may compile native extensions. The validated profile uses batch
one, CFG=1, prefix KV caching, 18 main threads and 12 MLP workers.
For a smaller functional run, use `--width 512 --height 512`. Dimensions must
be positive multiples of 32. Inference steps default to 40.

### 4. Measure resident inference time

Add `--warmup-steps 2` to perform a two-step warmup before the measured request.
Add `--runs 3` to generate three images in the same process, with files named
`result-01.png`, `result-02.png` and `result-03.png`. Each request is recorded
in `result.json`.

## Measured performance

Apple M5 Pro / 64 GiB, CPU only, batch one, September 20, 2026.
The final repository-integration regression used 40 denoising steps, CFG=1,
seed 42, prefix KV caching and a two-step warmup.

| Resolution | Steps | Resident request latency | W8 GEMM calls |
| --- | ---: | ---: | ---: |
| 512 × 512 | 40 | **157.05 seconds** | 4,480 |
| 1024 × 1024 | 40 | **770.92 seconds** | 4,480 |

Each row is one measured request using the same paper-lantern prompt, not a
multi-run median. Times include text encoding, denoising, VAE decoding and PIL
conversion. They exclude loading, prepacking, warmup, initial latent creation
and PNG writing. Both requests executed all 112 W8 Linear modules at every step.

The images matched the pre-migration W8A8 images pixel for pixel. Earlier
measurements were 158.76 and 811.28 seconds; the single-run differences do not
establish a speedup from moving code between repositories.

[Timing and coverage evidence](https://github.com/kevinzs2048/flagos-macos-runtime/blob/qwen_image/benchmarks/qwen-image-migration-images.json)
records the tested application and operator revisions.

## Quantization and validation

- Weights: symmetric INT8 per output channel, zero point 0, FP32 scales.
- Activations: dynamic asymmetric INT8 per token/row, FP32 scales.
- Accumulation: INT32, followed by FP32 scaling and BF16 output.
- Scope: Q/K and MLP proj/gate Linear modules in blocks 2–29, using zero-based
  indices; 112 modules in a 32-block Transformer.
- Other Transformer weights and Text Encoder weights retain BF16. VAE files
  retain FP32 storage and are loaded as BF16; CPU convolution computes in FP32.
- Portable INT8 codes/scales are stored in Safetensors. Native packed buffers
  are prepared when loading the model.

| Component | Approximate weight size, decimal GB |
| --- | ---: |
| Mixed W8A8/BF16 Transformer | 10.48 |
| BF16 Text Encoder | 17.53 |
| FP32 VAE | 1.35 |
| Complete model directory | 29.38 |

The combined regression suites passed **380 tests**: 209 operator tests and
171 model/integration tests. Twelve sampled real-input kernel checks also
passed against an integer reference. Transformer prediction differences from
BF16 were measured with identical inputs at steps 1, 20 and 40.

Pixel equality verifies the repository migration, not lossless quantization
against BF16. Image checks for these new weights currently cover one prompt;
text rendering still has letter-shape errors. A complete 100-prompt image-quality
evaluation of this checkpoint has not been completed.

[Full migration report](https://github.com/kevinzs2048/flagos-macos-runtime/blob/qwen_image/docs/qwen_image/MIGRATION_REPORT.md)
contains the validation scope and reproduction details.

## Example images

These files are included in the validated model directory:

- [1024 × 1024, 40 steps](validation/runtime-migration/1024-40.png)
- [512 × 512, 40 steps](validation/runtime-migration/512-40.png)
- [Numerical validation](validation/precision.json)

## Technical overview

```text
Mac launcher
  -> Qwen-Image model integration in flagos-macos-runtime
  -> Qwen-Image-2.1 Diffusers pipeline on PyTorch CPU
  -> FlagGems native SME2/KleidiAI operators and ATen CPU operations
  -> Generated image
```

**flagos-macos-runtime** maintains model loading, CPU compatibility, model
fusion wiring, Mac configuration and the image-generation launcher.

**FlagGems** maintains reusable Linear modules, packing/caches and Arm operators.
The default performance figures above use native SME2/KleidiAI computation.

**FlagTree-CPU** provides the Triton CPU compiler used by the validated software
environment and optional Triton operator implementations. Its presence does
not mean the default native GEMM path executes through Triton.

## Contributing

Report model-loading or launcher issues in
[flagos-macos-runtime](https://github.com/kevinzs2048/flagos-macos-runtime/tree/qwen_image).
For operator changes, use the matching
[FlagGems branch](https://github.com/kevinzs2048/FlagGems/tree/qwen_image).
Include the source revisions, Mac model, generation settings and request JSON.

## License

The source checkpoint includes the **Qwen Research License Agreement**, dated
September 20, 2026. This model retains that [LICENSE](LICENSE); consult it for
the permitted uses and distribution terms. Runtime components retain their
respective licenses.

