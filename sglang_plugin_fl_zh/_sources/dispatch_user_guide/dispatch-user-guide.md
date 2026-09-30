# 算子调度用户指南

<!-- CHANGED: v0.2.0 documents policy-based dispatch and distributed communication while keeping the public scope to the three released layers; PD disaggregation is outside the v0.2.0 release scope. -->
调度系统通过 YAML 文件和环境变量提供算子替换与分布式通信配置。您可以独立控制替换层，并配置可感知平台的通信后端。

调度系统同时支持 YAML 配置和环境变量，以便进行细粒度控制。环境变量优先于 YAML 配置。

优先级链如下：

```{code-block} python
SGLANG_FL_* 环境变量 > YAML 配置（SGLANG_FL_CONFIG）> 平台自动检测 YAML > 代码默认值
```

```{toctree}
:maxdepth: 2

dispatch-through-yaml-file.md
dispatch-through-environment-variables.md
debugg-and-diagonostics.md
vendor-integration.md

```
