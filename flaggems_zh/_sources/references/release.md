# 关于打包与发布

创建源码或二进制发行包的过程类似于基于[源码来构建和安装](../installation/#install-from-source)的过程。
打包过程包括对前端（如 `pip` 或 `build`）的调用以及将命令发送给后端
（`scikit-build-core`）的动作。

## 1. 使用 `build` 构建前端

要使用 `build` 包（建议）来构建一个 wheel 包，执行以下命令：

```shell
pip install -U build
python -m build --no-isolation --no-deps .
```

这一命令会首先基于源码创建一个源码发行包（sdist），之后构建一个二进制发行包（wheel）。

如果你希望禁用默认的构建过程（源码目录 -> sdist -> wheel），你可以

- 指定 `--sdist` 选项从源码构建源码发行包（源码目录 -> sdist），或者
- 指定 `--wheel` 选项从源码构建二进制发行包（源码目录 -> wheel），或者
- 指定 `--sdist` 的同时指定 `--wheel` 来基于源码目录构建源码发行包和二进制发行包
  （源码目录 -> sdist，源码目录 -> wheel）。

构建的输出会存放在 `.dist/` 目录下：

## 2. 使用 `pip` 构建前端

另一种方式是使用 `pip` 来生成 wheel 包：

```shell
pip wheel --no-build-isolation --no-deps -w dist .
```

用来配置 `scikit-build-core`
的环境变量的工作方式与[安装说明](../getting-started/installation)文档中的方式一致。

构建二进制包（wheel）的动作完成之后，你可以使用 `pip` 命令来安装。

```shell
cd FlagGems
python -m build --no-isolation --wheel .
```
