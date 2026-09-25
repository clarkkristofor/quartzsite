# Home Server Resilience — Priority Task List

**Created:** 2026-09-22

Four gaps identified in the current setup (Windows Server + Raspberry Pi 5 + Home Assistant Pi), ranked by priority.

---

## 1. Pi Backup Strategy

**Cost:** $0 (uses existing Windows HDDs + Backblaze account) | **Time:** ~half a day

**Why it matters:** Only the Windows SSD is currently backed up (mirrored HDDs + Backblaze). The Pi 5 (11 services, including DNS via AdGuard/Technitium) and Home Assistant Pi have no backup. SD card corruption is the most common Pi failure mode, and losing the Pi means losing DNS resolution for the whole network.

**Steps:**
1. Set up `restic` or `rsync` cron job on the Pi(s) to push Docker volumes + configs to the Windows box's mirrored HDDs.
2. Extend the same job (or a second one) to push to Backblaze B2 for off-site coverage.
3. **Test a restore** — don't just confirm the backup job runs.
4. (Optional, +1-2 hrs) Add periodic full SD card image backup for bare-metal recovery.

---

## 2. UPS for Router + Pi 5 + Home Assistant Pi

**Cost:** ~$80 (APC BE600M1) | **Time:** ~1-2 hours setup

**Why it matters:** Router, Pi 5, and Home Assistant Pi are co-located and share one outage risk — a power blip can corrupt SD cards mid-write, taking down DNS and home automation at once. Combined draw is tiny (5-15W) against the unit's 330W capacity, so runtime will be hours, not minutes.

**Steps:**
1. Buy APC BE600M1 (600VA/330W, USB port for NUT/PowerChute management, ~$80).
2. Plug router + both Pi power supplies into the battery-backed outlets.
3. Install NUT (Network UPS Tools) on the Pi(s) — one Pi acts as NUT server reading the UPS over USB.
4. Configure a graceful-shutdown trigger when battery drops below a set threshold (this is the actual point — prevents the SD card corruption a hard cutoff would cause).

---

## 3. VLAN for IoT/Smart Home Devices

**Cost:** $0 (Flint 2 router supports IoT WIFI) | **Time:** ~2-4 hours

**Why it matters:** Currently one flat network — smart bulbs, switches, and cameras share the same broadcast domain as servers and personal devices. If any IoT device is compromised, it has direct network access to everything else. Standard best practice is isolating IoT on its own VLAN.

**Steps:**
1. Enable IoT WIFI for smart home devices (bulbs, switches, cameras, smart TVs).
2. Set firewall rules so IoT VLAN can reach the internet + AdGuard DNS, but not the main network (servers, personal devices).
3. Migrate devices to the new SSID one at a time, testing as you go (some smart home hubs need same-network access — check before moving).

---

## 4. Basic Resource Monitoring

**Cost:** $0 (self-hosted, open source) | **Time:** ~2-3 hours

**Why it matters:** Uptime Kuma confirms services are *up*, but won't catch slow-building problems — disk filling up, SD card wear, RAM pressure — before they cause an outage. With 21 services running, catching this early matters more, not less.

**Steps:**
1. Deploy Netdata or Glances (lightweight) via Docker/Portainer on the Pi 5 — or Prometheus + Grafana if you want historical trends/dashboards (more setup, more capability).
2. Point it at disk space, RAM, CPU temp for both Pi 5 and Windows box.
3. Set basic alert thresholds (e.g., disk >85% full) routed to whatever you already use for Uptime Kuma notifications.

---

## Total Estimate

| Task | Cost | Time |
|---|---|---|
| Pi backup strategy | $0 | ~4 hours |
| UPS | ~$80 | ~1-2 hours |
| IoT VLAN | $0 | ~2-4 hours |
| Resource monitoring | $0 | ~2-3 hours |
| **Total** | **~$80** | **~1.5-2 days spread out** |
