Key learnings for Cloudflare Tunnel setup:

Deployment:

- Use `--no-autoupdate` in cloudflared container
- No port publishing needed
- Token must be current and valid
- Container logs crucial for troubleshooting

Cloudflare configuration:

- HTTPS type for secure services (like Portainer)
- HTTP type for standard web services
- Set "No TLS Verify" for self-signed certs
- Use "TLS origin server name: 0.0.0.0" for local services
- URL format: protocol://IP:port
- Subdomain structure: service.lab.domain.com

Common issues:

- Certificate validation errors need TLS settings
- Connection refused means wrong port/protocol
- HTTP/HTTPS mismatch shows in logs
- Bad gateway (502) requires checking cloudflared logs