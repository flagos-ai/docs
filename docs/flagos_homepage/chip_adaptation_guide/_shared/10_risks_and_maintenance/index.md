# Risks and Maintenance

|**Risk or requirement**|**Description**|
|---|---|
|Driver access method|Refreshing token authentication every 30 minutes is impractical for automation. Driver and SDK packages should be openly downloadable or use long-lived authorization.|
|Specific dependency trade-offs|Some trade-offs are allowed at the intermediate stage, but specific dependencies must be eliminated before advanced cooperation.|
|Image build neutrality|Use neutral base images to demonstrate compatibility rather than relying entirely on vendor-customized images.|
|Long-term maintenance commitment|Advanced cooperation requires continuous security maintenance and progressive improvement of TLS and other version lifecycle management.|
|Heterogeneous mixed efficiency|When a chip is used in a heterogeneous cluster at the intermediate stage, pay particular attention to mixed communication efficiency of at least 81%.|
|Device SLA|CI devices must stay online 24/7, SVT machines must be isolated, and the FR machine must be configured independently. Long-term offline status may cause certification downgrade or revocation.|
|Waiver period|Each certification-test waiver may last no more than six months. An unresolved waiver must be resubmitted or may result in certification downgrade.|
