# 安装 FlagGems-vLLM

如需全新安装 FlagGems-vLLM，请按照以下步骤操作。

1. 安装依赖项。

   ```{code-block} bash
   pip install -U 'scikit-build-core>=0.11' pybind11 ninja cmake
   ```

2. 克隆并安装 FlagGems-vLLM。

   ```{code-block} bash
   git clone https://github.com/flagos-ai/FlagGems-vllm.git
   cd FlagGems-vllm
   pip install .
   ```

   对于开发环境，请使用可编辑安装方式：

   ```{code-block} bash
   pip install --no-build-isolation -e .
   ```

   如需运行测试，请同时安装测试依赖项：

   ```{code-block} bash
   pip install -e '.[test]'
   ```
