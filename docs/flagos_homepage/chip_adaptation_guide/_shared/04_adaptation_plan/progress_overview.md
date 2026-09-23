# Overall Progress Overview

````{only} flagos_cloud
**Overall progress overview:** The figure below shows the complete path from contract kickoff, environment readiness, compiler integration, operator coverage, communication, training and inference, validation, compliance, release, and promotion. It is organized around key deliverables, cooperation-level evolution, and hardware investment.

**Performance metric requirements:** Starting from Stage 3, operator performance, communication throughput, model accuracy, and end-to-end efficiency gradually become acceptance metrics. For advanced cooperation, performance metrics are a key baseline. Under equivalent compute, the chip must reach a defined percentage of the NVIDIA baseline; the specific percentage will be confirmed later through the KT2 milestone.
````

````{only} flagos_edge
**Overall progress overview:** The figure below shows the complete path from contract kickoff, environment readiness, compiler integration, operator coverage, validation, compliance, release, and promotion. It is organized around key deliverables, cooperation-level evolution, and hardware investment.

**Performance metric requirements:** Starting from Stage 3, operator performance, model accuracy, and end-to-end efficiency gradually become acceptance metrics. For advanced cooperation, performance metrics are a key baseline.
````

**Quality and continuous maintenance requirements:** Vendors must commit to maintaining the mainline adaptation code. FlagOS upgrades and vendor Driver/SDK upgrades must both be covered by CI/CD validation so that performance results remain sustainable, reproducible, and releasable.

````{only} flagos_cloud
![image.png](/chip_adaptation_guide/assets/cloud/progress_overview-en.png)
````

````{only} flagos_edge
![image.png](/chip_adaptation_guide/assets/edge/progress_overview-en.png)
````

Figure 3. Overall progress overview

````{only} flagos_cloud
Estimated total duration: about 5-7 months from signing to release. Total hardware investment increases with the cooperation target. The basic path requires about 1 development board, 1 CI machine, 2 SVT machines, and 1 dedicated FR machine. Additional machines should be added for Day 0, distribution, cloud-native, or showroom plans.
````

````{only} flagos_edge
Estimated total duration: about 3-5 months from signing to release. Total hardware investment increases with the cooperation target. The basic path requires about 1 development board, 1 CI machine, 2 SVT machines, and 1 dedicated FlagRelease (FR) machine. Additional machines should be added for Day 0, distribution, cloud-native, or showroom plans.
````
