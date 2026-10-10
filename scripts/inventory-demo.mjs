#!/usr/bin/env node
/**
 * Static inventory of the bundled demo — no Electron, no uploads.
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { buildExportPayload, resolveExportDirectory, LAB_VERSION } =
  require(path.join(root, 'demo/lib/exportPath.js'));

const payload = buildExportPayload({ label: 'inventory' });
const exportDir = resolveExportDirectory(process.env.HOME);

console.log(JSON.stringify({
  ok: true,
  labVersion: LAB_VERSION,
  demoRoot: path.join(root, 'demo'),
  exportDir,
  samplePayloadKeys: Object.keys(payload),
  itemCount: payload.items.length,
  compliance: 'bundled-self-owned-demo-only',
}, null, 2));
