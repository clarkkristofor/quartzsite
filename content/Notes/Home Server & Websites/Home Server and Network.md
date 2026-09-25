# Home Server, Network, and Web hosting set up

## Purpose
My home server: 
- makes my network faster and more secure
- teaches me about home servers and networking
- is a playground for fun new projects
## Current Status
**Last Updated:** 2026-09-22
### Active Services
- Windows Server: 9 services
- Raspberry Pi 5: 14 services
- Home Assistant Pi 5: 1 service
- Total: 24 services running

---

## Network Overview
My small home network runs on a Flint 2 router. There is only one network, broadcasting WIFI at 2.4 and 5 Ghz.

**DNS Flow:**
- Client Device -> Flint 2 router -> Raspberry Pi 5 server (AdGuard Home -> Technitium) -> Upstream DNS Servers (Cloudflare DNS-over-HTTPS 1.1.1.1, 1.0.0.1)
## Devices Overview
There are two servers and 50+ other devices.
### WIFI router (1)
1. Flint 2 router, running Tailscale
### Servers
1. Raspberry Pi 5
2. Windows desktop
3. Home Assistant Server
### Personal Devices
- 3 Windows laptops
- 4 Android smartphones
- 2 Apple iPads
- 1 Windows desktop
### Entertainment Devices
- 3 Google smart tvs
- 1 Yahama audio receiver
### Smart Home Devices
- a handful of Google Nest Minis with Google Assistant
- many smart home devices
	- a dozen or so bulbs
	- 2 LED strips
	- 6+ switches
	- 3 cameras

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

## Backups

### Windows
- 1 TB SSD mirrored to 2x 4 TB HDDs (E: "Mirrored_Backup")
- Backblaze Personal backs up C:, D:, and E: off-site (E: includes the Pi backups below)

### Raspberry Pi 5
- **Tool:** restic 0.14, nightly at 3:00 AM via root crontab
- **Script:** `/root/pi-backup.sh` — log at `/var/log/pi-backup.log`
- **Destination:** `\\192.168.8.180\pi-backups` → `E:\pi-backups\restic`, mounted on the Pi at `/mnt/pi-backups` (fstab, nofail + automount)
- **Backs up:** `/home/pi`, `/home/ckos` (minus Downloads, .deb, .cache), `/var/lib/docker/volumes` (includes Portainer stack definitions)
- **Excluded:** Rocket.Chat volumes (pending a MongoDB dump)
- **Consistency:** stops uptime-kuma, changedetection, koreader-sync, and calibre-web for ~15 sec; DNS stays up
- **Retention:** 7 daily, 4 weekly, 6 monthly; plus a permanent `manual` baseline snapshot
- **Safety:** script aborts if the share isn't mounted (prevents filling the SD card)
- **Alerting:** Uptime Kuma push monitor "Pi 5 nightly backup" — alerts on failure or no check-in within 25 hrs
- **Secrets:** Windows user `pibackup` (creds in `/root/.smbcredentials-pibackup`); restic password in `/root/.restic-password` **and in password manager**
- **Restore tested:** 2026-09-22 (AdGuard config diff + Uptime Kuma booted from backup)

### Home Assistant Pi
- **Tool:** HA built-in automatic backups, daily, keep 7
- **Destination:** network storage `windows_backups` → `\\192.168.8.180\ha-backups` (`E:\ha-backups`)
- **Secrets:** Windows user `habackup`; encryption key / emergency kit **in password manager**
- **Alerting:** HA raises a notification on failed backups

### Restore quick reference (Pi 5)
1. Fresh Pi OS → install Docker, `cifs-utils`, restic
2. Recreate `/root/.smbcredentials-pibackup` + fstab line, mount the share
3. Restore the password file from password manager into `/root/.restic-password`
4. `restic restore latest --target /` (or `--include` a single path)
5. Reinstall Portainer → stacks reappear from `portainer_data`

