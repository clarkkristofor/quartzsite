[[technitium-setup-guide]]
AdGuard Home is set to block service for Facebook and TikTok, both in Filters > Blocked Services and Filters > custom filtering rules. But both sites are still accessible on the network. More than 1 device can access Facebook.

Nothing is whitelisted in AdGuard. I disabled DoH in my browser. I just moved my Pi to the same subnet as my router. Local DNS caching is ON (which is correct as per our previous troubleshooting).

AdGuard Home is working correctly on 192.168.4.2 and is actively blocking Facebook queries as configured.

But my system isn't using AdGuard Home (192.168.4.2) as its primary DNS server - it's using 192.168.4.1 (router) instead. 

In Eero, custom DNS is set to
- primary: 192.168.4.2
- secondary: 1.1.1.1
If I remove secondary or set it to 192.168.4.2, I lose access to the internet and to the AdGuard Home portal.

Also, not every query shows in Adguard's logs.


from eero help
### Why are my DNS settings greyed out? 

If you are an eero Plus user, this is expected behavior when eero Plus is enabled. eero Plus works by filtering DNS requests from devices, which means that any DNS server settings may not work as expected. 

Your devices may still show that they are using either your ISP DNS servers or any custom DNS servers you set previously via DHCP. However, eero Plus works by filtering all DNS requests on the network, which means that users on the network will not be able to bypass eero Plus just by changing DNS servers on their devices.  

If you still want to change your DNS settings, you will need to first disable each eero Plus filter that’s enabled. You can do this in the eero App under ‘Discover’ > ‘eero Plus’, then toggle off Advanced Security, Block Ads, and any Content Filters enabled on any Profiles.  
  
Once all of these features are disabled, you will then be able to follow the instructions above for changing your DNS settings. 

### How does custom DNS work with other features? 

#### _Local DNS Caching_

Local DNS caching works by storing DNS information locally, which can help speed up the time it takes to load webpages or reach other resources on the internet. 

When this feature is enabled, you will notice that, instead of your ISP or custom DNS settings, you will see the IP address of your gateway eero provided to your devices. This is required for this feature to work, as devices will need to be able to query the cached DNS information on the gateway eero. 

From there, the gateway eero will then send any DNS messages out to either your ISP DNS servers by default, or to your custom DNS servers for any DNS resolution.


I have a Windows machine I'm using as a home server. It's running Plex for Windows and RustDesk, Speedtest tracker, and Syncthing on Docker for Windows. I have a Raspberry Pi Zero v1.1 running AdGuard Home. My goal is to make my home network faster and more secure, to learn about home servers, and have fun with new projects.

But my home network runs on eero, and eero cannot force all dns traffic to AdGuard. I don't want to replace my router right now. What other options do I have?

, I'd like to use a firewall to
- redirect all outbound port 53 traffic to AdGuard (192.168.4.2)
- Block outbound DNS-over-HTTPS (DoH) on port 443 to known public DNS servers
- Block outbound DNS-over-TLS (DoT) on port 853.

pfSense is one option, give me others. It needs to be able to: * Catch all traditional DNS requests (port 53) and force them through AdGuard * Prevent DNS bypasses via encrypted DNS (DoH/DoT) * Work regardless of what DNS settings devices or Eero try to use Bonus points if it can run in docker on my windows machine. give me at least three options, explaining pros and cons, and suggesting what you think would be the best for my network and needs