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

# Pull down anything changed on GitHub (merged PRs, web edits) before pushing
Write-Host "Pulling latest changes from GitHub..." -ForegroundColor Cyan
git pull --rebase origin v5
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "PULL FAILED. Your changes are committed locally but NOT pushed." -ForegroundColor Red
    Write-Host "If git reported a conflict: fix the listed files, then run" -ForegroundColor Red
    Write-Host "  git add <file>   and   git rebase --continue   then run this script again." -ForegroundColor Red
    Write-Host "To back out of the pull instead, run:  git rebase --abort" -ForegroundColor Red
    exit 1
}

# Sync with remote repository targeting the v5 branch
Write-Host "Pushing to remote repository..." -ForegroundColor Cyan
git push origin v5
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "PUSH FAILED. Nothing went live. See the git message above." -ForegroundColor Red
    exit 1
}

Write-Host "--- Sync Complete! Check the Actions tab for the deploy. ---" -ForegroundColor Green
