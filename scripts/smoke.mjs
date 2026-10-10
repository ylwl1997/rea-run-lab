#!/usr/bin/env node
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { buildExportPayload, resolveExportDirectory, LAB_VERSION } = require(
  path.join(root, 'demo/lib/exportPath.js'),
);

const checks = [];
function check(name, ok, detail) {
  checks.push({ name, ok: !!ok, detail: detail || '' });
}

const payload = buildExportPayload({ label: 'smoke' });
const demoMain = path.join(root, 'demo/main/index.js');
const demoPreload = path.join(root, 'demo/preload/bridge.js');
const demoExport = path.join(root, 'demo/lib/exportPath.js');

check('lab_version', LAB_VERSION === '0.1.0', LAB_VERSION);
check('payload_kind', payload.kind === 'rea-lab-export', payload.kind);
check('has_items', Array.isArray(payload.items) && payload.items.length >= 3, String(payload.items?.length));
check('meta_compliance', payload.meta?.compliance === 'self-owned-demo-only', payload.meta?.compliance);
check('demo_main_exists', fs.existsSync(demoMain));
check('demo_preload_exists', fs.existsSync(demoPreload));
check('demo_export_exists', fs.existsSync(demoExport));
check('no_uploads_dir_policy', !fs.existsSync(path.join(root, 'uploads')), 'uploads/ must not exist');

const failed = checks.filter((c) => !c.ok);
const generatedAt = new Date().toISOString();
const report = {
  ok: failed.length === 0,
  labVersion: LAB_VERSION,
  generatedAt,
  demoRoot: 'demo/',
  exportDirExample: resolveExportDirectory('/tmp'),
  samplePayload: payload,
  checks,
  failed: failed.map((c) => c.name),
  evidenceStyle: {
    note: 'Teaching report — not a substitute for rea-agents Evidence. Bundled self-owned demo only.',
    findings: [
      {
        id: 'export-path-helper',
        file: 'demo/lib/exportPath.js',
        symbol: 'buildExportPayload',
        summary: 'Deterministic export payload builder used by IPC lab:export-snapshot',
      },
      {
        id: 'ipc-export-snapshot',
        file: 'demo/main/index.js',
        symbol: 'lab:export-snapshot',
        summary: 'Main-process IPC handler returns buildExportPayload result',
      },
      {
        id: 'preload-bridge',
        file: 'demo/preload/bridge.js',
        symbol: 'reaLab.exportSnapshot',
        summary: 'Preload exposes narrow lab API to renderer',
      },
    ],
  },
  compliance: {
    ownDemoOnly: true,
    arbitraryUploadsAllowed: false,
  },
  note: 'Smoke covers bundled demo only. No arbitrary binaries.',
};

const outDir = path.join(root, 'artifacts');
fs.mkdirSync(outDir, { recursive: true });
const jsonPath = path.join(outDir, 'smoke-report.json');
fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

const rows = checks
  .map(
    (c) =>
      `<tr><td><code>${c.name}</code></td><td>${c.ok ? 'PASS' : 'FAIL'}</td><td>${escapeHtml(c.detail)}</td></tr>`,
  )
  .join('\n');
const findings = report.evidenceStyle.findings
  .map(
    (f) =>
      `<li><strong>${escapeHtml(f.id)}</strong> — <code>${escapeHtml(f.file)}</code> · <code>${escapeHtml(f.symbol)}</code><br/>${escapeHtml(f.summary)}</li>`,
  )
  .join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>rea-run-lab smoke report</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; max-width: 52rem; color: #111; }
    .ok { color: #067d3b; font-weight: 700; }
    .bad { color: #b42318; font-weight: 700; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #ddd; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #f6f7f9; }
    code { font-size: 0.9em; }
    .muted { color: #555; }
  </style>
</head>
<body>
  <h1>rea-run-lab · demo smoke report</h1>
  <p>Status: <span class="${report.ok ? 'ok' : 'bad'}">${report.ok ? 'OK' : 'FAILED'}</span>
     · lab <code>${LAB_VERSION}</code> · generated <code>${generatedAt}</code></p>
  <p class="muted">${escapeHtml(report.evidenceStyle.note)}</p>
  <h2>Checks</h2>
  <table>
    <thead><tr><th>Check</th><th>Result</th><th>Detail</th></tr></thead>
    <tbody>
${rows}
    </tbody>
  </table>
  <h2>Evidence-style findings (teaching)</h2>
  <ul>
${findings}
  </ul>
  <h2>Compliance</h2>
  <ul>
    <li>Own bundled demo only (<code>demo/</code>)</li>
    <li>No arbitrary binary uploads</li>
  </ul>
  <p class="muted">JSON twin: <code>smoke-report.json</code> in the same Artifacts bundle.</p>
</body>
</html>
`;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const htmlPath = path.join(outDir, 'smoke-report.html');
fs.writeFileSync(htmlPath, html);

// Pages-ready copy
const pagesDir = path.join(outDir, 'pages');
fs.mkdirSync(pagesDir, { recursive: true });
fs.writeFileSync(path.join(pagesDir, 'index.html'), html);
fs.writeFileSync(path.join(pagesDir, 'smoke-report.json'), JSON.stringify(report, null, 2));

console.log(JSON.stringify({ ok: report.ok, failed: report.failed, jsonPath, htmlPath, pagesDir }, null, 2));
process.exit(failed.length === 0 ? 0 : 1);
