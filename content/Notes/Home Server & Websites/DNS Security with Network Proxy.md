# DNS Security with Network Proxy

## Problem
Browser-level DNS-over-HTTPS (DoH) bypasses local DNS blocking by sending encrypted queries directly to providers.

## Solution Options
1. Firewall rules blocking DoH ports
2. IP-based blocking
3. **Proxy/gateway interception**
   - Chosen for flexibility and minimal service disruption

## Proxy Architecture
**Current:**
Devices → Eero → Internet (DoH bypass possible)

**Proposed:** 
Devices → Eero → Proxy → Internet (No bypass possible)


## Implementation Plan
### Hardware
- Raspberry Pi 5
- USB 3.0 to Gigabit Ethernet adapter
- Physical layout: Fiber → Modem → Pi5 (USB) → Pi5 (ethernet) → Eero → Devices

### Software
- ngnix proxy gateway
- DNS chain: Devices → Eero → Proxy → Technitium → AdGuard → Cloudflare

### Setup Steps
1. ~~Install ngnix on Pi 5~~ done
2. ~~Install USB ethernet adapter~~ done
3. Configure Pi 5 gateway mode, in process
	- [x] enable IP forwarding and make permanent
	- [x] configure network interfaces
	- [x] set up NAT forwarding  and make permanent
	- [ ] Setup dnsmasq for DHCP/DNS
	- [ ] Migrate DNS services
	- [ ] set Eero to bridge mode
	- [ ] test
4. Reconnect network devices
5. Configure nginx as transparent proxy
6. update server connections

#### physically place Pi 5 between modem and router

#### ✨ test gateway
Here are the gateway verification steps to test before proceeding with DNS migration:

1. Basic connectivity tests:
- Ping from device through both network interfaces
- Verify IP forwarding: `sudo sysctl net.ipv4.ip_forward`
- Check interface status: `ip a` should show both interfaces up with correct IPs

2. Traffic flow verification:
- Run `tcpdump -i eth0` and `tcpdump -i usb0` to verify traffic flowing through both interfaces
- Test outbound connectivity: `curl -v https://example.com` from a client device
- Verify NAT: `sudo iptables -t nat -L -n -v` should show packet counts increasing

3. Performance check:
- Speed test through gateway
- Check for packet loss: `mtr 8.8.8.8`
- Monitor system resources: `htop` to ensure no bottlenecks

If any test fails, should resolve before proceeding with DNS migration. 
#### dnsmasq configuration for /etc/dnsmasq.conf:
```
interface=eth0
dhcp-range=192.168.4.2,192.168.4.254,24h
dhcp-option=option:router,192.168.4.1
dhcp-option=option:dns-server,192.168.4.1
server=127.0.0.1#53
cache-size=1000
```

Test configuration:
```
sudo dnsmasq --test
sudo systemctl restart dnsmasq
```

Verify DHCP is working by connecting a device and checking it gets an IP in the correct range.
#### DNS Migration steps:
1. Update container networking:
```
dns-net:
	subnet: 192.168.4.0/24
	gateway: 192.168.4.1
```

2. Update container IPs:
	- Technitium: 192.168.4.2
	- AdGuard: 192.168.4.3

3. Update dnsmasq config:
```
server=192.168.4.2#53
```

4. Test chain:
	- Verify device → dnsmasq → Technitium → AdGuard → Cloudflare
	- Use `dig` or `nslookup` at each step

Key point: Keep old network running until testing confirms new setup works.
#### transparent proxy
Transparent proxy setup with nginx:

1. Install required packages:
```
apt install nginx nginx-extras
```

2. Configure nginx as stream proxy in /etc/nginx/nginx.conf:
```
stream {
    map $ssl_preread_protocol $upstream_port {
        "" 80;
        default 443;
    }

    server {
        listen 80;
        listen 443;
        ssl_preread on;
        
        proxy_connect_timeout 5s;
        proxy_timeout 30s;
        
        proxy_pass $remote_addr:$upstream_port;
        
        error_log /var/log/nginx/stream_error.log info;
        access_log /var/log/nginx/stream_access.log combined;
    }
}

# Enable proxy protocol if needed
proxy_protocol on;
```

3. Enable IP forwarding settings:
```
net.ipv4.ip_forward=1
net.ipv4.conf.all.route_localnet=1
```

4. Add iptables rules to redirect traffic to nginx:
```
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8443
```

5. Test setup:
- Start nginx
- Verify connections route through proxy
- Check logs for errors

#### update windows server connections
update configuration for services that other devices connect to by IP. Specifically:

1. Ollama - current endpoint [http://ollama.home:3000](http://ollama.home:3000)
2. Portainer - current endpoint [https://winserver.home:9443](https://winserver.home:9443)
3. Any Syncthing clients that connect to Windows server
4. Any RustDesk configurations pointing to that server
5. Any manual DNS entries in Technitium for Windows server services

However, since you're using .home domain names for most services, you can minimize disruption by just updating the DNS records in Technitium once the server gets its new IP.

#### update pi 5 server connections
update Pi 5 connections. From the docs, these Pi 5 services will need updates:

- Portainer ([https://pi5.home:9443](https://pi5.home:9443))
- AdGuard Home ([http://adguard.home](http://adguard.home))
- Technitium DNS ([http://dns.home:5380](http://dns.home:5380))
- Syncthing ([https://192.168.4.5:8384](https://192.168.4.5:8384))
- Uptime Kuma ([http://192.168.4.5:3001](http://192.168.4.5:3001))

Most are using .home domains so they'll just need DNS record updates in Technitium, like the Windows services. Only Syncthing and Uptime Kuma are using direct IPs that will need configuration changes.

#### Potential significant issues:

1. Performance bottlenecks through Pi 5 affecting network speed
2. DNS leaks if proxy isn't configured correctly
3. Service disruption during DNS migration if not all devices/services update properly
4. SSL/HTTPS issues with the transparent proxy
5. DHCP conflicts if dnsmasq and Eero settings aren't perfectly aligned
## Benefits
- Network-wide solution
- No per-device configuration
- Maintains existing services
- Complete DNS control
