# Install TransformerEngine-FL

## Docker (Recommended)

TransformerEngine-FL runs in a pre-built Docker image shared with Megatron-LM-FL. Go to the [FlagOS main page](https://flagos.io/Home), pick the image for your hardware from the download list in the middle of the page, and follow the on-page instructions to pull the image, enter the container, and start it.

Suitable for 100B+ parameter model pre-training.

You can install TransformerEngine-FL through one of the following methods:

## Direct install from FlagOS Repository

```bash
pip install transformer_engine==0.1.0+te2.9.0 --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

## Install from source

```bash
git clone https://github.com/flagos-ai/TransformerEngine-FL.git
cd TransformerEngine-FL
git checkout <tag number>
git submodule update --init --recursive
MAX_JOBS=xxx pip install .
```

## Non-NVIDIA platforms

TransformerEngine-FL v0.3.0 has been validated on MetaX, Hygon, Ascend, and T-Head PPU. Non-NVIDIA builds must skip the CUDA extension:

```bash
git clone https://github.com/flagos-ai/TransformerEngine-FL.git
cd TransformerEngine-FL
git checkout v0.3.0
git submodule update --init --recursive
TE_FL_SKIP_CUDA=1 MAX_JOBS=64 pip install -v . --no-build-isolation --root-user-action=ignore
```

```{note}
`TE_FL_SKIP_CUDA=1` is mandatory on non-NVIDIA platforms — without it the build tries to compile the CUDA kernels and fails.
```

The FlagOS operator tier (`te_fl_prefer: flagos`) additionally requires FlagTree and FlagGems. See [Multi-Platform Build and Testing](../user_guide/multi-platform-testing.md) for the full procedure.

For an end-to-end training workflow using TransformerEngine-FL, Megatron-LM-FL, and FlagScale, see [End-to-End Use Case: TransformerEngine-FL + Megatron-LM-FL + FlagScale](../user_guide/e2e-use-case.md).
