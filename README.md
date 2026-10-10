# rea-run-lab

[![Open in GitHub Codespaces](https://img.shields.io/badge/GitHub_Codespaces-Open-blue?logo=github)](https://codespaces.new/ylwl1997/rea-run-lab?quickstart=1)
[![demo-smoke](https://github.com/ylwl1997/rea-run-lab/actions/workflows/smoke.yml/badge.svg)](https://github.com/ylwl1997/rea-run-lab/actions/workflows/smoke.yml)

One-click **Codespaces** lab for trying [REA](https://rea.run/) (`rea-agents`) against a **bundled, self-owned Electron-shaped demo** — not arbitrary binaries.

Site docs: [rea.run/docs/install/](https://rea.run/docs/install/) · [中文安装](https://rea.run/zh/docs/install/)

## Open in Codespaces

1. Click **Open in GitHub Codespaces** above (or use the green **Code → Codespaces** button).
2. Wait for the Dev Container (Node 22). `postCreateCommand` runs the demo smoke + inventory.
3. In the Codespaces terminal:

```bash
# Optional: see what setup would write (no client changes yet)
npx -y rea-agents@latest setup --dry-run

# When you are ready to register MCP with your agent host inside Codespaces:
npx -y rea-agents@latest setup
```

4. Point REA at the **bundled demo only**:

```text
/workspaces/rea-run-lab/demo
```

Ask for Evidence on export paths / IPC (`lab:export-snapshot`, `buildExportPayload`), then keep unknowns marked.

## What is included

| Path | Purpose |
|------|---------|
| `demo/` | Self-owned Electron-shaped teaching target (main / preload / renderer / `lib/exportPath.js`) |
| `scripts/smoke.mjs` | CI + local smoke (no Electron required) |
| `scripts/inventory-demo.mjs` | Static inventory of the demo |
| `.devcontainer/` | Codespaces / Dev Containers (Node 22) |

## Compliance (read this)

- **Local / Codespaces only** for this lab flow. Analyze the bundled demo or software **you own / ship / have written permission** to study.
- **No arbitrary binary uploads.** Do not drop commercial installers, cracked packages, or strangers’ malware into this repo or Codespace.
- **Not an official REA product.** Upstream is [morluto/rea](https://github.com/morluto/rea); teaching site is [rea.run](https://rea.run/).
- **No crack / DRM / license-bypass content.** See [legal boundary](https://rea.run/faq/legal-boundary/).
- Primary docs stay on **rea.run** — this lab does not CTA competitor mirrors.

## Quick checks without REA

```bash
node scripts/smoke.mjs
node scripts/inventory-demo.mjs
```

## License

MIT — see `LICENSE`.
