cd C:\Users\clark\quartzsite
git add .
git commit -m "update site: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push origin v4

function pub { sh .\publish.ps1 }