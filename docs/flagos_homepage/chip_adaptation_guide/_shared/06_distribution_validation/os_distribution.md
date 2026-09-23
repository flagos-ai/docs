# OS Distribution Validation

**Validation party**

OS distribution company

**Validation scope**

1. Driver loading and stability on the target OS kernel version.
2. Compatibility of core system libraries such as glibc, libstdc++, and OpenMPI.
3. Docker/containerd runtime operation.
4. Kernel module signature validation.

**Hardware requirements**

One device provided by the chip company or made available for remote access.

**Acceptance criteria**

1. The driver loads normally on the target kernel, with no errors in dmesg.
2. Core LTP test items pass.
3. The container runtime can pull and run standard images.

**Relationship to certification**

After the chip obtains FlagOS Verified certification, it enters the OS distribution validation pipeline.
