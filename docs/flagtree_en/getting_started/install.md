# Install FlagTree

## Environment setup

The best practice to avoid environment compatibility issues is to use the image recommended in the [User Manual](https://github.com/flagos-ai/FlagTree/wiki/User-Manual).

## Option 1: Install from prebuilt Docker image

For installing FlagTree on different backends from prebuilt Docker image, see the following list:

- [NVIDIA](/getting_started/multi-backend-prebuilt-docker-image-install/install-nv.md)
- [NVIDIA TileIR](/getting_started/multi-backend-prebuilt-docker-image-install/install-tileir.md)
- [AMD](/getting_started/multi-backend-prebuilt-docker-image-install/install-amd.md)
- [ARM China](/getting_started/multi-backend-prebuilt-docker-image-install/install-aipu.md)
- [Enflame](/getting_started/multi-backend-prebuilt-docker-image-install/install-enflame.md)
- [Huawei Ascend](/getting_started/multi-backend-prebuilt-docker-image-install/install-ascend.md)
- [Huixi](/getting_started/multi-backend-prebuilt-docker-image-install/install-rpu.md)
- [HYGON](/getting_started/multi-backend-prebuilt-docker-image-install/install-hcu.md)
- [ILUVATAR](/getting_started/multi-backend-prebuilt-docker-image-install/install-iluvatar.md)
- [MetaX](/getting_started/multi-backend-prebuilt-docker-image-install/install-metax.md)
- [Moore Threads](/getting_started/multi-backend-prebuilt-docker-image-install/install-mthreads.md)
- [SpacemiT](/getting_started/multi-backend-prebuilt-docker-image-install/install-spacemit.md)
- [Sunrise](/getting_started/multi-backend-prebuilt-docker-image-install/install-sunrise.md)
- [T-Head](/getting_started/multi-backend-prebuilt-docker-image-install/install-ppu.md)
- [Tsingmicro](/getting_started/multi-backend-prebuilt-docker-image-install/install-tsingmicro.md)
- [KLX](/getting_started/multi-backend-prebuilt-docker-image-install/install-xpu.md)

## Option 2: Install from source

1. Clone FlagTree and enter the FlagTree directory.

    ```{code-block} bash
    #    Clone the FlagTree project from the remote Git repository to local
    git clone https://github.com/flagos-ai/flagtree
    #    Switch the current working directory to the cloned FlagTree project directory
    cd flagtree
    ```

2. Install Ubuntu and Python dependencies.

    ```{code-block} bash
    # Install dependencies for Ubuntu
    apt install zlib1g zlib1g-dev libxml2 libxml2-dev nlohmann-json3-dev  # ubuntu
    # Install dependencies for Python
    # The dependencies are included in the requirements.txt in the flagtree/python directory.
    cd python; python3 -m pip install -r requirements.txt

    ```

3. Build and install FlagTree
    Below are the common commands used to build and install FlagTree. However, different backends have different requirements. For more information, see the "Install FlagTree for different backends" section.

    ```{code-block} bash
    # Set FLAGTREE_BACKEND using the backend name from the table above
    export FLAGTREE_BACKEND=${backend_name}  # Do not set it on nvidia/amd/triton-shared

    # For Triton 3.1/3.2/3.3 (branch: triton_v3.1.x, triton_v3.2.x, triton_v3.3.x)
    cd python
    python3 -m pip install . --no-build-isolation -v  # Install flagtree and uninstall triton

    # For Triton 3.4/3.5/3.6 (branch: triton_v3.4.x, triton_v3.5.x, main)
    python3 -m pip install . --no-build-isolation -v  # Install flagtree and uninstall triton
    ```

4. Verify FlagTree installation

    ```{code-block} python
    python3 -m pip show flagtree
    cd ${ANY_DIR_OTHER_THAN_FLAGTREE_PYTHON}; python3 -c 'import triton; print(triton.__path__)'
    ```

For installing FlagTree on different backends from source, see the following list:

- [NVIDIA](/getting_started/multi-backend-prebuilt-docker-image-install/install-nv.md)
- [NVIDIA TileIR](/getting_started/multi-backend-prebuilt-docker-image-install/install-tileir.md)
- [AMD](/getting_started/multi-backend-prebuilt-docker-image-install/install-amd.md)
- [ARM China](/getting_started/multi-backend-prebuilt-docker-image-install/install-aipu.md)
- [Enflame](/getting_started/multi-backend-prebuilt-docker-image-install/install-enflame.md)
- [Huawei Ascend](/getting_started/multi-backend-prebuilt-docker-image-install/install-ascend.md)
- [Huixi](/getting_started/multi-backend-prebuilt-docker-image-install/install-rpu.md)
- [HYGON](/getting_started/multi-backend-prebuilt-docker-image-install/install-hcu.md)
- [ILUVATAR](/getting_started/multi-backend-prebuilt-docker-image-install/install-iluvatar.md)
- [MetaX](/getting_started/multi-backend-prebuilt-docker-image-install/install-metax.md)
- [Moore Threads](/getting_started/multi-backend-prebuilt-docker-image-install/install-mthreads.md)
- [SpacemiT](/getting_started/multi-backend-prebuilt-docker-image-install/install-spacemit.md)
- [Sunrise](/getting_started/multi-backend-prebuilt-docker-image-install/install-sunrise.md)
- [T-Head](/getting_started/multi-backend-prebuilt-docker-image-install/install-ppu.md)
- [Tsingmicro](/getting_started/multi-backend-prebuilt-docker-image-install/install-tsingmicro.md)
- [KLX](/getting_started/multi-backend-prebuilt-docker-image-install/install-xpu.md)
- [ARM64 CPU](/getting_started/install-arm64-cpu.md)

## Option 3: Install wheel package

If you do not wish to build from source, you can directly pull and install whl (partial backend support).

1. Install PyTorch
2. Uninstall Triton

    ```{code} python
    python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
    RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
    ```

3. Install FlagTree and Triton

    The wheel list is maintained in the [User Manual](https://github.com/flagos-ai/FlagTree/wiki/User-Manual).

    |Backend   |Install command<br>(The version corresponds to the git tag)|Triton<br>ver.|libc.so &<br>libstdc++.so|
    |:---------|:---------|:---------|:---------|
    |nvidia    |python3.12 -m pip install flagtree===0.7.0 $RES                 |3.6|GLIBC_2.39<br>GLIBCXX_3.4.33<br>CXXABI_1.3.15|
    |tileir    |python3.12 -m pip install flagtree===0.6.1+tileir3.6 $RES       |3.6|GLIBC_2.39<br>GLIBCXX_3.4.33<br>CXXABI_1.3.15|
    |amd       |python3.12 -m pip install flagtree===0.7.0rc1+amd3.6 $RES       |3.6|GLIBC_2.39<br>GLIBCXX_3.4.33<br>CXXABI_1.3.15|
    |aipu      |python3.10 -m pip install flagtree===0.5.0+aipu3.3 $RES         |3.3|GLIBC_2.35<br>GLIBCXX_3.4.30<br>CXXABI_1.3.13|
    |ascend    |python3.11 -m pip install flagtree===0.7.0+ascend3.5 $RES       |3.5|GLIBC_2.35<br>GLIBCXX_3.4.30<br>CXXABI_1.3.13|
    |ascend    |python3.11 -m pip install flagtree===0.6.0+ascend3.2 $RES       |3.2|GLIBC_2.35<br>GLIBCXX_3.4.30<br>CXXABI_1.3.13|
    |enflame   |python3.12 -m pip install flagtree===0.7.0rc2+enflame3.6 $RES   |3.6|GLIBC_2.39<br>GLIBCXX_3.4.33<br>CXXABI_1.3.15|
    |enflame   |python3.12 -m pip install flagtree===0.5.0+enflame3.5 $RES      |3.5|GLIBC_2.39<br>GLIBCXX_3.4.33<br>CXXABI_1.3.15|
    |enflame   |python3.10 -m pip install flagtree===0.4.0+enflame3.3 $RES      |3.3|GLIBC_2.35<br>GLIBCXX_3.4.30<br>CXXABI_1.3.13|
    |hcu       |python3.10 -m pip install flagtree===0.7.0+hcu3.6 $RES          |3.6|GLIBC_2.35<br>GLIBCXX_3.4.30<br>CXXABI_1.3.13|
    |hcu       |python3.10 -m pip install flagtree===0.5.1+hcu3.1 $RES          |3.1|GLIBC_2.35<br>GLIBCXX_3.4.30<br>CXXABI_1.3.13|
    |iluvatar  |python3.12 -m pip install flagtree===0.7.0+iluvatar3.6 $RES     |3.6|GLIBC_2.39<br>GLIBCXX_3.4.33<br>CXXABI_1.3.15|
    |iluvatar  |python3.12 -m pip install flagtree===0.5.1+iluvatar3.1 $RES     |3.1|GLIBC_2.39<br>GLIBCXX_3.4.33<br>CXXABI_1.3.15|
    |iluvatar  |python3.10 -m pip install flagtree===0.5.1+iluvatar3.1 $RES     |3.1|GLIBC_2.35<br>GLIBCXX_3.4.30<br>CXXABI_1.3.13|
    |metax     |python3.12 -m pip install flagtree===0.7.0rc3+metax3.6 $RES     |3.6|GLIBC_2.39<br>GLIBCXX_3.4.33<br>CXXABI_1.3.15|
    |metax     |python3.12 -m pip install flagtree===0.5.1+metax3.0 $RES        |3.0|GLIBC_2.35<br>GLIBCXX_3.4.30<br>CXXABI_1.3.13|
    |mthreads  |python3.10 -m pip install flagtree===0.7.0+mthreads3.6 $RES     |3.6|GLIBC_2.35<br>GLIBCXX_3.4.30<br>CXXABI_1.3.13|
    |mthreads  |python3.10 -m pip install flagtree===0.5.1+mthreads3.2 $RES     |3.2|GLIBC_2.35<br>GLIBCXX_3.4.30<br>CXXABI_1.3.13|
    |mthreads  |python3.10 -m pip install flagtree===0.5.1+mthreads3.1 $RES     |3.1|GLIBC_2.35<br>GLIBCXX_3.4.30<br>CXXABI_1.3.13|
    |ppu       |python3.12 -m pip install flagtree===0.7.0+ppu3.6 $RES          |3.6|GLIBC_2.39<br>GLIBCXX_3.4.33<br>CXXABI_1.3.15|
    |sunrise   |python3.10 -m pip install flagtree===0.6.0+sunrise3.6 $RES      |3.6|GLIBC_2.39<br>GLIBCXX_3.4.33<br>CXXABI_1.3.15|
    |sunrise   |python3.10 -m pip install flagtree===0.4.0+sunrise3.4 $RES      |3.4|GLIBC_2.39<br>GLIBCXX_3.4.33<br>CXXABI_1.3.15|
    |tsingmicro|python3.10 -m pip install flagtree===0.7.0+tsingmicro3.6 $RES   |3.6|GLIBC_2.30<br>GLIBCXX_3.4.28<br>CXXABI_1.3.12|
    |tsingmicro|python3.10 -m pip install flagtree===0.6.0+tsingmicro3.3 $RES   |3.3|GLIBC_2.30<br>GLIBCXX_3.4.28<br>CXXABI_1.3.12|
    |xpu       |python3.10 -m pip install flagtree===0.7.0rc3+xpu3.6 $RES       |3.6|GLIBC_2.35<br>GLIBCXX_3.4.30<br>CXXABI_1.3.13|
    |xpu       |python3.10 -m pip install flagtree===0.5.1+xpu3.0 $RES          |3.0|GLIBC_2.31<br>GLIBCXX_3.4.28<br>CXXABI_1.3.12|

Historical versions of flagtree can be found at https://resource.flagos.net/#browse/search/pypi/=repository_name%3Dflagos-pypi-hosted%20AND%20name.raw%3Dflagtree

## Running tests

After installation, you can generally run the following tests. For specific backend support tests, please refer to .github/workflow/${backend_name}-build-and-test.yml in the corresponding branch.

```{code} shell
# nvidia/amd
cd python/test/unit
python3 -m pytest -s
# other backends
cd third_party/${backend_name}/python/test/unit
python3 -m pytest -s
```

## Q&A

Q: After installation, running the program reports: version GLIBC or GLIBCXX not found

A: Check which GLIBC / GLIBCXX versions are supported by libc.so.6 and libstdc++.so.6.0.30 in your environment:

```{code} shell
strings /lib/x86_64-linux-gnu/libc.so.6 |grep GLIBC
strings /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30 | grep GLIBCXX
```

If the required GLIBC / GLIBCXX version is supported, you can also try:

```{code} shell
export LD_PRELOAD="/lib/x86_64-linux-gnu/libc.so.6"  # If GLIBC cannot be found
export LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30"  # If GLIBCXX cannot be found
export LD_PRELOAD="/lib/x86_64-linux-gnu/libc.so.6 \
    /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30"  # If neither GLIBC nor GLIBCXX can be found
```
