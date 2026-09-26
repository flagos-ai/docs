# 安装 FlagTree

## 环境准备

避免环境兼容性问题的最佳实践是使用 [用户手册](https://github.com/flagos-ai/FlagTree/wiki/User-Manual) 中推荐的镜像。

## 方式一：从预构建的 Docker 镜像安装

有关在不同后端上从预构建 Docker 镜像安装 FlagTree 的信息，请参见以下列表：

- [NVIDIA](/getting_started/multi-backend-prebuilt-docker-image-install/install-nv.md)
- [NVIDIA TileIR](/getting_started/multi-backend-prebuilt-docker-image-install/install-tileir.md)
- [AMD](/getting_started/multi-backend-prebuilt-docker-image-install/install-amd.md)
- [安谋科技](/getting_started/multi-backend-prebuilt-docker-image-install/install-aipu.md)
- [燧原](/getting_started/multi-backend-prebuilt-docker-image-install/install-enflame.md)
- [华为昇腾](/getting_started/multi-backend-prebuilt-docker-image-install/install-ascend.md)
- [辉羲智能](/getting_started/multi-backend-prebuilt-docker-image-install/install-rpu.md)
- [海光信息](/getting_started/multi-backend-prebuilt-docker-image-install/install-hcu.md)
- [天数智芯](/getting_started/multi-backend-prebuilt-docker-image-install/install-iluvatar.md)
- [沐曦股份](/getting_started/multi-backend-prebuilt-docker-image-install/install-metax.md)
- [摩尔线程](/getting_started/multi-backend-prebuilt-docker-image-install/install-mthreads.md)
- [进迭时空](/getting_started/multi-backend-prebuilt-docker-image-install/install-spacemit.md)
- [曦望芯科](/getting_started/multi-backend-prebuilt-docker-image-install/install-sunrise.md)
- [平头哥](/getting_started/multi-backend-prebuilt-docker-image-install/install-ppu.md)
- [清微智能](/getting_started/multi-backend-prebuilt-docker-image-install/install-tsingmicro.md)
- [KLX](/getting_started/multi-backend-prebuilt-docker-image-install/install-xpu.md)

## 方式二：从源码安装

1. 克隆 FlagTree 并进入 FlagTree 目录。

    ```{code-block} bash
    #    从远程 Git 仓库克隆 FlagTree 项目到本地
    git clone https://github.com/flagos-ai/flagtree
    #    将当前工作目录切换到克隆的 FlagTree 项目目录
    cd flagtree
    ```

2. 安装 Ubuntu 和 Python 依赖。

    ```{code-block} bash
    # 安装 Ubuntu 依赖
    apt install zlib1g zlib1g-dev libxml2 libxml2-dev nlohmann-json3-dev  # ubuntu
    # 安装 Python 依赖
    # 依赖项包含在 flagtree/python 目录下的 requirements.txt 中。
    cd python; python3 -m pip install -r requirements.txt

    ```

3. 构建并安装 FlagTree
    以下是用于构建和安装 FlagTree 的常用命令。然而，不同的后端有不同的要求。有关更多信息，请参见"为不同后端安装 FlagTree"部分。

    ```{code-block} bash
    # 使用上表中的后端名称设置 FLAGTREE_BACKEND
    export FLAGTREE_BACKEND=${backend_name}  # 在 nvidia/amd/triton-shared 上不要设置此项

    # 对于 Triton 3.1/3.2/3.3（分支：triton_v3.1.x、triton_v3.2.x、triton_v3.3.x）
    cd python
    python3 -m pip install . --no-build-isolation -v  # 安装 flagtree 并卸载 triton

    # 对于 Triton 3.4/3.5/3.6（分支：triton_v3.4.x、triton_v3.5.x、main）
    python3 -m pip install . --no-build-isolation -v  # 安装 flagtree 并卸载 triton
    ```

4. 验证 FlagTree 安装

    ```{code-block} python
    python3 -m pip show flagtree
    cd ${ANY_DIR_OTHER_THAN_FLAGTREE_PYTHON}; python3 -c 'import triton; print(triton.__path__)'
    ```

有关在不同后端上从源码安装 FlagTree 的信息，请参见以下列表：

- [NVIDIA](/getting_started/multi-backend-prebuilt-docker-image-install/install-nv.md)
- [NVIDIA TileIR](/getting_started/multi-backend-prebuilt-docker-image-install/install-tileir.md)
- [AMD](/getting_started/multi-backend-prebuilt-docker-image-install/install-amd.md)
- [安谋科技](/getting_started/multi-backend-prebuilt-docker-image-install/install-aipu.md)
- [燧原](/getting_started/multi-backend-prebuilt-docker-image-install/install-enflame.md)
- [华为昇腾](/getting_started/multi-backend-prebuilt-docker-image-install/install-ascend.md)
- [辉羲智能](/getting_started/multi-backend-prebuilt-docker-image-install/install-rpu.md)
- [海光信息](/getting_started/multi-backend-prebuilt-docker-image-install/install-hcu.md)
- [天数智芯](/getting_started/multi-backend-prebuilt-docker-image-install/install-iluvatar.md)
- [沐曦股份](/getting_started/multi-backend-prebuilt-docker-image-install/install-metax.md)
- [摩尔线程](/getting_started/multi-backend-prebuilt-docker-image-install/install-mthreads.md)
- [进迭时空](/getting_started/multi-backend-prebuilt-docker-image-install/install-spacemit.md)
- [曦望芯科](/getting_started/multi-backend-prebuilt-docker-image-install/install-sunrise.md)
- [平头哥](/getting_started/multi-backend-prebuilt-docker-image-install/install-ppu.md)
- [清微智能](/getting_started/multi-backend-prebuilt-docker-image-install/install-tsingmicro.md)
- [KLX](/getting_started/multi-backend-prebuilt-docker-image-install/install-xpu.md)
- [ARM64 CPU](/getting_started/install-arm64-cpu.md)

## 方式三：安装 wheel 包

如果您不想从源码构建，可以直接拉取并安装 whl（部分后端支持）。

1. 安装 PyTorch
2. 卸载 Triton

    ```{code} python
    python3 -m pip uninstall -y triton  # 重复此命令直到完全卸载
    RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
    ```

3. 安装 FlagTree 和 Triton

    wheel 包列表在 [用户手册](https://github.com/flagos-ai/FlagTree/wiki/User-Manual) 中维护。

    |后端   |安装命令<br>（版本对应 git 标签）|Triton<br>版本|libc.so &<br>libstdc++.so|
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

FlagTree 的历史版本可在 https://resource.flagos.net/#browse/search/pypi/=repository_name%3Dflagos-pypi-hosted%20AND%20name.raw%3Dflagtree 找到。

## 运行测试

安装完成后，您通常可以运行以下测试。有关特定后端支持的测试，请参考对应分支中的 .github/workflow/${backend_name}-build-and-test.yml。

```{code} shell
# nvidia/amd
cd python/test/unit
python3 -m pytest -s
# 其他后端
cd third_party/${backend_name}/python/test/unit
python3 -m pytest -s
```

## 常见问题

问：安装后运行程序报错：找不到 GLIBC 或 GLIBCXX 版本

答：检查您环境中 libc.so.6 和 libstdc++.so.6.0.30 支持的 GLIBC / GLIBCXX 版本：

```{code} shell
strings /lib/x86_64-linux-gnu/libc.so.6 |grep GLIBC
strings /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30 | grep GLIBCXX
```

如果所需的 GLIBC / GLIBCXX 版本已受支持，您也可以尝试：

```{code} shell
export LD_PRELOAD="/lib/x86_64-linux-gnu/libc.so.6"  # 如果找不到 GLIBC
export LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30"  # 如果找不到 GLIBCXX
export LD_PRELOAD="/lib/x86_64-linux-gnu/libc.so.6 \
    /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30"  # 如果 GLIBC 和 GLIBCXX 都找不到
```
