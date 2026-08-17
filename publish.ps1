# Navigate to Quartz directory
Set-Location -Path "C:\Users\clark\quartzsite"

Write-Host "--- Starting Quartz Sync ---" -ForegroundColor Cyan

# Check for git changes
$status = git status --porcelain
if ($status) {
    Write-Host "Changes detected." -ForegroundColor Yellow

    # Flag any deletions before staging anything, so an accidental local
    # deletion (sync hiccup, misclick, etc.) can't get silently pushed live.
    $deletions = $status | Where-Object { $_ -match '^\s*D\s' -or $_ -match '^\s*.D\s' }
    if ($deletions) {
        Write-Host ""
        Write-Host "WARNING: The following files are missing locally and would be DELETED from the repo:" -ForegroundColor Red
        $deletions | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
        Write-Host ""
        $confirm = Read-Host "Type YES to continue and commit these deletions, or anything else to abort"
        if ($confirm -ne "YES") {
            Write-Host "Aborted. Nothing was staged, committed, or pushed." -ForegroundColor Yellow
            exit 1
        }
    }

    Write-Host "Staging and committing..." -ForegroundColor Yellow
    git add .

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Site update: $timestamp"
} else {
    Write-Host "No local content changes detected." -ForegroundColor Green
}

# Sync with remote repository targeting the v5 branch
Write-Host "Pushing to remote repository..." -ForegroundColor Cyan
git push origin v5

Write-Host "--- Sync Complete! ---" -ForegroundColor Green