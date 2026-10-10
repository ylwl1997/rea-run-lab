#!/usr/bin/env node
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { buildExportPayload, LAB_VERSION } = require(path.join(root, 'demo/lib/exportPath.js'));

const checks = [];
function check(name, ok, detail) {
  checks.push({ name, ok: !!ok, detail: detail || '' });
}

const payload = buildExportPayload({ label: 'smoke' });
check('lab_version', LAB_VERSION === '0.1.0', LAB_VERSION);
check('payload_kind', payload.kind === 'rea-lab-export', payload.kind);
check('has_items', Array.isArray(payload.items) && payload.items.length >= 3, String(payload.items?.length));
check('meta_compliance', payload.meta?.compliance === 'self-owned-demo-only', payload.meta?.compliance);
check('demo_main_exists', fs.existsSync(path.join(root, 'demo/main/index.js')));
check('demo_preload_exists', fs.existsSync(path.join(root, 'demo/preload/bridge.js')));
check('no_uploads_dir_policy', !fs.existsSync(path.join(root, 'uploads')), 'uploads/ must not exist');

const failed = checks.filter((c) => !c.ok);
const report = {
  ok: failed.length === 0,
  labVersion: LAB_VERSION,
  checks,
  failed: failed.map((c) => c.name),
  note: 'Smoke covers bundled demo only. REA setup is documented separately; no arbitrary binaries.',
};

const outDir = path.join(root, 'artifacts');
fs.mkdirSync(outDir, { recursive: true });
const reportPath = path.join(outDir, 'smoke-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
console.log('wrote', reportPath);
process.exit(failed.length === 0 ? 0 : 1);
