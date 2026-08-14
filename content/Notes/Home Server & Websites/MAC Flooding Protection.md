# MAC Flooding Protection and Network Services

## Issue
Metronet modems include protection against MAC flooding attacks by shutting down ports that detect more than 3 MAC addresses simultaneously.

## How Services Generate Multiple MACs
Network services can create virtual MAC addresses:
- Physical Pi MAC address
- nginx worker processes
- Docker network interfaces
- Connection pooling

## Solution: MAC Address Binding
Bind all Pi services to use single MAC address:
1. Create `/etc/systemd/network/00-default.link`
2. Configure to use Pi's physical MAC
3. Forces all services and containers to present as one device

## Implementation
```
[Match]
OriginalName=eth0

[Link]
MACAddress=2c:cf:67:73:f9:2a
```

## Benefits
- Prevents triggering Metronet's MAC flood protection
- Allows proxy setup without security shutdowns 
- Maintains stable network identity across all services
