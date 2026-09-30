# 安装 FlagQuantum

请先阅读[环境要求](requirements.md)。

## 步骤

1. 安装 FlagQuantum

   - 安装正式发布的包

     ```{code-block} shell
     python -m pip install flagquantum
     ```

   - 安装带开发工具的开发版检出

     ```{code-block} shell
     git clone https://github.com/flagos-ai/FlagQuantum.git
     cd FlagQuantum
     python -m pip install -e ".[dev]"
     ```

2. 按需增加可选依赖

   ```{code-block} shell
   python -m pip install -e ".[jax,cuda,viz]"
   ```

   请使用[环境要求](requirements.md)中的分组名，而不是手工安装外部框架，这样才会沿用已锁定的兼容区间。

3. 验证安装

   ```{code-block} python
   import flagquantum as fq
   print(fq.__version__)
   ```

4. 验证本地执行路径

   ```{code-block} shell
   python -m examples.local.simulate
   python -m examples.local.measure
   python -m examples.local.train
   ```

   这三个示例覆盖本地态向量模拟、测量与 PyTorch 原生训练，不需要凭据、远程资源或可选后端。

## 开发容器

仓库同时提供面向 CPU 与 CUDA 环境的开发容器定义，并区分是否包含 JAX 与 QSteed 编译器。如果你更希望使用准备好的环境，请按仓库中的容器指南操作；镜像从本地检出安装 FlagQuantum 并内置 JupyterLab，且都不包含提供方凭据。

## 下一步

- [构建并运行你的第一个程序](../user_guide/basic-usage.md)
- [使用 PyTorch 训练](../user_guide/training-with-pytorch.md)
- [选择模拟表示](../user_guide/simulation-representations.md)
