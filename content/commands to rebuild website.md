# 1. In the plugin repo — rebuild after editing BookGrid.tsx
cd ~/quartzsite/quartz-components
npm run build

# 2. Commit and push the rebuilt dist/
git add -A
git commit -m "BookGrid: linked section h1, remove card-image border"
git push

# 3. Confirm the new commit hash (sanity check against GitHub)
git rev-parse HEAD

# 4. Back in the site repo — force a fresh pull of the plugin
cd ~/quartzsite
npx quartz plugin remove github:clarkkristofor/quartz-components
npx quartz plugin add github:clarkkristofor/quartz-components

# 5. Confirm the lockfile now shows the new commit (should match step 3)
grep -A 3 '"quartz-components"' quartz.lock.json

# 6. Stop any running dev server (Ctrl+C in that terminal), then fresh build
npx quartz build --serve