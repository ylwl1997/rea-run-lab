# Enable Actions workflow (one-time)

Pushing `.github/workflows/*` requires a GitHub credential with the **`workflow`** OAuth scope.
The agent token only has `gist, read:org, repo`, so git/API rejects:

```
refusing to allow an OAuth App to create or update workflow
`.github/workflows/demo-smoke.yml` without `workflow` scope
```

## Fix (pick one)

### A) Re-auth gh with workflow scope (recommended)
```bash
# Clear env tokens that shadow hosts.yml
unset GH_TOKEN GITHUB_TOKEN
gh auth refresh -h github.com -s repo,workflow,gist,read:org
# then from repo root:
mkdir -p .github/workflows
cp ci/demo-smoke.yml .github/workflows/demo-smoke.yml
git add .github/workflows/demo-smoke.yml
git commit -m "Enable demo-smoke Actions workflow"
git push origin main
gh workflow run demo-smoke.yml
```

### B) GitHub web UI
1. Open https://github.com/ylwl1997/rea-run-lab/new/main?filename=.github/workflows/demo-smoke.yml
2. Paste contents of `ci/demo-smoke.yml`
3. Commit to `main`
4. Actions → demo-smoke → Run workflow

Canonical workflow source in this repo until enabled: [`ci/demo-smoke.yml`](demo-smoke.yml)
