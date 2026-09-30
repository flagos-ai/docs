# 安装 FlagGems

## 1. 环境准备

- 你必须确保为自己的硬件正确地安装了内核态的驱动程序和用户空间的 SDK 或工具链，
  并且均已配置正确，工作正常。无论是 NVIDIA 平台还是其他 AI 加速器硬件，
  这一点都适用。

- 你必须确保已经在节点上安装了合适的 Python 版本。目前建议的版本是 Python 3.10。
  在将来这一建议版本可能会不同，并且，如果你在使用
  [非 NVIDIA 硬件平台](../usage/non-nvidia)，
  厂商可能对可以使用的 Python 版本有额外的约束。

- 你可能需要在安装 *FlagGems* 之前先安装 [PyTorch](https://github.com/pytorch/pytorch)、
  [Triton](https://github.com/triton-lang/triton) 等软件环境。

  如果你在使用[非 NVIDIA 硬件平台](../usage/non-nvidia)来运行
  *FlagGems* 以及你的工作负载，则你可能需要安装针对这类平台**定制、裁剪过的**
  PyTorch、Triton 软件包。

- 如果你想尝试将将 *FlagGems* [与 VLLM 集成](../frameworks/#vllm)，
  则需要安装 [vLLM](https://github.com/vllm-project/vllm)，或者厂商定制版本
  （如果有的话）。

## 2. 从 PyPI 安装

你可以使用自己常用的 Python 包管理器（例如 `pip`）从 [PyPI](https://pypi.org/project/flag-gems/)
安装 *FlagGem* 的软件包：

```shell
pip install flag_gems
```

> [!INFO]
> **提示**
>
> 这种纯 Python 包的安装方式仅安装 *FlagGems* 中用 Python 实现的算子。
> 如果需要安装 C++ 封装的算子，你必须采用
> [从源码构建安装](#install-from-source)方式。

## 3. 从源码构建、安装 {#install-from-source}

与很多其他开源软件类似，*FlagGems* 支持从源码构建、安装。

### 3.1 克隆源代码

```shell
git clone https://github.com/flagos-ai/FlagGems
cd FlagGems/
```

### 3.2 安装 FlagTree

如果你希望使用原生的 Triton 编译器而不是 *FlagTree*，可以跳过这一步。

[FlagTree](https://github.com/flagos-ai/FlagTree) 是一个针对多种
AI 平台的、开源的统一编译器。在安装 FlagTree 之前，请先阅读 FlagTree
项目的运行环境需求。

`requirements_<backend>.txt` 文件已经包含 FlagTree 以及构建依赖
（如 `scikit-build-core`、`pybind11`、`ninja`、`cmake`），
可以通过以下命令一起安装。

```shell
pip install -r requirements/requirements_nvidia.txt
```

> [!TIP]
> **提示**
>
> - 对于[非 NVIDIA 平台](../usage/non-nvidia)，
>   你必须**使用** `requirements/` 目录下的其他
>   `requirements_<backend>.txt` 文件。
> - 我们正在努力简化这一安装步骤。请持续关注。

### 3.3 安装软件包

*FlagGems* 既可以作为纯 Python 软件包来安装，也支持带 C++ 扩展特性的安装。
C++ 扩展特性仍然是一种实验性特性，所以如果你计划在生产环境中使用，
请确保在开始使用之前进行必要的评估测试。

### 3.3.1 带 C++ 扩展特性的安装

如果你不打算启用 C++ 封装的算子，可以跳过这一步。

如要构建、安装 *FlagGems* 中的 C++ 扩展特性，则必须在安装过程中为 CMake
指定选项 `-DFLAGGEMS_BUILD_C_EXTENSION=ON`。你可以通过设置 `SKBUILD_CMAKE_ARGS`
或者 `CMAKE_ARGS` 环境变量这两种方式来为 CMake 提供参数。
下面的命令以可编辑模式（Editable Mode）安装 `flag_gems` 包，同时使用
`CMAKE_ARGS` 环境变量来启用 C++ 扩展特性：

```shell
CMAKE_ARGS="-DFLAGGEMS_BUILD_C_EXTENSIONS=ON -DCMAKE_BUILD_TYPE=Release" \
pip install -v -e .
```

> [!TIP]
> 建议显式指定 `-DCMAKE_BUILD_TYPE=Release`。
> 若不指定构建类型，`libtriton_jit` 及 `FlagGems` 自身的 C++
> 代码都不会针对所选目标平台启用编译器优化（`-O3 -DNDEBUG` 等），
> 从而导致 C++ wrapper 的执行时间明显变长，拉低 C++ 封装算子的整体性能。

> [!NOTE]
> 若构建失败（例如依赖冲突或 pip 无法定位已安装的 PyTorch），
> 可在 `pip install` 命令上加 `--no-build-isolation`，让 pip
> 复用当前环境中已装好的 PyTorch 以及 `requirements_<backend>.txt`
> 预装的构建依赖。更多细节参见 [§4.2 关于构建隔离](#build-isolation)。

上面的命令默认构建 **CUDA** 后端。如需构建其他后端或启用 pointwise 动态 C++ 模块，
请传递相应的 CMake 选项。以下是各平台的编译示例：

**NVIDIA CUDA（启用 pointwise 动态 C++ 支持）**

```shell
CMAKE_ARGS="-DFLAGGEMS_BUILD_C_EXTENSIONS=ON -DCMAKE_BUILD_TYPE=Release" \
pip install -v -e .
```

**天数智芯 CoreX (IX)**

```shell
export LIBRARY_PATH=<corex-install-dir>/lib64:$LIBRARY_PATH
#export LIBRARY_PATH=/usr/local/corex/lib64:$LIBRARY_PATH
CMAKE_ARGS="-DFLAGGEMS_BACKEND=IX -DFLAGGEMS_BUILD_C_EXTENSIONS=ON -DCMAKE_BUILD_TYPE=Release" \
pip install -v -e .
```

**摩尔线程 (MUSA)**

```shell
export MUSA_HOME=<musa-install-dir>
#export MUSA_HOME=/usr/local/musa-xxx
CMAKE_ARGS="-DFLAGGEMS_BACKEND=MUSA -DFLAGGEMS_BUILD_C_EXTENSIONS=ON -DCMAKE_BUILD_TYPE=Release" \
pip install -v -e .
```

**华为昇腾 (NPU)**

```shell
CMAKE_ARGS="-DFLAGGEMS_BACKEND=NPU -DFLAGGEMS_BUILD_C_EXTENSIONS=ON -DCMAKE_BUILD_TYPE=Release" \
pip install -e .
```

注意，上面的命令会安装 [libtriton_jit 库](https://github.com/flagos-ai/libtriton_jit)，
并且安装方式是克隆其 GIT 仓库并从源码来安装。

关于命令行选项的更详细的信息，你可以参考以下小节：

- [CMake 选项](#cmake-options).
- [pip 选项](#pip-options).
- [构建隔离（build isolation）](#build-isolation)
- [安装 libtriton_jit](#libtriton-jit)

#### 3.3.2 仅安装 Python 软件包

你可以将 `flag_gems` 作为纯 Python 软件包来安装。
如果你希望直接使用 `flag_gems`，无意对其实现作任何修改或定制，
可以将其安装到你的 Python 运行环境中：

```shell
pip install .
```

这种安装方式类似于 `pip install flag_gems` 命令所完成的动作。
唯一的区别是在这里你所使用的不是预先构建好的 Python wheel 发行包，
而是从项目的源代码来安装。

如果你在参与 *FlagGems* 的开发或测评、优化工作，例如开发新的算子，
或者执行一些类似的开发、测试工作，你可以通过在命令行中指定 `-e`
参数完成**可编辑的**安装部署，如下例所示：

```shell
pip install -e .
```

关于一些 `pip` 的常用选项，你可以在 [pip 选项参考资料](#pip-options)
一节中阅读一些详细说明。

## 4. 参考资料

### 4.1 常用的 `pip` 选项 {#pip-options}

一些经常使用的 `pip` 命令行选项包括：

1. `-v`：显示配置与构建过程的详细日志信息。

2. `-e`：执行**可编辑模式的**安装部署。需要注意的是，在可编辑的部署环境中，
   C++ 部分的代码（头文件、库、cmake 包文件等等）都会被安装到 Python
   （可以是虚拟环境）的 `site-packages` 目录下，而 `flag_gems` 包中的
   Python 代码会继续存放在当前目录下。包安装程序会在 `site-packages`
   目录下安装一个加载器来找到 `flag_gems` 的 Python 代码。

3. `--no-build-isolation`：指示 `pip` 在构建项目时**不要**创建独立的虚拟环境
   （即 virtualenv 或者缩写为 venv）。这一选项通常用于可编辑模式的安装部署。
   需要注意的是，如果在构建时不使用隔离环境，你必须手动完成构造依赖项的安装。
   更多的细节可参阅[构建隔离](#build-isolation)小节。

4. `--no-deps`：指示 `pip` 不要安装依赖包。
   如果你不希望 `pip` 更新已经安装部署的依赖包时，这一选项是有用的。

### 4.2 关于构建隔离 {#build-isolation}

根据社区 [PEP 517](https://peps.python.org/pep-0517/#recommendations-for-build-frontends-non-normative) 所给的倡议，
诸如 `pip` 或者其他一些较新的构建前端（build frontend）一般会使用隔离环境来构建软件包。
构建过程会创建一个**虚拟环境（Virtual Environment）**，并在该环境中安装构建的需求，
之后才会启动软件包的构建过程。

如果你不希望使用构建隔离（通常是指可编辑模式的安装），可以为 `pip install`
命令指定 `--no-build-isolation` 参数。设置这一参数之后，安装程序会在识别出依赖项后，
尽可能复用系统上已经安装了的、版本兼容的软件包。
这也意味着作为用户的你要在自己的环境中预先安装 `build-requirements` 的内容。
如果不启用构建隔离，你需要查阅 `pyproject.toml` 文件中的 `[build-system.requires]`
小节，手动安装其中列举的软件包。

### 4.3 关于 CMake 选项 {#cmake-options}

如前所述，在构建、安装 `flag_gems` 时，你可以通过环境变量 `SKBUILD_CMAKE_ARGS`
或 `CMAKE_ARGS` 向 CMake 传递参数选项。
需要注意的是，对于环境变量 `SKBUILD_CMAKE_ARGS` 而言，如果需要指定多个参数选项，
这些参数要使用分号（`:`）隔开；对于 `CMAKE_ARGS`，多个选项要使用空格来分隔。
造成这一差别的主要原因是 `scikit-build-core` 与其前身 `scikit-build`
之间存在不兼容的变更。

用来配置 `flag_gems` 安装的 CMake 选项如下：

<table>
<thead>
<tr>
  <th>选项</th><th>描述</th><th>默认值</th>
<tr>
</thead>
<tbody>
<tr>
  <td><code>FLAGGEMS_USE_EXTERNAL_TRITON_JIT</code></td>
  <td>
    是否使用外部的 <a href="#libtriton-jit">Triton JIT 库</a>。
  </td>
  <td><code>OFF</code></td>
</tr>
<tr>                                      |
  <td><code>FLAGGEMS_USE_EXTERNAL_PYBIND11</code></td>
  <td>
    是否使用外部的 `pybind11` 库。
  </td>
  <td><code>ON</code></td>
</tr>
<tr>                                      |
  <td><code>FLAGGEMS_BUILD_C_EXTENSIONS</code></td>
  <td>
    是否构建 C++ 扩展。以开发模式安装时建议启用此选项。
  </td>
  <td><code>ON</code></td>
</tr>
<tr>
  <td><code>FLAGGEMS_BUILD_CTESTS</code></td>
  <td>
    是否构建 C++ 扩展的单元测试。
  </td>
  <td>取值为 <code>FLAGGEMS_BUILD_C_EXTENSIONS</code></td>
</tr>
<tr>
  <td><code>FLAGGEMS_INSTALL</code></td>
  <td>
    是否安装 FlagGems 的 CMake 包。建议以开发模式安装时启用此选项。
  </td>
  <td>ON</td>
</tr>
<tr>
  <td><code>FLAGGEMS_BACKEND</code></td>
  <td>
    目标后端平台。合法取值为 <code>CUDA</code>、<code>IX</code>、<code>MUSA</code> 和 <code>NPU</code>。
  </td>
  <td><code>CUDA</code></td>
</tr>
<tr>
  <td><code>FLAGGEMS_BUILD_POINTWISE_DYNAMIC_CPP</code></td>
  <td>
    是否构建 pointwise 动态 C++ 支持模块。
  </td>
  <td><code>OFF</code></td>
</tr>
</tbody>
</table>

### 4.4 `scikit-build-core` 选项  {#scikit-build-core-options}

工具 `scikit-build-core` 是一个**构建后端（Build Backend）**，用来桥接 CMake
和 Python 这两个构建系统，进而简化使用 CMake 来构建 Python 模块的过程。
用来配置 `scikit-build-core` 的一些常用环境变量包括：

1. `SKBUILD_CMAKE_BUILD_TYPE`：用来配置项目的构建类型。
   合法的取值包括 `Release`、`Debug`、`RelWithDebInfo` 和 `MinSizeRel` 等。
1. `SKBUILD_BUILD_DIR`：用来设置项目的构建目录。
   默认取值为 `pyproject.toml` 文件中定义的 `build/{cache_tag}`。

### 4.5 关于 `libtriton_jit` 库   {#libtriton-jit}

*FlagGems* 的 C++ 扩展特性依赖于 [TritonJIT](https://github.com/flagos-ai/libtriton_jit/)，
一个用 C++ 来实现 Triton JIT 运行时的库。利用 TritonJIT，我们可以在 C++
代码中调用 Triton 的 JIT 函数。
如果在构建、安装 `flag_gems` 时使用外部的 TritonJIT 库，
就意味着你需要单独构建并安装它，从而满足 `flag_gems` CMake 构建的前提条件；
之后要使用 `-DTritonJIT_ROOT=<安装路径>` 选项将安装位置告知 CMake。

例如，下面的命令会启动一个可编辑的安装动作，
并且使用在 `/usr/local/lib/libtriton_jit` 下已经安装好的外部 *TritonJIT* 实例。

```shell
CMAKE_ARGS="-DFLAGGEMS_BUILD_C_EXTENSIONS=ON -DFLAGGEMS_USE_EXTERNAL_TRITON_JIT=ON -DTritonJIT_ROOT=/usr/local/lib/libtriton_jit" \
pip install -v -e .
```
