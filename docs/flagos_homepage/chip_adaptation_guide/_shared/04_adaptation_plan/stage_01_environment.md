# Stage 1: Development Board Readiness and Base Environment Adaptation (Chip-Level)

**Prerequisites**

The MOU has been signed.

**Hardware investment**

1 development board or server, with remote access provided by the vendor to the FlagOS team.

**Activities**

1. Provide the chip development board and select at least one operating system, preferably Ubuntu.
2. Provide the driver and SDK access method. Open downloads are preferred. If authorization-only downloads are used, programmatic authentication must support CI/CD automation.
3. Confirm base image compatibility. A neutral image is preferred, followed by a vendor-provided image.
4. Confirm software compatibility, including kernel, Python, and PyTorch community version coverage.
5. Validate the base environment: PyTorch can recognize the target device backend, and the equivalent device discovery API returns an available device.

**Deliverables**

Environment readiness report and driver/SDK access documentation.

**FlagOS contacts**

Platform engineering team.

**Chip company contacts**

Driver and firmware engineers.

**Acceptance criteria**

1. The chip can be correctly identified by the OS, for example through lspci or dmidecode.
2. PyTorch can recognize the chip backend.
3. Basic operators, such as matrix multiplication and elementwise operations, execute correctly.
4. The driver can be obtained unattended.

**Estimated duration**

1-2 weeks

**Related documents**

Environment configuration guide, driver installation manual, and compatibility matrix.
