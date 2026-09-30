# Install FlagQuantum

Read [Requirements](requirements.md) before proceeding.

## Steps

1. Install FlagQuantum

   - Install the released package

     ```{code-block} shell
     python -m pip install flagquantum
     ```

   - Install a development checkout with the development tools

     ```{code-block} shell
     git clone https://github.com/flagos-ai/FlagQuantum.git
     cd FlagQuantum
     python -m pip install -e ".[dev]"
     ```

2. Add the optional dependencies you need

   ```{code-block} shell
   python -m pip install -e ".[jax,cuda,viz]"
   ```

   Use the group names in [Requirements](requirements.md) instead of installing
   external frameworks by hand, so that pinned compatibility windows are kept.

3. Verify the installation

   ```{code-block} python
   import flagquantum as fq
   print(fq.__version__)
   ```

4. Verify a local execution path

   ```{code-block} shell
   python -m examples.local.simulate
   python -m examples.local.measure
   python -m examples.local.train
   ```

   These three examples cover local statevector simulation, measurements, and
   PyTorch-native training without credentials, remote resources or optional
   backends.

## Development containers

The repository also ships development container definitions for CPU and CUDA
environments, with and without JAX and the QSteed compiler. Follow the
container guide in the repository when you prefer a prepared environment; the
images install FlagQuantum from the checkout and include JupyterLab, and none
of them contain provider credentials.

## Next steps

- [Build and run your first program](../user_guide/basic-usage.md)
- [Train with PyTorch](../user_guide/training-with-pytorch.md)
- [Choose a simulation representation](../user_guide/simulation-representations.md)
