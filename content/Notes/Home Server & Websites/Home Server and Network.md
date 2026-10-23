# Home Server, Network, and Web hosting set up

## Purpose
My home server: 
- makes my network faster and more secure
- teaches me about home servers and networking
- is a playground for fun new projects

Related notes: [[Backup & Restore]] · [[Changelog]] · [[Home Server Tasks]] (to-do list) · [[Websites]] · [[Server project costs]]

## Current Status
**Last Updated:** 2026-10-19
### Active Services
- Windows Server: 10 services
- Raspberry Pi 5: 12 services
- Home Assistant Pi 5: 3 services
- Acer laptop (watcher): 10 services
- Total: 35 services running

---

## Network Overview
My small home network runs on a Flint 2 router. There is only one network, broadcasting WIFI at 2.4 and 5 Ghz.

**DNS Flow:**
- Client Device -> Flint 2 router -> Raspberry Pi 5 server (AdGuard Home -> Technitium) -> Upstream DNS Servers (Cloudflare DNS-over-HTTPS 1.1.1.1, 1.0.0.1)
- **Secondary DNS:** Flint 2 also lists the Acer laptop (`192.168.8.198`). Its AdGuard goes straight to Cloudflare DoH and forwards `osnet.home` to the Pi 5 (`[/osnet.home/]192.168.8.161`). The router may send some everyday queries there too, not only during failures. While the Pi 5 is down, `osnet.home` names don't resolve (expected).
- **Router admin:** use `http://console.gl-inet.com` or `http://192.168.8.1`. `router.osnet.home` resolves correctly but the router's web server returns 403 Forbidden: it only accepts its own names and its IP (confirmed 2026-10-17 — not a DNS or browser-HTTPS issue). The `router` record still works for ping/SSH.

**Local DNS zone (`osnet.home`, Technitium on the Pi 5)** — updated 2026-10-17:

| Name | Type | Points to |
|---|---|---|
| `pi5` | A / AAAA | `192.168.8.161` / `fdcb:b9c8:acf1:0:2ecf:67ff:fe73:f92a` |
| `acer` | A / AAAA | `192.168.8.198` / `fdcb:b9c8:acf1:0:608d:6793:fac2:62d9` |
| `ha` | A / AAAA | `192.168.8.227` / `fdcb:b9c8:acf1:0:e758:c77c:cd02:a012` (also `homeassistant.local` via mDNS) |
| `hp` | A | `192.168.8.180` (Windows server; replaced `winserver`, which pointed at the old `.138`) |
| `router` | A | `192.168.8.1` (admin page refuses this name — see above) |
| `adguard`, `dns` | CNAME | `pi5` |
| `adguard2`, `beszel`, `chat`, `gatus`, `uptime` | CNAME | `acer` — Beszel at `http://beszel.osnet.home:8090` (added 2026-10-19) |
| `ai` | CNAME | `hp` — Open WebUI at `http://ai.osnet.home:3000` (added 2026-10-17) |

- IPv6 records use each machine's stable address on the `fdcb:b9c8:acf1:0::/64` prefix. Don't use `fe80::` (link-local), `temporary` addresses, the router's DHCPv6 `/128` leases (e.g. `::1fa`, `::3f5`), or the second `fd4a:595a:fd35:85e0::` prefix (being retired; source unknown).

**Power:** Modem, router, Pi 5, Home Assistant Pi, and the Acer laptop are on an APC UPS (see Power / UPS below).
## Devices Overview
There are four servers and 50+ other devices.
### WIFI router (1)
1. Flint 2 router, running Tailscale
### Servers
1. Raspberry Pi 5
2. Windows desktop
3. Home Assistant Server
4. Acer laptop (backup DNS + external monitor)
### Personal Devices
- 3 Windows laptops
- 4 Android smartphones
- 2 Apple iPads
- 1 Windows desktop
### Entertainment Devices
- 3 Google smart tvs
- 1 Yamaha audio receiver
### Smart Home Devices
- a handful of Google Nest Minis with Google Assistant
- many smart home devices
	- a dozen or so bulbs
	- 2 LED strips
	- 6+ switches
	- 3 Wyze cameras

