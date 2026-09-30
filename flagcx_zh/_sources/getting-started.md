# 快速开始

## 环境配置

**容器创建参考命令：**

根据需要修改 `<Docker name> <mount directory> <mount point>` 并选择 `<Docker Image>`。

```Plain
-------------NVIDIA A800 平台容器创建参考命令------------
sudo docker run -itd \
                --name <Docker name> \
                --privileged \
                --net=host \
                --pid=host \
                --cap-add=ALL \
                --shm-size 128G \
                --ulimit memlock=-1 \
                --gpus all \
                -v /dev/:/dev/ \
                -v /usr/src/:/usr/src/ \
                -v /lib/modules/:/lib/modules/ \
                -v <mount directory>:<mount point> \
                <Docker Image> \
                /bin/bash
-------------KLX P800 平台容器创建参考命令-----------
sudo docker run -itd \
        --name <Docker name> \
        --privileged \
        --net=host \
        --pid=host \
        --shm-size 128G \
        --ulimit memlock=-1 \
        --group-add video \
        -v <mount directory>:<mount point> \
        -v /usr/local/xpu/:/usr/local/xpu \
        <Docker Image> \
        /bin/bash  
```          

## 构建与安装

1. 获取 FlagCX 源代码

   ```
   git clone https://github.com/flagos-ai/FlagCX.git
   cd FlagCX
   git submodule update --init --recursive
   ```

2. 安装

   **方式 A — Python 安装（pip install）：**

   ```shell
   pip install . -v --no-build-isolation
   ```

   此方式会自动检测硬件后端。您也可以显式指定后端：

   ```shell
   USE_NVIDIA=1 pip install . -v --no-build-isolation
   ```

   **方式 B — C++ 库（make）：**

   查看并选择适合当前平台的构建选项：

   ```
   make USE_NVIDIA=1 -j$(nproc) # NVIDIA GPU 平台
   make USE_CAMBRICON=1 -j$(nproc)  # 寒武纪平台
   make USE_KUNLUNXIN=1 -j$(nproc) # 昆仑芯平台
   make USE_SUNRISE=1 -j$(nproc) # Sunrise AI 平台
   ```

   参见[构建与安装](build.md)获取支持的后端标志完整列表。
   
2. 构建成功结果

   ![flagcx_build_and_installation_successful_build_result.png](images/flagcx_build_and_installation_successful_build_result.png)

3. 编译过程中可能遇到的问题

   - **如果找不到 `nccl.h` 或其他库**

      - 可以先使用 `locate xxx.h` 查找头文件的本地路径。

      - 找到后，可以直接设置 `CCL_HOME=XXX` 指定安装路径。构建系统会自动使用 `$CCL_HOME/include` 和 `$CCL_HOME/lib` 作为头文件和库路径。

      - 如果本地没有该文件，安装相应的头文件/库。有多种安装方法；以下是一个示例：

        ```Plain
        sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys A4B469963BF863CC  # 导入公钥
        echo "deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/ /" | sudo tee /etc/apt/sources.list.d/cuda.list                                # 添加仓库
        sudo apt-get update                                              # 更新 apt
        sudo apt-get install libnccl-dev                                 # 安装 NCCL 开发包
        sudo apt-get install cuda-toolkit-11-8                           # 安装 CUDA Toolkit
        ```


   - 如果出现 `gtest.h` 头文件错误

      安装 Google Test（gtest）单元测试框架

      ```Plain
      git clone https://github.com/google/googletest.git # 获取 gtest 源代码
      cd googletest                                      # 进入项目目录
      mkdir build                                        # 创建用于存储构建输出的目录
      cd build                                           # 进入构建目录
      cmake ..                                           # 为 GoogleTest 生成原生构建脚本
      make                                               # 编译源代码
      sudo make install                                  # 安装静态库
      ```

## 使用 FlagCX 进行同构测试

### 通信 API 测试

1. 环境配置

   选择 Docker 镜像 `<Docker Image>` 创建容器并进入。

2. 选择构建选项

   ```Plain
   cd FlagCX/test/perf/host_api # 进入 Host API 测试目录
   make USE_NVIDIA=1 # 根据硬件平台选择编译选项
   ```

3. 构建成功结果

   ![homogeneous_communication_api_test_successful_build_result.png](images/homogeneous_communication_api_test_successful_build_result.png)

### Device API 测试

Device API 测试验证通过 Device API 进行的节点内和节点间通信。
参见[测试](testing.md)获取测试二进制文件的完整列表、构建说明和运行示例。

### Torch API 测试

