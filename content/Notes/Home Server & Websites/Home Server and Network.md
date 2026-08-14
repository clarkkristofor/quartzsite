# Home Server, Network, and Web hosting set up

## Purpose
My home server: 
- makes my network faster and more secure
- teaches me about home servers and networking
- is a playground for fun new projects
## Current Status
**Last Updated:** 2026-07-03
### Active Services
- Windows Server: 9 services
- Raspberry Pi 5: 10 services
- Home Assistant Pi 5: 1 service
- Total: 19 services running

---

## Network Overview
My small home network runs on a Flint 2 router. There is only one network, broadcasting WIFI at 2.4 and 5 Ghz.

**DNS Flow:**
- Client Device -> Flint 2 router (AdGuard Home) -> Raspberry Pi 5 server (Technitium) -> Upstream DNS Servers (1.1.1.1, 9.9.9.9)
## Devices Overview
There are two servers and 50+ other devices.
### WIFI router (1)
1. Flint 2 router, running Adguard Home and Tailscale
### Servers
1. Raspberry Pi 5
2. Windows desktop
3. Home Assistant Server
### Personal Devices
- 3 Windows laptops
- 4 Android smartphones
- 2 Apple iPads
- 1 Windows desktop
- **Protected Devices** (included above): 2 iPads, kid's 2 smartphones, 2 Windows laptops
### Entertainment Devices
- 3 Google smart tvs
- 1 Sonos speaker
- 1 Yahama audio receiver
### Smart Home Devices
- a handful of Google Nest Minis with Google Assistant
- many Wyze smart home devices
	- a dozen or so bulbs
	- 2 LED strips
	- 4 switches
	- 3 cameras
	- a robot vacuum 

## Servers in Detail
### Windows
HP ENVY Desktop TE01-1022
- Intel(R) Core(TM) i7-10700 8 cores, 4.80 GHz
- 64 GB RAM
- Intel UHD Graphics 630
- ZOTAC NVIDIA GeForce RTX 2060 8GB GDDR6 Graphics Card - ‎ZT-T20610E-10M
- 1 TB SSD, plus 2 [4TB HDDs](https://www.bestbuy.com/site/wd-blue-4tb-internal-sata-hard-drive-for-desktops/9026007.p?skuId=9026007) mirrored for backup of the 1 TB SSD
- [500W L05757-800](https://www.amazon.com/LXun-L05757-800-Compatible-DPS-500AB-32-795-0003UR/dp/B0BRPPZCWC) power supply
### Raspberry Pi 5
- 8 GB RAM, 256 GB mini SD card
- Headless. Accessed via SSH and Raspberry Pi Connect
### Home Assistant
- Raspberry Pi 5, 4 GM RAM, 128 GM SD card
- Headless
## Services Overview

| Service           | Server         | Ports                              | Cloudflare Tunnel           | Installation | Creation   |
| ----------------- | -------------- | ---------------------------------- | --------------------------- | ------------ | ---------- |
| Backblaze Backup  | Windows        |                                    |                             | baremetal    |            |
| Docker            | Windows        |                                    |                             | baremetal    | 2024-11-19 |
| Minecraft server  | Windows        | - 25565                            |                             | baremetal    | 2025-01-02 |
| Ollama            | Windows        |                                    |                             | baremetal    | 2026-07-03 |
| Open WebUI        | Windows        | - 3000                             |                             | Docker       | 2026-07-03 |
| Cloudflared       | Windows        |                                    |                             | baremetal    | 2026-07-03 |
| RustDesk Server   | Windows        | see below                          |                             | Docker       | 2024-11-19 |
| Portainer         | Windows        | - 9443 (Web UI)<br>- 8000 (Web UI) | winportainer.superclark.net | Docker       | 2024-11-19 |
| Watchtower        | Windows        |                                    |                             | Docker       | 2026-07-03 |
| Docker            | Raspberry Pi 5 |                                    |                             | baremetal    | 2024-11-29 |
| Portainer         | Raspberry Pi 5 | - 9443 (Web UI)<br>- 8000 (Web UI) | portainer.superclark.net    | Docker       | 2024-11-29 |
| KOreader sync     | Raspberry Pi 5 | - 3002                             |                             |              | 2026-04-13 |
| Calibre-web       | Raspberry Pi 5 | - 8083                             | books.superclark.net        | Docker       | 2026-04-13 |
| Technitium        | Raspberry Pi 5 | - 8081 (Web UI)                    |                             | Docker       | 2025-04-04 |
| rocketchat        | Raspberry Pi 5 | - 3000                             | chat.superclark.net         | Docker       | 2026-01-20 |
| cloudflared       | Raspberry Pi 5 |                                    |                             | Docker       | 2024-12-13 |
| Uptime Kuma       | Raspberry Pi 5 | - 3001 (Web UI)                    | uptime.superclark.net       | Docker       | 2024-12-04 |
| changedetector.io | Raspberry Pi 5 | - 5000 (Web UI)                    | changes.superclark.net      | Docker       | 2024-12-18 |
| Watchtower        | Raspberry Pi 5 |                                    |                             | Docker       | 2024-12-22 |

### Notes
- All dates are in America/Chicago timezone
- RustDesk Server consists of two Docker containers (hbbr ports: 21119, 21117 and hbbs 21115, 21116, 21118)