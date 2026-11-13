# Home Server To-Do

**Updated:** 2026-11-09 (time estimates revised; UPS alert to Rocket.Chat dropped) · Current setup: [[Home Server and Network]] · Finished work and history: [[Changelog]]

Open tasks for the home server setup (Windows Server + Raspberry Pi 5 + Home Assistant Pi + Acer laptop). Resilience first, then home automation projects.

---

# Resilience

In order of importance. New alerts post to #alerts, each through its own incoming webhook posting as `alerts`.

## 1. VLAN for IoT/Smart Home Devices

**Deadline:** before Mar 21, 2027 (avoid the Christmas weeks) | **Cost:** $0 (Flint 2 router supports IoT WIFI) | **Time:** ~2-4 hours

**Why it matters:** Currently one flat network — smart bulbs, switches, and cameras share the same broadcast domain as servers and personal devices. If any IoT device is compromised, it has direct network access to everything else.

**Steps:**
1. Enable IoT WIFI for smart home devices (bulbs, switches, cameras, smart TVs).
2. Set firewall rules so IoT VLAN can reach the internet + AdGuard DNS, but not the main network (servers, personal devices).
3. Migrate devices to the new SSID one at a time, testing as you go (some smart home hubs need same-network access — check before moving).

---

## 2. Backup failure alert (Backblaze)

**Deadline:** none set | **Cost:** $0 | **Time:** ~45-60 min | **Difficulty:** 3/10

**Why it matters:** The Pi 5, HA and Acer backups already alert on failure (Uptime Kuma push monitors, Healthchecks.io). Backblaze on the HP — the HP's one critical service and the only off-site copy — isn't watched by anything. If it quietly stopped, nothing would say so.

**Steps:**
1. Find where Backblaze records its last completed backup on the HP (its status/log files).
2. Scheduled check on the HP: if the last completed backup is recent (e.g., under 48 hrs), ping a new push monitor (Uptime Kuma or Healthchecks.io); silence = alert.
3. Alert to #alerts; test by pausing Backblaze.

---

## 3. New device on network alert

**Deadline:** none set | **Cost:** $0 | **Time:** ~1-2 hours | **Difficulty:** 4/10

**Why it matters:** Flags anything unknown joining the network. Pairs with the VLAN (#1) — catches a device that lands on the wrong network.

**Steps:**
1. Pick a source for the device list (router's client list or a network scanner).
2. Build the list of known devices.
3. Alert unknown devices to #alerts; test with a phone or spare device.

---

## 4. Weekly home health report agent

**Deadline:** none set | **Cost:** $0 | **Time:** ~1.5-2 hours setup (then ~1 min per weekly run, unattended)

**Why it matters:** Beszel, Uptime Kuma and the backup checks only speak up when something crosses a line. A weekly plain-English summary in #house shows slow trends (disk creeping up, short outages, a backup that keeps nearly failing) without opening three dashboards.

**Steps:**
1. Script on the Acer gathers read-only data: Beszel (disk, RAM, temps, SMART, the week's alerts), Uptime Kuma (uptime, outages), backups (Healthchecks.io + Uptime Kuma push monitors). (~30 min)
2. Send it to Ollama on the HP for a short summary — try `qwen3:8b` or `qwen3.6` (already installed) before pulling `qwen3:14b` (C: is tight); tune the instructions. (~30 min)
3. New incoming webhook to Rocket.Chat #house; weekly timer (e.g., Sunday afternoon, after services). (~10 min)
4. Test against reality; if the HP is off, post the raw numbers without the AI summary. (~30 min)

Read-only: no tools that can change anything.

---

---

# Home automation projects

Ranked by interest and usefulness. Difficulty is challenge + time, 0–10.

| #   | Project                                                      | Difficulty |
| --- | ------------------------------------------------------------ | ---------- |
| 7   | HA auto-updates with 7-day wait — set up, awaiting first run | 3/10       |
| 16  | Sermon transcription (Whisper on the HP)                     | 4/10       |
| 17  | Price-drop watcher → Rocket.Chat                             | 4/10       |
| 18  | Kids' savings bot (spend/save/share) in Rocket.Chat          | 6/10       |
| 13  | Ollama chat bot in Rocket.Chat                               | 6/10       |

**Where to build:** non-HA projects in n8n on the Acer (`http://n8n.osnet.home:5678`) — #13, #16 (orchestration; Whisper on the HP), #17, #18, Resilience #4, possibly the checking side of Resilience #2 and #3. Projects tied to HA devices stay in HA.

**Notes:**
- **7. HA auto-updates** — Core and OS only (HACS and add-ons manual); details in [[Changelog]] 2026-10-30. Left: confirm a real "queued" post and the first Saturday install, then mark done. Still skim release notes for breaking changes (GE Home, Matter, Ollama).
- **16. Sermon transcription** — Whisper on the HP's RTX 2060 turns sermon recordings into Obsidian notes (searchable archive). Decide: where recordings come from, and which Whisper model fits the 2060's 8 GB alongside Ollama.
- **17. Price-drop watcher** — games via IsThereAnyDeal's official API, Amazon via camelcamelcamel alerts, other stores only where their terms allow (no ToS-breaking scraping). Posts to Rocket.Chat.
- **18. Kids' savings bot** — kids DM a bot ("spent 4.50 spend candy", "balance"); it updates their Google Sheet register (spend / save / share) via the Sheets API and replies with the new balance. Monthly job adds allowance across the three categories. Extras: undo, gift deposits, negative-balance warning, optional copy to Clark. Strict message format first; plain language via `qwen3:8b` later. Open: sheet layout, allowance amounts/split/day, whether kids can log deposits.

**Parked (off the ranked list):**
- HA command bot: fall back to built-in Assist when the HP is off.
- TV summary: add the Roku (not in HA yet).
- Chores: reply "done" / re-nag (#9/#10); laundry "did you move it?" nag (#8).
- #15 Family YouTube feed — second my-feed playlist (Wyrmwood Vlogs + kids' channels), same GitHub Actions run.
- #19 Custom Google TV home screen — Projectivy Launcher installed; full custom dashboard judged not worth it. Still possible: debloat via ADB (cleanyourtv / tv-detox, disable not delete), HA "Notifications for Android TV" on-screen alerts. On the TCL: Roku → Settings → Privacy → Smart TV Experience → uncheck "Use info from TV inputs".
- #20 RSS feed splitter (done): later, swap the keyword lists for an Ollama yes/no politics check.

## Hardware side projects

- **Dryer-done detector** — Pi Zero 2 W + ReSpeaker HAT near the dryer; detects the end-of-cycle buzzer → `rest_command.rocketchat_notify`. Once working, enable Pi OS's read-only overlay.
- **Air-quality sensor** — XIAO ESP32-S3 + Sensirion SCD41 (CO₂/temp/humidity) on ESPHome → HA alerts for high CO₂.

**Decided against:** Pi 5 NVMe upgrade, a used NUC, Jellyfin/Immich/Frigate (2026-10-14); dice roller / RPG bot (2026-10-17); UPS/power outage alerts to Rocket.Chat — Clark's phone alerts are enough (2026-11-09). Staying at four servers.
