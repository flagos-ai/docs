**Performance-related metrics must remain key acceptance criteria throughout Stages 3-6.** Stage 3 focuses on operator performance, Stage 4a on communication throughput and linearity, and Stage 4b on training/inference accuracy and end-to-end performance. Before advanced cooperation, Day 0, distribution, or showroom plans, the efficiency target relative to the NVIDIA baseline under equivalent compute must be confirmed. The exact percentage will be defined later according to the KT2 requirements.

|**Stage**|**Acceptance criteria**|**Pass standard**|**Required hardware**|
|---|---|---|---|
|Stage 0|MOU signing|Effective after both parties sign or seal|N/A|
|Stage 1|Environment readiness|Chip is recognized by the OS and PyTorch can recognize the backend|1 development board|
|Stage 2|Triton kernel compilation pass rate|>=95%, CI machine availability >=99%|1 CI machine|
|Stage 3|FlagGems operator test pass rate|>=80%, core operators 100%|1 CI machine and 1 debug machine|
|Stage 4a|Homogeneous collective communication throughput ratio|>=99% of the native library|2-machine multi-card cluster|
|Stage 4b|Model accuracy deviation|<2% relative to the NVIDIA baseline|Reuse Stage 4a devices|
|Stage 5|CTS core tests passed|100% passed or waiver approved|1 CI machine and 2 SVT machines|
|Stage 6|Number of models released through FlagRelease|>=10 models|1 dedicated FR machine|
|Advanced cooperation|Equivalent-compute performance comparison|Efficiency reaches X% of the NVIDIA equivalent-compute baseline|Multi-card cluster, FR machine, or CI|