1. 环境配置

   - 选择 Docker 镜像 `<Docker Image>` 创建容器并进入。
   
   
      - 检查容器中是否安装了 PyTorch。如果没有，按照以下步骤安装。
   
        ```Plain
        pip list | grep torch         # 检查容器中是否安装了 PyTorch
        ------------------# 安装 PyTorch----------------------------------
        python -m pip install --pre torch \
          --index-url https://download.pytorch.org/whl/nightly/<cuXXX> \
          --trusted-host download.pytorch.org \
          --no-cache-dir --timeout 300 \
          --root-user-action=ignore
          
        nvcc --version 2>/dev/null || nvidia-smi   # 检查 CUDA 运行时驱动版本；如果 release 是 12.4，安装对应的 cu124 版本
        ```
   
         **注意：** `<cuXXX>` 对应于与当前硬件驱动匹配的 CUDA 工具包版本。
   


2. 选择构建选项

   ```
   cd /FlagCX/plugin/torch/
   python setup.py develop --adaptor [xxx]
   ```

   **注意**：`[xxx]` 应根据当前平台选择，例如 `nvidia`、`klx` 等。

   **替代方案 — NCCL 包装插件：**

   对于 NVIDIA 平台，您也可以使用 NCCL 包装插件，它提供了一个可直接替换的 `libnccl.so`，将 NCCL API 调用路由到 FlagCX。这允许任何基于 NCCL 的应用程序（PyTorch、DeepSpeed 等）透明地使用 FlagCX，无需修改代码：

   ```shell
   cd FlagCX/plugin/nccl
   make NCCL_HOME=/path/to/nccl CUDA_HOME=/path/to/cuda
   LD_PRELOAD=./build/lib/libnccl.so your_application
   ```

   详见 FlagCX 仓库中的 `plugin/nccl/README.md`。

3. 构建成功结果

   - 编译后会生成 `build` 目录。运行命令：

     ```
     pip list | grep flagcx
     ```

   - 您应该看到 `flagcx` 版本和路径与当前构建目录匹配，表明编译和安装成功。

     ```
     python -c "import flagcx; print(flagcx)"
     ```

## 使用 FlagCX + FlagScale 进行同构训练

1. 环境配置

   - 选择 Docker 镜像 `<Docker Image>`，创建名为 `<Docker name>` 的容器并进入。

     ```Plain
     ## 查看 conda 环境
     conda env list  
     ## 激活 flagscale-train 环境用于后续操作
     conda activate flagscale-train 
     pip install modelscope 
     pip install pandas
     ```
     
     **注意：** 如果没有名为 "flagscale-train" 的 conda 环境，可能需要运行以下命令设置 conda 环境
     
     ```Plain
     ./install/install-requirements.sh --env train
     ```
     
   
   - 训练后端代码适配（未打补丁模式）
   
     ```Plain
     cd FlagScale
     python tools/patch/unpatch.py --backend Megatron-LM
     ```


2. 构建并安装 FlagCX 库

   - 拉取 FlagScale 和 FlagCX 源代码。

     ```Plain
     git clone https://github.com/flagos-ai/FlagScale.git 
     git clone https://github.com/flagos-ai/FlagCX.git
     ```
   
   
      - 构建并安装 FlagCX
   
        ```Plain
        cd FlagCX                        # 进入 FlagCX 目录；查看 Makefile 根据平台选择构建选项，如 USE_NVIDIA、USE_KUNLUNXIN 等
        make USE_NVIDIA=1                # 使用 NVIDIA GPU 支持编译 FlagCX
        cd plugin/torch                  # 进入 Torch 插件目录
        python setup.py develop --adaptor nvidia   # 以开发模式安装 Python Torch 适配器
        pip list | grep flagcx           # 验证安装并检查已安装 FlagCX 包的绝对路径
        ```
   
   
      - 编译安装成功截图
   
        ```
        python -c "import flagcx; print(flagcx)"
        ```
   


## 使用 FlagCX 进行异构测试

### 通信 API 测试

1. 环境配置

   选择 Docker 镜像 `<Docker Image>` 创建容器并进入。


2. 创建符号链接

   ```
   cd /root
   ln -s /workspace/flagcx_test_[xxx]/FlagCX ./FlagCX
   ```

   **说明**

   - `/workspace/` — 共享文件夹；在容器中挂载后，host1 和 host2 都可以访问。
   - `flagcx_test_[xxx]/FlagCX` — `[xxx]` 表示不同平台的 FlagCX 通信库。
   - `./FlagCX` — 符号链接名称；通过访问 `/root/FlagCX`，可以到达当前平台的 FlagCX 库。

3. 构建并安装

   - 在每台主机上分别编译安装 FlagCX 通信 API。

   - 参见[使用 FlagCX 进行同构测试](getting-started.md)部分的详细步骤。
