Cooperation is divided into three levels: basic, intermediate, and advanced. Chip companies progress through the levels step by step. Given the characteristics of edge chips, no adaptation is required for the FlagCX communication library or the large-model training and inference framework.

|**Dimension**|**Basic (integration validation)**|**Intermediate (deep adaptation)**|**Advanced (ecosystem co-building)**|
|---|---|---|---|
|Positioning|Integration validation|Deep adaptation|Ecosystem co-building|
|Operators|Adopt selected high-performance FlagGems operators|Fully support the FlagGems Stable operator set and commit to using FlagGems by default|Co-build FlagGems and generate specialized operators with KernelGen<br>|
|Compiler|Use the FlagTree compiler and C++ Wrapper|Optimize with Hints and TLE; use FlagTree as the default compiler|Co-build all three Triton TLE implementation layers|
|CI/CD|Use the FlagOS CI resource pool for unit tests<br>|Co-build test cases, upstream code, and provide machine resources. Jointly solve technical issues and complete model adaptation and optimization|Bring in operating-system and cloud partner communities|
|Compatibility and security|Provide base container image materials and download channels for customized third-party dependencies|Obtain FlagOS certification, promptly update customized packages, and respond immediately to package adaptation issues|Share security working-group results and bring them into downstream distributions<br>|
|Open-source community|Basic member|Intermediate member, eligible to run for PMC|Advanced member, with course and case-study coverage|
|Business expansion|—|Bring in partner clouds and MaaS platforms|Bring in upstream and downstream ecosystem communities|