## Servers in Detail
### SSH access (from the Yoga laptop)
- Shortcuts in `C:\Users\clark\.ssh\config`: `ssh hp` (clark@`.180`), `ssh acer` (clark@`.198`), `ssh pi` (ckos@`.161`)
- Key login on all three with the laptop's `id_ed25519` — no passwords. HP: key in `C:\ProgramData\ssh\administrators_authorized_keys`; Acer and Pi: `~/.ssh/authorized_keys`
- Windows Terminal has one profile per server (command line `ssh hp` / `ssh acer` / `ssh pi`); right-click the pinned Terminal icon to open one
- HP opens in PowerShell; Acer and Pi open in bash
- "Remote host identification has changed" after a rebuild is expected: `ssh-keygen -R <ip>` then reconnect (happened with the Pi after its 2026-10-11 rebuild)

### Windows
HP ENVY Desktop TE01-1022
- Intel(R) Core(TM) i7-10700 8 cores, 4.80 GHz
- 64 GB RAM
- Intel UHD Graphics 630
- ZOTAC NVIDIA GeForce RTX 2060 8GB GDDR6 Graphics Card - ‎ZT-T20610E-10M
- 475 GB NVMe SSD (C:, SK hynix BC511; ~88% full after 2026-10-19 cleanup — removed Gemma model, unused Docker images, Windows SDK, NVIDIA Nsight tools), 1 TB Toshiba DT01ACA100 HDD, plus 2 [4TB HDDs](https://www.bestbuy.com/site/wd-blue-4tb-internal-sata-hard-drive-for-desktops/9026007.p?skuId=9026007) (WD40EZAX) mirrored as E: for backup of the 1 TB Toshiba HDD. All four drives' SMART health is in Beszel
- [500W L05757-800](https://www.amazon.com/LXun-L05757-800-Compatible-DPS-500AB-32-795-0003UR/dp/B0BRPPZCWC) power supply
- Intel Wi-Fi 6E AX210 160MHz card (dedicated PCIe; `Wi-Fi 2`, MAC `F4:A4:75:85:DE:96`). Built-in Realtek RTL8821CE (`Wi-Fi`, MAC `74:12:B3:AD:9F:7D`) disabled 2026-10-16
- **Wi-Fi only** (no Ethernet run available). AX210 Preferred Band set to "Prefer 5GHz band" — it had been joining `OSnet_5g` on 2.4 GHz (~300 Mbps); now 5 GHz, ~2,100 Mbps receive. Router 5 GHz is on channel 60 (DFS): radar detection can force a channel change and brief drops — if Uptime Kuma shows short Windows outages, move the Flint 2 to a non-DFS channel (36–48 or 149–165)
- Fixed IP `192.168.8.180`, reserved to the AX210's MAC; DNS name `hp.osnet.home`
- Both Wi-Fi network profiles set to **Private** (were Public, which blocked the OpenSSH firewall rule)
- OpenSSH Server enabled (auto-start). Key login: laptop's `id_ed25519.pub` in `C:\ProgramData\ssh\administrators_authorized_keys` (admin account). SSH opens straight into PowerShell (`DefaultShell` registry value under `HKLM:\SOFTWARE\OpenSSH`)
- SMB shares: `pi-backups` (used by the Pi 5 **and** the Acer, user `pibackup`) and `ha-backups` (HA, user `habackup`). `pi-backups` had a 1-user limit, which blocked a second client with `NT_STATUS_REQUEST_NOT_ACCEPTED` / Linux `mount error(5)`; set to unlimited 2026-10-15 (`Set-SmbShare -Name pi-backups -ConcurrentUserLimit 0`).
### Raspberry Pi 5
- 8 GB RAM, new SD card (rebuilt 2026-10-11; old card kept as fallback for now)
- Hostname `raspberrypi`, user `ckos` (uid 1000)
- Headless, mostly. Accessed via SSH. But can be accessed headed via TV screen.
- **Ethernet only** (Wi-Fi off via `nmcli radio wifi off`)
- IPv4 `192.168.8.161`, reserved on router to eth0 MAC `2C:CF:67:73:F9:2A`
- IPv6 `fdcb:b9c8:acf1:0:2ecf:67ff:fe73:f92a` (MAC-based, stable) — AAAA record for `pi5.osnet.home` in Technitium
### Home Assistant
- Raspberry Pi 5, 4 GB RAM, 128 GB SD card
- Headless
- Ethernet, MAC `2C:CF:67:66:23:6D`
- IPv4 `192.168.8.227` (reserved on router); IPv6 `fdcb:b9c8:acf1:0:e758:c77c:cd02:a012` (stable)
- Names: `homeassistant.local` (mDNS) and `ha.osnet.home` (Technitium — use this for Docker containers and monitors)

### Acer laptop (watcher)
Acer Aspire E5-576G — backup DNS + monitoring (Gatus, Uptime Kuma) + Rocket.Chat, independent of the Pi 5 (added 2026-10-13, replacing the planned Pi Zero 2 W; Rocket.Chat and Uptime Kuma moved here 2026-10-15)
- Intel Core i5-8250U (4 cores / 8 threads), 8 GB RAM, 256 GB SSD
- Linux Mint 22.3 Cinnamon (Ubuntu 24.04 "noble" base), kernel 6.17
- Hostname `clark-Aspire-E5-576G`, user `clark`
- **Ethernet only** (Wi-Fi off via `nmcli radio wifi off`)
- IPv4 `192.168.8.198`, reserved on router to Ethernet MAC `D8:C4:97:5F:8F:23`
- IPv6 `fdcb:b9c8:acf1:0:608d:6793:fac2:62d9` (stable) — AAAA record for `acer.osnet.home`
- Headless via SSH; lid close = do nothing, suspend = never, screen off after 5 min
- Battery is weak — check periodically for swelling; remove it if it bulges
- Docker Engine from Docker's Ubuntu repo (`noble`); compose stacks in `~/docker/<service>/`
- systemd-resolved stub listener disabled (`/etc/systemd/resolved.conf.d/adguard.conf`) so AdGuard can use port 53
- ufw firewall: allowed 53, 3000/tcp (AdGuard), 8080/tcp (Gatus), 3002/tcp (Rocket.Chat), 3001/tcp (Uptime Kuma), 8090/tcp (Beszel hub)
- Windows share `//192.168.8.180/pi-backups` mounted at `/mnt/backups` (fstab, cifs, `vers=3.0`, nofail + automount; creds `/root/.smbcredentials-pibackup`, same as the Pi 5). If the `cifs` module isn't loaded the mount fails with "No such device" — `sudo modprobe cifs`
- Secrets in `.env` files (chmod 600); values containing `$` must be single-quoted
- Kept over the HP Spectre (2026-10-14): 4 cores / 8 threads vs. the HP's 2 / 4, built-in Ethernet, already set up. If it needs more RAM, the E5-576G usually takes an extra DDR4 SO-DIMM (check slots).

### Spare hardware (not servers)
Staying at four servers. A fifth box only for a specific new workload (e.g., Jellyfin, Immich, Frigate).
- **HP Spectre 14" laptop** — cold spare / test box. Intel Core i7-7500U (2 cores / 4 threads, Kaby Lake, ~2016), 16 GB RAM (soldered), Intel UHD 620 (Quick Sync), 1080p screen (cracked), Windows. Likely no built-in Ethernet.
- **Pi Zero 2 W** — assigned to the dryer-done detector (32 GB SD card, ReSpeaker HAT). See [[Home Server Tasks]].
- **Pi Zero W v1.1** — spare (with ReSpeaker HAT).

## Services Overview

| Service               | Server         | Ports                                        | Cloudflare Tunnel        | Installation      | Creation                              |
| --------------------- | -------------- | -------------------------------------------- | ------------------------ | ----------------- | ------------------------------------- |
| Backblaze Backup      | Windows        |                                              |                          | baremetal         |                                       |
| Docker                | Windows        |                                              |                          | baremetal         | 2024-11-19                            |
| Minecraft server      | Windows        | - 25565                                      |                          | baremetal         | 2025-01-02                            |
| Ollama                | Windows        | - 11434 (LAN, since 2026-10-17)              |                          | baremetal         | 2026-07-03                            |
| Open WebUI            | Windows        | - 3000                                       | ai.superclark.net        | Docker            | 2026-07-03                            |
| searxng               | Windows        | - 8085                                       |                          | Docker            | 2026-07-03                            |
| RustDesk Server       | Windows        | see Notes                                    |                          | Docker            | 2024-11-19                            |
| Portainer             | Windows        | - 9443 (Web UI)<br>- 8000 (Web UI)           |                          | Docker            | 2024-11-19                            |
| Watchtower            | Windows        |                                              |                          | Docker            | 2026-07-03                            |
| cloudflared           | Windows        |                                              | ai.superclark.net only   |                   |                                       |
| Docker                | Raspberry Pi 5 |                                              |                          | baremetal         | 2024-11-29                            |
| Portainer             | Raspberry Pi 5 | - 9443 (Web UI)<br>- 8000 (Web UI)           | portainer.superclark.net | Docker            | 2024-11-29                            |
| KOreader sync         | Raspberry Pi 5 | - 3003 (host) → 3000                         |                          | Docker            | 2026-04-13                            |
| Calibre-web           | Raspberry Pi 5 | - 8083                                       | books.superclark.net     | Docker            | 2026-04-13                            |
| Technitium            | Raspberry Pi 5 | - 5380 (Web UI)                              |                          | Docker            | 2025-04-04                            |
| cloudflared           | Raspberry Pi 5 |                                              |                          | Docker            | 2024-12-13                            |
| changedetector.io     | Raspberry Pi 5 | - 5000 (Web UI)                              | changes.superclark.net   | Docker            | 2024-12-18                            |
| Watchtower            | Raspberry Pi 5 |                                              |                          | Docker            | 2024-12-22                            |
| Adguard Home          | Raspberry Pi 5 | - 53 (DNS)<br>- adguard.osnet.home (Web UI)  |                          | Docker            | 2026-09-22                            |
| Pi backup (restic)    | Raspberry Pi 5 |                                              |                          | baremetal (cron)  | 2026-09-22                            |
| NUT server            | Raspberry Pi 5 | - 3493                                       |                          | baremetal (apt)   | 2026-10-11                            |
| HA backups            | Home Assistant |                                              |                          | built-in          | 2026-09-22                            |
| NUT client            | Home Assistant |                                              |                          | HA app            | 2026-10-11                            |
| Docker                | Acer laptop    |                                              |                          | baremetal         | 2026-10-13                            |
| AdGuard Home          | Acer laptop    | - 53 (DNS)<br>- 3000 (Web UI)                |                          | Docker (host net) | 2026-10-13                            |
| adguardhome-sync      | Acer laptop    | none (API off)                               |                          | Docker            | 2026-10-13                            |
| Gatus                 | Acer laptop    | - 8080 (Web UI)                              |                          | Docker            | 2026-10-13                            |
| Rocket.Chat + MongoDB | Acer laptop    | - 3002 (host) → 3000 (MongoDB not published) | chat.superclark.net      | Docker            | 2026-10-15 (on Pi 5 since 2026-01-20) |
| Acer backup (restic)  | Acer laptop    |                                              |                          | baremetal (cron)  | 2026-10-15                            |
| Uptime Kuma           | Acer laptop    | - 3001 (Web UI)                              | uptime.superclark.net    | Docker            | 2026-10-15 (on Pi 5 since 2024-12-04) |
| Beszel hub + agent    | Acer laptop    | - 8090 (Web UI; agents connect here)         |                          | Docker            | 2026-10-19                            |
| Beszel agent          | Raspberry Pi 5 | - 45876                                      |                          | Docker (Portainer stack `beszel-agent`) | 2026-10-19                |
| Beszel agent          | Home Assistant | - 45876                                      |                          | HA app (community) | 2026-10-19                           |
| Beszel agent          | Windows        | - 45876                                      |                          | baremetal (NSSM service) | 2026-10-19                     |
| Backup push monitor   | Acer laptop    |                                              |                          | Uptime Kuma       | 2026-09-22                            |

### Notes
- All dates are in America/Chicago timezone
- RustDesk Server consists of two Docker containers (hbbr ports: 21119, 21117 and hbbs 21115, 21116, 21118)
- Cloudflare Tunnels run through cloudflared on the Pi 5, except `ai.superclark.net`, which has its own cloudflared on the HP (corrected 2026-10-17; possibly move it to the Pi 5). Routes are in Cloudflare Zero Trust → Networks → Tunnels → *Published application routes*. `chat.superclark.net` → `http://192.168.8.198:3002` and `uptime.superclark.net` → `http://192.168.8.198:3001` (Acer), so these public pages still depend on the Pi 5's cloudflared; other Pi 5 routes use container names (e.g. was `http://rocketchat:3000`)
- Rocket.Chat (Acer): compose stack in `~/docker/rocketchat/` — `registry.rocket.chat/rocketchat/rocket.chat:8.9.0` (pinned; no major.minor tags exist) + `mongo:7.0` (container `rc-mongodb`, replica set `rs0`, data in `./data/db`). Site URL `https://chat.superclark.net`. No Watchtower on the Acer — upgrade manually
- Uptime Kuma (Acer): compose stack in `~/docker/uptime-kuma/` — `louislam/uptime-kuma:1.23.17` (pinned), data in `./data` (SQLite `kuma.db`), no docker.sock mount. Old Pi volume `uptime-kuma_uptime-kuma` kept as rollback
- Backups for all servers: see [[Backup & Restore]]

## Power / UPS
- **UPS:** APC Back-UPS ES 600M1 (BE600M1), 330W — powers modem, router, Pi 5, HA Pi, Acer laptop charger (~5% load and ~2.4 hr runtime measured before the laptop was added; recheck)
- **NUT server:** Pi 5 (USB to UPS), UPS name `apc`, listens on port 3493
  - Configs in `/etc/nut/` (`ups.conf`, `nut.conf`, `upsd.conf`, `upsd.users`, `upsmon.conf`)
  - Users: `upsmon` (primary, local) and `homeassistant` (secondary) — passwords in password manager
  - Shutdown threshold: 10 min runtime remaining (`ignorelb` + `override.battery.runtime.low = 600`) or 10% charge
  - UPS cuts output 120 sec after shutdown (`offdelay = 120`, `ondelay = 180` in `ups.conf`) so the HA Pi (~1 min to shut down) finishes first
  - Pi 5 journal is persistent (`/etc/systemd/journald.conf.d/99-persistent.conf`, 50M cap), so NUT logs survive reboots
- **Home Assistant:** NUT app in `netclient` mode (user `homeassistant`, shuts down HA host) + NUT integration for sensors
- **Shutdown order:** Pi 5 sets FSD → HA Pi shuts down → Pi 5 shuts down → UPS cuts power after 120 sec. Tested 2026-10-13 (`sudo upsmon -c fsd`) — pass.
- **Acer laptop:** not a NUT client. When the UPS cuts output, it keeps running on its own (weak) battery until that runs out, then powers off hard. Optional: add it as a NUT secondary so it shuts down cleanly.
- **Known gap:** the BE600M1 ignores `ondelay` and restores power immediately if wall power is present. In a test, or if power returns mid-shutdown, the HA Pi stays off (solid red LED) — press its power button. In a real outage, both Pis boot on their own when power returns.

## Monitoring

### Where alerts go (since 2026-10-17)
- **Rocket.Chat #alerts** — read-only channel for server alerts. Posts come from bot user `alerts` (bot role, **moderator** in #alerts — needed to post in a read-only channel). One incoming webhook per source: "Uptime Kuma", "Gatus" and "Beszel" (others to come). Senders use the **local** URL `http://192.168.8.198:3002/hooks/…`, not chat.superclark.net (that goes through cloudflared on the Pi 5, so a Pi 5 outage would block its own alert). Webhook URLs live only in Uptime Kuma, `~/docker/gatus/.env` and Beszel's notification settings.
- **Discord** — kept only for things that would stop a Rocket.Chat message reaching you: Rocket.Chat down, Router down, Internet down, Pi 5 down (both), and Healthchecks.io (whole Acer down).
- Gotchas: don't set a channel in a sender (Rocket.Chat rejects it: "overriding destination channel is disabled"); `error-not-allowed` means `alerts` isn't a member/moderator of #alerts.

### Uptime Kuma (Acer laptop, port 3001; moved from the Pi 5 2026-10-15) — alerts to Rocket.Chat #alerts
**The main monitor** (since 2026-10-17; Gatus only watches Uptime Kuma itself — see below). Notifications: **Rocket.Chat #alerts** (Rocket.chat type, Channel left blank, Default enabled — new monitors get it) on every monitor except Rocket.Chat, Internet and Router, which use **Discord – fallback** only (Default enabled off); Pi 5 ping uses both. The original Discord notification was deleted. Can't report the whole Acer going down — that's Healthchecks.io's job.
Push URLs: Pi 5 backup script (`KUMA=` in `/root/pi-backup.sh`) and HA `secrets.yaml` (`uptime_kuma_ha_backup_push`) both point at `http://192.168.8.198:3001`.

| Monitor                       | Group   | Type              | Target                                                  | Notes                                                                                                |
| ----------------------------- | ------- | ----------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Pi 5 ping                     | Pi 5    | Ping              | `192.168.8.161`                                         | #alerts + Discord – fallback (cloudflared on the Pi 5 carries chat.superclark.net). Added 2026-10-17 |
| DNS - AdGuard (external)      | Pi 5    | DNS               | `google.com` via `192.168.8.161:53`                     | Tests AdGuard → Technitium → Cloudflare                                                              |
| DNS - local (osnet.home)      | Pi 5    | DNS               | `pi5.osnet.home` via `192.168.8.161:53`                 | Tests Technitium local zone                                                                          |
| Rocket.Chat                   | Pi 5    | HTTP(s) - Keyword | `http://192.168.8.198:3002/api/info`, keyword `success` | Now on the Acer (2026-10-15). Discord – fallback only                                                |
| DNS - AdGuard Acer (external) | —       | DNS               | `google.com` via `192.168.8.198:53`                     | Backup DNS on the Acer. Added 2026-10-17                                                             |
| Home Assistant, Windows ping  | —       | —                 | —                                                       | Already in Uptime Kuma (not previously listed here — fill in details)                                |
| NUT server                    | Pi 5    | TCP Port          | `192.168.8.161:3493`                                    | NUT daemon only, not USB link                                                                        |
| Public - Books                | Public  | HTTP(s)           | `https://books.superclark.net`                          | Cert expiry on                                                                                       |
| Public - Chat                 | Public  | HTTP(s)           | `https://chat.superclark.net`                           | Cert expiry on                                                                                       |
| Public - Changes              | Public  | HTTP(s)           | `https://changes.superclark.net`                        | Cert expiry on                                                                                       |
| Public - Portainer (Pi)       | Public  | HTTP(s)           | `https://portainer.superclark.net`                      | Cert expiry on                                                                                       |
| Public - Uptime               | Public  | HTTP(s)           | `https://uptime.superclark.net`                         | Cert expiry on                                                                                       |
| Public - AI                   | Public  | HTTP(s)           | `https://ai.superclark.net`                             | HP's own cloudflared → Open WebUI (port 3000)                                                        |
| Local - Portainer (Win)       | —       | HTTP(s)           | `https://hp.osnet.home:9443`                            | Ignore TLS (self-signed)                                                                             |
| Beszel hub                    | Acer    | HTTP(s)           | `http://192.168.8.198:8090`                             | Added 2026-10-19. New group `Acer` for the Acer's monitors                                           |
| Internet                      | Network | Ping              | `1.1.1.1`                                               | Retries 3. Discord – fallback only                                                                   |
| Router                        | Network | Ping              | `192.168.8.1`                                           | Discord – fallback only                                                                              |
| Pi 5 nightly backup           | —       | Push              | from `/root/pi-backup.sh`                               | 25 hr window                                                                                         |
| HA nightly backup             | —       | Push              | from HA `rest_command.uptime_kuma_ha_backup`            | 25 hr window                                                                                         |

Defaults: 60 sec interval, 2 retries unless noted.

### Beszel (resource monitoring; since 2026-10-19) — alerts to Rocket.Chat #alerts
Tracks disk, RAM, CPU, temperature, GPU and drive health (SMART) on all four servers. Hub on the Acer (`http://beszel.osnet.home:8090`; admin login in password manager).
- **Hub + Acer agent:** compose stack `~/docker/beszel/` — `henrygd/beszel:0.21.0` and `henrygd/beszel-agent:0.21.0` (pinned; no Watchtower on the Acer — upgrade manually). Agent talks to the hub through a shared socket (`/beszel_socket/beszel.sock`). Token and key in `.env` (chmod 600; key single-quoted). `APP_URL` `http://192.168.8.198:8090`
- **Pi 5 agent:** Portainer stack `beszel-agent` (`henrygd/beszel-agent:0.21.0`, host network, docker.sock read-only; `BESZEL_TOKEN`/`BESZEL_KEY` as stack environment variables). Pinned tag, so Watchtower leaves it alone
- **HA Pi agent:** community HA app "Beszel Agent" (repo `https://github.com/vineetchoudhary/home-assistant-beszel-agent`), Hub URL `http://192.168.8.198:8090`; start on boot + watchdog on
- **HP agent:** native Windows agent as an NSSM service (`beszel-agent`), installed with the hub's Binary → Windows command. Can't be pinned — don't upgrade it ahead of the hub. `EXTRA_FILESYSTEMS=E:` (set with `nssm set beszel-agent AppEnvironmentExtra +EXTRA_FILESYSTEMS=E:`, then `nssm restart beszel-agent`). Bundled smartctl reads SMART for all four drives (NVMe, Toshiba, both WDs). Logs in `C:\ProgramData\beszel-agent\logs`. GPU (RTX 2060) shows automatically
- Agents connect out to the hub (WebSocket on 8090), so only the Acer needed a firewall port
- **Notifications:** Settings → Notifications, one generic webhook to the local Rocket.Chat URL: `generic://192.168.8.198:3002/hooks/…?template=json&messagekey=text&disabletls=yes` (Beszel's Rocket.Chat type is HTTPS-only). The "Beszel" incoming webhook has a script that adds the alert title (server + problem) in bold, since Rocket.Chat ignores the `title` field
- **Alerts (All systems):** disk 85%, memory 90%, temperature 80 °C, each for 10 min; Status alerts off (Uptime Kuma covers up/down). **HP:** disk 90% and temperature 85 °C (C: runs ~88% full; idles ~71 °C). **Acer:** battery alert (charge only drops if its power is cut). SMART failures alert automatically
- Backed up with the rest of `~/docker` by the Acer's nightly restic; the script stops `beszel` alongside `uptime-kuma` during the run

### Home Assistant alerts (phone, via mobile app)
- **UPS on battery or lost:** Status data → `OB DISCHRG` for 30–60 sec, or → Unavailable for 5 min
- **Power restored:** Status data → `OL CHRG`
- **HA backup push:** automation on *Last successful automatic backup* change → `rest_command.uptime_kuma_ha_backup` (defined in `/homeassistant/configuration.yaml`)
- **Washer done → Rocket.Chat #clamsusa:** automation on `sensor.washer_state` → `Finished` → `rest_command.rocketchat_notify` (webhook URL in `secrets.yaml` as `rocketchat_washer_webhook`). Washer comes from the GE Home (SmartHQ) HACS integration `ha_gehome` (GE cloud login — keep updated via HACS)
- **Daily TV summary → #house (9:00 PM):** automation "Daily TV summary → #house" → `rest_command.rocketchat_house`. Sums two History Stats helpers (Settings → Helpers, today since midnight): `sensor.living_room_living_room_tv_tv_today_living_room` (`media_player.basement_tv_2`, Android TV Remote, state `on`) and `sensor.den_den_tv_tv_today_den` (`media_player.den_tv`, Cast). `media_player.basement_tv` (Cast) is the same Living Room set — not counted. No Roku in HA yet. Per-app line for Living Room: template helper `sensor.living_room_tv_app` (maps `media_player.basement_tv_2`'s `app_id` to Disney+ / YouTube / YouTube TV / Peacock / Netflix / Other, or `off`) → History Stats helpers `sensor.tv_app_today_disney`, `_youtube`, `_youtube_tv`, `_peacock`, `_netflix`; Other = Living Room total minus those. To track a new app, add it to the template's map and add a History Stats helper. All 7 TV History Stats helpers use state class `total_increasing` (set 2026-10-17), so HA keeps long-term statistics indefinitely (detailed history is purged after ~10 days by default). Graphs: **TV Time** dashboard (sidebar, `/tv-time`) — today so far, daily 7/30 days, weekly 12 weeks, monthly 12 months, Living Room by app; bars use the "change" statistic and fill in from 2026-10-17 on.
- **House bot (#house → HA):** Rocket.Chat outgoing webhook on #house → HA webhook automation "House bot - Rocket.Chat" → Ollama agent (`conversation.ollama_conversation`, `qwen3:8b`) → reply via `rest_command.rocketchat_house` (incoming webhook as user `house`; URL in `secrets.yaml` as `rocketchat_house_webhook`). Webhook ID and token live only in the automation and Rocket.Chat. Keep #house **unencrypted** (E2E sends blank text to webhooks) and the outgoing webhook's **Retry Failed URLs off** (otherwise duplicate replies). Only exposed entities can be controlled (Settings → Voice assistants → Expose).

### Gatus (Acer laptop, port 8080) — watches the monitoring; alerts to Rocket.Chat #alerts + Discord #gatus
Since 2026-10-17 Gatus only watches Uptime Kuma, Rocket.Chat and sends the Healthchecks.io heartbeat; everything else moved to Uptime Kuma (both ran on the Acer and duplicated each other). If the laptop itself goes down, Healthchecks.io reports it. Config in `~/docker/gatus/config/config.yaml` (earlier versions kept as `config.yaml.bak` — full list with routing — and `config.yaml.bak2`); `DISCORD_WEBHOOK`, `HC_PING_URL` and `ROCKETCHAT_WEBHOOK` in `~/docker/gatus/.env` (loaded via `env_file`). Two alert types: `slack` → Rocket.Chat #alerts (Gatus has no Rocket.Chat type; Rocket.Chat accepts Slack's format) and `discord`. After changing `.env`, run `docker compose up -d --force-recreate` — a plain restart doesn't reload it. "Provider wasn't configured properly" in the logs = the webhook variable is empty. Alerts after 3 failures, resolves after 2 successes. **HTTP checks need `[CONNECTED] == true`** as well as `[STATUS] < 400` — when nothing answers, the status is 0, which passes `< 400` on its own (this hid outages until 2026-10-17).

| Monitor | Group | Type | Target | Alerts to |
|---|---|---|---|---|
| Uptime Kuma | Laptop | HTTP | `http://192.168.8.198:3001`, connected + status < 400 | #alerts |
| Rocket.Chat | Laptop | HTTP | `http://192.168.8.198:3002/api/info`, `success == true` | Discord |
| Healthchecks.io heartbeat | Heartbeat | HTTP | Healthchecks.io ping URL, every 5 min | (no alert) |

### adguardhome-sync (Acer laptop)
- Copies settings from the Pi 5 AdGuard (`http://192.168.8.161`) to the laptop AdGuard (`http://192.168.8.198:3000`) every 10 min and on start
- **DNS server config is not synced** (`FEATURES_DNS_SERVER_CONFIG=false`), so the laptop keeps its own upstreams; DHCP sync also off
- Credentials in `~/docker/adguard-sync/.env`

### Healthchecks.io (dead man's switch) — alerts to email + Discord
- Check "Gatus laptop": period 5 min, grace 10 min
- Gatus pings it every 5 min. If the laptop, Gatus, internet, or whole-house power goes down, the pings stop and Healthchecks.io alerts.
- Check "Acer nightly backup": period 1 day, grace 2 hr — pinged by `/root/acer-backup.sh` (`/fail` on error). Used instead of Uptime Kuma so the Acer doesn't report on its own backups.

### Tested 2026-10-13
- Stopped AdGuard on the Pi 5: DNS kept resolving via the laptop (confirmed in the laptop's query log); Gatus alerts and "resolved" messages arrived in Discord.
- Stopped Gatus: Healthchecks.io alert arrived by email and Discord.

### Tested 2026-10-17 (alerts → Rocket.Chat)
- Stopped AdGuard on the Pi 5: Uptime Kuma and Gatus down alerts arrived in #alerts, then resolved messages; nothing in Discord.
- After trimming Gatus: stopped Uptime Kuma → Gatus alert in #alerts.
