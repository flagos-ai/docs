Throughout chip adaptation, the chip company must provide physical devices at each stage to support CI/CD, validation, and release. For the first two batches, two machines are recommended for each batch. A separate machine is required for the FlagRelease stage. Additional machines are usually required for Day 0, distribution, cloud-native, or showroom plans. Virtualization can supplement multi-OS validation, but critical validation still requires physical devices.

|**Stage ID**|**Stage**|**Required devices**|**Purpose**|**Configuration requirements**|**Availability timing**|
|---|---|---|---|---|---|
|Stage 1|Environment readiness|1 chip development board or server with remote access for the FlagOS team|Single-card operation|Ubuntu OS, 64 GB or more memory|Prepare immediately after the Stage 0 MOU is signed|
|Stage 2|FlagTree compiler integration|1 CI machine added to the CI resource pool and 1 debug machine|Compiler build validation and CI pipeline triggers|Single card, 200 GB or more disk space, network access to the FlagOS CI cluster|Connect to CI when Stage 2 starts|
|Stage 3|FlagGems operator adaptation|2 CI machines and 1 debug machine|Automated CI tests and operator development/debugging|CI machines must stay reliably online; the debug machine should preferably be available to the FlagOS community|Confirm the CI machine SLA when Stage 3 starts|
|Stage 4|End-to-end validation|2 CI machines and 2 SVT machines|Continuous CI regression and system validation testing|SVT machines must be isolated from CI machines to avoid interference|Available when Stage 4 starts|
|Stage 5|FlagRelease release|1 dedicated FR machine|Model migration, image builds, and release validation|Single card or above, 200 GB or more disk space, high-speed network|Available when Stage 5 starts|
