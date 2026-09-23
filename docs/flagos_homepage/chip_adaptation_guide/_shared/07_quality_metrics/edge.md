**Performance-related metrics must remain key acceptance criteria throughout Stages 3-6.** Stage 3 focuses on operator performance, and Stage 4 focuses on inference accuracy and end-to-end performance.

|**Stage**|**Acceptance criteria**|**Pass standard**|**Required hardware**|
|---|---|---|---|
|Stage 0|MOU signing|Effective after both parties sign or seal|N/A|
|Stage 1|Environment readiness|Chip is recognized by the OS and PyTorch can recognize the backend|1 development board|
|Stage 2|Triton kernel compilation pass rate|>=95%, CI machine availability >=99%|1 CI machine|
|Stage 3|FlagGems operator test pass rate|>=80%, core operators 100%|2 CI machines and 1 debug machine|
|Stage 4|Model accuracy deviation|<2% relative to the NVIDIA baseline|2 CI machines and 1 debug machine|
|Stage 5|CTS core tests passed|100% passed or waiver approved|2 CI machines and 2 SVT machines|
|Stage 6|Number of models released through FlagRelease|>=10 models|1 dedicated FR machine|