## Services Overview

| Service             | Server         | Ports                              | Cloudflare Tunnel           | Installation     | Creation   |
| ------------------- | -------------- | ---------------------------------- | --------------------------- | ---------------- | ---------- |
| Backblaze Backup    | Windows        |                                    |                             | baremetal        |            |
| Docker              | Windows        |                                    |                             | baremetal        | 2024-11-19 |
| Minecraft server    | Windows        | - 25565                            |                             | baremetal        | 2025-01-02 |
| Ollama              | Windows        |                                    |                             | baremetal        | 2026-07-03 |
| Open WebUI          | Windows        | - 3000                             |                             | Docker           | 2026-07-03 |
| Cloudflared         | Windows        |                                    |                             | baremetal        | 2026-07-03 |
| RustDesk Server     | Windows        | see below                          |                             | Docker           | 2024-11-19 |
| Portainer           | Windows        | - 9443 (Web UI)<br>- 8000 (Web UI) | winportainer.superclark.net | Docker           | 2024-11-19 |
| Watchtower          | Windows        |                                    |                             | Docker           | 2026-07-03 |
| Docker              | Raspberry Pi 5 |                                    |                             | baremetal        | 2024-11-29 |
| Portainer           | Raspberry Pi 5 | - 9443 (Web UI)<br>- 8000 (Web UI) | portainer.superclark.net    | Docker           | 2024-11-29 |
| KOreader sync       | Raspberry Pi 5 | - 3003                             |                             |                  | 2026-04-13 |
| Calibre-web         | Raspberry Pi 5 | - 8083                             | books.superclark.net        | Docker           | 2026-04-13 |
| Technitium          | Raspberry Pi 5 | - 5380 (Web UI)                    |                             | Docker           | 2025-04-04 |
| rocketchat          | Raspberry Pi 5 | - 3000                             | chat.superclark.net         | Docker           | 2026-01-20 |
| cloudflared         | Raspberry Pi 5 |                                    |                             | Docker           | 2024-12-13 |
| Uptime Kuma         | Raspberry Pi 5 | - 3001 (Web UI)                    | uptime.superclark.net       | Docker           | 2024-12-04 |
| changedetector.io   | Raspberry Pi 5 | - 5000 (Web UI)                    | changes.superclark.net      | Docker           | 2024-12-18 |
| Watchtower          | Raspberry Pi 5 |                                    |                             | Docker           | 2024-12-22 |
| Adguard Home        | Raspberry Pi 5 | adguard.osnet.home                 |                             | Docker           | 2026-09-21 |
| Pi backup (restic)  | Raspberry Pi 5 |                                    |                             | baremetal (cron) | 2026-09-22 |
| Backup push monitor | Raspberry Pi 5 |                                    |                             | Uptime Kuma      | 2026-09-22 |
| HA backups          | Home Assistant |                                    |                             | built-in         | 2026-09-22 |

### Notes
- All dates are in America/Chicago timezone
- RustDesk Server consists of two Docker containers (hbbr ports: 21119, 21117 and hbbs 21115, 21116, 21118)
- 2026-09-22: AdGuard Home migrated off the router onto the Pi5 (dedicated resources, no more OOM crashes), chained through Technitium as upstream so local resolution still works, blocklists covering ads/trackers (AdGuard DNS filter, EasyList, EasyPrivacy, HaGeZi Pro), adult content (oisd NSFW), security/threat-intel (HaGeZi TIF, Phishing Army, URLhaus), and Roku telemetry — plus your old custom allowlist rules recovered and restored.
- 2026-09-22: Added nightly restic backups for the Pi 5 and automatic HA backups, both to shares on the Windows box (E:) and off-site via Backblaze Personal. Restore tested. Uptime Kuma push monitor alerts on failed or missed backups. Removed an old unused Windows share mount from the Pi's fstab. Rocket.Chat excluded pending a MongoDB dump.