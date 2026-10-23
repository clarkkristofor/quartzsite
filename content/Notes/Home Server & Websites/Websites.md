# Websites

Cloudflare manages all the domains and DNS records.

## Carrd sites
- clarkolsonsmith.com
	- purpose: a landing page for my professional life
- saraolsonsmith.com
	- purpose: a landing page for my wife's professional life, including selling the book she recently published
- susannaholsonsmith.com
	- purpose: a landing page for fun for my daughter
- amosolsonsmith.com
	- purpose: a landing page for fun for my son

## superclark.net — custom Obsidian Quartz 4.5.x
- purpose: share rpg session notes with friends, share books, music, and other things I'm into

### Self-hosted subdomains (Cloudflare Tunnel via cloudflared on the Pi 5)
| Subdomain | Service | Server |
|---|---|---|
| ai.superclark.net | Open WebUI | Windows |
| books.superclark.net | Calibre-web | Pi 5 |
| chat.superclark.net | Rocket.Chat | Pi 5 |
| changes.superclark.net | changedetection.io | Pi 5 |
| portainer.superclark.net | Portainer | Pi 5 |
| uptime.superclark.net | Uptime Kuma | Pi 5 |

All monitored in Uptime Kuma with cert-expiry alerts — see [[Home Server and Network#Monitoring]].

## Security
- Cloudflare "Bot Fight Mode" and "Block AI Bots" on superclark.net and clarkolsonsmith.com (since 2024-12-06)
- robots.txt plus `<meta name="robots" content="noai, noimageai">` in superclark.net's header
