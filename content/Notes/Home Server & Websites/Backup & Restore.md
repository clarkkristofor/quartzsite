# Backup & Restore

Back to [[Home Server and Network]]

## Windows
- 1 TB Toshiba HDD (DT01ACA100) mirrored to 2x 4 TB WD HDDs (E: "Mirrored_Backup"); C: is a separate 475 GB NVMe SSD
- Backblaze Personal backs up C:, D:, and E: off-site (E: includes the Pi 5, Acer and HA backups below)
- `pi-backups` share has no user limit (was 1 until 2026-10-15) so the Pi 5 and the Acer can both mount it

## Raspberry Pi 5
- **Tool:** restic, nightly at 3:00 AM via root crontab (`0 3 * * * /root/pi-backup.sh`)
- **Script:** `/root/pi-backup.sh` — log at `/var/log/pi-backup.log`
- **Destination:** `\\192.168.8.180\pi-backups` → `E:\pi-backups\restic`, mounted on the Pi at `/mnt/pi-backups` (fstab, nofail + automount)
- **Backs up:** `/home/pi`, `/home/ckos` (minus Downloads, .deb, .cache), `/var/lib/docker/volumes` (includes Portainer stack definitions), `/root/pi-backup.sh`, `/etc/fstab`
- **Not backed up:** `/etc/nut/`, `/etc/sysctl.conf`, `/etc/systemd/`, root crontab — recreate by hand (see restore steps)
- **Rocket.Chat:** moved to the Acer 2026-10-15; its mongodump was removed from this script (old script kept as `/root/pi-backup.sh.bak-2026-10-15`). `rocketchat_*` volumes still excluded (stopped rollback stack — remove ~2026-10-22). The last Pi dump (2026-10-15 3 AM) stays in `/home/ckos/backups/rocketchat/` as an archived copy
- **Consistency:** stops changedetection, koreader-sync, and calibre-web for ~15 sec; DNS stays up (uptime-kuma dropped from the list 2026-10-15 — it moved to the Acer)
- **Retention:** 7 daily, 4 weekly, 6 monthly; plus a permanent `manual` baseline snapshot
- **Safety:** script aborts if the share isn't mounted (prevents filling the SD card)
- **Alerting:** Uptime Kuma (now on the Acer) push monitor "Pi 5 nightly backup" via `KUMA=http://192.168.8.198:3001/api/push/...` — alerts on failure or no check-in within 25 hrs
- **Secrets:** Windows user `pibackup` (creds in `/root/.smbcredentials-pibackup`); restic password in `/root/.restic-password` **and in password manager**
- **Restore tested:** 2026-09-22 (partial); **2026-10-11 full rebuild onto new SD card**

## Acer laptop
- **Tool:** restic, nightly at 3:30 AM via root crontab (`30 3 * * * /root/acer-backup.sh`) — 30 min after the Pi 5
- **Script:** `/root/acer-backup.sh` — log at `/var/log/acer-backup.log`
- **Destination:** same `pi-backups` share, separate repo → `E:\pi-backups\acer-restic`, mounted on the Acer at `/mnt/backups` (fstab, nofail + automount)
- **Backs up:** `/home/clark/docker` (minus `rocketchat/data`, the live MongoDB files), `/home/clark/backups`, `/root/acer-backup.sh`, `/etc/fstab`
- **Consistency:** stops uptime-kuma and beszel during the restic run (clean SQLite copies; beszel added 2026-10-19, previous script at `/root/acer-backup.sh.bak`)
- **Rocket.Chat:** nightly `mongodump` from `rc-mongodb` to `/home/clark/backups/rocketchat/rocketchat.archive.gz`; a failed dump marks the run failed
- **Retention:** 7 daily, 4 weekly, 6 monthly
- **Safety:** script aborts if the share isn't mounted as cifs
- **Alerting:** Healthchecks.io check "Acer nightly backup" (1 day period, 2 hr grace; `/fail` ping on error)
- **Secrets:** Windows user `pibackup` (creds in `/root/.smbcredentials-pibackup`, identical to the Pi's); restic password in `/root/.restic-password` **and in password manager ("Acer restic")** — different from the Pi's
- **First run:** 2026-10-15, snapshot OK

## Restore runbook (Acer)
1. Install Linux Mint, Docker Engine (Docker's Ubuntu repo), `cifs-utils`, `restic`; recreate the creds file + fstab line, `sudo modprobe cifs`, mount the share
2. Restore the password from password manager into `/root/.restic-password`
3. `restic -r /mnt/backups/acer-restic restore latest --target /`
4. Re-apply host settings by hand: ufw rules, systemd-resolved stub listener off, Ethernet only / Wi-Fi off (see [[Home Server and Network]])
5. Start AdGuard, adguardhome-sync, Gatus, Uptime Kuma, Beszel stacks
6. Rocket.Chat: `docker compose up -d mongodb`, wait for healthy, `docker compose exec -T mongodb mongorestore --archive --gzip --drop < ~/backups/rocketchat/rocketchat.archive.gz`, then `docker compose up -d rocketchat`
7. Restore root crontab line; run the script once and confirm Healthchecks.io goes green

## Home Assistant Pi
- **Tool:** HA built-in automatic backups, daily, keep 7
- **Destination:** network storage `windows_backups` → `\\192.168.8.180\ha-backups` (`E:\ha-backups`)
- **Secrets:** Windows user `habackup`; encryption key / emergency kit **in password manager**
- **Alerting:** HA notification on failed backups, plus Uptime Kuma push monitor "HA nightly backup" (25 hr window)

## Restore runbook (Pi 5)
1. Flash Pi OS with same hostname/user (`raspberrypi` / `ckos`); set router DNS to a fallback first
2. Install Docker (get.docker.com), add `ckos` to `docker` group; install `cifs-utils`, `restic`
3. Recreate `/root/.smbcredentials-pibackup` + fstab line, mount the share
4. Restore the password file from password manager into `/root/.restic-password`
5. Stop Docker, then `restic restore latest --target /`; start Docker
6. Reinstall Portainer (`portainer_data` volume) → stacks reappear; start Technitium, then AdGuard, then the rest
7. Rocket.Chat no longer runs on the Pi 5 — see the Acer runbook below
8. Restore `/root/pi-backup.sh` + root crontab; run once and confirm the Uptime Kuma push monitor
9. Reinstall NUT (configs in [[Home Server and Network#Power / UPS]]); turn Wi-Fi off (`nmcli radio wifi off`); check the router's IP reservation points at the eth0 MAC
