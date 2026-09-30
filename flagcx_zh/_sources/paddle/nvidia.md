# 在 NVIDIA GPU 环境下使用 Paddle 和 FlagCX 指南

## 环境配置

1. 在 NVIDIA GPU 环境上准备一个 docker 容器
2. 启动 docker 容器

    ```bash
    sudo docker exec -it [container_name] bash
    ```

3. 克隆 Paddle

    ```bash
    git clone https://github.com/PaddlePaddle/Paddle.git
    ```

## 使用 FlagCX 编译 Paddle

请按照以下命令操作：

```bash
# 切换到 develop 分支
cd Paddle && git checkout develop
# 创建 build 目录
mkdir build && cd build
# 安装 paddle 依赖
pip install -r ../python/requirements.txt
# 运行 cmake
cmake .. -GNinja -DPY_VERSION=3.10 -DWITH_GPU=ON -DWITH_FLAGCX=ON -DWITH_DISTRIBUTE=ON -DCMAKE_BUILD_TYPE=Release

# 编译
ninja -j$(nproc)
# 定位 paddle whl 包
cd ./python/dist
# 安装 whl 包
pip install -U [whl_package_name]
# 检查安装是否成功
python -c "import paddle;paddle.utils.run_check()"
```

## 使用 Paddle + FlagCX 训练模型

我们支持在 NVIDIA GPU 环境上使用 Paddle + FlagCX 训练 GPT3。请参考以下步骤开始。

1. 克隆 PaddleNLP

    ```bash
    git clone https://github.com/PaddlePaddle/PaddleNLP.git
    ```

2. 安装依赖

    ```bash
    pip install -r requirements.txt
    pip install -r requirements-dev.txt
    ```

3. 下载数据

    ```bash
    # 创建数据目录
    mkdir -p ./llm/data 
    cd ./llm/data

    # 下载数据
    wget https://bj.bcebos.com/paddlenlp/models/transformers/gpt/data/gpt2_openwebtext_100k.bin
    wget https://bj.bcebos.com/paddlenlp/models/transformers/gpt/data/gpt2_openwebtext_100k.idx 
    ```

4. 准备训练脚本  
    请参考以下脚本训练 GPT3

    ```bash
    # 这是使用 flagcx 作为通信后端在 NVIDIA GPU 机器上训练 gpt3 的脚本
    # 定义根路径
    export root_path=/workspace
    export PYTHONPATH=$root_path/PaddleNLP:$PYTHONPATH
    export PADDLE_DISTRI_BACKEND=flagcx

    # 日志
    export GLOG_v=0
    export FLAGCX_DEBUG=INFO
    export FLAGCX_DEBUG_SUBSYS=INIT

    current_date=$(date +"%m%d")
    task_name="gpt13b_dynamic_hand_nosp_ly4_debug_$current_date"
    log_dir="log_$current_date/${task_name}_1"
    output_dir="output_$current_date/${task_name}_1"

    rm -rf ${log_dir}
    rm -rf ${output_dir}


    python -u -m paddle.distributed.launch \
        --gpus "0,1,2,3,4,5,6,7" \
        --log_dir ${log_dir} \
        run_pretrain.py \
        ${root_path}/PaddleNLP/tests/test_tipc/dygraph/hybrid_parallelism/gpt3/auto_config_gpt3_13b/pretrain-gpt3_13b-config.json

    echo "---- $task_name performance:"
    echo "throughput(tokens/s/card):"
    cat ${log_dir}/workerlog.0 | grep "interval_tokens_per_second_per_device:" | awk -F ',' '{print $11}' | awk -F ' ' '{print $2}' | awk 'NR > 10 {print $1}' |sort -n | awk '{values[NR] = $1} END {for (i = 3; i <= NR-2; i++) sum += values[i]; print sum / (NR-4)}'

    echo "max_memory_allocated(GB):"
    cat ${log_dir}/workerlog.0 | grep "interval_tokens_per_second_per_device:" | awk -F ',' '{print $7}' | tail -n 1

    echo "max_memory_reserved(GB):"
    cat ${log_dir}/workerlog.0 | grep "interval_tokens_per_second_per_device:" | awk -F ',' '{print $8}' | tail -n 1
    ```