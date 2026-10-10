# Workflow status

Canonical workflow: [`.github/workflows/demo-smoke.yml`](../.github/workflows/demo-smoke.yml) (also mirrored at [`ci/demo-smoke.yml`](demo-smoke.yml)).

Jobs: **smoke** only — uploads Artifacts `smoke-report` (JSON + HTML). No GitHub Pages deploy job (Pages API 404’d on first deploys; Artifacts are the visitor path).

Trigger: Actions → demo-smoke → **Run workflow**, or push to `main`.
