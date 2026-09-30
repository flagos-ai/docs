# Operator Dispatch User Guide

<!-- CHANGED: v0.2.0 documents policy-based dispatch and distributed communication while keeping the public scope to the three released layers; PD disaggregation is outside the v0.2.0 release scope. -->
The dispatch system provides operator replacement and distributed communication configuration through YAML files and environment variables. You can control the replacement layers independently and configure platform-aware communication backends.

The dispatch system supports both YAML configuration and environment variables for fine-grained control. Environment variables take precedence over YAML config.

The priority chain is as follows:

```{code-block} python
SGLANG_FL_* env vars > YAML config (SGLANG_FL_CONFIG) > Platform auto-detect YAML > Code defaults
```

```{toctree}
:maxdepth: 2

dispatch-through-yaml-file.md
dispatch-through-environment-variables.md
debugg-and-diagonostics.md
vendor-integration.md

```
