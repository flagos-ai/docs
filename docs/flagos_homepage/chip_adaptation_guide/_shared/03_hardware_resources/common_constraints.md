# Key Constraints

- CI devices must stay online 24/7 and be managed through the unified FlagOS CI/CD resource pool.

- SVT devices should be physically isolated from CI devices to prevent validation jobs and CI jobs from competing for resources.

- The dedicated FlagRelease machine should be configured independently and should not be shared with other workloads.

- All devices must support automated access. Driver and SDK packages should preferably be available through open downloads or long-lived authorization.
