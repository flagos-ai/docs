# FlagOS Southbound Chip Adaptation Guide: Edge Chips

This guide is for edge AI chip vendors, FlagOS adaptation engineers, system software developers, and distribution partners. It describes the complete path for integrating edge chips with FlagOS, including cooperation levels, device investment, the base environment, the FlagTree compiler, FlagGems operators, compatibility certification, distribution validation, quality metrics, automation tools, promotion criteria, and risk management.

Edge adaptation focuses on stable operation on single-node or small-scale devices, resource-constrained environments, driver and firmware coordination, and end-to-end efficiency. Edge adaptation does not require the FlagCX communication library or the FlagScale large-model training and inference framework by default; if a product explicitly supports these capabilities, they can be evaluated separately within the actual cooperation scope.

```{toctree}
:maxdepth: 2
:numbered: 2

edge/01_technical_stack/index.md
edge/02_cooperation_model/index.md
edge/03_hardware_resources/index.md
edge/04_adaptation_plan/index.md
edge/05_compatibility_certification/index.md
edge/06_distribution_validation/index.md
edge/07_quality_metrics/index.md
edge/08_tools_and_skills/skill_catalog.md
edge/09_promotion_criteria/index.md
edge/10_risks_and_maintenance/index.md
```
