# Navigate to Quartz directory
Set-Location -Path "C:\Users\clark\quartzsite"

Write-Host "--- Starting Quartz Sync ---" -ForegroundColor Cyan

# Check for git changes (content or build configuration)
$status = git status --porcelain
if ($status) {
    Write-Host "Changes detected. Staging and committing..." -ForegroundColor Yellow
    git add .
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Site update: $timestamp"
} else {
    Write-Host "No local content changes detected." -ForegroundColor Green
}

# Sync with remote repository
Write-Host "Pushing to remote repository..." -ForegroundColor Cyan
git push origin main

Write-Host "--- Sync Complete! ---" -ForegroundColor Green