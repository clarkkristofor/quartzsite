Key learnings about zones in Technitium:

1. Basic structure:

- A records for main devices (pi5.home, winserver.home)
- CNAME records point services to their host device (ollama -> winserver.home)
- SRV records define ports (_http._tcp.servicename -> port)

2. Important details:

- SRV records use standard values: Priority 10, Weight 100
- Browsers don't read SRV records - must manually add ports to URLs
- Use correct Target in SRV records (point to host, not service name)

3. Access format: [http://servicename.home:port](http://servicename.home:port)