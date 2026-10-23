# Home Server To-Do

**Created:** 2026-09-22 · **Updated:** 2026-10-20 (added Resilience #2 replace archived Watchtower and #4 update notifications on the Acer (DIUN); renumbered — backup failure alert now #3, UPS #5, new device #6, weekly report #7). 2026-10-19: resource monitoring done — Beszel on all four servers with alerts to #alerts and SMART on the HP, see [[Changelog]]; weekly home health report agent split out as its own task; Resilience reordered by importance: VLAN, backup failure alert, UPS alert, new device alert, weekly health report — the three alerts moved from home automation #4–#6, the report from #11). 2026-10-17: renamed from Homelab Resilience Tasks; added home automation project list, reordered, with decisions and HA auto-updates added; merged side projects into it; plan changed so Beszel alerts will go to Rocket.Chat #alerts (Beszel not set up yet); monitoring alerts moved to Rocket.Chat #alerts — done, see [[Changelog]]; daily TV summary set up. Earlier today: washer-done notifications — done, see [[Changelog]]; Rocket.Chat and Uptime Kuma moved to the Acer — done, see [[Changelog]]; NVMe upgrade dropped — Pi 5 stays on SD with write-heavy services moved off it; no NUC or media/photo server.

**Follow-up ~2026-10-22:** if Rocket.Chat and Uptime Kuma on the Acer are still fine: in the Pi 5's Portainer remove the stopped rocketchat stack + its volumes and the uptime-kuma stack (container already gone) + volume `uptime-kuma_uptime-kuma`; delete `~/rocketchat-migrate.archive.gz` and `~/uptime-kuma-data.tar.gz` on the Pi and the Acer.

Open tasks for the home server setup (Windows Server + Raspberry Pi 5 + Home Assistant Pi + Acer laptop). Resilience tasks first, then home automation projects. Current setup: [[Home Server and Network]]. Finished work goes in [[Changelog]].

---

# Resilience

In order of importance.

## 1. VLAN for IoT/Smart Home Devices

**Deadline:** before Mar 21, 2027 (avoid the Christmas weeks) | **Cost:** $0 (Flint 2 router supports IoT WIFI) | **Time:** ~2-4 hours

**Why it matters:** Currently one flat network — smart bulbs, switches, and cameras share the same broadcast domain as servers and personal devices. If any IoT device is compromised, it has direct network access to everything else.

**Steps:**
1. Enable IoT WIFI for smart home devices (bulbs, switches, cameras, smart TVs).
2. Set firewall rules so IoT VLAN can reach the internet + AdGuard DNS, but not the main network (servers, personal devices).
3. Migrate devices to the new SSID one at a time, testing as you go (some smart home hubs need same-network access — check before moving).

---

## 2. Replace archived Watchtower (Pi 5 + HP)

**Deadline:** none set | **Cost:** $0 | **Time:** ~15 min | **Difficulty:** 1/10

**Why it matters:** `containrrr/watchtower` was archived 2025-12-17; its last release (1.7.1, 2023) gets no security patches, and Watchtower has Docker socket access. `nickfedor/watchtower` is the maintained fork and a drop-in replacement.

**Steps:**
1. Pi 5 (Portainer) and HP: change the image to `nickfedor/watchtower`; keep current settings.
2. Optional: post its update notices to #alerts through its own incoming webhook as `alerts` (local URL).
3. Confirm it starts and logs a check; pinned images (e.g., the Pi's Beszel agent) stay untouched. Update [[Home Server and Network]] (Watchtower rows).

---

## 3. Backup failure alert (Backblaze)

**Deadline:** none set | **Cost:** $0 | **Time:** ~1-2 hours | **Difficulty:** 3/10 (was home automation #5)

**Why it matters:** The Pi 5, HA and Acer backups already alert on failure (Uptime Kuma push monitors, Healthchecks.io). Backblaze on the HP — the HP's one critical service and the only off-site copy — isn't watched by anything. If it quietly stopped, nothing would say so.

**Steps:**
1. Find where Backblaze records its last completed backup on the HP (its status/log files).
2. Scheduled check on the HP: if the last completed backup is recent (e.g., under 48 hrs), ping a new push monitor (Uptime Kuma or Healthchecks.io); silence = alert.
3. Alert to #alerts; test by pausing Backblaze.

---

## 4. Update notifications on the Acer (DIUN)

**Deadline:** none set | **Cost:** $0 | **Time:** ~45 min | **Difficulty:** 3/10

**Why it matters:** The Acer runs the alerting stack (Uptime Kuma, Gatus, Beszel, Rocket.Chat), so no auto-updates there — a bad overnight update could silence alerts. Its images are pinned to versions, which Watchtower's monitor-only mode can't see past; DIUN watches for newer version tags and only notifies.

**Steps:**
1. DIUN compose stack in `~/docker/diun/`, watching the Acer's containers for newer version tags.
2. Its own incoming webhook as `alerts` → #alerts (local URL; Slack format like Gatus if needed).
3. Test with an image known to be behind. Upgrades stay manual (~7-day wait, back up first, like the HA auto-update rule). Add DIUN to [[Home Server and Network]] (services table, Acer ufw if it needs a port) and the Acer backup.

---

## 5. UPS/power outage alert

**Deadline:** none set | **Cost:** $0 | **Time:** ~30-60 min | **Difficulty:** 2/10 (was home automation #4)

**Why it matters:** HA already sends on-battery / power-restored alerts to Clark's phone. Posting them to Rocket.Chat lets the rest of the family see them too.

**Steps:**
1. From the Pi 5's NUT server via HA's NUT integration (sensors already in use): on battery / power restored.
2. New incoming webhook "UPS" posting as `alerts` → #alerts; add a `rest_command` and call it from the existing HA alert automations (keep the phone alerts).
3. Test (unplug the UPS briefly).

---

## 6. New device on network alert

**Deadline:** none set | **Cost:** $0 | **Time:** ~1-2 hours | **Difficulty:** 4/10 (was home automation #6)

**Why it matters:** Flags anything unknown joining the network. Pairs with the VLAN (#1) — catches a device that lands on the wrong network.

**Steps:**
1. Pick a source for the device list (router's client list or a network scanner).
2. Build the list of known devices.
3. Alert unknown devices to #alerts; test with a phone or spare device.

---

## 7. Weekly home health report agent

**Deadline:** none set | **Cost:** $0 | **Time:** ~2-3 hours setup (then ~1 min per weekly run, unattended)

**Why it matters:** Beszel, Uptime Kuma and the backup checks only speak up when something crosses a line. A weekly plain-English summary in #house shows slow trends (disk creeping up, short outages, a backup that keeps nearly failing) without opening three dashboards.

**Steps:**
1. Script on the Acer gathers read-only data: Beszel (disk, RAM, temps, SMART, the week's alerts), Uptime Kuma (uptime, outages), backups (Healthchecks.io + Uptime Kuma push monitors). (~45 min)
2. Send it to Ollama on the HP for a short summary — try `qwen3:8b` or `qwen3.6` (already installed) before pulling `qwen3:14b` (C: is tight); tune the instructions. (~30 min)
3. New incoming webhook to Rocket.Chat #house; weekly timer (e.g., Sunday afternoon, after services). (~15 min)
4. Test against reality; if the HP is off, post the raw numbers without the AI summary. (~30 min)

Read-only: no tools that can change anything.

---

# Home automation projects

Ranked by interest and usefulness. Difficulty is challenge + time, 0–10. #4–#6 (UPS, backup failure, new device alerts) and #11 (weekly health report) moved to Resilience (2026-10-19).

| #      | Project                                                                 | Difficulty |
| ------ | ----------------------------------------------------------------------- | ---------- |
| ~~1~~  | ~~Plain-language HA command bot~~                                       | 5/10       |
| ~~2~~  | ~~Daily TV watching summary~~                                           | 2/10       |
| ~~3~~  | ~~Move monitoring alerts to Rocket.Chat (Discord backup for the Acer)~~ | 2/10       |
| 7      | HA auto-updates with 7-day wait                                         | 3/10       |
| 8      | Laundry "did you move it?" nag with reply                               | 5/10       |
| 9      | Trash/recycling night reminder (yes/no re-nag)                          | 3/10       |
| 10     | Weekly chore rotation (kids reply "done")                               | 5/10       |
| 12     | Kid tutor instructions for Ollama                                       | 3/10       |
| 13     | Ollama chat bot in Rocket.Chat                                          | 6/10       |
| 14     | Morning weather briefing                                                | 3/10       |

**Decisions (2026-10-17):**
- One task list for everything; resilience tasks stay on top, home automation projects follow.
- HA command bot and TV summary go first.
- Monitoring moves to Rocket.Chat (#3) before any new alerts (now Resilience #3, #5, #6), so no alert gets built in Discord and moved later.
- Reply-based reminders (laundry, trash, chores) come after the alerts and auto-updates.
- HA auto-updates wait 7 days rather than skipping ".0" releases — works for Core, OS and HACS with one rule; prudence and quality of life are worth the bump from 2/10 to 3/10.
- Dropped: dice roller / RPG bot.

**Notes:**
1. **HA command bot** — Rocket.Chat outgoing webhook on its own channel → HA Assist with the Ollama integration → reply via `rest_command.rocketchat_notify`. Model: `qwen3:8b` (decided 2026-10-17 — fits in the 2060's 8 GB, tool calling; turn thinking off). Ollama reachable on the LAN (done 2026-10-17). Expose only a limited set of entities; built-in Assist handles simple commands if the HP is off. Its reply path is what #8, #9 and #10 need. **Status (2026-10-17): working** — see [[Changelog]]. Whole family (kids included) added to #house; ~40 entities exposed, aliases added as problems come up. Left: fallback to built-in Assist when the HP is off.
2. **Daily TV summary** — **Status (2026-10-17): set up** — posts household total + per-TV time to #house at 9:00 PM. History Stats helpers (today since midnight): Living Room TV via Android TV Remote state `on`; Den TV via Cast (`on/idle/playing/paused/buffering`). Basement TV (Cast) is the same set as Living Room, so not counted twice. Left: Roku isn't in HA yet (skipped for now); check the first few nights' totals look right. **Per-app breakdown added (2026-10-17):** Living Room only (from Android TV Remote's app attribute) — Disney+, YouTube, YouTube TV, Peacock, Netflix, plus Other (home screen, screensaver, new apps). Counts the open app, not whether it's playing. Den stays a single total.
3. **Monitoring → Rocket.Chat** — **Status (2026-10-17): done and tested** — see [[Changelog]]; routing in [[Home Server and Network]] → Monitoring. "Something off the Acer watching the Acer" is already covered by Healthchecks.io (Acer/Gatus down) and Gatus (Rocket.Chat down). New alerts (Resilience #2–#6, Beszel, HA auto-updates) post to #alerts — give each its own incoming webhook posting as user `alerts`. **Uptime Kuma/Gatus overlap trimmed (2026-10-17, done and tested):** Uptime Kuma is the main monitor; Gatus only watches Uptime Kuma, Rocket.Chat and the Healthchecks.io heartbeat.
7. **HA auto-updates** — add-ons use their own "Auto update" toggle. For Core, OS and HACS: when an update appears, skip it (clears the orange dot) and record the date; after 7 days, clear the skip, back up, install. A newer version mid-wait restarts its 7 days. Post "queued" and "installed/failed" to #alerts. Run on a Saturday morning, not before Sunday services. Still skim release notes for breaking changes (GE Home, Matter, Ollama).
12. **Kid tutor instructions** — only matters once #13 exists; tune for both kids' ages.

## Hardware side projects

- **Dryer-done detector** — Pi Zero 2 W (32 GB SD card) + ReSpeaker HAT near the dryer; detects the end-of-cycle buzzer → HA notification (same Rocket.Chat webhook and `rest_command.rocketchat_notify` as the washer). Chosen over the Zero W v1.1: 4 cores for audio detection, and it runs standard 64-bit Pi OS (many current images and audio libraries dropped the Zero W's ARMv6). Once it works, enable Pi OS's read-only overlay to cut SD wear and make it safe to unplug.
- **Air-quality sensor** — XIAO ESP32-S3 (from the ReSpeaker XVF3800 board) + Sensirion SCD41 (CO₂/temp/humidity) on ESPHome → HA alerts for high CO₂.

---

**Spares (not servers):** Pi Zero W v1.1 (with its ReSpeaker HAT) and the HP Spectre laptop. Decided 2026-10-14 to stay at four servers (HA Pi, Pi 5, Acer, Windows).

**Decided against (2026-10-14):** Pi 5 NVMe upgrade (moving write-heavy services to the Acer handles SD wear and the restic backup covers an SD failure); buying a used NUC; Jellyfin/Immich/Frigate.