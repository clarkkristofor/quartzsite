# Home Server To-Do

**Updated:** 2026-11-23 (Uptime Kuma 2.x done; n8n 3.x is now #5) · Current setup: [[Home Server and Network]] · Finished work and history: [[Changelog]]

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

## 5. n8n 2.48.1 → 3.x (Acer)

**Deadline:** none set | **Cost:** $0 | **Time:** ~45 min | **Difficulty:** 4/10

**Why it matters:** DIUN shows 3.3.0 available (2026-11-19). Major version — read the 3.0 breaking changes before upgrading.

**Wait until:** 3.x is marked stable (expected early December 2026) **and** a first patch release is out (3.x.1+), as with Rocket.Chat. As of 2026-11-23, 3.x was early access/beta and stable was 2.48.7. The upgrade is one-way — no going back to 2.x without the backup. Skipping small 2.x bumps until then (decided 2026-11-23), unless one fixes a security issue.

**Steps:**
1. Run Settings → Migration Report (read-only; already in 2.48.1) — move to the newest 2.x first if it asks. Read the 3.0 breaking-changes notes; check they don't hit the Kottke workflow's nodes (Webhook, RSS Read, If, Edit Fields, Merge, Code, Respond to Webhook). Known to check: If node "Always Output Data" now adds an empty item only when every output is empty (Kottke's If has it on); Code node task timeout drops 300 → 60 sec.
2. Back up `data` + `.env` (as on 2026-11-11), change the pinned tag, pull and start.
3. Test `https://feeds.superclark.net/webhook/kottke` and `?feed=politics`; check the Uptime Kuma "n8n" and "Public - Feeds" monitors.

**Not yet:** Rocket.Chat 9.0.0 — staying on 8.9.0 LTS until 9.0.1+ (see [[Changelog]] 2026-11-11).

---

# Home automation projects

Ranked by interest and usefulness. Difficulty is challenge + time, 0–10.

| #   | Project                                                      | Difficulty |
| --- | ------------------------------------------------------------ | ---------- |
| 7   | HA auto-updates with 7-day wait — set up, awaiting first run | 3/10       |
| 21  | AI Diplomacy — play against local LLMs on the HP             | 3-4/10     |
| 22  | AdGuard privacy report → Rocket.Chat (weekly)                | 3-4/10     |
| 23  | Smart Feedbin filter — daily top 10 by interest (Ollama)     | 5/10       |


**Where to build:** non-HA projects in n8n on the Acer (`http://n8n.osnet.home:5678`) — #22, #23 (scoring on the HP), Resilience #4, possibly the checking side of Resilience #2 and #3. Projects tied to HA devices stay in HA.

**Notes:**
- **7. HA auto-updates** — Core and OS only (HACS and add-ons manual); details in [[Changelog]] 2026-10-30. Left: confirm a real "queued" post and the first Saturday install, then mark done. Still skim release notes for breaking changes (GE Home, Matter, Ollama).
- **21. AI Diplomacy** — Clark plays one power against AI powers running on the HP (Ollama), slow play-by-mail pace.
  - **Start with DiploMind** (github.com/jansona/DiploMind, AGPL-3.0; Python 3.11+, FastAPI, uv; current work on the `dot/cloud-rebuild` branch). Already has human + AI seats, a web board (3D with 2D fallback, mobile layout, lobby), legal-orders-only order entry, and negotiation rounds (up to 3 staged messages per round, public/private channels, "ready" to end early). Early one-person project (2 stars); its AIs still make illegal orders and false claims; default opponent is a non-LLM heuristic for testing.
  - **Steps:** (1) run DiploMind on the HP with the mock config to try the board; (2) connect Ollama (needs its own setup) and play a short game vs `qwen3:8b` / a 14B — time a full phase; (3) if the AIs are fun, add: optional "are you sure?" hints (toggle), post-game reveal of each AI's private reasoning, one phase per evening (AIs work overnight) with optional Rocket.Chat pings. If the AIs are weak, compare Good Start Labs' AI Diplomacy agents (github.com/goodstartlabs/ai_diplomacy) or mix in a cloud model.
  - **Order entry wishes** (check DiploMind against these): legal-only choices per unit, warning for units with no order (they hold), map arrows previewing moves, plain-English confirmation screen (Submit / Edit), optional hints for legal-but-likely-wrong orders.
  - **Idea source:** github.com/igposner/diplomacy-v2 (DeepSeek only, 2-minute real-time phases) — borrow its promise tracking (AIs state commitments with orders, scored kept / broken each phase; good for the "who stabbed me" reveal) and message limits (no flooding, no near-duplicates).
  - **Hosted services tried (2026-11-21):** diplomacy.kevinandpauline.com — very rough; AIs stalled for over an hour, reload gave an Azure 404; dropped. olamarena.com/arena/diplomacy — one human seat, AIs fill the rest, model names shown, ends winter 1907; sign-up failed ("email rate limit exceeded" — their side), retry later.

- **22. AdGuard privacy report** — weekly post to Clark (Rocket.Chat): which devices made the most DNS lookups, top blocked and tracking domains per device, new domains a device started contacting (e.g., "the TV contacted 40 tracking domains"). Data from AdGuard Home's query log and stats (Pi 5 main, Acer backup); built in n8n on the Acer; optional plain-English summary via `qwen3:8b`. Pairs with Resilience #1 (IoT VLAN) — shows which devices most need isolating, and later whether the VLAN changed anything. Read-only.
- **23. Smart Feedbin filter** — the LLM scores each day's new Feedbin articles against Clark's interests and produces a daily "top 10" (filtered RSS feed, like the Kottke splitter, or starred items in Feedbin). Built in n8n on the Acer; scoring by Ollama on the HP (`qwen3:8b` first). Use Feedbin's official API only. Open: write an interests list, decide feed vs. stars, what happens when the HP is off (skip the day or pass everything through).

## Hardware side projects

- **Air-quality sensor** — XIAO ESP32-S3 + Sensirion SCD41 (CO₂/temp/humidity) on ESPHome → HA alerts for high CO₂.

**Decided against:** Pi 5 NVMe upgrade, a used NUC, Jellyfin/Immich/Frigate (2026-10-14); dice roller / RPG bot (2026-10-17); UPS/power outage alerts to Rocket.Chat — Clark's phone alerts are enough (2026-11-09). Staying at four servers.
