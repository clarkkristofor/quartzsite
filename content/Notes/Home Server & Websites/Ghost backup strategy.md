# Ghost Site Backup Strategy

## Overview
Multi-layered backup approach for Ghost blog sites running in Docker:
1. Direct volume backups (via Backblaze)
2. Automated MySQL dumps (via Task Scheduler)
3. Manual Ghost Admin UI exports (as needed)

## Direct Volume Access Setup
1. Create bind mount directories for MySQL data:
   - `D:/ghost-data/mysqlX` (where X is site number)
2. Configure Docker volumes in compose file to use bind mounts
3. Ensure Backblaze is configured to backup these directories

## Automated MySQL Dumps
1. Create directory: `D:\ghost-backup\mysqldumps`
2. Create PowerShell script: `D:\ghost-backup\backup-ghost-dbs.ps1`
3. Configure Task Scheduler:
   - Program: powershell.exe
   - Arguments: `-ExecutionPolicy Bypass -File "D:\ghost-backup\backup-ghost-dbs.ps1"`
   - Schedule: Daily (recommended: early morning)
   - Run with highest privileges

## Manual Ghost Exports
- Perform before major site changes
- Access via Ghost Admin UI → Settings → Labs → Export
- Store exports in `D:\ghost-backup\admin-exports`

## Recovery Options
1. Full site restore: Use Backblaze volume backups
2. Database restore: Use latest MySQL dump
3. Content-only restore: Use Ghost Admin UI export

## Best Practices
- Keep at least 30 days of MySQL dumps
- Test restores periodically
- Perform Ghost UI exports before significant changes
- Monitor backup file sizes for anomalies
- Verify Backblaze is backing up all required directories

## For New Ghost Sites
1. Add new database to MySQL dumps script
2. Create corresponding bind mount directory
3. Update Backblaze paths if needed
4. Test backup chain (volumes, dumps, and exports)