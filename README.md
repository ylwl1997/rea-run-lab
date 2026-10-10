# rea-run-lab

[![Actions](https://img.shields.io/badge/GitHub_Actions-demo--smoke-blue?logo=githubactions)](https://github.com/ylwl1997/rea-run-lab/actions)

Public lab for [REA](https://rea.run/) (`rea-agents`) against a **bundled, self-owned Electron-shaped demo** — not arbitrary binaries.

Site: [rea.run/docs/install/](https://rea.run/docs/install/#actions-demo) · [中文](https://rea.run/zh/docs/install/#actions-demo)

> **Enable workflow once:** OAuth used to publish this repo lacked the `workflow` scope, so `.github/workflows/demo-smoke.yml` could not be pushed. Canonical YAML is in [`ci/demo-smoke.yml`](ci/demo-smoke.yml) — see [`ci/ENABLE-WORKFLOW.md`](ci/ENABLE-WORKFLOW.md) (`gh auth refresh -s workflow` or paste via web UI). After it lands, **Run workflow** appears under Actions.


## Actions 演示流水线（推荐访客路径）

1. Open **[Actions](https://github.com/ylwl1997/rea-run-lab/actions)** on this repo.
2. Select workflow **demo-smoke** → **Run workflow** (branch `main`).
3. When the run finishes, open the run summary → **Artifacts** → download `smoke-report` (JSON + HTML Evidence-style teaching report).
4. Optional: if GitHub Pages is enabled for this repo, the latest successful `main` run also publishes the HTML report to Pages (see the run’s **pages** job / environment URL).

```bash
# Same checks locally
node scripts/smoke.mjs
node scripts/inventory-demo.mjs
```

## Codespaces / Dev Container（可选）

Dev Container files remain for maintainers and anyone who wants an interactive shell:

[![Open in GitHub Codespaces](https://img.shields.io/badge/GitHub_Codespaces-Open-blue?logo=github)](https://codespaces.new/ylwl1997/rea-run-lab?quickstart=1)

1. Open Codespaces (Node 22). `postCreateCommand` runs smoke + inventory.
2. Optional: `npx -y rea-agents@latest setup --dry-run` then `setup`.
3. Point REA at `/workspaces/rea-run-lab/demo` only.

## What is included

| Path | Purpose |
|------|---------|
| `demo/` | Self-owned Electron-shaped teaching target |
| `scripts/smoke.mjs` | Smoke + Evidence-style HTML/JSON report |
| `scripts/inventory-demo.mjs` | Static inventory |
| `.github/workflows/demo-smoke.yml` | Actions: workflow_dispatch + push; Artifacts; optional Pages |
| `.devcontainer/` | Codespaces / Dev Containers (Node 22) |

## Compliance

- Analyze the **bundled demo** or software **you own / ship / have written permission** to study.
- **No arbitrary binary uploads.**
- Not an official REA product. Upstream: [morluto/rea](https://github.com/morluto/rea). Teaching site: [rea.run](https://rea.run/).
- No crack / DRM / license-bypass content. [Legal boundary](https://rea.run/faq/legal-boundary/).

## License

MIT — see `LICENSE`.
