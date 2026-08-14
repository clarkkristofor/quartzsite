Here's what we learned about Syncthing issues:

1. Ensure you're looking at the correct device's web interface - accessing 127.0.0.1:8384 shows your local device's interface

2. Permissions are crucial:
   - Folder needs "Everyone" with Full Control permissions
   - Permissions must apply to subfolders too
   - Without proper permissions, you get "Access denied" errors

3. When stuck:
   - Stop Syncthing service to regain access to frozen folders
   - Sometimes need to completely remove and re-add shared folders
   - Must set correct path when first accepting share - can't change it later

4. Share request delays can happen between devices even when both show as connected