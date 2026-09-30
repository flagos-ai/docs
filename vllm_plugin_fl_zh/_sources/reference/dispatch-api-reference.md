# 调度 API 参考

## 便捷函数

- `call_op(op_name, *args, **kwargs)`：调用算子
- `resolve_op(op_name)`：解析算子实现

## 策略管理

- `get_policy()`：获取当前策略
- `set_global_policy(policy)`：设置全局策略
- `reset_global_policy()`：重置为环境变量默认值
- `policy_context(policy)`：临时策略上下文
- `policy_from_config(config_path)`：从 YAML 配置文件创建策略

## 管理器

- `get_default_manager()`：获取默认管理器实例
- `reset_default_manager()`：重置默认管理器

## 插件发现

- `discover_plugins(registry)`：发现并加载插件
- `get_discovered_plugins()`：获取已发现插件列表
- `clear_discovered_plugins()`：清除已发现插件列表

## 日志

- `get_logger(name)`：获取日志记录器实例
- `set_log_level(level, name)`：设置日志级别
