#!/usr/bin/env bash
# publish-component.sh — full round-trip for a quartz-components change
#
# Usage:
#   ./publish-component.sh "commit message" ComponentExportName [AnotherExportName ...]
#
# Example:
#   ./publish-component.sh "Add PopularNotes component" PopularNotesHubHome PopularNotesGardenFolder

set -euo pipefail

QUARTZSITE_DIR="/c/Users/clark/quartzsite"
QUARTZ_COMPONENTS_DIR="/c/Users/clark/quartzsite/quartz-components"

COMMIT_MSG="${1:?Usage: $0 \"commit message\" ComponentExportName [AnotherExportName ...]}"
shift
PLUGIN_NAMES=("$@")

if [[ ${#PLUGIN_NAMES[@]} -eq 0 ]]; then
  echo "Error: no plugin export names given."
  echo "Usage: $0 \"commit message\" ComponentExportName [AnotherExportName ...]"
  exit 1
fi

echo "Plugin export(s) to refresh: ${PLUGIN_NAMES[*]}"

echo "== 0. Manifest check (package.json 'quartz.components' block) =="
MANIFEST="$QUARTZ_COMPONENTS_DIR/package.json"
# node.exe is a native Windows binary under Git Bash and doesn't understand
# Unix-style /c/... paths, so convert before handing it off.
if command -v cygpath >/dev/null 2>&1; then
  MANIFEST_WIN="$(cygpath -w "$MANIFEST")"
else
  MANIFEST_WIN="$MANIFEST"
fi

MISSING=()
for name in "${PLUGIN_NAMES[@]}"; do
  found=$(node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));
    const comps = (pkg.quartz && pkg.quartz.components) || {};
    console.log(Object.prototype.hasOwnProperty.call(comps, process.argv[2]) ? 'yes' : 'no');
  " "$MANIFEST_WIN" "$name")
  if [[ "$found" == "no" ]]; then
    MISSING+=("$name")
  fi
done

if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo "Error: the following export(s) are missing from package.json's \"quartz\".\"components\" block:"
  for m in "${MISSING[@]}"; do
    echo "  - $m"
  done
  echo ""
  echo "Add an entry for each, e.g.:"
  echo '  "SomeExportName": { "displayName": "Some Export Name", "defaultPosition": "afterBody", "defaultPriority": 25 }'
  echo ""
  echo "This is separate from src/components/index.ts and src/index.ts — the code can export"
  echo "correctly and still fail to render if this manifest block doesn't also list it."
  exit 1
fi
echo "All plugin export(s) found in the manifest. Proceeding."

echo "== 1. Build quartz-components =="
cd "$QUARTZ_COMPONENTS_DIR"
npm run build

echo "== 2. Review changes before staging =="
git status
read -p "Stage and commit these exact files? (y/N) " ok
[[ "$ok" == "y" ]] || { echo "Aborted before commit."; exit 1; }

git add -p   # interactive — forces you to see every hunk, no blanket -A
git commit -m "$COMMIT_MSG"
git push origin main

echo "== 3. Force-refresh plugin(s) in quartzsite =="
cd "$QUARTZSITE_DIR"
for name in "${PLUGIN_NAMES[@]}"; do
  rm -rf ".quartz/plugins/$name"
  echo "Removed .quartz/plugins/$name"
done

echo "== 4. Reminder: update quartz.config.yaml if this is a new component =="
read -p "Config already updated for this change? (y/N) " cfg_ok
[[ "$cfg_ok" == "y" ]] || { echo "Update quartz.config.yaml, then re-run from step 5 manually."; exit 1; }

echo "== 5. Local build check =="
npx quartz build
echo "Build succeeded. Recommend: npx quartz build --serve to eyeball it before pushing."
read -p "Looks good — push quartzsite v5? (y/N) " push_ok
[[ "$push_ok" == "y" ]] || { echo "Stopped before push. Nothing sent to GitHub Pages."; exit 0; }

echo "== 6. Commit and push quartzsite =="
git add quartz.config.yaml quartz.lock.json
git status
git commit -m "Deploy: $COMMIT_MSG"
git push origin v5

echo "== Done. Check the Actions tab on quartzsite for the real deploy result. =="
