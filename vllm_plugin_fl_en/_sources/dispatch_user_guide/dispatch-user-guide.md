# Operator dispatch user guide

This guide describes how to use an operator dispatch system that selects between FlagGems, vendor-specific, and PyTorch reference implementations. The selection follows a priority hierarchy, from highest to lowest:

- User-specific configuration file (YAML)
- Item-specific environment variables
- Platform configuration file (for example, ascend.yaml and cuda.yaml)
- Built-in default values

```{toctree}
:maxdepth: 2

quick-start.md
configure-backend-selection.md
configure-policy.md
add-ops-and-vendors.md

```
