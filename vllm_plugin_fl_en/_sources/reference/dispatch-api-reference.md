# Dispatch API Reference

## Convenience Functions

- `call_op(op_name, *args, **kwargs)`: Call an operator
- `resolve_op(op_name)`: Resolve operator implementation

## Policy Management

- `get_policy()`: Get current policy
- `set_global_policy(policy)`: Set global policy
- `reset_global_policy()`: Reset to environment variable defaults
- `policy_context(policy)`: Temporary policy context
- `policy_from_config(config_path)`: Create policy from YAML config file

## Manager

- `get_default_manager()`: Get default manager instance
- `reset_default_manager()`: Reset default manager

## Plugin Discovery

- `discover_plugins(registry)`: Discover and load plugins
- `get_discovered_plugins()`: Get list of discovered plugins
- `clear_discovered_plugins()`: Clear discovered plugins list

## Logging

- `get_logger(name)`: Get logger instance
- `set_log_level(level, name)`: Set log level
