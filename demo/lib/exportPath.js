/**
 * Export-path helper — intentional teaching surface for Evidence → file:line demos.
 */
'use strict';

const LAB_VERSION = '0.1.0';

/**
 * Build a deterministic export payload for the lab demo.
 * @param {{ label?: string, includeMeta?: boolean }} opts
 */
function buildExportPayload(opts = {}) {
  const label = String(opts.label || 'default');
  const includeMeta = opts.includeMeta !== false;
  const body = {
    kind: 'rea-lab-export',
    label,
    exportedAt: 'STATIC_PLACEHOLDER', // replaced in smoke for stability notes
    items: [
      { id: 'route-home', type: 'route', value: '/' },
      { id: 'route-export', type: 'route', value: '/export' },
      { id: 'feature-snapshot', type: 'feature', value: 'export-snapshot' },
    ],
  };
  if (includeMeta) {
    body.meta = {
      labVersion: LAB_VERSION,
      compliance: 'self-owned-demo-only',
      engine: 'none-required-for-js-static',
    };
  }
  return body;
}

/**
 * Resolve where a snapshot would be written (teaching string only).
 */
function resolveExportDirectory(homeDir) {
  const base = homeDir || process.env.HOME || '/tmp';
  return `${base}/rea-lab-exports`;
}

module.exports = {
  LAB_VERSION,
  buildExportPayload,
  resolveExportDirectory,
};
