# AI Distribution Validation

**Validation party**

AI distribution company

**Validation scope**

1. Complete installation and operation of PyTorch on the chip.
2. Loading and execution of the FlagGems operator library.
3. End-to-end operation of the Triton compilation pipeline.
4. Loading and inference of representative models such as Qwen2.5 and Llama3.

**Hardware requirements**

The dedicated machine provided by the chip company during the FlagRelease stage can be made available for remote use by the AI distribution.

**Acceptance criteria**

1. PyTorch core test cases pass.
2. The FlagGems operator loading rate reaches 100%.
3. Triton kernels compile and execute correctly.

**Relationship to certification**

AI distribution validation is an important reference condition for FlagOS Platinum certification.
